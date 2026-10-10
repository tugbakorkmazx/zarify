namespace Zarify.Api.Models;

/// One long-lived sign-in, held by the browser as an httpOnly cookie; the
/// database keeps only its SHA-256 hash. Every use replaces it with a new
/// one (rotation). It also carries the user's SecurityStamp from when it was
/// issued: a password reset, suspension or anything else that rotates the
/// stamp makes every outstanding refresh token useless at once. Deleting the
/// account deletes them (cascade).
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required Guid UserId { get; set; }
    public User? User { get; set; }

    /// Lowercase hex SHA-256 of the cookie value.
    public required string TokenHash { get; set; }

    /// User.SecurityStamp when this token was issued.
    public required string SecurityStamp { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public required DateTime ExpiresAtUtc { get; set; }

    /// Set when it was exchanged for a new token, or revoked at sign-out.
    public DateTime? RevokedAtUtc { get; set; }

    /// True when it was rotated (rather than revoked at sign-out) — a rotated
    /// token showing up again means it was copied, and the whole family is
    /// revoked.
    public bool Rotated { get; set; }
}
