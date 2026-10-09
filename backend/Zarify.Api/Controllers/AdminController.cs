using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;

namespace Zarify.Api.Controllers;

/// The operator's payment approval queue. Admin only — the role comes from
/// the token (see TokenService); nobody can become admin through the API.
[ApiController]
[Route("api/admin")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class AdminController(ZarifyDbContext db, ILogger<AdminController> logger) : ControllerBase
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
    /// Published and its share link starts working for guests.
    [HttpPost("invitations/{id:guid}/approve-payment")]
    public async Task<ActionResult<InvitationDto>> ApprovePayment(Guid id, CancellationToken ct)
    {
        var invitation = await db.Invitations.SingleOrDefaultAsync(i => i.Id == id, ct);
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
        await db.SaveChangesAsync(ct);

        logger.LogInformation(
            "Payment approved for invitation {InvitationId} ({Slug}) by admin {AdminId}",
            invitation.Id, invitation.Slug, User.FindFirstValue(ClaimTypes.NameIdentifier));

        return Ok(InvitationDto.FromEntity(invitation));
    }
}
