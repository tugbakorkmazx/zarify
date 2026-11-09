/** Use the saved address, optionally qualified by the venue name. */
function venueDestination(venueName: string | null | undefined, venueAddress: string | null | undefined) {
  const address = venueAddress?.trim();
  if (!address) return undefined;
  const name = venueName?.trim();
  return encodeURIComponent(name ? `${name}, ${address}` : address);
}

export function venueMapUrl(venueName: string | null | undefined, venueAddress: string | null | undefined): string | undefined {
  const destination = venueDestination(venueName, venueAddress);
  return destination ? `https://www.google.com/maps/search/?api=1&query=${destination}` : undefined;
}

export function venueDirectionsUrl(venueName: string | null | undefined, venueAddress: string | null | undefined): string | undefined {
  const destination = venueDestination(venueName, venueAddress);
  return destination ? `https://www.google.com/maps/dir/?api=1&destination=${destination}` : undefined;
}
