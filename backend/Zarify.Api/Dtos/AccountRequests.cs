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
