using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;

namespace Zarify.Api.Controllers;

[ApiController]
[Route("api/rsvp")]
public class RsvpController(ZarifyDbContext db) : ControllerBase
{
    /// Public — guests reply straight from the shared link, no account.
    /// A new reply gets a random edit token, returned once and kept only as
    /// a hash; the guest's browser stores it, and a later submission carrying
    /// it updates that reply (200). Without a matching token the submission
    /// is a new reply (201) — even under a name that has already replied, so
    /// nobody can overwrite someone else's answer by typing their name. The
    /// owner's list flags replies that share a name.
    [HttpPost]
    [EnableRateLimiting(RateLimitPolicies.Rsvp)]
    public async Task<IActionResult> Create(CreateRsvpRequest request, CancellationToken ct)
    {
        var invitation = await db.Invitations
            .Where(i => i.Slug == request.InvitationSlug)
            .Select(i => new { i.Id, i.RsvpEnabled, i.Status })
            .SingleOrDefaultAsync(ct);

        // Not yet published (payment pending) looks the same as unknown to a
        // guest — the page itself isn't visible to them either.
        if (invitation is null || invitation.Status != InvitationStatus.Published)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }

        // The page hides the form when RSVP is off, but the endpoint is
        // public, so the owner's setting has to be enforced here too.
        if (!invitation.RsvpEnabled)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.RsvpClosed);
        }

        var guestName = GuestNameKey.NormalizeDisplay(request.Name);
        var nameKey = GuestNameKey.From(guestName);
        if (nameKey.Length == 0)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.GuestNameRequired);
        }

        var attendance = RsvpDto.AttendanceFromWire(request.Attendance);
        var guestCount = attendance == RsvpAttendance.No ? 0 : request.Guests;
        var message = string.IsNullOrWhiteSpace(request.Message) ? null : request.Message.Trim();

        if (!string.IsNullOrWhiteSpace(request.EditToken))
        {
            var tokenHash = HashToken(request.EditToken);
            var existing = await db.Rsvps.SingleOrDefaultAsync(
                r => r.InvitationId == invitation.Id && r.EditTokenHash == tokenHash, ct);
            if (existing is not null)
            {
                ApplyUpdate(existing, guestName, nameKey, attendance, guestCount, message);
                await db.SaveChangesAsync(ct);
                return Ok(new GuestRsvpResponse(existing.Id, RsvpDto.AttendanceToWire(attendance), request.EditToken));
            }
            // An unknown token (the reply was deleted, or it belongs to
            // another invitation) falls through to a fresh reply.
        }

        var editToken = NewToken();
        var rsvp = new Rsvp
        {
            InvitationId = invitation.Id,
            GuestName = guestName,
            GuestNameKey = nameKey,
            EditTokenHash = HashToken(editToken),
            Attendance = attendance,
            GuestCount = guestCount,
            Message = message,
        };
        db.Rsvps.Add(rsvp);
        await db.SaveChangesAsync(ct);
        return StatusCode(
            StatusCodes.Status201Created,
            new GuestRsvpResponse(rsvp.Id, RsvpDto.AttendanceToWire(attendance), editToken));
    }

    /// The latest submission replaces the earlier one wholesale — name
    /// spelling and note included. The form never shows a guest their
    /// previous reply, so keeping any part of it (e.g. an old "Geliyoruz!"
    /// note on a reply that's now "No") would leave the couple reading
    /// something the guest can't see and didn't just say.
    private static void ApplyUpdate(Rsvp rsvp, string guestName, string nameKey, RsvpAttendance attendance, int guestCount, string? message)
    {
        rsvp.GuestName = guestName;
        rsvp.GuestNameKey = nameKey;
        rsvp.Attendance = attendance;
        rsvp.GuestCount = guestCount;
        rsvp.Message = message;
        rsvp.UpdatedAtUtc = DateTime.UtcNow;
    }

    /// 32 random bytes, URL-safe base64 (43 characters).
    private static string NewToken() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static string HashToken(string token) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(token.Trim())));
}
