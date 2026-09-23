using System.Security.Cryptography;

namespace Zarify.Api.Services;

/// Bank-transfer reference codes like "ZRF-4K7Q": short enough to type into a
/// transfer description, independent of the couple's names, and drawn from
/// an alphabet without the look-alikes 0/O and 1/I so a code read off a
/// phone screen or a bank statement can't be mistyped into a different one.
public static class PaymentReferenceGenerator
{
    public const string Prefix = "ZRF-";
    public const int CodeLength = 4;

    // A–Z and 2–9 minus I and O (0 and 1 are already out): 32 characters,
    // 32^4 ≈ 1M codes. Uniqueness is enforced by a unique index; callers
    // retry with a fresh code on a collision.
    public const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public static string New() =>
        Prefix + RandomNumberGenerator.GetString(Alphabet, CodeLength);
}
