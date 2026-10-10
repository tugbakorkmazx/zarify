using Zarify.Api.Models;

namespace Zarify.Api.Dtos;

public record InvitationOwnerDto(string Email, string FirstName, string LastName, Guid Id, DateTime? SuspendedAtUtc);

/// One invitation as the admin sees it: the invitation plus who owns it, so
/// the operator can match it against the incoming bank transfer.
/// PaymentReference is kept out of InvitationDto (which guests also get) —
/// only the owner's payment screen and admin rows carry it.
public record AdminInvitationDto(InvitationDto Invitation, InvitationOwnerDto Owner, string? PaymentReference, decimal? AmountTry)
{
    public static AdminInvitationDto FromEntity(Invitation invitation, User owner) => new(
        InvitationDto.FromEntity(invitation),
        new InvitationOwnerDto(owner.Email, owner.FirstName, owner.LastName, owner.Id, owner.SuspendedAtUtc),
        invitation.PaymentReference,
        invitation.AmountTry);
}

/// A page of a longer admin list.
public record PagedDto<T>(List<T> Items, int Total, int Page, int PageSize);

public record RsvpCountsDto(int AttendingResponses, int AttendingGuests, int MaybeResponses, int NotAttendingResponses);

/// The admin's detail view of one invitation: everything on the row, the
/// RSVP figures, the accepted-contract record(s) and what admins have done
/// to it.
public record AdminInvitationDetailDto(
    AdminInvitationDto Row,
    RsvpCountsDto Rsvps,
    List<SalesAgreementDto> Agreements,
    List<AuditEntryDto> History);

public record AdminUserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    DateTime CreatedAtUtc,
    DateTime? SuspendedAtUtc,
    string? SuspensionNote,
    int InvitationCount);

public record AdminUserDetailDto(AdminUserDto User, List<AdminInvitationDto> Invitations, List<AuditEntryDto> History);

public record AuditEntryDto(
    Guid Id,
    string AdminEmail,
    string Action,
    string TargetType,
    Guid TargetId,
    string TargetLabel,
    string? Note,
    DateTime CreatedAtUtc)
{
    public static AuditEntryDto FromEntity(AdminAuditLog l) =>
        new(l.Id, l.AdminEmail, l.Action, l.TargetType, l.TargetId, l.TargetLabel, l.Note, l.CreatedAtUtc);
}

/// The figures on the admin's Summary tab. Month figures are for the
/// current calendar month in Türkiye.
public record AdminSummaryDto(
    int Users,
    int SuspendedUsers,
    Dictionary<string, int> InvitationsByStatus,
    int PendingPayments,
    int RejectedAwaitingFix,
    int ApprovedThisMonth,
    decimal ApprovedThisMonthTry,
    string MonthLabel);
