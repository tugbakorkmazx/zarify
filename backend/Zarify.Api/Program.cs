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

const string FrontendCorsPolicy = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

// The API only ever receives small JSON bodies (the largest is an
// invitation with its story and schedule, a few KB), so cap requests far
// below Kestrel's 30 MB default.
builder.WebHost.ConfigureKestrel(kestrel => kestrel.Limits.MaxRequestBodySize = 64 * 1024);

// Add services to the container.

builder.Services.AddControllers()
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

builder.Services.AddDbContext<ZarifyDbContext>(options =>
    options.UseMySql(connectionString, mySqlServerVersion));

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
builder.Services.Configure<PaymentOptions>(builder.Configuration.GetSection("Payment"));

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
            .WithMethods("GET", "POST", "PUT")
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
// email inside AuthController. Numbers live in RateLimitPolicies.
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
