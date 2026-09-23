namespace Zarify.Api.Models;

public class Invitation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required Guid UserId { get; set; }
    public User? User { get; set; }

    /// URL-safe, globally unique — this is what the public /davetiye/{slug}
    /// page and the share link are addressed by.
    public required string Slug { get; set; }
    public required string TemplateSlug { get; set; }

    public required string BrideName { get; set; }
    public required string GroomName { get; set; }
    public required DateOnly WeddingDate { get; set; }
    public required TimeOnly WeddingTime { get; set; }
    public required string VenueName { get; set; }
    public required string VenueAddress { get; set; }

    public bool IncludePhotoAlbum { get; set; } = true;
    public bool IncludeDressCode { get; set; } = true;
    public bool RsvpEnabled { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
