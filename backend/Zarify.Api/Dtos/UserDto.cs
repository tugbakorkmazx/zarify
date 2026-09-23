using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

public record UserDto(Guid Id, string Email, string FirstName, string LastName)
{
    public static UserDto FromEntity(User user) =>
        new(user.Id, user.Email, user.FirstName, user.LastName);
}
