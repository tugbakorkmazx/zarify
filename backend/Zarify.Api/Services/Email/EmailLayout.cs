using System.Text;
using System.Text.Encodings.Web;
using System.Text.Unicode;

namespace Zarify.Api.Services.Email;

/// What one email says, independent of how it's drawn. Every string is
/// plain text — the layout escapes it.
public record EmailContent(
    string Subject,
    string Preheader,
    string Eyebrow,
    string Heading,
    IReadOnlyList<string> Paragraphs,
    IReadOnlyList<EmailDetail> Details,
    EmailButton? Button,
    IReadOnlyList<string> AfterParagraphs);

/// A label/value row; `Emphasis` sets the value large, in wine (amounts,
/// reference codes); `Mono` keeps an IBAN or a link from breaking oddly.
public record EmailDetail(string Label, string Value, bool Emphasis = false, bool Mono = false);

public record EmailButton(string Label, string Url);

/// The single email layout, after DESIGN.md's Herbaryum system: an ivory
/// card on a deeper paper ground, the wordmark, a small-caps wine eyebrow,
/// a serif heading, square wine button. Built for email clients: tables,
/// inline styles, web-safe serif fallbacks (Georgia), no images, no
/// external CSS — and a plain-text twin of every message.
public static class EmailLayout
{
    private const string Paper = "#efe8d6";
    private const string PaperDeep = "#e4d9bf";
    private const string PaperShade = "#cfc09e";
    private const string Wine = "#6d1d28";
    private const string Soot = "#1f1c17";
    private const string SootSoft = "#4c463b";
    private const string Serif = "Georgia, 'Times New Roman', Times, serif";

    public static (string Html, string Text) Render(EmailContent c, string lang, string siteUrl, string footer)
    {
        return (Html(c, lang, siteUrl, footer), Text(c, siteUrl, footer));
    }

    // Escapes markup characters but leaves Turkish letters as they are
    // (WebUtility.HtmlEncode would turn "ü" into "&#252;").
    private static readonly HtmlEncoder Encoder = HtmlEncoder.Create(UnicodeRanges.All);

    private static string E(string value) => Encoder.Encode(value);

    private static string Html(EmailContent c, string lang, string siteUrl, string footer)
    {
        var h = new StringBuilder();
        h.Append($"""
            <!DOCTYPE html>
            <html lang="{lang}">
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="color-scheme" content="light only">
            <title>{E(c.Subject)}</title>
            </head>
            <body style="margin:0;padding:0;background-color:{PaperDeep};">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:{PaperDeep};">{E(c.Preheader)}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{PaperDeep};">
            <tr><td align="center" style="padding:32px 12px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
            <tr><td align="center" style="padding:0 0 20px 0;font-family:{Serif};font-size:34px;line-height:1;color:{Soot};">Zarify</td></tr>
            <tr><td style="background-color:{Paper};border:1px solid {PaperShade};padding:6px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d8ccb0;">
            <tr><td style="padding:40px 36px 36px 36px;font-family:{Serif};color:{Soot};">
            <p style="margin:0 0 10px 0;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:{Wine};">{E(c.Eyebrow)}</p>
            <h1 style="margin:0 0 6px 0;font-family:{Serif};font-size:30px;line-height:1.15;font-weight:normal;color:{Soot};">{E(c.Heading)}</h1>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 26px 0;"><tr><td style="width:72px;border-top:1px solid {Soot};border-bottom:1px solid {Soot};height:3px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
            """);

        foreach (var p in c.Paragraphs) AppendParagraph(h, p);

        if (c.Details.Count > 0)
        {
            h.Append($"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;border-top:1px solid {Soot};">""");
            foreach (var d in c.Details)
            {
                var valueStyle = d.Emphasis
                    ? $"font-size:24px;line-height:1.2;color:{Wine};"
                    : $"font-size:17px;line-height:1.4;color:{Soot};";
                var mono = d.Mono ? "word-break:break-all;letter-spacing:0.5px;" : "";
                h.Append($"""
                    <tr><td style="padding:12px 0;border-bottom:1px solid #d8ccb0;font-family:{Serif};">
                    <p style="margin:0 0 3px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:{SootSoft};">{E(d.Label)}</p>
                    <p style="margin:0;{valueStyle}{mono}">{E(d.Value)}</p>
                    </td></tr>
                    """);
            }
            h.Append("</table>");
        }

        if (c.Button is { } b)
        {
            h.Append($"""
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 26px 0;"><tr>
                <td style="background-color:{Wine};">
                <a href="{E(b.Url)}" style="display:inline-block;padding:14px 28px;font-family:{Serif};font-size:16px;letter-spacing:1px;color:{Paper};text-decoration:none;">{E(b.Label)}</a>
                </td></tr></table>
                <p style="margin:0 0 22px 0;font-size:13px;line-height:1.5;color:{SootSoft};word-break:break-all;">{E(b.Url)}</p>
                """);
        }

        foreach (var p in c.AfterParagraphs) AppendParagraph(h, p);

        h.Append($"""
            </td></tr>
            </table>
            </td></tr>
            <tr><td align="center" style="padding:20px 24px 0 24px;font-family:{Serif};font-size:13px;line-height:1.6;color:{SootSoft};">
            {E(footer)}<br>
            <a href="{E(siteUrl)}" style="color:{Wine};text-decoration:underline;">{E(Host(siteUrl))}</a>
            </td></tr>
            </table>
            </td></tr>
            </table>
            </body>
            </html>
            """);
        return h.ToString();
    }

    private static void AppendParagraph(StringBuilder h, string text) =>
        h.Append($"""<p style="margin:0 0 18px 0;font-family:{Serif};font-size:17px;line-height:1.6;color:{SootSoft};">{E(text)}</p>""");

    private static string Text(EmailContent c, string siteUrl, string footer)
    {
        var t = new StringBuilder();
        t.AppendLine("ZARIFY").AppendLine();
        t.AppendLine(c.Eyebrow.ToUpperInvariant());
        t.AppendLine(c.Heading).AppendLine();
        foreach (var p in c.Paragraphs) t.AppendLine(p).AppendLine();
        foreach (var d in c.Details) t.AppendLine($"{d.Label}: {d.Value}");
        if (c.Details.Count > 0) t.AppendLine();
        if (c.Button is { } b) t.AppendLine($"{b.Label}: {b.Url}").AppendLine();
        foreach (var p in c.AfterParagraphs) t.AppendLine(p).AppendLine();
        t.AppendLine("--").AppendLine(footer).AppendLine(siteUrl);
        return t.ToString();
    }

    private static string Host(string url) =>
        Uri.TryCreate(url, UriKind.Absolute, out var uri) ? uri.Host : url;
}
