using System.Threading.RateLimiting;

namespace Zarify.Api.Services;

/// Per-account limits on creating and editing invitations (numbers in
/// RateLimitPolicies). Keyed on the user id from the token, so they run
/// inside InvitationsController rather than as middleware policies — the
/// rate limiter runs before authentication.
public sealed class InvitationThrottle : IDisposable
{
    private readonly PartitionedRateLimiter<Guid> _create =
        PartitionedRateLimiter.Create<Guid, Guid>(userId =>
            RateLimitPartition.GetFixedWindowLimiter(userId, _ => RateLimitPolicies.InvitationCreatePerUser));

    private readonly PartitionedRateLimiter<Guid> _update =
        PartitionedRateLimiter.Create<Guid, Guid>(userId =>
            RateLimitPartition.GetFixedWindowLimiter(userId, _ => RateLimitPolicies.InvitationUpdatePerUser));

    /// Returns null when the attempt may go ahead, or how long to wait.
    public TimeSpan? TryCreate(Guid userId) => Acquire(_create, userId);

    public TimeSpan? TryUpdate(Guid userId) => Acquire(_update, userId);

    private static TimeSpan? Acquire(PartitionedRateLimiter<Guid> limiter, Guid key)
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
        _create.Dispose();
        _update.Dispose();
    }
}
