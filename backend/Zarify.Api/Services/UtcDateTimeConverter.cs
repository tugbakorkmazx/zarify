using System.Text.Json;
using System.Text.Json.Serialization;

namespace Zarify.Api.Services;

/// Every DateTime the API stores is UTC (the *Utc properties), but MySQL
/// hands them back with Kind = Unspecified, which serializes without a "Z" —
/// and a browser then reads "2026-10-08T11:50:00" as local time, three hours
/// off in Turkey. This writes them as UTC, with the "Z".
public sealed class UtcDateTimeConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.GetDateTime().ToUniversalTime();

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        var utc = value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc),
        };
        writer.WriteStringValue(utc);
    }
}
