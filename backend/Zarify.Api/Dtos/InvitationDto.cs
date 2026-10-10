using Zarify.Api.Models;
using Zarify.Api.Services;

namespace Zarify.Api.Dtos;

public record ScheduleItemDto(string Time, string Title, string? Description);

public record InvitationDto(
    Guid Id,
    string Slug,
    string TemplateSlug,
    string BrideName,
    string GroomName,
    DateOnly WeddingDate,
    TimeOnly WeddingTime,
    string VenueName,
    string VenueAddress,
    string? StoryText,
    List<ScheduleItemDto> Schedule,
    string? DressCode,
    string? GiftNote,
    string? AccommodationNote,
    DateOnly? RsvpDeadline,
    bool RsvpEnabled,
    string Status,
    DateTime? PublishedAtUtc,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    /// Only on a PendingPayment invitation whose transfer an admin
    /// couldn't confirm; cleared on approval, so guests never see it.
    DateTime? PaymentRejectedAtUtc,
    string? PaymentRejectionNote,
    /// Only while an admin has taken the invitation offline — guests never
    /// get a Removed invitation, only its owner and admins do.
    DateTime? RemovedAtUtc,
    string? RemovalNote,
    /// The first moment RSVPs are refused: the end of the deadline day, or
    /// of the wedding day when there's no deadline (Turkish time).
    DateTime RsvpClosesAtUtc)
{
    public static string StatusToWire(InvitationStatus status) => status switch
    {
        InvitationStatus.Draft => "draft",
        InvitationStatus.PendingPayment => "pendingPayment",
        InvitationStatus.Removed => "removed",
        _ => "published",
    };

    public static InvitationStatus? StatusFromWire(string? status) => status switch
    {
        "draft" => InvitationStatus.Draft,
        "pendingPayment" => InvitationStatus.PendingPayment,
        "published" => InvitationStatus.Published,
        "removed" => InvitationStatus.Removed,
        _ => null,
    };

    public static InvitationDto FromEntity(Invitation invitation) => new(
        invitation.Id,
        invitation.Slug,
        invitation.TemplateSlug,
        invitation.BrideName,
        invitation.GroomName,
        invitation.WeddingDate,
        invitation.WeddingTime,
        invitation.VenueName,
        invitation.VenueAddress,
        invitation.StoryText,
        invitation.Schedule.Select(s => new ScheduleItemDto(s.Time, s.Title, s.Description)).ToList(),
        invitation.DressCode,
        invitation.GiftNote,
        invitation.AccommodationNote,
        invitation.RsvpDeadline,
        invitation.RsvpEnabled,
        StatusToWire(invitation.Status),
        invitation.PublishedAtUtc,
        invitation.CreatedAtUtc,
        invitation.UpdatedAtUtc,
        invitation.PaymentRejectedAtUtc,
        invitation.PaymentRejectionNote,
        invitation.RemovedAtUtc,
        invitation.RemovalNote,
        InvitationRules.RsvpClosesAtUtc(invitation));
}
