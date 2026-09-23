using System.ComponentModel.DataAnnotations;

namespace Zarify.Api.Dtos;

public class CreateInvitationRequest
{
    [Required, MaxLength(100)]
    public required string TemplateSlug { get; set; }

    [Required, MaxLength(100)]
    public required string BrideName { get; set; }

    [Required, MaxLength(100)]
    public required string GroomName { get; set; }

    [Required]
    public required DateOnly WeddingDate { get; set; }

    [Required]
    public required TimeOnly WeddingTime { get; set; }

    [Required, MaxLength(150)]
    public required string VenueName { get; set; }

    [Required, MaxLength(300)]
    public required string VenueAddress { get; set; }

    public bool IncludePhotoAlbum { get; set; } = true;
    public bool IncludeDressCode { get; set; } = true;
    public bool RsvpEnabled { get; set; } = true;
}
