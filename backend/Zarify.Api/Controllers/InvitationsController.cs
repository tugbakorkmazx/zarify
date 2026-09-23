using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;

namespace Zarify.Api.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController(ZarifyDbContext db) : ControllerBase
{
    private const int MaxSlugAttempts = 5;

    /// Creates the signed-in user's invitation and returns it with the slug
    /// its public page (and share link) will be addressed by.
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<InvitationDto>> Create(CreateInvitationRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        // The JWT can outlive the account it names (e.g. the account was
        // removed after the token was issued) — check up front rather than
        // letting that surface as an opaque foreign-key failure from
        // SaveChangesAsync below.
        var userExists = await db.Users.AnyAsync(u => u.Id == userId, ct);
        if (!userExists)
        {
            return Unauthorized(new { message = "Oturumunuz artık geçerli değil. Lütfen tekrar giriş yapın." });
        }

        var baseSlug = SlugGenerator.Slugify($"{request.BrideName}-{request.GroomName}");

        for (var attempt = 0; attempt < MaxSlugAttempts; attempt++)
        {
            var slug = attempt == 0 ? baseSlug : $"{baseSlug}-{SlugGenerator.RandomSuffix()}";

            var invitation = new Invitation
            {
                UserId = userId,
                Slug = slug,
                TemplateSlug = request.TemplateSlug.Trim(),
                BrideName = request.BrideName.Trim(),
                GroomName = request.GroomName.Trim(),
                WeddingDate = request.WeddingDate,
                WeddingTime = request.WeddingTime,
                VenueName = request.VenueName.Trim(),
                VenueAddress = request.VenueAddress.Trim(),
                IncludePhotoAlbum = request.IncludePhotoAlbum,
                IncludeDressCode = request.IncludeDressCode,
                RsvpEnabled = request.RsvpEnabled,
            };

            db.Invitations.Add(invitation);
            try
            {
                await db.SaveChangesAsync(ct);
                return CreatedAtAction(nameof(GetBySlug), new { slug = invitation.Slug }, InvitationDto.FromEntity(invitation));
            }
            catch (DbUpdateException ex) when (attempt < MaxSlugAttempts - 1 && IsSlugCollision(ex))
            {
                // Slug collision (unique index) — detach and retry with a
                // fresh random suffix rather than round-tripping a lookup
                // query for every create. Any other DbUpdateException (e.g.
                // a foreign-key failure) is a different problem that a new
                // slug won't fix, so it's left to propagate instead of
                // being retried into a wasted loop and a generic 500.
                db.Entry(invitation).State = EntityState.Detached;
            }
        }

        return Conflict(new { message = "Davetiye linki oluşturulamadı. Lütfen tekrar deneyin." });
    }

    private static bool IsSlugCollision(DbUpdateException ex) =>
        ex.InnerException is MySqlException { Number: 1062 } mysqlEx
        && mysqlEx.Message.Contains("IX_Invitations_Slug", StringComparison.Ordinal);

    /// Public — a guest opening the shared link has no account.
    [HttpGet("{slug}")]
    public async Task<ActionResult<InvitationDto>> GetBySlug(string slug, CancellationToken ct)
    {
        var invitation = await db.Invitations.SingleOrDefaultAsync(i => i.Slug == slug, ct);
        return invitation is null ? NotFound() : Ok(InvitationDto.FromEntity(invitation));
    }

    /// The signed-in owner's own invitations, newest first, each with its
    /// RSVP tallies — what the "Davetiyelerim" dashboard lists.
    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<List<MyInvitationDto>>> Mine(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var invitations = await db.Invitations
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.CreatedAtUtc)
            .ToListAsync(ct);

        var ids = invitations.Select(i => i.Id).ToList();
        var tallies = await db.Rsvps
            .Where(r => ids.Contains(r.InvitationId))
            .GroupBy(r => new { r.InvitationId, r.Attendance })
            .Select(g => new { g.Key.InvitationId, g.Key.Attendance, Responses = g.Count(), Guests = g.Sum(r => r.GuestCount) })
            .ToListAsync(ct);

        RsvpSummaryDto SummaryFor(Guid invitationId)
        {
            var rows = tallies.Where(t => t.InvitationId == invitationId).ToList();
            var yes = rows.SingleOrDefault(t => t.Attendance == RsvpAttendance.Yes);
            var maybe = rows.SingleOrDefault(t => t.Attendance == RsvpAttendance.Maybe);
            var no = rows.SingleOrDefault(t => t.Attendance == RsvpAttendance.No);
            return new RsvpSummaryDto(
                yes?.Responses ?? 0,
                yes?.Guests ?? 0,
                maybe?.Responses ?? 0,
                maybe?.Guests ?? 0,
                no?.Responses ?? 0);
        }

        return Ok(invitations.Select(i => new MyInvitationDto(InvitationDto.FromEntity(i), SummaryFor(i.Id))));
    }

    /// Every reply to one of the signed-in owner's invitations, most
    /// recently created or updated first. Guest names and notes are private to the couple, so another
    /// user's invitation id gets the same 404 as a nonexistent one.
    [Authorize]
    [HttpGet("{id:guid}/rsvps")]
    public async Task<ActionResult<List<RsvpDto>>> Rsvps(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var owns = await db.Invitations.AnyAsync(i => i.Id == id && i.UserId == userId, ct);
        if (!owns)
        {
            return NotFound();
        }

        var rsvps = await db.Rsvps
            .Where(r => r.InvitationId == id)
            .OrderByDescending(r => r.UpdatedAtUtc ?? r.CreatedAtUtc)
            .ToListAsync(ct);

        return Ok(rsvps.Select(RsvpDto.FromEntity));
    }

    private bool TryGetUserId(out Guid userId)
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(raw, out userId);
    }
}
