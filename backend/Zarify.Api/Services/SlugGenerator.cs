using System.Text;
using System.Text.RegularExpressions;

namespace Zarify.Api.Services;

public static partial class SlugGenerator
{
    /// Lowercase, ASCII-only, dash-separated. Turkish letters are transliterated
    /// rather than dropped so "Tuğba & Burak" reads as "tugba-burak", not "tuba-burak".
    public static string Slugify(string input)
    {
        var transliterated = input
            .Replace('ı', 'i').Replace('İ', 'i')
            .Replace('ğ', 'g').Replace('Ğ', 'g')
            .Replace('ü', 'u').Replace('Ü', 'u')
            .Replace('ş', 's').Replace('Ş', 's')
            .Replace('ö', 'o').Replace('Ö', 'o')
            .Replace('ç', 'c').Replace('Ç', 'c')
            .ToLowerInvariant();

        var sb = new StringBuilder(transliterated.Length);
        foreach (var ch in transliterated)
        {
            if (char.IsAsciiLetterOrDigit(ch))
            {
                sb.Append(ch);
            }
            else if (sb.Length > 0 && sb[^1] != '-')
            {
                sb.Append('-');
            }
        }

        var slug = NonTrailingDashRegex().Replace(sb.ToString().Trim('-'), "-");
        return slug.Length == 0 ? "davetiye" : slug;
    }

    /// A short random suffix ("k3f9a2") appended to a base slug to guarantee
    /// uniqueness without a lookup — collisions are still possible in theory,
    /// so callers retry with a fresh suffix on a unique-constraint violation.
    public static string RandomSuffix(int length = 6)
    {
        const string alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
        var bytes = new byte[length];
        Random.Shared.NextBytes(bytes);
        var sb = new StringBuilder(length);
        foreach (var b in bytes)
        {
            sb.Append(alphabet[b % alphabet.Length]);
        }
        return sb.ToString();
    }

    [GeneratedRegex("-{2,}")]
    private static partial Regex NonTrailingDashRegex();
}
