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
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc)
{
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
        invitation.CreatedAtUtc,
        invitation.UpdatedAtUtc);
}
