namespace Zarify.Api.Models;

public enum UserRole
{
    User,
    Admin,
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    /// Everyone registers as a plain User. Admin (the operator's payment
    /// approval panel) is granted directly in the database, never through
    /// the API.
    public UserRole Role { get; set; } = UserRole.User;

    /// Copied into every token this user is issued ("stamp" claim) and
    /// checked on each authenticated request. Changing it — on a password
    /// reset — signs the user out everywhere at once.
    public string SecurityStamp { get; set; } = NewSecurityStamp();

    public static string NewSecurityStamp() => Guid.NewGuid().ToString("N");

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
