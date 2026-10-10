using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MySqlConnector;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Options;
using Zarify.Api.Services;
using Zarify.Api.Services.Email;

namespace Zarify.Api.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController(
    ZarifyDbContext db,
    IEmailQueue emails,
    EmailComposer composer,
    ILogger<InvitationsController> logger) : ControllerBase
{
    private const int MaxCreateAttempts = 5;
    private const string SlugIndex = "IX_Invitations_Slug";
    private const string PaymentReferenceIndex = "IX_Invitations_PaymentReference";

    /// Creates the signed-in user's invitation and returns it with the slug
    /// its public page (and share link) will be addressed by. It starts as
    /// PendingPayment: the link goes live once an admin confirms the bank
    /// transfer (see AdminController). The current price is fixed onto the
    /// order here, and the accepted contract is recorded in its own
    /// SalesAgreement row, which outlives the invitation. The owner is
    /// emailed the payment details, and the admin (Email:AdminAddress) a
    /// new-order notice.
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<InvitationDto>> Create(
        CreateInvitationRequest request, [FromServices] IOptions<PaymentOptions> paymentOptions, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        // The JWT can outlive the account it names (e.g. the account was
        // removed after the token was issued) — check up front rather than
        // letting that surface as an opaque foreign-key failure from
        // SaveChangesAsync below. The buyer's details are copied onto the
        // agreement record.
        var buyer = await db.Users.SingleOrDefaultAsync(u => u.Id == userId, ct);
        if (buyer is null)
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        // No order without a price: the amount accepted in the contract is
        // the one stored on it.
        if (paymentOptions.Value.AmountTry is not { } price || price <= 0)
        {
            return this.Error(StatusCodes.Status503ServiceUnavailable, ErrorCodes.PaymentNotConfigured);
        }

        // Publishing starts a paid, distance contract — the owner must have
        // confirmed the pre-contract information and the contract first.
        if (!request.AcceptDistanceSales)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.DistanceSalesNotAccepted);
        }
        var acceptedAtUtc = DateTime.UtcNow;
        var acceptedVersion = string.IsNullOrWhiteSpace(request.DistanceSalesVersion)
            ? null
            : request.DistanceSalesVersion.Trim();

        var baseSlug = SlugGenerator.Slugify($"{request.BrideName}-{request.GroomName}");
        var slug = baseSlug;

        for (var attempt = 0; attempt < MaxCreateAttempts; attempt++)
        {
            var invitation = new Invitation
            {
                UserId = userId,
                Slug = slug,
                TemplateSlug = request.TemplateSlug.Trim(),
                PaymentReference = PaymentReferenceGenerator.New(),
                AmountTry = price,
                BrideName = "",
                GroomName = "",
                WeddingDate = request.WeddingDate,
                WeddingTime = request.WeddingTime,
                VenueName = "",
                VenueAddress = "",
                DistanceSalesAcceptedAtUtc = acceptedAtUtc,
                DistanceSalesVersion = acceptedVersion,
            };
            ApplyFields(invitation, request);

            db.Invitations.Add(invitation);
            var agreement = new SalesAgreement
            {
                Invitation = invitation,
                UserId = buyer.Id,
                UserEmail = buyer.Email,
                UserFirstName = buyer.FirstName,
                UserLastName = buyer.LastName,
                InvitationSlug = invitation.Slug,
                CoupleNames = $"{invitation.BrideName} & {invitation.GroomName}",
                PaymentReference = invitation.PaymentReference,
                AmountTry = price,
                AcceptedAtUtc = acceptedAtUtc,
                Version = acceptedVersion,
            };
            db.SalesAgreements.Add(agreement);
            try
            {
                await db.SaveChangesAsync(ct);
                emails.Enqueue(composer.OrderPlaced(buyer, invitation));
                if (composer.AdminNewOrder(buyer, invitation) is { } adminNotice)
                {
                    emails.Enqueue(adminNotice);
                }
                return CreatedAtAction(nameof(GetBySlug), new { slug = invitation.Slug }, InvitationDto.FromEntity(invitation));
            }
            catch (DbUpdateException ex) when (attempt < MaxCreateAttempts - 1
                && (IsUniqueViolation(ex, SlugIndex) || IsUniqueViolation(ex, PaymentReferenceIndex)))
            {
                // Collision on one of the two unique, randomly-completed
                // values — detach and retry rather than round-tripping a
                // lookup query for every create. Only the colliding value
                // changes: a reference clash keeps the (nicer) base slug,
                // and every attempt draws a fresh reference anyway. Any other
                // DbUpdateException (e.g. a foreign-key failure) is a problem
                // a retry won't fix, so it propagates.
                db.Entry(agreement).State = EntityState.Detached;
                db.Entry(invitation).State = EntityState.Detached;
                if (IsUniqueViolation(ex, SlugIndex))
                {
                    slug = $"{baseSlug}-{SlugGenerator.RandomSuffix()}";
                }
            }
        }

        return this.Error(StatusCodes.Status409Conflict, ErrorCodes.InvitationLinkFailed);
    }

    /// Updates one of the signed-in owner's invitations in place. The slug
    /// (and so every share link already sent) stays the same even if the
    /// names change. Another user's invitation id gets the same 404 as a
    /// nonexistent one.
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<InvitationDto>> Update(Guid id, UpdateInvitationRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var invitation = await db.Invitations.SingleOrDefaultAsync(i => i.Id == id && i.UserId == userId, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }

        ApplyFields(invitation, request);
        invitation.UpdatedAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return Ok(InvitationDto.FromEntity(invitation));
    }

    /// Copies the owner-editable fields onto the entity, trimming text and
    /// turning blank optional fields into null so "left empty" is stored the
    /// same way however the client sent it — the public page keys section
    /// visibility off that. (Programme rows with a blank title never get
    /// here: validation rejects them, and the form drops them before
    /// sending.)
    private static void ApplyFields(Invitation invitation, InvitationFieldsRequest request)
    {
        invitation.BrideName = request.BrideName.Trim();
        invitation.GroomName = request.GroomName.Trim();
        invitation.WeddingDate = request.WeddingDate;
        invitation.WeddingTime = request.WeddingTime;
        invitation.VenueName = request.VenueName.Trim();
        invitation.VenueAddress = request.VenueAddress.Trim();
        invitation.StoryText = NullIfBlank(request.StoryText);
        invitation.Schedule = request.Schedule
            .Select(item => new ScheduleItem
            {
                Time = item.Time,
                Title = item.Title.Trim(),
                Description = NullIfBlank(item.Description),
            })
            .OrderBy(item => item.Time, StringComparer.Ordinal)
            .ToList();
        invitation.DressCode = NullIfBlank(request.DressCode);
        invitation.GiftNote = NullIfBlank(request.GiftNote);
        invitation.AccommodationNote = NullIfBlank(request.AccommodationNote);
        invitation.RsvpDeadline = request.RsvpDeadline;
        invitation.RsvpEnabled = request.RsvpEnabled;
    }

    private static string? NullIfBlank(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private async Task AssignPaymentReference(Invitation invitation, CancellationToken ct)
    {
        for (var attempt = 0; ; attempt++)
        {
            invitation.PaymentReference = PaymentReferenceGenerator.New();
            try
            {
                await db.SaveChangesAsync(ct);
                return;
            }
            catch (DbUpdateException ex) when (attempt < MaxCreateAttempts - 1 && IsUniqueViolation(ex, PaymentReferenceIndex))
            {
                // taken — loop round with a fresh code
            }
        }
    }

    private static bool IsUniqueViolation(DbUpdateException ex, string indexName) =>
        ex.InnerException is MySqlException { Number: 1062 } mysqlEx
        && mysqlEx.Message.Contains(indexName, StringComparison.Ordinal);

    /// Public — a guest opening the shared link has no account, and sees
    /// the invitation only once it's Published. The owner (if their token
    /// comes along) can see their own invitation in any status, e.g. to
    /// preview it while the payment is pending — and so can an admin.
    [HttpGet("{slug:maxlength(160)}")]
    public async Task<ActionResult<InvitationDto>> GetBySlug(string slug, CancellationToken ct)
    {
        var invitation = await db.Invitations.SingleOrDefaultAsync(i => i.Slug == slug, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }

        var isOwner = TryGetUserId(out var userId) && invitation.UserId == userId;
        // The admin checks the invitation before approving its payment.
        var isAdmin = User.IsInRole(nameof(UserRole.Admin));
        if (invitation.Status != InvitationStatus.Published && !isOwner && !isAdmin)
        {
            // Distinguishable from an unknown slug so the page can say
            // "not published yet" rather than "this link is wrong".
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotPublished);
        }

        return Ok(InvitationDto.FromEntity(invitation));
    }

    /// Bank-transfer details for one of the owner's invitations: where to
    /// send the money and the reference to write in the transfer
    /// description so the admin can match it.
    [Authorize]
    [HttpGet("{id:guid}/payment")]
    public async Task<ActionResult<PaymentInstructionsDto>> Payment(
        Guid id, [FromServices] IOptions<PaymentOptions> paymentOptions, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var invitation = await db.Invitations.SingleOrDefaultAsync(i => i.Id == id && i.UserId == userId, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }
        if (invitation.Status == InvitationStatus.Published)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.PaymentAlreadyApproved);
        }

        var payment = paymentOptions.Value;
        // The amount is the one fixed on the order; only the account details
        // come from current configuration.
        var amount = invitation.AmountTry ?? payment.AmountTry;
        if (string.IsNullOrWhiteSpace(payment.Iban) || string.IsNullOrWhiteSpace(payment.AccountHolder) || amount is not > 0)
        {
            return this.Error(StatusCodes.Status503ServiceUnavailable, ErrorCodes.PaymentNotConfigured);
        }

        if (invitation.PaymentReference is null)
        {
            // Only possible for an invitation created before references
            // existed and later moved back to pending — give it one now.
            await AssignPaymentReference(invitation, ct);
        }

        return Ok(new PaymentInstructionsDto(
            invitation.PaymentReference!, payment.BankName, payment.AccountHolder!, payment.Iban!, amount!.Value));
    }

    /// The accepted-contract record for one of the owner's invitations: when
    /// they accepted, which version, at what price.
    [Authorize]
    [HttpGet("{id:guid}/agreement")]
    public async Task<ActionResult<SalesAgreementDto>> Agreement(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var agreement = await db.SalesAgreements
            .Where(a => a.InvitationId == id && a.Invitation!.UserId == userId)
            .OrderByDescending(a => a.AcceptedAtUtc)
            .FirstOrDefaultAsync(ct);
        return agreement is null
            ? this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound)
            : Ok(SalesAgreementDto.FromEntity(agreement));
    }

    /// Cancels an order that hasn't been published yet: the invitation (and
    /// anything hanging off it) is deleted, while its SalesAgreement row is
    /// kept and marked cancelled, for the admin's records and the legal
    /// retention period. A published invitation can't be cancelled here.
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Cancel(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var invitation = await db.Invitations.SingleOrDefaultAsync(i => i.Id == id && i.UserId == userId, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }
        if (invitation.Status == InvitationStatus.Published)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.CannotCancelPublished);
        }

        var now = DateTime.UtcNow;
        var agreements = await db.SalesAgreements.Where(a => a.InvitationId == id).ToListAsync(ct);
        foreach (var agreement in agreements)
        {
            agreement.CancelledAtUtc = now;
        }
        // SetNull: EF clears the agreements' InvitationId as it deletes.
        db.Invitations.Remove(invitation);
        await db.SaveChangesAsync(ct);

        logger.LogInformation(
            "Invitation {InvitationId} ({Slug}, ref {Reference}) cancelled by its owner {UserId}",
            invitation.Id, invitation.Slug, invitation.PaymentReference, userId);

        return NoContent();
    }

    /// The signed-in owner's own invitations, newest first, each with its
    /// RSVP tallies — what the "Davetiyelerim" dashboard lists.
    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<List<MyInvitationDto>>> Mine(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var invitations = await db.Invitations
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.CreatedAtUtc)
            .ToListAsync(ct);

        var ids = invitations.Select(i => i.Id).ToList();
        var sameName = await db.Rsvps
            .Where(r => ids.Contains(r.InvitationId))
            .GroupBy(r => new { r.InvitationId, r.GuestNameKey })
            .Where(g => g.Count() > 1)
            .Select(g => new { g.Key.InvitationId, Replies = g.Count() })
            .ToListAsync(ct);

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
                no?.Responses ?? 0,
                sameName.Where(s => s.InvitationId == invitationId).Sum(s => s.Replies));
        }

        return Ok(invitations.Select(i => new MyInvitationDto(InvitationDto.FromEntity(i), SummaryFor(i.Id))));
    }

    /// Every reply to one of the signed-in owner's invitations, most
    /// recently created or updated first, with replies that share a name
    /// flagged. Guest names and notes are private to the couple, so another
    /// user's invitation id gets the same 404 as a nonexistent one.
    [Authorize]
    [HttpGet("{id:guid}/rsvps")]
    public async Task<ActionResult<List<RsvpDto>>> Rsvps(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var owns = await db.Invitations.AnyAsync(i => i.Id == id && i.UserId == userId, ct);
        if (!owns)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }

        var rsvps = await db.Rsvps
            .Where(r => r.InvitationId == id)
            .OrderByDescending(r => r.UpdatedAtUtc ?? r.CreatedAtUtc)
            .ToListAsync(ct);

        var sharedKeys = rsvps
            .GroupBy(r => r.GuestNameKey)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToHashSet();
        return Ok(rsvps.Select(r => RsvpDto.FromEntity(r, sharedKeys.Contains(r.GuestNameKey))));
    }

    private bool TryGetUserId(out Guid userId)
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(raw, out userId);
    }
}
