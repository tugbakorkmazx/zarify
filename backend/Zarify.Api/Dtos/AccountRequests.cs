using System.ComponentModel.DataAnnotations;

namespace Zarify.Api.Dtos;

public class ForgotPasswordRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public required string Email { get; set; }
}

public class ResetPasswordRequest
{
    /// The token from the emailed link.
    [Required, MaxLength(100)]
    public required string Token { get; set; }

    [Required, MinLength(8), MaxLength(128)]
    public required string Password { get; set; }
}

public class DeleteAccountRequest
{
    /// The current password — deleting is irreversible, so a stolen or
    /// forgotten-open session alone can't do it.
    [Required, MaxLength(128)]
    public required string Password { get; set; }
}

public class RejectPaymentRequest
{
    /// Why the transfer couldn't be confirmed; sent to the couple as-is.
    [Required, MaxLength(500)]
    public required string Note { get; set; }
}

/// Taking an invitation offline or suspending an account: the reason is
/// required — it's emailed to the owner (removal) and kept in the log.
public class AdminNoteRequest
{
    [Required, MaxLength(500)]
    public required string Note { get; set; }
}

public class CorrectNamesRequest
{
    [Required, MaxLength(100)]
    public required string BrideName { get; set; }

    [Required, MaxLength(100)]
    public required string GroomName { get; set; }
}

public class RsvpDeadlineRequest
{
    public DateOnly? RsvpDeadline { get; set; }
}

/// The archived contract HTML, for the owner's "Sözleşmemi görüntüle" page.
public record ContractDocumentDto(string Html, string? Sha256, string? PaymentReference, DateTime AcceptedAtUtc);
