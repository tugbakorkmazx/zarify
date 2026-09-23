/** "2027-10-10" → "10 Ekim 2027 · Pazar" — shared by the draft preview and
 * the published invitation page so both format the owner's chosen date the
 * same way. */
export function formatDateLine(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = new Intl.DateTimeFormat("tr-TR", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("tr-TR", { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat("tr-TR", { year: "numeric" }).format(date);
  const weekday = new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(date);
  return `${day} ${month} ${year} · ${weekday}`;
}
