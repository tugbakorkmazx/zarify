using System.Globalization;
using System.Text;

namespace Zarify.Api.Services;

/// The one CSV dialect every export uses: what Excel in a Turkish locale
/// opens correctly on a double-click — UTF-8 with a BOM (so ç, ğ, ş… read
/// right), semicolons between fields (the comma is the decimal separator),
/// dates as gg.aa.yyyy ss:dd in Turkish time and amounts as 199,90. Every
/// field is quoted, and one starting like a formula is defused.
public sealed class CsvFile
{
    private static readonly CultureInfo Tr = CultureInfo.GetCultureInfo("tr-TR");
    private readonly StringBuilder _csv = new();

    public CsvFile Row(params string?[] fields)
    {
        _csv.Append(string.Join(';', fields.Select(Cell))).Append("\r\n");
        return this;
    }

    public static string Moment(DateTime? utc) =>
        utc is { } value ? TurkeyTime.FromUtc(value).ToString("dd.MM.yyyy HH:mm", Tr) : "";

    public static string Money(decimal amount) => amount.ToString("0.00", Tr);

    public static string Number(int value) => value.ToString(Tr);

    public byte[] ToBytes() =>
        Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(_csv.ToString())).ToArray();

    /// Quotes a field, and defuses values a spreadsheet would run as a
    /// formula (a guest name typed as "=HYPERLINK(…)").
    private static string Cell(string? value)
    {
        value ??= "";
        if (value.Length > 0 && "=+-@\t\r".Contains(value[0]))
        {
            value = "'" + value;
        }
        return $"\"{value.Replace("\"", "\"\"")}\"";
    }
}
