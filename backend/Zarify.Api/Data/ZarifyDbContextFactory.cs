using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Zarify.Api.Data;

/// Used only by `dotnet ef` design-time tooling (migrations add/update).
/// Reads the same appsettings + user-secrets configuration Program.cs uses
/// at runtime, so `dotnet ef database update` connects with the real
/// ConnectionStrings:Default instead of a placeholder.
public class ZarifyDbContextFactory : IDesignTimeDbContextFactory<ZarifyDbContext>
{
    public ZarifyDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddUserSecrets<ZarifyDbContext>(optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException(
                "ConnectionStrings:Default is not configured. Set it via `dotnet user-secrets set \"ConnectionStrings:Default\" \"...\"` (run from backend/Zarify.Api).");

        var optionsBuilder = new DbContextOptionsBuilder<ZarifyDbContext>();
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 44));
        optionsBuilder.UseMySql(connectionString, serverVersion);
        return new ZarifyDbContext(optionsBuilder.Options);
    }
}
