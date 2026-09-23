namespace Zarify.Api.Dtos;

/// What a couple needs to make the bank transfer for one invitation. The
/// reference is the invitation's PaymentReference ("ZRF-4K7Q"), not its slug.
public record PaymentInstructionsDto(
    string Reference,
    string? BankName,
    string AccountHolder,
    string Iban,
    decimal AmountTry);
