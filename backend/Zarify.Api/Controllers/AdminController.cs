using System.Globalization;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;
using Zarify.Api.Services.Email;

namespace Zarify.Api.Controllers;

/// The operator's panel: payment approvals, every invitation, every
/// account, and the log of what admins did. Admin only — the role comes
/// from the token (see TokenService); nobody can become admin through the
/// API. Every state-changing action writes an AdminAuditLogs row.
[ApiController]
[Route("api/admin")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class AdminController(
    ZarifyDbContext db,
    IEmailQueue emails,
    EmailComposer composer,
    ILogger<AdminController> logger) : ControllerBase
{
    private const int PageSize = 20;
    private static readonly CultureInfo Tr = CultureInfo.GetCultureInfo("tr-TR");

    // ── Summary ───────────────────────────────────────────────────────────

    [HttpGet("summary")]
    public async Task<ActionResult<AdminSummaryDto>> Summary(CancellationToken ct)
    {
        var users = await db.Users.CountAsync(ct);
        var suspended = await db.Users.CountAsync(u => u.SuspendedAtUtc != null, ct);
        var byStatus = await db.Invitations
            .GroupBy(i => i.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);
        var rejected = await db.Invitations
            .CountAsync(i => i.Status == InvitationStatus.PendingPayment && i.PaymentRejectedAtUtc != null, ct);

        var today = TurkeyTime.Today();
        var monthStart = new DateOnly(today.Year, today.Month, 1);
        var fromUtc = TurkeyTime.StartOfDayUtc(monthStart);
        var toUtc = TurkeyTime.StartOfDayUtc(monthStart.AddMonths(1));
        var approved = await db.SalesAgreements
            .Where(a => a.PaymentApprovedAtUtc >= fromUtc && a.PaymentApprovedAtUtc < toUtc)
            .GroupBy(_ => 1)
            .Select(g => new { Count = g.Count(), Total = g.Sum(a => a.AmountTry) })
            .SingleOrDefaultAsync(ct);

        var counts = Enum.GetValues<InvitationStatus>()
            .ToDictionary(InvitationDto.StatusToWire, s => byStatus.SingleOrDefault(b => b.Status == s)?.Count ?? 0);

        return Ok(new AdminSummaryDto(
            users,
            suspended,
            counts,
            counts[InvitationDto.StatusToWire(InvitationStatus.PendingPayment)],
            rejected,
            approved?.Count ?? 0,
            approved?.Total ?? 0,
            monthStart.ToString("MMMM yyyy", Tr)));
    }

    // ── Payments ──────────────────────────────────────────────────────────

    /// Invitations waiting for their bank transfer to be confirmed, oldest
    /// first — the order transfers are most likely to arrive in.
    [HttpGet("invitations/pending-payment")]
    public async Task<ActionResult<List<AdminInvitationDto>>> PendingPayment(CancellationToken ct)
    {
        var rows = await db.Invitations
            .Where(i => i.Status == InvitationStatus.PendingPayment)
            .OrderBy(i => i.CreatedAtUtc)
            .Include(i => i.User)
            .ToListAsync(ct);

        return Ok(rows.Select(i => AdminInvitationDto.FromEntity(i, i.User!)));
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
    /// Published, its share link starts working for guests, the approval
    /// time is stamped on the order's agreement record (for the
    /// accountant's export), and the owner is emailed the link.
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

        var now = DateTime.UtcNow;
        invitation.Status = InvitationStatus.Published;
        invitation.PublishedAtUtc = now;
        invitation.PaymentRejectedAtUtc = null;
        invitation.PaymentRejectionNote = null;

        var agreement = await db.SalesAgreements
            .Where(a => a.InvitationId == id && a.CancelledAtUtc == null)
            .OrderByDescending(a => a.AcceptedAtUtc)
            .FirstOrDefaultAsync(ct);
        if (agreement is not null)
        {
            agreement.PaymentApprovedAtUtc = now;
        }

        var amount = invitation.AmountTry is { } a ? a.ToString("C", Tr) : null;
        Audit(AdminActions.PaymentApproved, invitation, amount);
        await db.SaveChangesAsync(ct);

        if (invitation.User is { } owner)
        {
            emails.Enqueue(composer.PaymentApproved(owner, invitation));
        }
        logger.LogInformation(
            "Payment approved for invitation {InvitationId} ({Slug}) by admin {AdminId}",
            invitation.Id, invitation.Slug, AdminId());

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
        Audit(AdminActions.PaymentRejected, invitation, note);
        await db.SaveChangesAsync(ct);

        if (invitation.User is { } owner)
        {
            emails.Enqueue(composer.PaymentRejected(owner, invitation, note));
        }
        logger.LogInformation(
            "Payment rejected for invitation {InvitationId} ({Slug}) by admin {AdminId}",
            invitation.Id, invitation.Slug, AdminId());

        return Ok(InvitationDto.FromEntity(invitation));
    }

    /// Approved orders for the accountant, as CSV: one row per order whose
    /// transfer was confirmed between `from` and `to` (Turkish calendar
    /// days, both inclusive). Read from the agreement records, so orders
    /// whose invitation or account was deleted later are still in it.
    /// Semicolon-separated with a BOM and Turkish number format, which is
    /// what Excel in a Turkish locale opens correctly.
    [HttpGet("orders/approved.csv")]
    public async Task<IActionResult> ApprovedOrdersCsv([FromQuery] DateOnly from, [FromQuery] DateOnly to, CancellationToken ct)
    {
        if (from > to || to.DayNumber - from.DayNumber > 366 * 3)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.ExportRangeInvalid);
        }
        var fromUtc = TurkeyTime.StartOfDayUtc(from);
        var toUtc = TurkeyTime.StartOfDayUtc(to.AddDays(1));
        var rows = await db.SalesAgreements
            .Where(a => a.PaymentApprovedAtUtc >= fromUtc && a.PaymentApprovedAtUtc < toUtc)
            .OrderBy(a => a.PaymentApprovedAtUtc)
            .ToListAsync(ct);

        var csv = new StringBuilder();
        csv.AppendLine(string.Join(';', "Onay tarihi", "Referans", "Ad", "Soyad", "E-posta", "Tutar (TL)", "Çift", "Sipariş tarihi"));
        foreach (var a in rows)
        {
            csv.AppendLine(string.Join(';',
                Cell(TurkeyTime.FromUtc(a.PaymentApprovedAtUtc!.Value).ToString("dd.MM.yyyy HH:mm", Tr)),
                Cell(a.PaymentReference ?? ""),
                Cell(a.UserFirstName),
                Cell(a.UserLastName),
                Cell(a.UserEmail),
                Cell(a.AmountTry.ToString("0.00", Tr)),
                Cell(a.CoupleNames),
                Cell(TurkeyTime.FromUtc(a.AcceptedAtUtc).ToString("dd.MM.yyyy HH:mm", Tr))));
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        return File(bytes, "text/csv; charset=utf-8", $"zarify-onaylanan-siparisler-{from:yyyy-MM-dd}-{to:yyyy-MM-dd}.csv");
    }

    /// Quotes a CSV field, and defuses values a spreadsheet would run as a
    /// formula (a couple's name typed as "=HYPERLINK(…)").
    private static string Cell(string value)
    {
        if (value.Length > 0 && "=+-@\t\r".Contains(value[0]))
        {
            value = "'" + value;
        }
        return $"\"{value.Replace("\"", "\"\"")}\"";
    }

    // ── Invitations ───────────────────────────────────────────────────────

    /// Every invitation in every status, newest first, filtered by status
    /// and by a search over the payment reference, slug, the couple's names
    /// and the owner's email.
    [HttpGet("invitations")]
    public async Task<ActionResult<PagedDto<AdminInvitationDto>>> Invitations(
        [FromQuery] string? status, [FromQuery] string? q, [FromQuery] int page = 1, CancellationToken ct = default)
    {
        var query = db.Invitations.Include(i => i.User).AsQueryable();
        if (InvitationDto.StatusFromWire(status) is { } wanted)
        {
            query = query.Where(i => i.Status == wanted);
        }
        if (Term(q) is { } term)
        {
            query = query.Where(i =>
                (i.PaymentReference != null && i.PaymentReference.Contains(term))
                || i.Slug.Contains(term)
                || i.BrideName.Contains(term)
                || i.GroomName.Contains(term)
                || i.User!.Email.Contains(term));
        }

        page = Math.Max(1, page);
        var total = await query.CountAsync(ct);
        var rows = await query
            .OrderByDescending(i => i.CreatedAtUtc)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync(ct);
        return Ok(new PagedDto<AdminInvitationDto>(
            rows.Select(i => AdminInvitationDto.FromEntity(i, i.User!)).ToList(), total, page, PageSize));
    }

    [HttpGet("invitations/{id:guid}")]
    public async Task<ActionResult<AdminInvitationDetailDto>> InvitationDetail(Guid id, CancellationToken ct)
    {
        var invitation = await db.Invitations.Include(i => i.User).SingleOrDefaultAsync(i => i.Id == id, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }

        var tallies = await db.Rsvps
            .Where(r => r.InvitationId == id)
            .GroupBy(r => r.Attendance)
            .Select(g => new { Attendance = g.Key, Responses = g.Count(), Guests = g.Sum(r => r.GuestCount) })
            .ToListAsync(ct);
        var yes = tallies.SingleOrDefault(t => t.Attendance == RsvpAttendance.Yes);
        var rsvps = new RsvpCountsDto(
            yes?.Responses ?? 0,
            yes?.Guests ?? 0,
            tallies.SingleOrDefault(t => t.Attendance == RsvpAttendance.Maybe)?.Responses ?? 0,
            tallies.SingleOrDefault(t => t.Attendance == RsvpAttendance.No)?.Responses ?? 0);

        var agreements = await db.SalesAgreements
            .Where(a => a.InvitationId == id)
            .OrderByDescending(a => a.AcceptedAtUtc)
            .ToListAsync(ct);

        return Ok(new AdminInvitationDetailDto(
            AdminInvitationDto.FromEntity(invitation, invitation.User!),
            rsvps,
            agreements.Select(SalesAgreementDto.FromEntity).ToList(),
            await HistoryFor(AuditTargets.Invitation, id, ct)));
    }

    /// Takes a published invitation offline (inappropriate content — the
    /// Kullanım Şartları clause). Nothing is deleted: it becomes Removed,
    /// guests see "Bu davetiye yayında değil", RSVPs stop, and the owner is
    /// emailed the reason.
    [HttpPost("invitations/{id:guid}/remove")]
    public async Task<ActionResult<AdminInvitationDto>> Remove(Guid id, AdminNoteRequest request, CancellationToken ct)
    {
        var note = request.Note.Trim();
        if (note.Length == 0)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.NoteInvalid);
        }
        var invitation = await db.Invitations.Include(i => i.User).SingleOrDefaultAsync(i => i.Id == id, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }
        if (invitation.Status != InvitationStatus.Published)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.NotPublished);
        }

        invitation.Status = InvitationStatus.Removed;
        invitation.RemovedAtUtc = DateTime.UtcNow;
        invitation.RemovalNote = note;
        Audit(AdminActions.InvitationRemoved, invitation, note);
        await db.SaveChangesAsync(ct);

        emails.Enqueue(composer.InvitationRemoved(invitation.User!, invitation, note));
        logger.LogInformation("Invitation {InvitationId} ({Slug}) taken offline by admin {AdminId}",
            invitation.Id, invitation.Slug, AdminId());
        return Ok(AdminInvitationDto.FromEntity(invitation, invitation.User!));
    }

    /// Puts a removed invitation back online, same link; the owner is told.
    [HttpPost("invitations/{id:guid}/republish")]
    public async Task<ActionResult<AdminInvitationDto>> Republish(Guid id, CancellationToken ct)
    {
        var invitation = await db.Invitations.Include(i => i.User).SingleOrDefaultAsync(i => i.Id == id, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }
        if (invitation.Status != InvitationStatus.Removed)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.NotRemoved);
        }

        invitation.Status = InvitationStatus.Published;
        invitation.RemovedAtUtc = null;
        invitation.RemovalNote = null;
        Audit(AdminActions.InvitationRepublished, invitation, null);
        await db.SaveChangesAsync(ct);

        emails.Enqueue(composer.InvitationRepublished(invitation.User!, invitation));
        logger.LogInformation("Invitation {InvitationId} ({Slug}) republished by admin {AdminId}",
            invitation.Id, invitation.Slug, AdminId());
        return Ok(AdminInvitationDto.FromEntity(invitation, invitation.User!));
    }

    /// Corrects the couple's names — owners can't change them once the
    /// invitation is paid for. The slug (and every link already shared)
    /// stays; the agreement record keeps the names as accepted.
    [HttpPut("invitations/{id:guid}/names")]
    public async Task<ActionResult<AdminInvitationDto>> CorrectNames(Guid id, CorrectNamesRequest request, CancellationToken ct)
    {
        var bride = request.BrideName.Trim();
        var groom = request.GroomName.Trim();
        if (bride.Length == 0 || groom.Length == 0)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.ValidationFailed);
        }
        var invitation = await db.Invitations.Include(i => i.User).SingleOrDefaultAsync(i => i.Id == id, ct);
        if (invitation is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);
        }

        var before = $"{invitation.BrideName} & {invitation.GroomName}";
        var after = $"{bride} & {groom}";
        if (before != after)
        {
            invitation.BrideName = bride;
            invitation.GroomName = groom;
            invitation.UpdatedAtUtc = DateTime.UtcNow;
            Audit(AdminActions.NamesCorrected, invitation, $"{before} → {after}");
            await db.SaveChangesAsync(ct);
            logger.LogInformation("Names on invitation {InvitationId} corrected by admin {AdminId}", invitation.Id, AdminId());
        }
        return Ok(AdminInvitationDto.FromEntity(invitation, invitation.User!));
    }

    // ── Users ─────────────────────────────────────────────────────────────

    [HttpGet("users")]
    public async Task<ActionResult<PagedDto<AdminUserDto>>> Users(
        [FromQuery] string? q, [FromQuery] bool suspended = false, [FromQuery] int page = 1, CancellationToken ct = default)
    {
        var query = db.Users.AsQueryable();
        if (suspended)
        {
            query = query.Where(u => u.SuspendedAtUtc != null);
        }
        if (Term(q) is { } term)
        {
            query = query.Where(u =>
                u.Email.Contains(term)
                || u.FirstName.Contains(term)
                || u.LastName.Contains(term)
                || (u.FirstName + " " + u.LastName).Contains(term));
        }

        page = Math.Max(1, page);
        var total = await query.CountAsync(ct);
        var rows = await query
            .OrderByDescending(u => u.CreatedAtUtc)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .Select(u => new { User = u, Invitations = db.Invitations.Count(i => i.UserId == u.Id) })
            .ToListAsync(ct);
        return Ok(new PagedDto<AdminUserDto>(
            rows.Select(r => ToDto(r.User, r.Invitations)).ToList(), total, page, PageSize));
    }

    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult<AdminUserDetailDto>> UserDetail(Guid id, CancellationToken ct)
    {
        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == id, ct);
        if (user is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.UserNotFound);
        }
        var invitations = await db.Invitations
            .Where(i => i.UserId == id)
            .OrderByDescending(i => i.CreatedAtUtc)
            .ToListAsync(ct);
        return Ok(new AdminUserDetailDto(
            ToDto(user, invitations.Count),
            invitations.Select(i => AdminInvitationDto.FromEntity(i, user)).ToList(),
            await HistoryFor(AuditTargets.User, id, ct)));
    }

    /// Suspends an account: it can no longer sign in, and rotating its
    /// SecurityStamp ends every open session at once. Its published
    /// invitations stay up — taking one down is a separate decision
    /// (Remove). Admin accounts can't be suspended here.
    [HttpPost("users/{id:guid}/suspend")]
    public async Task<ActionResult<AdminUserDto>> Suspend(Guid id, AdminNoteRequest request, CancellationToken ct)
    {
        var note = request.Note.Trim();
        if (note.Length == 0)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.NoteInvalid);
        }
        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == id, ct);
        if (user is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.UserNotFound);
        }
        if (user.Role == UserRole.Admin)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.CannotSuspendAdmin);
        }
        if (user.SuspendedAtUtc is not null)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.AlreadySuspended);
        }

        user.SuspendedAtUtc = DateTime.UtcNow;
        user.SuspensionNote = note;
        user.SecurityStamp = Models.User.NewSecurityStamp();
        Audit(AdminActions.UserSuspended, AuditTargets.User, user.Id, user.Email, note);
        await db.SaveChangesAsync(ct);

        logger.LogInformation("User {UserId} suspended by admin {AdminId}", user.Id, AdminId());
        return Ok(ToDto(user, await db.Invitations.CountAsync(i => i.UserId == id, ct)));
    }

    [HttpPost("users/{id:guid}/reinstate")]
    public async Task<ActionResult<AdminUserDto>> Reinstate(Guid id, CancellationToken ct)
    {
        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == id, ct);
        if (user is null)
        {
            return this.Error(StatusCodes.Status404NotFound, ErrorCodes.UserNotFound);
        }
        if (user.SuspendedAtUtc is null)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.NotSuspended);
        }

        user.SuspendedAtUtc = null;
        user.SuspensionNote = null;
        Audit(AdminActions.UserReinstated, AuditTargets.User, user.Id, user.Email, null);
        await db.SaveChangesAsync(ct);

        logger.LogInformation("User {UserId} reinstated by admin {AdminId}", user.Id, AdminId());
        return Ok(ToDto(user, await db.Invitations.CountAsync(i => i.UserId == id, ct)));
    }

    // ── Audit log ─────────────────────────────────────────────────────────

    [HttpGet("audit")]
    public async Task<ActionResult<PagedDto<AuditEntryDto>>> AuditLog([FromQuery] int page = 1, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        var total = await db.AdminAuditLogs.CountAsync(ct);
        var rows = await db.AdminAuditLogs
            .OrderByDescending(l => l.CreatedAtUtc)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync(ct);
        return Ok(new PagedDto<AuditEntryDto>(rows.Select(AuditEntryDto.FromEntity).ToList(), total, page, PageSize));
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private async Task<List<AuditEntryDto>> HistoryFor(string targetType, Guid id, CancellationToken ct) =>
        (await db.AdminAuditLogs
            .Where(l => l.TargetType == targetType && l.TargetId == id)
            .OrderByDescending(l => l.CreatedAtUtc)
            .Take(50)
            .ToListAsync(ct))
        .Select(AuditEntryDto.FromEntity)
        .ToList();

    private void Audit(string action, Invitation invitation, string? note) =>
        Audit(action, AuditTargets.Invitation, invitation.Id,
            $"{invitation.PaymentReference ?? invitation.Slug} · {invitation.BrideName} & {invitation.GroomName}", note);

    /// Added to the context; saved with the change it records.
    private void Audit(string action, string targetType, Guid targetId, string label, string? note)
    {
        Guid.TryParse(AdminId(), out var adminId);
        db.AdminAuditLogs.Add(new AdminAuditLog
        {
            AdminUserId = adminId == Guid.Empty ? null : adminId,
            AdminEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email") ?? "?",
            Action = action,
            TargetType = targetType,
            TargetId = targetId,
            TargetLabel = label.Length > 300 ? label[..300] : label,
            Note = note,
        });
    }

    private string? AdminId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

    private static string? Term(string? q) =>
        string.IsNullOrWhiteSpace(q) ? null : q.Trim() is { Length: <= 100 } t ? t : q.Trim()[..100];

    private static AdminUserDto ToDto(User u, int invitationCount) => new(
        u.Id, u.Email, u.FirstName, u.LastName, u.Role == UserRole.Admin ? "admin" : "user",
        u.CreatedAtUtc, u.SuspendedAtUtc, u.SuspensionNote, invitationCount);
}
