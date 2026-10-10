using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

/// One order's accepted-contract record: who accepted what, when, at which
/// price. Shown to the owner on their invitation page and to the admin in the
/// cancelled-orders list.
public record SalesAgreementDto(
    Guid Id,
    Guid? InvitationId,
    string InvitationSlug,
    string CoupleNames,
    string? PaymentReference,
    decimal AmountTry,
    DateTime AcceptedAtUtc,
    string? Version,
    string UserEmail,
    string UserFirstName,
    string UserLastName,
    DateTime? CancelledAtUtc,
    /// The filled-in contract was archived and can be opened again.
    bool HasContract)
{
    public static SalesAgreementDto FromEntity(SalesAgreement a) => new(
        a.Id,
        a.InvitationId,
        a.InvitationSlug,
        a.CoupleNames,
        a.PaymentReference,
        a.AmountTry,
        a.AcceptedAtUtc,
        a.Version,
        a.UserEmail,
        a.UserFirstName,
        a.UserLastName,
        a.CancelledAtUtc,
        a.ContractSha256 != null);
}
