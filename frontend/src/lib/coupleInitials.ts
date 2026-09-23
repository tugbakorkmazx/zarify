/** Turns a "Bride & Groom" style names string into a monogram-style
 * signature, e.g. "Tuğba & Burak" → "T. & B.", for the RSVP submit button
 * and closing signature — so a filled-in draft's names replace the
 * template's static placeholder monogram everywhere, not just in the hero. */
export function coupleInitials(names: string): string {
  const parts = names
    .split("&")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length !== 2) return names;
  const initial = (value: string) => value.charAt(0).toLocaleUpperCase("tr-TR");
  return `${initial(parts[0])}. & ${initial(parts[1])}.`;
}
