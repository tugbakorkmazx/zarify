/** "2027-10-10" → "10 Ekim 2027 · Pazar" (tr) / "10 October 2027 · Sunday"
 * (en) — shared by the draft preview and the published invitation page so
 * both format the owner's chosen date the same way, in the language the
 * guest picked. A calendar date, so it's formatted in UTC: the weekday can't
 * shift with the viewer's time zone. */
export function formatDateLine(dateStr: string, lang: "tr" | "en" = "tr"): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const locale = lang === "en" ? "en-GB" : "tr-TR";
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(date);
  return `${part({ day: "numeric" })} ${part({ month: "long" })} ${part({ year: "numeric" })} · ${part({ weekday: "long" })}`;
}
