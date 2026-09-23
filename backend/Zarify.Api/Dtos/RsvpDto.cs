using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

public record RsvpDto(
    Guid Id,
    string GuestName,
    string Attendance,
    int GuestCount,
    string? Message,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc)
{
    public static RsvpDto FromEntity(Rsvp rsvp) => new(
        rsvp.Id,
        rsvp.GuestName,
        AttendanceToWire(rsvp.Attendance),
        rsvp.GuestCount,
        rsvp.Message,
        rsvp.CreatedAtUtc,
        rsvp.UpdatedAtUtc);

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
    int NotAttendingResponses);

public record MyInvitationDto(InvitationDto Invitation, RsvpSummaryDto Rsvp);
