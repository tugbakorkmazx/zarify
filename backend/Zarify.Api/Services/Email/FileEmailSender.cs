using System.Text;
using Microsoft.Extensions.Options;
using Zarify.Api.Options;

namespace Zarify.Api.Services.Email;

/// Development: nothing leaves the machine. Each email becomes an .html file
/// (plus a .txt with the plain-text part) in Email:OutputDirectory, and the
/// console gets a clickable file:// link to it and every link inside it —
/// so a password reset can be followed straight from the API's log.
public class FileEmailSender(
    IOptions<EmailOptions> options,
    IWebHostEnvironment environment,
    ILogger<FileEmailSender> logger) : IEmailSender
{
    private readonly string _directory = Path.GetFullPath(
        options.Value.OutputDirectory is { Length: > 0 } dir
            ? dir
            : Path.Combine(environment.ContentRootPath, "dev-emails"));

    public async Task SendAsync(EmailMessage message, CancellationToken ct)
    {
        Directory.CreateDirectory(_directory);
        var stamp = DateTime.Now.ToString("yyyyMMdd-HHmmss-fff");
        var baseName = $"{stamp}-{message.Kind}-{Safe(message.To)}";
        var htmlPath = Path.Combine(_directory, baseName + ".html");

        await File.WriteAllTextAsync(htmlPath, message.Html, Encoding.UTF8, ct);
        await File.WriteAllTextAsync(
            Path.Combine(_directory, baseName + ".txt"),
            $"To: {message.To}\nSubject: {message.Subject}\n\n{message.Text}",
            Encoding.UTF8,
            ct);

        var log = new StringBuilder()
            .AppendLine($"E-posta (gönderilmedi, dosyaya yazıldı) → {message.To}: {message.Subject}")
            .AppendLine($"  dosya: {new Uri(htmlPath).AbsoluteUri}");
        foreach (var attachment in message.Attachments)
        {
            var attachmentPath = Path.Combine(
                _directory, $"{baseName}-ek-{Safe(Path.GetFileNameWithoutExtension(attachment.FileName))}{Path.GetExtension(attachment.FileName)}");
            await File.WriteAllBytesAsync(attachmentPath, attachment.Content, ct);
            log.AppendLine($"  ek:    {new Uri(attachmentPath).AbsoluteUri}");
        }
        foreach (var link in message.Links)
        {
            log.AppendLine($"  link:  {link}");
        }
        logger.LogInformation("{EmailPreview}", log.ToString().TrimEnd());
    }

    private static string Safe(string value) =>
        new(value.Select(c => char.IsLetterOrDigit(c) ? c : '_').ToArray());
}
