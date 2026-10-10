using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Zarify.Api.Options;

namespace Zarify.Api.Services.Email;

/// Sends through the configured SMTP server (MailKit), one connection per
/// message — volumes are a handful an hour. HTML with a plain-text
/// alternative.
public class SmtpEmailSender(IOptions<EmailOptions> options) : IEmailSender
{
    private readonly EmailOptions _options = options.Value;

    public async Task SendAsync(EmailMessage message, CancellationToken ct)
    {
        var mime = new MimeMessage();
        mime.From.Add(new MailboxAddress(_options.FromName, _options.FromAddress));
        mime.To.Add(new MailboxAddress(message.ToName ?? "", message.To));
        mime.Subject = message.Subject;
        var body = new BodyBuilder { HtmlBody = message.Html, TextBody = message.Text };
        foreach (var attachment in message.Attachments)
        {
            body.Attachments.Add(attachment.FileName, attachment.Content, ContentType.Parse(attachment.ContentType));
        }
        mime.Body = body.ToMessageBody();

        var smtp = _options.Smtp;
        var security = smtp.Security switch
        {
            "SslOnConnect" => SecureSocketOptions.SslOnConnect,
            "Auto" => SecureSocketOptions.Auto,
            "None" => SecureSocketOptions.None,
            _ => SecureSocketOptions.StartTls,
        };

        using var client = new SmtpClient { Timeout = 20_000 };
        await client.ConnectAsync(smtp.Host ?? throw new InvalidOperationException("Email:Smtp:Host is not set."), smtp.Port, security, ct);
        if (!string.IsNullOrEmpty(smtp.Username))
        {
            await client.AuthenticateAsync(smtp.Username, smtp.Password ?? "", ct);
        }
        await client.SendAsync(mime, ct);
        await client.DisconnectAsync(true, ct);
    }
}
