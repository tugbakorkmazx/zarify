using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;
using Zarify.Api.Services.Email;

namespace Zarify.Api.Controllers;

/// The operator's payment approval queue. Admin only — the role comes from
/// the token (see TokenService); nobody can become admin through the API.
[ApiController]
[Route("api/admin")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class AdminController(
    ZarifyDbContext db,
    IEmailQueue emails,
    EmailComposer composer,
    ILogger<AdminController> logger) : ControllerBase
{
    /// Invitations waiting for their bank transfer to be confirmed, oldest
    /// first — the order transfers are most likely to arrive in.
    [HttpGet("invitations/pending-payment")]
    public async Task<ActionResult<List<AdminInvitationDto>>> PendingPayment(CancellationToken ct)
    {
        var rows = await db.Invitations
            .Where(i => i.Status == InvitationStatus.PendingPayment)
            .OrderBy(i => i.CreatedAtUtc)
            .Select(i => new { Invitation = i, i.User!.Email, i.User.FirstName, i.User.LastName })
            .ToListAsync(ct);

        return Ok(rows.Select(r => new AdminInvitationDto(
            InvitationDto.FromEntity(r.Invitation),
            new InvitationOwnerDto(r.Email, r.FirstName, r.LastName),
            r.Invitation.PaymentReference,
            r.Invitation.AmountTry)));
    }

    /// Orders their owners cancelled before publishing, newest first — the
    /// invitations themselves are gone; their agreement records remain, with
    /// the reference and amount needed to refund a transfer that already
    /// arrived.
    [HttpGet("orders/cancelled")]
    public async Task<ActionResult<List<SalesAgreementDto>>> CancelledOrders(CancellationToken ct)
    {
        var rows = await db.SalesAgreements
            .Where(a => a.CancelledAtUtc != null)
            .OrderByDescending(a => a.CancelledAtUtc)
            .Take(200)
            .ToListAsync(ct);
        return Ok(rows.Select(SalesAgreementDto.FromEntity));
    }

    /// Marks the bank transfer as received: the invitation becomes
    /// Published, its share link starts working for guests, and the owner
    /// is emailed the link.
    [HttpPost("invitations/{id:guid}/approve-payment")]
    public async Task<ActionResult<InvitationDto>> ApprovePayment(Guid id, CancellationToken ct)
    {
        var invitation = await db.Invitations.Include(i => i.User).SingleOrDefaultAsync(i => i.Id == id, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }
        if (invitation.Status != InvitationStatus.PendingPayment)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.NotAwaitingPayment);
        }

        invitation.Status = InvitationStatus.Published;
        invitation.PublishedAtUtc = DateTime.UtcNow;
        invitation.PaymentRejectedAtUtc = null;
        invitation.PaymentRejectionNote = null;
        await db.SaveChangesAsync(ct);

        if (invitation.User is { } owner)
        {
            emails.Enqueue(composer.PaymentApproved(owner, invitation));
        }
        logger.LogInformation(
            "Payment approved for invitation {InvitationId} ({Slug}) by admin {AdminId}",
            invitation.Id, invitation.Slug, User.FindFirstValue(ClaimTypes.NameIdentifier));

        return Ok(InvitationDto.FromEntity(invitation));
    }

    /// The transfer couldn't be confirmed (wrong amount, no reference,
    /// nothing arrived…). The order stays PendingPayment — nothing is
    /// deleted — with the admin's note stored on it and shown on the
    /// owner's payment page, and the owner is emailed the note. Rejecting
    /// again replaces the note; approving later clears it.
    [HttpPost("invitations/{id:guid}/reject-payment")]
    public async Task<ActionResult<InvitationDto>> RejectPayment(Guid id, RejectPaymentRequest request, CancellationToken ct)
    {
        var note = request.Note.Trim();
        if (note.Length == 0)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.RejectionNoteInvalid);
        }
        var invitation = await db.Invitations.Include(i => i.User).SingleOrDefaultAsync(i => i.Id == id, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }
        if (invitation.Status != InvitationStatus.PendingPayment)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.NotAwaitingPayment);
        }

        invitation.PaymentRejectedAtUtc = DateTime.UtcNow;
        invitation.PaymentRejectionNote = note;
        await db.SaveChangesAsync(ct);

        if (invitation.User is { } owner)
        {
            emails.Enqueue(composer.PaymentRejected(owner, invitation, note));
        }
        logger.LogInformation(
            "Payment rejected for invitation {InvitationId} ({Slug}) by admin {AdminId}",
            invitation.Id, invitation.Slug, User.FindFirstValue(ClaimTypes.NameIdentifier));

        return Ok(InvitationDto.FromEntity(invitation));
    }
}
