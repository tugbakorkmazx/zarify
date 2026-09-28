using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;

namespace Zarify.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ZarifyDbContext db, ITokenService tokenService, AuthThrottle throttle) : ControllerBase
{
    /// Throttled per IP (policy) and per email (AuthThrottle) — see
    /// RateLimitPolicies for the numbers.
    [HttpPost("register")]
    [EnableRateLimiting(RateLimitPolicies.Register)]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken ct)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (throttle.TryRegister(normalizedEmail) is { } registerWait)
        {
            await RateLimitPolicies.WriteTooManyRequests(HttpContext, registerWait, ct);
            return new EmptyResult();
        }

        var emailTaken = await db.Users.AnyAsync(u => u.Email == normalizedEmail, ct);
        if (emailTaken)
        {
            return this.Error(StatusCodes.Status409Conflict, ErrorCodes.EmailTaken);
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
    [EnableRateLimiting(RateLimitPolicies.Login)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (throttle.TryLogin(normalizedEmail) is { } loginWait)
        {
            await RateLimitPolicies.WriteTooManyRequests(HttpContext, loginWait, ct);
            return new EmptyResult();
        }
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail, ct);

        // Same generic message whether the email doesn't exist or the password
        // is wrong, so a caller can't use this endpoint to enumerate accounts.
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.InvalidCredentials);
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
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var user = await db.Users.FindAsync([id], ct);
        return user is null
            ? this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired)
            : Ok(UserDto.FromEntity(user));
    }
}
