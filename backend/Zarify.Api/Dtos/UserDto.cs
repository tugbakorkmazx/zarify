using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

/// Role is "user" or "admin" — the frontend uses it only to decide whether
/// to show the admin link; every admin endpoint checks the role itself.
public record UserDto(Guid Id, string Email, string FirstName, string LastName, string Role)
{
    public static UserDto FromEntity(User user) =>
        new(user.Id, user.Email, user.FirstName, user.LastName, user.Role == UserRole.Admin ? "admin" : "user");
}
