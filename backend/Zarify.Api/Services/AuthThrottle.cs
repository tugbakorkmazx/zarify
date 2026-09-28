using System.Threading.RateLimiting;

namespace Zarify.Api.Services;

/// Per-email limits for login and register, on top of the per-IP policies:
/// an attacker rotating IPs against one account still hits a wall. Keyed on
/// the normalised email; idle partitions are dropped by the limiter itself,
/// so the table doesn't grow without bound. Every attempt counts, success
/// or not — a real person doesn't sign in five times a minute.
public sealed class AuthThrottle : IDisposable
{
    private readonly PartitionedRateLimiter<string> _login =
        PartitionedRateLimiter.Create<string, string>(email =>
            RateLimitPartition.GetFixedWindowLimiter(email, _ => RateLimitPolicies.LoginPerEmail));

    private readonly PartitionedRateLimiter<string> _register =
        PartitionedRateLimiter.Create<string, string>(email =>
            RateLimitPartition.GetFixedWindowLimiter(email, _ => RateLimitPolicies.RegisterPerEmail));

    /// Returns null when the attempt may go ahead, or how long to wait.
    public TimeSpan? TryLogin(string normalizedEmail) => Acquire(_login, normalizedEmail);

    public TimeSpan? TryRegister(string normalizedEmail) => Acquire(_register, normalizedEmail);

    private static TimeSpan? Acquire(PartitionedRateLimiter<string> limiter, string key)
    {
        using var lease = limiter.AttemptAcquire(key);
        if (lease.IsAcquired)
        {
            return null;
        }
        return lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter)
            ? retryAfter
            : TimeSpan.FromMinutes(1);
    }

    public void Dispose()
    {
        _login.Dispose();
        _register.Dispose();
    }
}
