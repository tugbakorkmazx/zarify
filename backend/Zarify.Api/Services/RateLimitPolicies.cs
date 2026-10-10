using System.Threading.RateLimiting;

namespace Zarify.Api.Services;

/// Every rate limit the API enforces, in one place. The IP-keyed limits
/// run as ASP.NET Core rate-limiter policies (see Program.cs); the
/// email-keyed ones run inside AuthController through AuthThrottle, since
/// the email is only known once the body has been bound.
///
/// Behind the reverse proxy the client IP comes from X-Forwarded-For, and
/// only when the request arrived from a proxy listed in
/// ForwardedHeaders:KnownProxies / KnownNetworks — otherwise every visitor
/// would share the proxy's bucket.
public static class RateLimitPolicies
{
    public const string Rsvp = "rsvp";
    public const string Login = "login";
    public const string Register = "register";
    public const string ForgotPassword = "forgot-password";
    public const string ResetPassword = "reset-password";
    public const string InvitationLookup = "invitation-lookup";

    /// Guest RSVP: a household sharing one connection still fits.
    public static readonly FixedWindowRateLimiterOptions RsvpPerIp = Window(5, TimeSpan.FromMinutes(1));

    /// Login per IP is looser than per email: an office or a mobile
    /// carrier's NAT puts many people behind one address.
    public static readonly FixedWindowRateLimiterOptions LoginPerIp = Window(10, TimeSpan.FromMinutes(1));
    public static readonly FixedWindowRateLimiterOptions LoginPerEmail = Window(5, TimeSpan.FromMinutes(1));

    public static readonly FixedWindowRateLimiterOptions RegisterPerIp = Window(5, TimeSpan.FromMinutes(10));
    public static readonly FixedWindowRateLimiterOptions RegisterPerEmail = Window(3, TimeSpan.FromMinutes(10));

    /// "Forgot password" sends mail, so it's the tightest: per IP, and per
    /// address so nobody can flood one inbox from many IPs.
    public static readonly FixedWindowRateLimiterOptions ForgotPasswordPerIp = Window(5, TimeSpan.FromMinutes(15));
    public static readonly FixedWindowRateLimiterOptions ForgotPasswordPerEmail = Window(3, TimeSpan.FromHours(1));

    /// Submitting a new password with a link's token.
    public static readonly FixedWindowRateLimiterOptions ResetPasswordPerIp = Window(10, TimeSpan.FromMinutes(15));

    /// The public slug lookup behind every guest page. Slugs are guessable
    /// ("gelin-damat"), so this caps scanning; a guest opening the page a
    /// few times, or a family on one connection, stays far below it.
    public static readonly FixedWindowRateLimiterOptions InvitationLookupPerIp = Window(60, TimeSpan.FromMinutes(1));

    /// Creating an invitation places an order and draws a payment reference
    /// from a finite pool, so it's limited per account (InvitationThrottle)…
    public static readonly FixedWindowRateLimiterOptions InvitationCreatePerUser = Window(10, TimeSpan.FromHours(1));

    /// …and an account may hold only this many unpaid orders at once.
    public const int MaxPendingOrdersPerUser = 5;

    /// Saving edits: generous for someone fixing details, a wall for a script.
    public static readonly FixedWindowRateLimiterOptions InvitationUpdatePerUser = Window(30, TimeSpan.FromMinutes(10));

    private static FixedWindowRateLimiterOptions Window(int permits, TimeSpan window) => new()
    {
        PermitLimit = permits,
        Window = window,
        QueueLimit = 0,
        AutoReplenishment = true,
    };

    /// Writes the 429 every limit shares: a Retry-After header and a
    /// friendly message in the caller's language (Accept-Language, which
    /// the frontend sets from the page's current language; Turkish by
    /// default).
    public static async Task WriteTooManyRequests(HttpContext context, TimeSpan? retryAfter, CancellationToken ct)
    {
        var seconds = Math.Max(1, (int)Math.Ceiling((retryAfter ?? TimeSpan.FromMinutes(1)).TotalSeconds));
        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.Response.Headers.RetryAfter = seconds.ToString();

        var english = ApiErrors.PrefersEnglish(context);
        var wait = seconds >= 90
            ? english ? $"{(seconds + 59) / 60} minutes" : $"{(seconds + 59) / 60} dakika"
            : english ? "a minute" : "bir dakika";
        var message = english
            ? $"Too many attempts. Please wait {wait} and try again."
            : $"Çok fazla deneme yaptınız. Lütfen {wait} sonra tekrar deneyin.";

        await context.Response.WriteAsJsonAsync(new { code = ErrorCodes.RateLimited, message, retryAfterSeconds = seconds }, ct);
    }
}
