namespace Zarify.Api.Models;

/// One thing an admin did: approving or rejecting a payment, taking an
/// invitation offline or putting it back, correcting the couple's names,
/// suspending or reinstating an account. Append-only. Like SalesAgreement,
/// it copies what it needs (the admin's email, a readable label for the
/// target) so it still reads correctly after the admin, the invitation or
/// the user is deleted.
public class AdminAuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// Cleared (not cascaded) if the admin's account is ever deleted.
    public Guid? AdminUserId { get; set; }
    public User? AdminUser { get; set; }
    public required string AdminEmail { get; set; }

    /// One of AdminActions.
    public required string Action { get; set; }

    /// "invitation" or "user", and that row's id — no foreign key, the
    /// target may be deleted later.
    public required string TargetType { get; set; }
    public required Guid TargetId { get; set; }

    /// What a person reads in the log: "ZRF-4K7Q · Ayşe & Mehmet" or an
    /// email address.
    public required string TargetLabel { get; set; }

    /// The admin's reason, or for a name correction "old → new".
    public string? Note { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public static class AdminActions
{
    public const string PaymentApproved = "payment.approved";
    public const string PaymentRejected = "payment.rejected";
    public const string InvitationRemoved = "invitation.removed";
    public const string InvitationRepublished = "invitation.republished";
    public const string NamesCorrected = "invitation.names-corrected";
    public const string UserSuspended = "user.suspended";
    public const string UserReinstated = "user.reinstated";
}

public static class AuditTargets
{
    public const string Invitation = "invitation";
    public const string User = "user";
}
