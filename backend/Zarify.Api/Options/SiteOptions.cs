namespace Zarify.Api.Options;

/// The frontend's public address — what links in emails (password reset,
/// share link, payment page) point at. Site:Url, e.g. https://zarify.com.tr;
/// http://localhost:3000 in development when unset.
public class SiteOptions
{
    public string? Url { get; set; }

    public string Link(string path) => $"{(Url ?? "").TrimEnd('/')}/{path.TrimStart('/')}";
}
