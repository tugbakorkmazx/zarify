using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;

namespace Zarify.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ZarifyDbContext db, ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken ct)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var emailTaken = await db.Users.AnyAsync(u => u.Email == normalizedEmail, ct);
        if (emailTaken)
        {
            return Conflict(new { message = "Bu e-posta adresi zaten kayıtlı." });
        }

        var user = new User
        {
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        var (token, expiresAtUtc) = tokenService.CreateToken(user);
        return CreatedAtAction(nameof(Me), new { }, new AuthResponse(token, expiresAtUtc, UserDto.FromEntity(user)));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail, ct);

        // Same generic message whether the email doesn't exist or the password
        // is wrong, so a caller can't use this endpoint to enumerate accounts.
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "E-posta veya şifre hatalı." });
        }

        var (token, expiresAtUtc) = tokenService.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAtUtc, UserDto.FromEntity(user)));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userId is null || !Guid.TryParse(userId, out var id))
        {
            return Unauthorized();
        }

        var user = await db.Users.FindAsync([id], ct);
        return user is null ? NotFound() : Ok(UserDto.FromEntity(user));
    }
}
