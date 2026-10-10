namespace Zarify.Api.Models;

/// Draft → PendingPayment → Published. Only Published invitations are
/// visible to guests (and accept RSVPs); the owner can always see and edit
/// their own. Draft is reserved for server-side drafts — today the create
/// flow keeps drafts in the browser and publishing creates the invitation
/// directly as PendingPayment.
public enum InvitationStatus
{
    Draft,
    PendingPayment,
    Published,
}

public class Invitation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required Guid UserId { get; set; }
    public User? User { get; set; }

    /// URL-safe, globally unique — this is what the public /davetiye/{slug}
    /// page and the share link are addressed by. Fixed at creation: editing
    /// the couple's names later must not break links already sent to guests.
    public required string Slug { get; set; }
    public required string TemplateSlug { get; set; }

    /// What the couple writes in the bank-transfer description ("ZRF-4K7Q")
    /// so the admin can match the payment. Separate from the slug: short,
    /// name-independent, no look-alike characters. Null only on invitations
    /// that were already live before payments existed.
    public string? PaymentReference { get; set; }

    /// The price at the moment the order was placed (PendingPayment). What
    /// the payment screen, the admin queue and the accepted contract show —
    /// later changes to Payment:AmountTry never reach an existing order.
    public decimal? AmountTry { get; set; }

    public required string BrideName { get; set; }
    public required string GroomName { get; set; }
    public required DateOnly WeddingDate { get; set; }
    public required TimeOnly WeddingTime { get; set; }
    public required string VenueName { get; set; }
    public required string VenueAddress { get; set; }

    // Optional content. Every field here is nullable/empty by default, and
    // the public page renders a section only when the couple filled it in —
    // a published invitation never falls back to template placeholder text.
    public string? StoryText { get; set; }
    public List<ScheduleItem> Schedule { get; set; } = [];
    public string? DressCode { get; set; }
    public string? GiftNote { get; set; }
    public string? AccommodationNote { get; set; }
    public DateOnly? RsvpDeadline { get; set; }

    public bool RsvpEnabled { get; set; } = true;

    public InvitationStatus Status { get; set; } = InvitationStatus.PendingPayment;

    /// When an admin confirmed the bank transfer and the invitation went live.
    public DateTime? PublishedAtUtc { get; set; }

    /// Set when an admin couldn't match the transfer (wrong amount, no
    /// reference, nothing arrived…) and said why. The order stays
    /// PendingPayment so the couple can fix it; approving clears both.
    public DateTime? PaymentRejectedAtUtc { get; set; }
    public string? PaymentRejectionNote { get; set; }

    /// When the owner ticked "I've read the Pre-Contract Information Form and
    /// the Distance Sales Contract" before publishing — the server's clock,
    /// not the browser's — and which version of those texts they saw. Null
    /// only on invitations created before the checkbox existed. The durable
    /// copy that survives deletion is the SalesAgreement row.
    public DateTime? DistanceSalesAcceptedAtUtc { get; set; }
    public string? DistanceSalesVersion { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}

/// One line of the day's programme, e.g. 16:00 · Nikâh Töreni.
public class ScheduleItem
{
    /// "HH:mm"
    public required string Time { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
}
