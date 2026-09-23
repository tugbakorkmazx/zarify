using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Zarify.Api.Services;

/// Folds a guest's typed name into the key used to recognise the same guest
/// replying again: "Ayşe  Yılmaz", "ayse yilmaz" and "AYŞE YILMAZ" all map to
/// "ayse yilmaz". Done in code rather than left to the column collation —
/// MySQL's utf8mb4_0900_ai_ci folds ş→s but keeps Turkish ı and i distinct,
/// which is exactly the letter guests on a non-Turkish keyboard swap.
public static partial class GuestNameKey
{
    /// Trim + collapse runs of whitespace — also the form the display name
    /// is stored in.
    public static string NormalizeDisplay(string name) => Whitespace().Replace(name.Trim(), " ");

    public static string From(string name)
    {
        // Dotted/dotless i first: ToLowerInvariant would turn 'I' into 'i'
        // but leave 'ı' alone, and 'İ' decomposes to 'i' + a combining dot.
        var text = NormalizeDisplay(name)
            .Replace('ı', 'i')
            .Replace('İ', 'i')
            .ToLowerInvariant()
            .Normalize(NormalizationForm.FormD);

        var folded = new StringBuilder(text.Length);
        foreach (var ch in text)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
            {
                folded.Append(ch);
            }
        }
        return folded.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex Whitespace();
}
