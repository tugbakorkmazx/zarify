namespace Zarify.Api.Services;

/// The business runs on Turkish time: "this month" on the admin summary,
/// the dates in the accountant's export and the times in emails all mean
/// Europe/Istanbul (UTC+3, no daylight saving), whatever the server's zone.
public static class TurkeyTime
{
    public static readonly TimeZoneInfo Zone = Find();

    public static DateTime FromUtc(DateTime utc) =>
        TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(utc, DateTimeKind.Utc), Zone);

    /// Midnight at the start of `date` in Türkiye, as UTC.
    public static DateTime StartOfDayUtc(DateOnly date) =>
        TimeZoneInfo.ConvertTimeToUtc(date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), Zone);

    public static DateOnly Today() => DateOnly.FromDateTime(FromUtc(DateTime.UtcNow));

    private static TimeZoneInfo Find()
    {
        foreach (var id in new[] { "Europe/Istanbul", "Turkey Standard Time" })
        {
            try { return TimeZoneInfo.FindSystemTimeZoneById(id); }
            catch (TimeZoneNotFoundException) { }
        }
        return TimeZoneInfo.CreateCustomTimeZone("TRT", TimeSpan.FromHours(3), "Türkiye", "Türkiye");
    }
}
