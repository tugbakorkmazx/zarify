namespace Zarify.Api.Options;

/// Outgoing email. Credentials come from user-secrets / environment, never
/// the repo:
///   dotnet user-secrets set "Email:Smtp:Host" "smtp.example.com"
///   dotnet user-secrets set "Email:Smtp:Username" "..."
///   dotnet user-secrets set "Email:Smtp:Password" "..."
///   dotnet user-secrets set "Email:AdminAddress" "siparis@zarify.com.tr"
/// In production: Email__Smtp__Host, Email__Smtp__Password, …
public class EmailOptions
{
    /// "Smtp" sends for real; "File" writes each email as an .html file
    /// and logs its path and links. Unset: File in Development, Smtp
    /// everywhere else — development never sends real mail by default.
    public string? Mode { get; set; }

    public string FromAddress { get; set; } = "bildirim@zarify.com.tr";
    public string FromName { get; set; } = "Zarify";

    /// Where new-order notifications go. Unset: none are sent.
    public string? AdminAddress { get; set; }

    /// File mode only. Default: dev-emails/ under the API's content root.
    public string? OutputDirectory { get; set; }

    public SmtpOptions Smtp { get; set; } = new();
}

public class SmtpOptions
{
    public string? Host { get; set; }
    public int Port { get; set; } = 587;
    public string? Username { get; set; }
    public string? Password { get; set; }

    /// "StartTls" (port 587), "SslOnConnect" (port 465), "Auto" or "None".
    public string Security { get; set; } = "StartTls";
}

public static class EmailModes
{
    public const string Smtp = "Smtp";
    public const string File = "File";
}
