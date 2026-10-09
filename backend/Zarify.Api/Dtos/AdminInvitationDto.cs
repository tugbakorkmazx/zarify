namespace Zarify.Api.Dtos;

public record InvitationOwnerDto(string Email, string FirstName, string LastName);

/// One row of the admin payment queue: the invitation plus who owns it, so
/// the operator can match it against the incoming bank transfer.
/// PaymentReference is kept out of InvitationDto (which guests also get) —
/// only the owner's payment screen and this admin row carry it.
public record AdminInvitationDto(InvitationDto Invitation, InvitationOwnerDto Owner, string? PaymentReference, decimal? AmountTry);
