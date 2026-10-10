using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Ganss.Xss;
using Zarify.Api.Models;

namespace Zarify.Api.Services;

/// Turns the contract text the buyer was shown into the archived copy kept
/// on their SalesAgreement row.
///
/// The legal texts live in one place — the frontend's legal pages — and the
/// browser sends the Pre-Contract Information Form and the Distance Sales
/// Contract exactly as it rendered them in the publish dialog, filled in
/// with the price and the buyer. Here that markup is cut down to plain
/// document tags (no scripts, styles, attributes or outside resources),
/// checked to be the expected texts at the order's price, and wrapped in a
/// header written by the server alone: buyer, reference, amount, version and
/// the server's acceptance time. The result is a self-contained HTML file;
/// its SHA-256 is stored next to it.
public static class ContractArchive
{
    /// Comfortably above the two texts (~20 KB) but well under the request cap.
    public const int MaxBodyLength = 120_000;

    private static readonly HtmlSanitizer Sanitizer = CreateSanitizer();

    /// Escapes markup characters but leaves Turkish letters readable in the
    /// stored file (WebUtility.HtmlEncode would turn "Ü" into "&#220;").
    private static readonly HtmlEncoder Encoder = HtmlEncoder.Create(UnicodeRanges.All);

    private static HtmlSanitizer CreateSanitizer()
    {
        var sanitizer = new HtmlSanitizer();
        sanitizer.AllowedTags.Clear();
        foreach (var tag in new[] { "article", "section", "h1", "h2", "h3", "p", "ul", "ol", "li", "strong", "em", "b", "i", "br", "mark", "span", "a" })
        {
            sanitizer.AllowedTags.Add(tag);
        }
        sanitizer.AllowedAttributes.Clear();
        sanitizer.AllowedAttributes.Add("href");
        sanitizer.AllowedCssProperties.Clear();
        sanitizer.AllowedSchemes.Clear();
        sanitizer.AllowedSchemes.Add("https");
        sanitizer.AllowedSchemes.Add("mailto");
        sanitizer.AllowedAtRules.Clear();
        sanitizer.KeepChildNodes = true;
        return sanitizer;
    }

    /// Null when the submitted text isn't the expected documents at this
    /// price (or is empty / too long).
    public static string? Build(string? submitted, User buyer, Invitation invitation, decimal amount, DateTime acceptedAtUtc, string? version, string siteUrl)
    {
        if (string.IsNullOrWhiteSpace(submitted) || submitted.Length > MaxBodyLength)
        {
            return null;
        }
        var body = Sanitizer.Sanitize(submitted, siteUrl);
        var text = WebUtility.HtmlDecode(body);
        var money = amount.ToString("N2", TurkeyTime.Culture);
        if (!text.Contains("Ön Bilgilendirme Formu", StringComparison.Ordinal)
            || !text.Contains("Mesafeli Satış Sözleşmesi", StringComparison.Ordinal)
            || !text.Contains(money, StringComparison.Ordinal))
        {
            return null;
        }

        string E(string? value) => Encoder.Encode(value ?? "—");
        var accepted = TurkeyTime.FromUtc(acceptedAtUtc).ToString("d MMMM yyyy HH:mm:ss", TurkeyTime.Culture);

        return $$"""
            <!doctype html>
            <html lang="tr">
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Zarify — Sözleşme {{E(invitation.PaymentReference)}}</title>
            <style>
              body { margin: 0; background: #efe8d6; color: #1f1c17; font: 17px/1.65 Georgia, 'Times New Roman', serif; }
              main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
              header { border: 1px solid #6d1d28; padding: 20px 24px; margin-bottom: 40px; background: #f6f1e4; }
              header h1 { margin: 0 0 12px; color: #6d1d28; font-size: 22px; font-weight: normal; }
              dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 16px; margin: 0; }
              dt { color: #4c463b; } dd { margin: 0; overflow-wrap: anywhere; }
              @media (max-width: 520px) { dl { grid-template-columns: 1fr; } dd { margin-bottom: 8px; } main { padding: 24px 16px 48px; } }
              h1, h2 { font-weight: normal; } h2 { color: #6d1d28; font-size: 19px; margin-top: 28px; }
              article + article { border-top: 2px solid #6d1d28; margin-top: 48px; padding-top: 8px; }
              mark { background: #f3dcd9; color: #6d1d28; }
              a { color: #6d1d28; }
            </style>
            </head>
            <body>
            <main>
            <header>
            <h1>Onaylanan sözleşme metinleri</h1>
            <dl>
            <dt>Alıcı</dt><dd>{{E(buyer.FirstName)}} {{E(buyer.LastName)}} · {{E(buyer.Email)}}</dd>
            <dt>Sipariş</dt><dd>{{E(invitation.PaymentReference)}} · {{E(invitation.BrideName)}} &amp; {{E(invitation.GroomName)}}</dd>
            <dt>Tutar</dt><dd>{{E(money)}} TL (vergiler dahil)</dd>
            <dt>Onay zamanı</dt><dd>{{E(accepted)}} (Türkiye saati, sunucu kaydı)</dd>
            <dt>Metin sürümü</dt><dd>{{E(version)}}</dd>
            </dl>
            </header>
            {{body}}
            </main>
            </body>
            </html>
            """;
    }

    public static string Sha256(string html) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(html)));
}
