namespace Zarify.Api.Models;

/// The record that a buyer accepted the Pre-Contract Information Form and
/// the Distance Sales Contract for one invitation order — kept for at least
/// three years (6502 sayılı Kanun / Mesafeli Sözleşmeler Yönetmeliği), so it
/// must outlive both the invitation and the account. Everything needed to
/// prove the agreement is copied onto the row at acceptance time; the links
/// to the invitation and the user are only conveniences and are set to null
/// (never cascaded) when either is deleted.
public class SalesAgreement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? InvitationId { get; set; }
    public Invitation? Invitation { get; set; }

    public Guid? UserId { get; set; }
    public User? User { get; set; }

    // The buyer as they were when they accepted.
    public required string UserEmail { get; set; }
    public required string UserFirstName { get; set; }
    public required string UserLastName { get; set; }

    // The order as it was when they accepted.
    public required string InvitationSlug { get; set; }
    public required string CoupleNames { get; set; }
    public string? PaymentReference { get; set; }
    public required decimal AmountTry { get; set; }

    /// Server clock, never the browser's.
    public required DateTime AcceptedAtUtc { get; set; }

    /// legalSettings.version of the texts that were shown, e.g. "2026-10-08".
    public string? Version { get; set; }

    /// Set when the owner cancelled the order before it was published. The
    /// invitation itself is deleted then; this row stays.
    public DateTime? CancelledAtUtc { get; set; }

    /// When an admin confirmed the bank transfer for this order. Kept here,
    /// on the row that outlives the invitation and the account, so the
    /// accountant's export of approved orders stays complete.
    public DateTime? PaymentApprovedAtUtc { get; set; }
}
