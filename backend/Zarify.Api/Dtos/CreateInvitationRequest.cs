using System.ComponentModel.DataAnnotations;

namespace Zarify.Api.Dtos;

public class CreateInvitationRequest : InvitationFieldsRequest
{
    [Required, MaxLength(100)]
    public required string TemplateSlug { get; set; }
}
