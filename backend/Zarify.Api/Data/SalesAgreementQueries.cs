using Zarify.Api.Models;

namespace Zarify.Api.Data;

public static class SalesAgreementQueries
{
    /// Every column except the archived contract HTML (tens of KB a row) —
    /// for lists and exports, which only need to know whether one exists.
    public static IQueryable<SalesAgreement> WithoutContract(this IQueryable<SalesAgreement> query) =>
        query.Select(a => new SalesAgreement
        {
            Id = a.Id,
            InvitationId = a.InvitationId,
            UserId = a.UserId,
            UserEmail = a.UserEmail,
            UserFirstName = a.UserFirstName,
            UserLastName = a.UserLastName,
            InvitationSlug = a.InvitationSlug,
            CoupleNames = a.CoupleNames,
            PaymentReference = a.PaymentReference,
            AmountTry = a.AmountTry,
            AcceptedAtUtc = a.AcceptedAtUtc,
            Version = a.Version,
            CancelledAtUtc = a.CancelledAtUtc,
            PaymentApprovedAtUtc = a.PaymentApprovedAtUtc,
            ContractSha256 = a.ContractSha256,
        });
}
