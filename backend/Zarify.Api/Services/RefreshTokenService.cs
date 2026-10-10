using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Zarify.Api.Data;
using Zarify.Api.Models;
using Zarify.Api.Options;

namespace Zarify.Api.Services;

/// Issues, rotates and revokes the refresh cookie behind "stay signed in".
/// The cookie is httpOnly (page scripts never see it), Secure, SameSite=
/// Strict and scoped to /api/auth, so it only ever travels to the sign-in
/// endpoints. The database keeps a hash of it.
public class RefreshTokenService(ZarifyDbContext db, IOptions<JwtOptions> jwt, TimeProvider clock)
{
    public const string CookieName = "zarify_refresh";
    private const string CookiePath = "/api/auth";

    /// A rotated token presented again within this window is most likely a
    /// second tab that refreshed at the same moment — refused, but without
    /// treating it as theft.
    private static readonly TimeSpan ReuseGrace = TimeSpan.FromSeconds(60);

    /// Creates a token for the user and sets the cookie. The caller saves.
    public void Issue(HttpResponse response, User user)
    {
        var token = NewToken();
        var expires = clock.GetUtcNow().UtcDateTime.AddDays(jwt.Value.RefreshDays);
        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = Hash(token),
            SecurityStamp = user.SecurityStamp,
            ExpiresAtUtc = expires,
        });
        response.Cookies.Append(CookieName, token, CookieOptions(expires));
    }

    public enum Outcome { Ok, Missing, Invalid }

    /// Exchanges the request's cookie for a new one. Ok comes with the user
    /// (signed-in, not suspended, stamp unchanged); everything else clears
    /// the cookie. A rotated token seen again after the grace window revokes
    /// all of that user's tokens.
    public async Task<(Outcome Outcome, User? User)> RotateAsync(HttpRequest request, HttpResponse response, CancellationToken ct)
    {
        if (!request.Cookies.TryGetValue(CookieName, out var presented) || string.IsNullOrWhiteSpace(presented))
        {
            return (Outcome.Missing, null);
        }

        var now = clock.GetUtcNow().UtcDateTime;
        var presentedHash = Hash(presented);
        var row = await db.RefreshTokens.Include(t => t.User).SingleOrDefaultAsync(t => t.TokenHash == presentedHash, ct);
        if (row?.User is not { } user)
        {
            Clear(response);
            return (Outcome.Invalid, null);
        }

        if (row.RevokedAtUtc is { } revokedAt)
        {
            if (row.Rotated && now - revokedAt > ReuseGrace)
            {
                await RevokeAllAsync(user.Id, ct);
            }
            Clear(response);
            return (Outcome.Invalid, null);
        }

        if (row.ExpiresAtUtc <= now || row.SecurityStamp != user.SecurityStamp || user.SuspendedAtUtc is not null)
        {
            row.RevokedAtUtc = now;
            await db.SaveChangesAsync(ct);
            Clear(response);
            return (Outcome.Invalid, null);
        }

        row.RevokedAtUtc = now;
        row.Rotated = true;
        Issue(response, user);
        await db.SaveChangesAsync(ct);
        return (Outcome.Ok, user);
    }

    /// Sign-out: revokes the presented token (if any) and clears the cookie.
    public async Task RevokeCurrentAsync(HttpRequest request, HttpResponse response, CancellationToken ct)
    {
        if (request.Cookies.TryGetValue(CookieName, out var presented) && !string.IsNullOrWhiteSpace(presented))
        {
            var hash = Hash(presented);
            await db.RefreshTokens
                .Where(t => t.TokenHash == hash && t.RevokedAtUtc == null)
                .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAtUtc, clock.GetUtcNow().UtcDateTime), ct);
        }
        Clear(response);
    }

    /// Every sign-in of the user ends — called wherever the SecurityStamp
    /// rotates (the stamp check alone would already refuse them; this keeps
    /// the table tidy and makes the intent explicit).
    public Task RevokeAllAsync(Guid userId, CancellationToken ct) =>
        db.RefreshTokens
            .Where(t => t.UserId == userId && t.RevokedAtUtc == null)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.RevokedAtUtc, clock.GetUtcNow().UtcDateTime), ct);

    public static void Clear(HttpResponse response) =>
        response.Cookies.Delete(CookieName, CookieOptions(null));

    private static CookieOptions CookieOptions(DateTime? expires) => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = CookiePath,
        Expires = expires,
        IsEssential = true,
    };

    private static string NewToken() =>
        Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static string Hash(string token) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(token.Trim())));
}
