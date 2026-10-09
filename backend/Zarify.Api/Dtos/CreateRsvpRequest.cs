using System.ComponentModel.DataAnnotations;

namespace Zarify.Api.Dtos;

public class CreateRsvpRequest
{
    [Required, MaxLength(160)]
    public required string InvitationSlug { get; set; }

    [Required, MaxLength(100)]
    public required string Name { get; set; }

    /// "yes" | "no" | "maybe"
    [Required, RegularExpression("^(yes|no|maybe)$", ErrorMessage = "Geçersiz katılım durumu.")]
    public required string Attendance { get; set; }

    [Range(1, 20, ErrorMessage = "Kişi sayısı 1 ile 20 arasında olmalıdır.")]
    public int Guests { get; set; } = 1;

    [MaxLength(1000)]
    public string? Message { get; set; }

    /// The token this browser got back with its first reply. With it, the
    /// reply is updated; without it (or with an unknown one) a new reply is
    /// added — a name alone never overwrites anyone's answer.
    [MaxLength(100)]
    public string? EditToken { get; set; }
}
