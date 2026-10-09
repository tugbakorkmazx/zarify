using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

public record RsvpDto(
    Guid Id,
    string GuestName,
    string Attendance,
    int GuestCount,
    string? Message,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    /// Another reply to the same invitation carries the same (folded) name —
    /// the same guest answering from a second device, or someone answering
    /// in their name. The owner decides which one counts.
    bool DuplicateName = false)
{
    public static RsvpDto FromEntity(Rsvp rsvp, bool duplicateName = false) => new(
        rsvp.Id,
        rsvp.GuestName,
        AttendanceToWire(rsvp.Attendance),
        rsvp.GuestCount,
        rsvp.Message,
        rsvp.CreatedAtUtc,
        rsvp.UpdatedAtUtc,
        duplicateName);

    public static string AttendanceToWire(RsvpAttendance attendance) => attendance switch
    {
        RsvpAttendance.Yes => "yes",
        RsvpAttendance.No => "no",
        _ => "maybe",
    };

    public static RsvpAttendance AttendanceFromWire(string value) => value switch
    {
        "yes" => RsvpAttendance.Yes,
        "no" => RsvpAttendance.No,
        _ => RsvpAttendance.Maybe,
    };
}

/// Per-invitation tallies for the owner's dashboard. "Responses" counts
/// replies; "Guests" sums headcount, which is what a couple actually plans
/// seating and catering around.
public record RsvpSummaryDto(
    int AttendingResponses,
    int AttendingGuests,
    int MaybeResponses,
    int MaybeGuests,
    int NotAttendingResponses,
    /// How many replies share a name with another reply (see RsvpDto.DuplicateName).
    int DuplicateNameResponses = 0);

/// What the guest's browser gets back: the reply's id and the token that
/// lets this browser — and only it — change the reply later.
public record GuestRsvpResponse(Guid Id, string Attendance, string EditToken);

public record MyInvitationDto(InvitationDto Invitation, RsvpSummaryDto Rsvp);
