using Zarify.Api.Models;
using Zarify.Api.Options;

namespace Zarify.Api.Services;

/// The dates that decide what guests can do with an invitation, all on the
/// Turkish calendar: RSVPs close at the end of the deadline day (or of the
/// wedding day when there's no deadline); the page closes to guests
/// GuestAccessMonths after the wedding, and the invitation is deleted
/// DeleteAfterMonths after it.
public static class InvitationRules
{
    /// The first moment RSVPs are no longer accepted (UTC).
    public static DateTime RsvpClosesAtUtc(Invitation i) =>
        TurkeyTime.StartOfDayUtc((i.RsvpDeadline ?? i.WeddingDate).AddDays(1));

    public static bool RsvpClosed(Invitation i, DateTime nowUtc) => nowUtc >= RsvpClosesAtUtc(i);

    /// The first moment guests can no longer open the page (UTC).
    public static DateTime GuestAccessEndsAtUtc(Invitation i, RetentionOptions r) =>
        TurkeyTime.StartOfDayUtc(i.WeddingDate.AddMonths(r.GuestAccessMonths).AddDays(1));

    public static bool GuestAccessEnded(Invitation i, RetentionOptions r, DateTime nowUtc) =>
        nowUtc >= GuestAccessEndsAtUtc(i, r);

    /// The first moment the invitation may be deleted (UTC).
    public static DateTime DeleteAtUtc(DateOnly weddingDate, RetentionOptions r) =>
        TurkeyTime.StartOfDayUtc(weddingDate.AddMonths(r.DeleteAfterMonths).AddDays(1));
}
