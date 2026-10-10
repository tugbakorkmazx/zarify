using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Zarify.Api.Models;
using Zarify.Api.Options;

namespace Zarify.Api.Services;

public class TokenService(IOptions<JwtOptions> jwtOptions) : ITokenService
{
    public const string SecurityStampClaim = "stamp";

    private readonly JwtOptions _options = jwtOptions.Value;

    public (string Token, DateTime ExpiresAtUtc) CreateToken(User user)
    {
        var expiresAtUtc = DateTime.UtcNow.AddMinutes(_options.ExpiryMinutes);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            // Read by [Authorize(Roles = "Admin")]. A role change takes
            // effect at the user's next login (tokens live ExpiryMinutes).
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            // Checked against the database on every request (Program.cs):
            // a password reset changes the stamp and ends every session.
            new Claim(SecurityStampClaim, user.SecurityStamp),
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
    }
}
