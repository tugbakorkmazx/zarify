namespace Zarify.Api.Options;

/// How long a wedding's data is kept (Retention section). Counted from the
/// wedding date, in whole months, on the Turkish calendar. Mirrored for the
/// legal texts through GET /api/pricing. Pending lawyer approval — see
/// EKSIKLER.md #21.
public class RetentionOptions
{
    /// After this the guest page reads "yayın süresi doldu" (the owner can
    /// still open it and download the replies).
    public int GuestAccessMonths { get; set; } = 3;

    /// After this the invitation and its RSVPs are deleted. The sales
    /// agreement and the admin audit log are kept.
    public int DeleteAfterMonths { get; set; } = 6;

    /// The owner is reminded this many days before guests lose access.
    public int NoticeDaysBefore { get; set; } = 7;
}
