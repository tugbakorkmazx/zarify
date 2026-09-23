namespace Zarify.Api.Models;

public enum RsvpAttendance
{
    Yes,
    No,
    Maybe,
}

/// One guest's reply to one invitation. Guests have no account, so a reply
/// is keyed only by the invitation it belongs to — the name is whatever the
/// guest typed.
public class Rsvp
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required Guid InvitationId { get; set; }
    public Invitation? Invitation { get; set; }

    /// As the guest last typed it (whitespace tidied) — what the couple sees.
    public required string GuestName { get; set; }

    /// Folded form of GuestName (see GuestNameKey) — how a repeat reply from
    /// the same guest is recognised and updated instead of duplicated.
    public required string GuestNameKey { get; set; }
    public required RsvpAttendance Attendance { get; set; }

    /// Headcount including the guest themselves. Always 0 for a "No" reply,
    /// so summing it gives expected attendance without special-casing.
    public int GuestCount { get; set; }

    public string? Message { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    /// Set when the same guest (same name, same invitation) replies again
    /// and their earlier reply is overwritten rather than duplicated.
    public DateTime? UpdatedAtUtc { get; set; }
}
