using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
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
    /// A guest replying again under the same name (compared by its folded
    /// GuestNameKey — case, Turkish letters and extra spaces ignored)
    /// updates their earlier reply instead of adding a second one: 201 for a
    /// new reply, 200 for an update.
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

        var existing = await FindExisting(invitation.Id, nameKey, ct);
        if (existing is not null)
        {
            ApplyUpdate(existing, guestName, attendance, guestCount, message);
            await db.SaveChangesAsync(ct);
            return Ok(RsvpDto.FromEntity(existing));
        }

        var rsvp = new Rsvp
        {
            InvitationId = invitation.Id,
            GuestName = guestName,
            GuestNameKey = nameKey,
            Attendance = attendance,
            GuestCount = guestCount,
            Message = message,
        };
        db.Rsvps.Add(rsvp);

        try
        {
            await db.SaveChangesAsync(ct);
            return StatusCode(StatusCodes.Status201Created, RsvpDto.FromEntity(rsvp));
        }
        catch (DbUpdateException ex) when (IsDuplicateGuest(ex))
        {
            // The same guest submitted twice at once (double tap, two
            // tabs) and the other request inserted first — the unique index
            // caught it. Fall back to updating that row.
            db.Entry(rsvp).State = EntityState.Detached;
            existing = await FindExisting(invitation.Id, nameKey, ct);
            if (existing is null)
            {
                throw;
            }
            ApplyUpdate(existing, guestName, attendance, guestCount, message);
            await db.SaveChangesAsync(ct);
            return Ok(RsvpDto.FromEntity(existing));
        }
    }

    private Task<Rsvp?> FindExisting(Guid invitationId, string nameKey, CancellationToken ct) =>
        db.Rsvps.SingleOrDefaultAsync(r => r.InvitationId == invitationId && r.GuestNameKey == nameKey, ct);

    /// The latest submission replaces the earlier one wholesale — name
    /// spelling and note included. The form never shows a guest their
    /// previous reply, so keeping any part of it (e.g. an old "Geliyoruz!"
    /// note on a reply that's now "No") would leave the couple reading
    /// something the guest can't see and didn't just say.
    private static void ApplyUpdate(Rsvp rsvp, string guestName, RsvpAttendance attendance, int guestCount, string? message)
    {
        rsvp.GuestName = guestName;
        rsvp.Attendance = attendance;
        rsvp.GuestCount = guestCount;
        rsvp.Message = message;
        rsvp.UpdatedAtUtc = DateTime.UtcNow;
    }

    private static bool IsDuplicateGuest(DbUpdateException ex) =>
        ex.InnerException is MySqlException { Number: 1062 } mysqlEx
        && mysqlEx.Message.Contains("IX_Rsvps_InvitationId_GuestNameKey", StringComparison.Ordinal);
}
