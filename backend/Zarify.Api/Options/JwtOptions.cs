namespace Zarify.Api.Options;

public class JwtOptions
{
    public required string Key { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    /// Access tokens are short-lived; the refresh cookie renews them.
    public int ExpiryMinutes { get; set; } = 15;

    /// How long a refresh cookie lives without being used. Each use issues
    /// a fresh one, so an active user never signs in again.
    public int RefreshDays { get; set; } = 14;
}
