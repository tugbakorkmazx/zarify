using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Zarify.Api.Options;

namespace Zarify.Api.Controllers;

/// Public — the price has to be shown before anyone commits to buying:
/// on the Pre-Contract Information Form, the Distance Sales Contract and the
/// publish confirmation. Reads the same Payment:AmountTry the payment screen
/// uses, so there is one source for it. Null until it's configured.
[ApiController]
[Route("api/pricing")]
public class PricingController(IOptions<PaymentOptions> paymentOptions) : ControllerBase
{
    [HttpGet]
    public ActionResult<PricingDto> Get()
    {
        var amount = paymentOptions.Value.AmountTry is > 0 ? paymentOptions.Value.AmountTry : null;
        return Ok(new PricingDto(amount, "TRY"));
    }
}

public record PricingDto(decimal? AmountTry, string Currency);
