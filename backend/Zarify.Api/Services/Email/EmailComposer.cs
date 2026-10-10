using Microsoft.Extensions.Options;
using Zarify.Api.Models;
using Zarify.Api.Options;

namespace Zarify.Api.Services.Email;

/// Builds each email the product sends from its data. Wording lives in
/// EmailTexts, drawing in EmailLayout; links point at Site:Url. Users have
/// no language preference yet, so everything goes out in Turkish.
public class EmailComposer(
    IOptions<SiteOptions> site,
    IOptions<EmailOptions> email,
    IOptions<PaymentOptions> payment)
{
    private const string Lang = EmailTexts.DefaultLanguage;

    private string T(string key, params object[] args) => EmailTexts.Get(Lang, key, args);
    private string Link(string path) => site.Value.Link(path);
    private string Money(decimal amount) => amount.ToString("C", EmailTexts.Culture(Lang));
    private string Date(DateOnly date) => date.ToString("d MMMM yyyy dddd", EmailTexts.Culture(Lang));
    private string Moment(DateTime utc) =>
        TurkeyTime.FromUtc(utc).ToString("d MMMM yyyy HH:mm", EmailTexts.Culture(Lang));

    private static string Couple(Invitation i) => $"{i.BrideName} & {i.GroomName}";

    public EmailMessage Welcome(User user) => Build(user.Email, Name(user), "welcome", new EmailContent(
        T("welcome.subject"),
        T("welcome.preheader"),
        T("welcome.eyebrow"),
        T("welcome.heading", user.FirstName),
        [T("welcome.p1"), T("welcome.p2")],
        [],
        new EmailButton(T("welcome.button"), Link("/davetiye-bilgileri")),
        []));

    public EmailMessage OrderPlaced(User user, Invitation invitation)
    {
        var p = payment.Value;
        var reference = invitation.PaymentReference ?? "—";
        var details = new List<EmailDetail>();
        if (invitation.AmountTry is { } amount)
        {
            details.Add(new EmailDetail(T("order.amount"), Money(amount), Emphasis: true));
        }
        var hasBank = !string.IsNullOrWhiteSpace(p.Iban) && !string.IsNullOrWhiteSpace(p.AccountHolder);
        if (hasBank)
        {
            details.Add(new EmailDetail(T("order.iban"), p.Iban!, Mono: true));
            details.Add(new EmailDetail(T("order.holder"), p.AccountHolder!));
            if (!string.IsNullOrWhiteSpace(p.BankName)) details.Add(new EmailDetail(T("order.bank"), p.BankName));
        }
        details.Add(new EmailDetail(T("order.reference"), reference, Emphasis: true));

        return Build(user.Email, Name(user), "order-placed", new EmailContent(
            T("order.subject", Couple(invitation)),
            T("order.preheader", reference),
            T("order.eyebrow"),
            Couple(invitation),
            hasBank ? [T("order.p1")] : [T("order.p1"), T("order.noBank")],
            details,
            new EmailButton(T("order.button"), Link($"/davetiyem/{invitation.Slug}")),
            [$"{T("paymentApproval")} {T("order.p2")}", T("order.p3")]));
    }

    /// Null when Email:AdminAddress isn't set.
    public EmailMessage? AdminNewOrder(User owner, Invitation invitation)
    {
        if (string.IsNullOrWhiteSpace(email.Value.AdminAddress)) return null;
        var reference = invitation.PaymentReference ?? "—";
        var amount = invitation.AmountTry is { } a ? Money(a) : "—";
        return Build(email.Value.AdminAddress, null, "admin-new-order", new EmailContent(
            T("adminOrder.subject", reference, Couple(invitation)),
            T("adminOrder.preheader", amount),
            T("adminOrder.eyebrow"),
            Couple(invitation),
            [T("adminOrder.p1")],
            [
                new EmailDetail(T("adminOrder.reference"), reference, Emphasis: true),
                new EmailDetail(T("adminOrder.amount"), amount),
                new EmailDetail(T("adminOrder.owner"), $"{owner.FirstName} {owner.LastName} · {owner.Email}"),
                new EmailDetail(T("adminOrder.wedding"), Date(invitation.WeddingDate)),
                new EmailDetail(T("adminOrder.placedAt"), Moment(invitation.CreatedAtUtc)),
            ],
            new EmailButton(T("adminOrder.button"), Link("/yonetim")),
            []));
    }

    public EmailMessage PaymentApproved(User user, Invitation invitation)
    {
        var shareUrl = Link($"/davetiye/{invitation.Slug}");
        return Build(user.Email, Name(user), "payment-approved", new EmailContent(
            T("approved.subject", Couple(invitation)),
            T("approved.preheader"),
            T("approved.eyebrow"),
            Couple(invitation),
            [T("approved.p1")],
            [new EmailDetail(T("approved.link"), shareUrl, Mono: true)],
            new EmailButton(T("approved.button"), shareUrl),
            [T("approved.p2")]));
    }

    public EmailMessage PaymentRejected(User user, Invitation invitation, string note)
    {
        var reference = invitation.PaymentReference ?? "—";
        return Build(user.Email, Name(user), "payment-rejected", new EmailContent(
            T("rejected.subject", Couple(invitation)),
            T("rejected.preheader", reference),
            T("rejected.eyebrow"),
            Couple(invitation),
            [T("rejected.p1", reference)],
            [new EmailDetail(T("rejected.note"), note)],
            new EmailButton(T("rejected.button"), Link($"/davetiyem/{invitation.Slug}")),
            [T("rejected.p2")]));
    }

    /// An admin took the published invitation offline; the note says why.
    public EmailMessage InvitationRemoved(User user, Invitation invitation, string note) =>
        Build(user.Email, Name(user), "invitation-removed", new EmailContent(
            T("removed.subject", Couple(invitation)),
            T("removed.preheader"),
            T("removed.eyebrow"),
            Couple(invitation),
            [T("removed.p1")],
            [new EmailDetail(T("removed.note"), note)],
            new EmailButton(T("removed.button"), Link($"/davetiyem/{invitation.Slug}")),
            [T("removed.p2"), T("removed.p3")]));

    public EmailMessage InvitationRepublished(User user, Invitation invitation)
    {
        var shareUrl = Link($"/davetiye/{invitation.Slug}");
        return Build(user.Email, Name(user), "invitation-republished", new EmailContent(
            T("republished.subject", Couple(invitation)),
            T("republished.preheader"),
            T("republished.eyebrow"),
            Couple(invitation),
            [T("republished.p1")],
            [new EmailDetail(T("approved.link"), shareUrl, Mono: true)],
            new EmailButton(T("approved.button"), shareUrl),
            []));
    }

    public EmailMessage PasswordReset(User user, string token) => Build(user.Email, Name(user), "password-reset", new EmailContent(
        T("reset.subject"),
        T("reset.preheader"),
        T("reset.eyebrow"),
        T("reset.heading", user.FirstName),
        [T("reset.p1")],
        [],
        new EmailButton(T("reset.button"), Link($"/sifre-sifirla?token={Uri.EscapeDataString(token)}")),
        [T("reset.p2"), T("reset.p3")]));

    public EmailMessage PasswordChanged(User user, DateTime changedAtUtc) => Build(user.Email, Name(user), "password-changed", new EmailContent(
        T("changed.subject"),
        T("changed.preheader"),
        T("changed.eyebrow"),
        T("changed.heading", user.FirstName),
        [T("changed.p1", Moment(changedAtUtc))],
        [],
        new EmailButton(T("changed.button"), Link("/sifremi-unuttum")),
        [T("changed.p2")]));

    /// Takes the details rather than the User: the row is already gone.
    public EmailMessage AccountDeleted(string emailAddress, string firstName, string lastName) =>
        Build(emailAddress, $"{firstName} {lastName}", "account-deleted", new EmailContent(
            T("deleted.subject"),
            T("deleted.preheader"),
            T("deleted.eyebrow"),
            T("deleted.heading", firstName),
            [T("deleted.p1"), T("deleted.p2")],
            [],
            null,
            [T("deleted.p3")]));

    private static string Name(User user) => $"{user.FirstName} {user.LastName}";

    private EmailMessage Build(string to, string? toName, string kind, EmailContent content)
    {
        var siteUrl = site.Value.Link("/");
        var (html, text) = EmailLayout.Render(content, Lang, siteUrl, T("footer"));
        var links = content.Button is { } b ? new[] { b.Url } : [];
        return new EmailMessage(to, toName, content.Subject, html, text, kind, links);
    }
}
