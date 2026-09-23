namespace Zarify.Api.Options;

/// Bank-transfer (IBAN) details shown to a couple after they publish. Set via
/// configuration (user-secrets / environment in production), not in the
/// repo:
///   dotnet user-secrets set "Payment:Iban" "TR.."
///   dotnet user-secrets set "Payment:AccountHolder" "..."
///   dotnet user-secrets set "Payment:BankName" "..."
///   dotnet user-secrets set "Payment:AmountTry" "..."
public class PaymentOptions
{
    public string? BankName { get; set; }
    public string? AccountHolder { get; set; }
    public string? Iban { get; set; }
    public decimal? AmountTry { get; set; }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(Iban)
        && !string.IsNullOrWhiteSpace(AccountHolder)
        && AmountTry is > 0;
}
