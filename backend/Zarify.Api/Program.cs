using System.Net;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Zarify.Api.Data;
using Zarify.Api.Options;
using Zarify.Api.Services;
using Zarify.Api.Services.Email;

const string FrontendCorsPolicy = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

// The API only ever receives small JSON bodies (the largest is an
// invitation with its story and schedule, a few KB), so cap requests far
// below Kestrel's 30 MB default.
builder.WebHost.ConfigureKestrel(kestrel => kestrel.Limits.MaxRequestBodySize = 64 * 1024);

// Add services to the container.

builder.Services.AddControllers()
    // Stored times are UTC; say so on the wire (see UtcDateTimeConverter).
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new UtcDateTimeConverter()))
    // Invalid input answers with the same { code, message } shape as every
    // other error (see ApiErrors) instead of ASP.NET's ProblemDetails.
    .ConfigureApiBehaviorOptions(options => options.InvalidModelStateResponseFactory = ApiErrors.InvalidModelState);
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException(
        "ConnectionStrings:Default is not configured. Set it via `dotnet user-secrets set \"ConnectionStrings:Default\" \"...\"`.");

// Hardcoded rather than ServerVersion.AutoDetect so startup and EF design-time
// tooling don't need a live database connection just to read its version.
var mySqlServerVersion = new MySqlServerVersion(new Version(8, 0, 44));

// Transient MySQL failures (a dropped pooled connection, the server waking
// up) are retried twice with a short back-off instead of reaching the guest
// as an error. Each attempt waits at most the connect timeout, so unless
// the connection string sets one, it's lowered from MySqlConnector's 15 s
// to 5 s: a real outage then answers (with a clean 500) in about 15 s
// rather than a minute. No code opens its own transactions, so the
// retrying strategy needs no changes elsewhere.
var mySqlConnection = new MySqlConnector.MySqlConnectionStringBuilder(connectionString);
if (!connectionString.Contains("timeout", StringComparison.OrdinalIgnoreCase))
{
    mySqlConnection.ConnectionTimeout = 5;
}
builder.Services.AddDbContext<ZarifyDbContext>(options =>
    options.UseMySql(mySqlConnection.ConnectionString, mySqlServerVersion, mySql =>
        mySql.EnableRetryOnFailure(maxRetryCount: 2, maxRetryDelay: TimeSpan.FromSeconds(2), errorNumbersToAdd: null)));

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()
    ?? throw new InvalidOperationException(
        "Jwt configuration is missing. Set Jwt:Key via `dotnet user-secrets set \"Jwt:Key\" \"...\"`.");
// The signing key never lives in the repo: user-secrets in development, the
// Jwt__Key environment variable in production. Fail at startup, loudly,
// rather than on the first request that needs a token — and refuse a key
// too short for HMAC-SHA256.
if (string.IsNullOrWhiteSpace(jwtOptions.Key))
{
    throw new InvalidOperationException(
        "Jwt:Key is not configured. Development: `dotnet user-secrets set \"Jwt:Key\" \"<random 64+ chars>\"`. " +
        "Production: set the Jwt__Key environment variable.");
}
if (Encoding.UTF8.GetByteCount(jwtOptions.Key) < 32)
{
    throw new InvalidOperationException("Jwt:Key is too short: HMAC-SHA256 needs at least 32 bytes (use 64+ random characters).");
}

builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddSingleton<AuthThrottle>();
builder.Services.AddSingleton<InvitationThrottle>();
builder.Services.Configure<PaymentOptions>(builder.Configuration.GetSection("Payment"));

// Links in emails point at the frontend. Development falls back to the
// local dev server; anywhere else Site:Url must be set.
builder.Services.Configure<SiteOptions>(builder.Configuration.GetSection("Site"));
builder.Services.PostConfigure<SiteOptions>(site =>
{
    if (string.IsNullOrWhiteSpace(site.Url) && builder.Environment.IsDevelopment())
    {
        site.Url = "http://localhost:3000";
    }
});
var siteUrl = builder.Configuration["Site:Url"];
if (!builder.Environment.IsDevelopment() && !Uri.TryCreate(siteUrl, UriKind.Absolute, out _))
{
    throw new InvalidOperationException(
        "Site:Url is not set (or not a URL) — email links need the site's address. Set the Site__Url environment variable, e.g. https://zarify.com.tr.");
}

// Email: real SMTP in production; in development every message is written
// to dev-emails/ as .html and its links logged (FileEmailSender), unless
// Email:Mode says otherwise. Sending happens in the background
// (EmailQueue/EmailWorker), so a mail problem never fails a request.
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection("Email"));
var emailOptions = builder.Configuration.GetSection("Email").Get<EmailOptions>() ?? new EmailOptions();
// (An empty value — "Mode": null in appsettings.json binds as "" — counts as unset.)
var emailMode = string.IsNullOrWhiteSpace(emailOptions.Mode)
    ? builder.Environment.IsDevelopment() ? EmailModes.File : EmailModes.Smtp
    : emailOptions.Mode.Trim();
if (emailMode == EmailModes.Smtp)
{
    if (string.IsNullOrWhiteSpace(emailOptions.Smtp.Host) || string.IsNullOrWhiteSpace(emailOptions.FromAddress))
    {
        throw new InvalidOperationException(
            "Email:Smtp:Host is not configured — password resets and order emails couldn't be sent. " +
            "Set Email__Smtp__Host, Email__Smtp__Port, Email__Smtp__Username and Email__Smtp__Password " +
            "(or Email__Mode=File to write emails to disk instead).");
    }
    builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();
}
else if (emailMode == EmailModes.File)
{
    builder.Services.AddSingleton<IEmailSender, FileEmailSender>();
}
else
{
    throw new InvalidOperationException($"Email:Mode must be \"{EmailModes.Smtp}\" or \"{EmailModes.File}\", not \"{emailMode}\".");
}
builder.Services.AddSingleton<EmailQueue>();
builder.Services.AddSingleton<IEmailQueue>(services => services.GetRequiredService<EmailQueue>());
builder.Services.AddHostedService<EmailWorker>();
builder.Services.AddSingleton<EmailComposer>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
        // A signature and expiry check alone would honour a token for up to
        // an hour after a password reset or account deletion. Every token
        // carries the user's SecurityStamp; a token whose user is gone or
        // whose stamp has changed is rejected. (One indexed lookup per
        // authenticated request.)
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var principal = context.Principal!;
                var sub = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                    ?? principal.FindFirst("sub")?.Value;
                var stamp = principal.FindFirst(TokenService.SecurityStampClaim)?.Value;
                if (!Guid.TryParse(sub, out var userId) || stamp is null)
                {
                    context.Fail("Token predates security stamps.");
                    return;
                }
                var db = context.HttpContext.RequestServices.GetRequiredService<ZarifyDbContext>();
                var current = await db.Users
                    .Where(u => u.Id == userId)
                    .Select(u => u.SecurityStamp)
                    .SingleOrDefaultAsync(context.HttpContext.RequestAborted);
                if (current != stamp)
                {
                    context.Fail("Session revoked.");
                }
            },
        };
    });

builder.Services.AddAuthorization();

// Origins come from configuration per environment: appsettings.Development
// (localhost) and appsettings.Production.json (the live domains).
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
if (allowedOrigins.Length == 0 && !builder.Environment.IsDevelopment())
{
    throw new InvalidOperationException(
        "Cors:AllowedOrigins is empty — the frontend could not call the API. Set it in appsettings.Production.json.");
}
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        // Only what the frontend actually sends.
        policy.WithOrigins(allowedOrigins)
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .WithHeaders("Content-Type", "Authorization", "Accept-Language")
            .WithExposedHeaders("Retry-After")
            .SetPreflightMaxAge(TimeSpan.FromHours(1));
    });
});

// Behind the reverse proxy, the client's address arrives in
// X-Forwarded-For. It is only believed when the request came from a proxy
// listed in configuration (ForwardedHeaders:KnownProxies — single IPs —
// and ForwardedHeaders:KnownNetworks — CIDR ranges); from anyone else the
// header is ignored, so a client can't forge its way into a fresh rate-limit
// bucket. With nothing configured only loopback is trusted (the ASP.NET
// Core default), which suits a proxy on the same machine.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.ForwardLimit = 1;

    var proxies = builder.Configuration.GetSection("ForwardedHeaders:KnownProxies").Get<string[]>() ?? [];
    var networks = builder.Configuration.GetSection("ForwardedHeaders:KnownNetworks").Get<string[]>() ?? [];
    if (proxies.Length > 0 || networks.Length > 0)
    {
        options.KnownProxies.Clear();
        options.KnownNetworks.Clear();
        foreach (var proxy in proxies)
        {
            options.KnownProxies.Add(IPAddress.Parse(proxy));
        }
        foreach (var network in networks)
        {
            var parsed = System.Net.IPNetwork.Parse(network);
            options.KnownNetworks.Add(new Microsoft.AspNetCore.HttpOverrides.IPNetwork(parsed.BaseAddress, parsed.PrefixLength));
        }
    }
});

// Public and auth endpoints are throttled per client IP (the real one, via
// ForwardedHeaders above); login and register are additionally limited per
// email inside AuthController, invitation create/update per account inside
// InvitationsController. Numbers live in RateLimitPolicies.
static string ClientIp(HttpContext context) => context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(RateLimitPolicies.Rsvp, context =>
        RateLimitPartition.GetFixedWindowLimiter(ClientIp(context), _ => RateLimitPolicies.RsvpPerIp));
    options.AddPolicy(RateLimitPolicies.Login, context =>
        RateLimitPartition.GetFixedWindowLimiter(ClientIp(context), _ => RateLimitPolicies.LoginPerIp));
    options.AddPolicy(RateLimitPolicies.Register, context =>
        RateLimitPartition.GetFixedWindowLimiter(ClientIp(context), _ => RateLimitPolicies.RegisterPerIp));
    options.AddPolicy(RateLimitPolicies.ForgotPassword, context =>
        RateLimitPartition.GetFixedWindowLimiter(ClientIp(context), _ => RateLimitPolicies.ForgotPasswordPerIp));
    options.AddPolicy(RateLimitPolicies.ResetPassword, context =>
        RateLimitPartition.GetFixedWindowLimiter(ClientIp(context), _ => RateLimitPolicies.ResetPasswordPerIp));
    options.AddPolicy(RateLimitPolicies.InvitationLookup, context =>
        RateLimitPartition.GetFixedWindowLimiter(ClientIp(context), _ => RateLimitPolicies.InvitationLookupPerIp));
    options.OnRejected = (context, ct) =>
    {
        TimeSpan? retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var wait) ? wait : null;
        return new ValueTask(RateLimitPolicies.WriteTooManyRequests(context.HttpContext, retryAfter, ct));
    };
});

var app = builder.Build();

// First, so everything after it — HTTPS redirection, HSTS, the rate limiter —
// sees the real client address and scheme.
app.UseForwardedHeaders();

// Any unhandled exception becomes a JSON 500 in the usual { code, message }
// shape — never a stack trace. The exception is still logged. CORS runs
// further in, and its headers are added as the response starts, so the
// browser can read this body too.
app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
    await context.Response.WriteAsJsonAsync(ApiErrors.Body(ErrorCodes.InternalError, context));
}));

// A JSON API: nothing it returns should be sniffed, framed or leak a referrer.
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;
    headers.XContentTypeOptions = "nosniff";
    headers.XFrameOptions = "DENY";
    headers["Referrer-Policy"] = "no-referrer";
    await next();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

// After CORS, so a 429 still carries the CORS headers the browser needs to
// let the page read the error message.
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
