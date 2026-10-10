using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

public record ScheduleItemDto(string Time, string Title, string? Description);

public record InvitationDto(
    Guid Id,
    string Slug,
    string TemplateSlug,
    string BrideName,
    string GroomName,
    DateOnly WeddingDate,
    TimeOnly WeddingTime,
    string VenueName,
    string VenueAddress,
    string? StoryText,
    List<ScheduleItemDto> Schedule,
    string? DressCode,
    string? GiftNote,
    string? AccommodationNote,
    DateOnly? RsvpDeadline,
    bool RsvpEnabled,
    string Status,
    DateTime? PublishedAtUtc,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    /// Only on a PendingPayment invitation whose transfer an admin
    /// couldn't confirm; cleared on approval, so guests never see it.
    DateTime? PaymentRejectedAtUtc,
    string? PaymentRejectionNote)
{
    public static string StatusToWire(InvitationStatus status) => status switch
    {
        InvitationStatus.Draft => "draft",
        InvitationStatus.PendingPayment => "pendingPayment",
        _ => "published",
    };

    public static InvitationDto FromEntity(Invitation invitation) => new(
        invitation.Id,
        invitation.Slug,
        invitation.TemplateSlug,
        invitation.BrideName,
        invitation.GroomName,
        invitation.WeddingDate,
        invitation.WeddingTime,
        invitation.VenueName,
        invitation.VenueAddress,
        invitation.StoryText,
        invitation.Schedule.Select(s => new ScheduleItemDto(s.Time, s.Title, s.Description)).ToList(),
        invitation.DressCode,
        invitation.GiftNote,
        invitation.AccommodationNote,
        invitation.RsvpDeadline,
        invitation.RsvpEnabled,
        StatusToWire(invitation.Status),
        invitation.PublishedAtUtc,
        invitation.CreatedAtUtc,
        invitation.UpdatedAtUtc,
        invitation.PaymentRejectedAtUtc,
        invitation.PaymentRejectionNote);
}
