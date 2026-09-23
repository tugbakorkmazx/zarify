using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

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
    bool IncludePhotoAlbum,
    bool IncludeDressCode,
    bool RsvpEnabled,
    DateTime CreatedAtUtc)
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
        invitation.IncludePhotoAlbum,
        invitation.IncludeDressCode,
        invitation.RsvpEnabled,
        invitation.CreatedAtUtc);
}
