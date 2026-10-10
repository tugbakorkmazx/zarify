namespace Zarify.Api.Services.Email;

/// One rendered email, ready for any IEmailSender. `Kind` names it in logs
/// and file names ("password-reset"); `Links` repeats the actionable URLs
/// so the development sender can print them.
public record EmailMessage(
    string To,
    string? ToName,
    string Subject,
    string Html,
    string Text,
    string Kind,
    IReadOnlyList<string> Links)
{
    public IReadOnlyList<EmailAttachment> Attachments { get; init; } = [];
}

/// A file sent with the email, e.g. the accepted contract as HTML.
public record EmailAttachment(string FileName, string ContentType, byte[] Content);

public interface IEmailSender
{
    Task SendAsync(EmailMessage message, CancellationToken ct);
}
