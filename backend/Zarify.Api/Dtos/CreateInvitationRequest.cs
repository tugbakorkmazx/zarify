using System.ComponentModel.DataAnnotations;

namespace Zarify.Api.Dtos;

public class CreateInvitationRequest : InvitationFieldsRequest
{
    [Required, MaxLength(100)]
    public required string TemplateSlug { get; set; }

    /// The owner confirmed reading the Pre-Contract Information Form and
    /// the Distance Sales Contract. Must be true; the time is recorded
    /// server-side.
    public bool AcceptDistanceSales { get; set; }

    /// Which version of those texts was shown (e.g. "2026-09-29").
    [MaxLength(32)]
    public string? DistanceSalesVersion { get; set; }
}
