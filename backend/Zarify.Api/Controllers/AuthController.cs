using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Zarify.Api.Data;
using Zarify.Api.Dtos;
using Zarify.Api.Models;
using Zarify.Api.Services;
using Zarify.Api.Services.Email;

namespace Zarify.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    ZarifyDbContext db,
    ITokenService tokenService,
    AuthThrottle throttle,
    IEmailQueue emails,
    EmailComposer composer,
    ILogger<AuthController> logger) : ControllerBase
{
    private static readonly TimeSpan ResetLinkLifetime = TimeSpan.FromHours(1);

    /// Throttled per IP (policy) and per email (AuthThrottle) — see
    /// RateLimitPolicies for the numbers.
    [HttpPost("register")]
    [EnableRateLimiting(RateLimitPolicies.Register)]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken ct)
    {
        var normalizedEmail = Normalize(request.Email);
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
        emails.Enqueue(composer.Welcome(user));

        var (token, expiresAtUtc) = tokenService.CreateToken(user);
        return CreatedAtAction(nameof(Me), new { }, new AuthResponse(token, expiresAtUtc, UserDto.FromEntity(user)));
    }

    [HttpPost("login")]
    [EnableRateLimiting(RateLimitPolicies.Login)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var normalizedEmail = Normalize(request.Email);
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
        if (!TryGetUserId(out var id))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }

        var user = await db.Users.FindAsync([id], ct);
        return user is null
            ? this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired)
            : Ok(UserDto.FromEntity(user));
    }

    /// Always 202 with no body — registered or not, the caller learns
    /// nothing about whether the address has an account. For a registered
    /// one: every earlier reset link is deleted, a new one-hour, single-use
    /// token is stored as a hash, and the link is queued for email (queued,
    /// so the response time doesn't differ either).
    [HttpPost("forgot-password")]
    [EnableRateLimiting(RateLimitPolicies.ForgotPassword)]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request, CancellationToken ct)
    {
        var normalizedEmail = Normalize(request.Email);
        if (throttle.TryForgotPassword(normalizedEmail) is { } wait)
        {
            await RateLimitPolicies.WriteTooManyRequests(HttpContext, wait, ct);
            return new EmptyResult();
        }

        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail, ct);
        if (user is not null)
        {
            await db.PasswordResetTokens.Where(t => t.UserId == user.Id).ExecuteDeleteAsync(ct);

            var token = NewToken();
            db.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = Hash(token),
                ExpiresAtUtc = DateTime.UtcNow.Add(ResetLinkLifetime),
            });
            await db.SaveChangesAsync(ct);
            emails.Enqueue(composer.PasswordReset(user, token));
            logger.LogInformation("Password reset link issued for user {UserId}", user.Id);
        }

        return Accepted();
    }

    /// Sets a new password with a reset link's token: valid only if it
    /// exists, hasn't been used and hasn't expired. Success uses it up (and
    /// any other outstanding link), rotates the SecurityStamp so every
    /// existing session ends, and emails a "your password was changed"
    /// notice. The user signs in again with the new password.
    [HttpPost("reset-password")]
    [EnableRateLimiting(RateLimitPolicies.ResetPassword)]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request, CancellationToken ct)
    {
        var hash = Hash(request.Token);
        var now = DateTime.UtcNow;
        var reset = await db.PasswordResetTokens
            .Include(t => t.User)
            .SingleOrDefaultAsync(t => t.TokenHash == hash, ct);
        if (reset?.User is null || reset.UsedAtUtc is not null || reset.ExpiresAtUtc <= now)
        {
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.ResetTokenInvalid);
        }

        var user = reset.User;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);
        user.SecurityStamp = Models.User.NewSecurityStamp();
        reset.UsedAtUtc = now;
        await db.SaveChangesAsync(ct);
        await db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.Id != reset.Id)
            .ExecuteDeleteAsync(ct);

        emails.Enqueue(composer.PasswordChanged(user, now));
        logger.LogInformation("Password reset completed for user {UserId}", user.Id);
        return NoContent();
    }

    /// Deletes the signed-in account after re-checking its password. Goes
    /// with it, by cascade: every invitation, every RSVP to them, any reset
    /// links. Stays: the SalesAgreements rows (legal retention), unlinked;
    /// an unpublished order's row is marked cancelled so the admin sees it
    /// in the cancelled list. The token stops working at once (no user, no
    /// stamp), and a confirmation is emailed to the address that's gone.
    [Authorize]
    [HttpPost("delete-account")]
    [EnableRateLimiting(RateLimitPolicies.Login)]
    public async Task<IActionResult> DeleteAccount(DeleteAccountRequest request, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId))
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }
        var user = await db.Users.SingleOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null)
        {
            return this.Error(StatusCodes.Status401Unauthorized, ErrorCodes.SessionExpired);
        }
        // Same per-account brake as login: this endpoint checks a password too.
        if (throttle.TryLogin(user.Email) is { } wait)
        {
            await RateLimitPolicies.WriteTooManyRequests(HttpContext, wait, ct);
            return new EmptyResult();
        }
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            // 400, not 401: the session is fine, the password isn't.
            return this.Error(StatusCodes.Status400BadRequest, ErrorCodes.PasswordIncorrect);
        }

        var now = DateTime.UtcNow;
        var unpublishedIds = await db.Invitations
            .Where(i => i.UserId == userId && i.Status != InvitationStatus.Published)
            .Select(i => i.Id)
            .ToListAsync(ct);
        var openAgreements = await db.SalesAgreements
            .Where(a => a.InvitationId != null && unpublishedIds.Contains(a.InvitationId.Value) && a.CancelledAtUtc == null)
            .ToListAsync(ct);
        foreach (var agreement in openAgreements)
        {
            agreement.CancelledAtUtc = now;
        }

        var (email, firstName, lastName) = (user.Email, user.FirstName, user.LastName);
        db.Users.Remove(user);
        await db.SaveChangesAsync(ct);

        emails.Enqueue(composer.AccountDeleted(email, firstName, lastName));
        logger.LogInformation("Account {UserId} deleted by its owner ({Cancelled} unpaid order(s) cancelled)",
            userId, openAgreements.Count);
        return NoContent();
    }

    private bool TryGetUserId(out Guid userId)
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(raw, out userId);
    }

    private static string Normalize(string email) => email.Trim().ToLowerInvariant();

    /// 32 random bytes, URL-safe base64.
    private static string NewToken() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static string Hash(string token) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(token.Trim())));
}
