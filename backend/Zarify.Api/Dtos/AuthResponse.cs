namespace Zarify.Api.Dtos;

public record AuthResponse(string Token, DateTime ExpiresAtUtc, UserDto User);
