namespace Zarify.Api.Models;

/// One "forgot password" link. The token itself goes only into the email;
/// the database keeps its SHA-256 hash. Valid for an hour, once — and
/// asking for a new link deletes the user's earlier ones.
public class PasswordResetToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required Guid UserId { get; set; }
    public User? User { get; set; }

    /// Lowercase hex SHA-256 of the token.
    public required string TokenHash { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public required DateTime ExpiresAtUtc { get; set; }
    public DateTime? UsedAtUtc { get; set; }
}
