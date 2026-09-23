using System.ComponentModel.DataAnnotations;

namespace Zarify.Api.Dtos;

/// Everything an owner can set on an invitation — shared by create and
/// update so both validate identically.
public class InvitationFieldsRequest : IValidatableObject
{
    public const int MaxScheduleItems = 12;

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

    [MaxLength(2000)]
    public string? StoryText { get; set; }

    public List<ScheduleItemRequest> Schedule { get; set; } = [];

    [MaxLength(1000)]
    public string? DressCode { get; set; }

    [MaxLength(1000)]
    public string? GiftNote { get; set; }

    [MaxLength(1000)]
    public string? AccommodationNote { get; set; }

    public DateOnly? RsvpDeadline { get; set; }

    public bool RsvpEnabled { get; set; } = true;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Schedule.Count > MaxScheduleItems)
        {
            yield return new ValidationResult(
                $"Programa en fazla {MaxScheduleItems} satır eklenebilir.", [nameof(Schedule)]);
        }
        if (RsvpDeadline is { } deadline && deadline > WeddingDate)
        {
            yield return new ValidationResult(
                "Katılım bildirimi son tarihi düğün tarihinden sonra olamaz.", [nameof(RsvpDeadline)]);
        }
    }
}

public class ScheduleItemRequest
{
    [Required, RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d$", ErrorMessage = "Program saati SS:DD biçiminde olmalıdır.")]
    public required string Time { get; set; }

    [Required(ErrorMessage = "Program satırının başlığı boş olamaz."), MaxLength(100)]
    public required string Title { get; set; }

    [MaxLength(300)]
    public string? Description { get; set; }
}
