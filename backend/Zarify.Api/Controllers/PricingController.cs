using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Zarify.Api.Options;

namespace Zarify.Api.Controllers;

/// Public — the price has to be shown before anyone commits to buying:
/// on the Pre-Contract Information Form, the Distance Sales Contract and the
/// publish confirmation. Reads the same Payment:AmountTry the payment screen
/// uses, so there is one source for it. Null until it's configured. Also
/// carries the retention periods (Retention section), which the legal texts
/// quote as the service period — so the texts and RetentionWorker can't
/// disagree.
[ApiController]
[Route("api/pricing")]
public class PricingController(IOptions<PaymentOptions> paymentOptions, IOptions<RetentionOptions> retention) : ControllerBase
{
    [HttpGet]
    public ActionResult<PricingDto> Get()
    {
        var amount = paymentOptions.Value.AmountTry is > 0 ? paymentOptions.Value.AmountTry : null;
        var r = retention.Value;
        return Ok(new PricingDto(amount, "TRY", new RetentionDto(r.GuestAccessMonths, r.DeleteAfterMonths, r.NoticeDaysBefore)));
    }
}

public record RetentionDto(int GuestAccessMonths, int DeleteAfterMonths, int NoticeDaysBefore);

public record PricingDto(decimal? AmountTry, string Currency, RetentionDto Retention);
