/** A Google Maps search link for the couple's venue — name and address as
 * they typed them, so it works without coordinates. No address, no link:
 * the "Haritada Aç" button is hidden rather than searching for a bare name. */
export function venueMapUrl(venueName: string | null | undefined, venueAddress: string | null | undefined): string | undefined {
  const address = venueAddress?.trim();
  if (!address) return undefined;
  const name = venueName?.trim();
  const query = name ? `${name}, ${address}` : address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
