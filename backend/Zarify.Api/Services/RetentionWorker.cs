using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Zarify.Api.Data;
using Zarify.Api.Models;
using Zarify.Api.Options;
using Zarify.Api.Services.Email;

namespace Zarify.Api.Services;

/// Applies the retention periods (Retention section) once a day, a minute
/// after startup and every 24 hours after that:
///   1. owners of published invitations that close to guests within
///      NoticeDaysBefore days are emailed once, with a nudge to download
///      the replies;
///   2. invitations DeleteAfterMonths past the wedding are deleted with
///      their RSVPs (cascade).
/// Closing to guests itself needs no job — the guest page checks the date
/// (InvitationRules). SalesAgreements are only unlinked (SetNull) and the
/// admin audit log is never touched. An unpaid order deleted this way has
/// its agreement marked cancelled, like any other cancelled order.
public class RetentionWorker(
    IServiceScopeFactory scopes,
    IOptions<RetentionOptions> options,
    ILogger<RetentionWorker> logger) : BackgroundService
{
    private static readonly TimeSpan FirstRunDelay = TimeSpan.FromMinutes(1);
    private static readonly TimeSpan Interval = TimeSpan.FromHours(24);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await Task.Delay(FirstRunDelay, stoppingToken);
            using var timer = new PeriodicTimer(Interval);
            do
            {
                try
                {
                    await RunOnceAsync(DateTime.UtcNow, stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    logger.LogError(ex, "Retention run failed; retrying at the next interval");
                }
            }
            while (await timer.WaitForNextTickAsync(stoppingToken));
        }
        catch (OperationCanceledException)
        {
            // shutting down
        }
    }

    /// One pass. Public so a test or an admin tool can run it on demand.
    public async Task<(int Notified, int Deleted)> RunOnceAsync(DateTime nowUtc, CancellationToken ct)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ZarifyDbContext>();
        var emails = scope.ServiceProvider.GetRequiredService<IEmailQueue>();
        var composer = scope.ServiceProvider.GetRequiredService<EmailComposer>();
        var r = options.Value;
        var today = DateOnly.FromDateTime(TurkeyTime.FromUtc(nowUtc));

        // 1. Reminders: guest access ends at the start of the day after
        //    wedding + GuestAccessMonths, so the last open day is that date.
        //    A wedding date W is due when W + months − NoticeDaysBefore ≤ today.
        var noticeCutoff = today.AddDays(r.NoticeDaysBefore).AddMonths(-r.GuestAccessMonths);
        var due = await db.Invitations
            .Include(i => i.User)
            .Where(i => i.Status == InvitationStatus.Published
                && i.RetentionNoticeSentAtUtc == null
                && i.WeddingDate <= noticeCutoff)
            .ToListAsync(ct);
        var notified = 0;
        foreach (var invitation in due)
        {
            var lastOpenDay = invitation.WeddingDate.AddMonths(r.GuestAccessMonths);
            invitation.RetentionNoticeSentAtUtc = nowUtc;
            // Already closed (e.g. the job was down): nothing useful to warn
            // about any more; just mark it.
            if (lastOpenDay >= today && invitation.User is { } owner)
            {
                emails.Enqueue(composer.RetentionNotice(
                    owner, invitation, lastOpenDay.AddDays(1), invitation.WeddingDate.AddMonths(r.DeleteAfterMonths).AddDays(1)));
                notified++;
            }
        }
        await db.SaveChangesAsync(ct);

        // 2. Deletion: wedding + DeleteAfterMonths has fully passed.
        var deleteCutoff = today.AddMonths(-r.DeleteAfterMonths).AddDays(-1);
        var expired = await db.Invitations
            .Where(i => i.WeddingDate <= deleteCutoff)
            .Select(i => new { i.Id, i.Status })
            .ToListAsync(ct);
        if (expired.Count > 0)
        {
            var unpaid = expired
                .Where(e => e.Status is InvitationStatus.PendingPayment or InvitationStatus.Draft)
                .Select(e => e.Id)
                .ToList();
            if (unpaid.Count > 0)
            {
                await db.SalesAgreements
                    .Where(a => a.InvitationId != null && unpaid.Contains(a.InvitationId.Value) && a.CancelledAtUtc == null)
                    .ExecuteUpdateAsync(s => s.SetProperty(a => a.CancelledAtUtc, nowUtc), ct);
            }
            var ids = expired.Select(e => e.Id).ToList();
            // RSVPs go by cascade; agreements are unlinked (SetNull) — both
            // enforced by the database, so a bulk delete is safe here.
            await db.Invitations.Where(i => ids.Contains(i.Id)).ExecuteDeleteAsync(ct);
        }

        if (notified > 0 || expired.Count > 0)
        {
            logger.LogInformation("Retention: {Notified} reminder(s) sent, {Deleted} invitation(s) deleted", notified, expired.Count);
        }
        return (notified, expired.Count);
    }
}
