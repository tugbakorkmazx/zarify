/** Who runs Zarify, as the legal pages name them. KVKK requires the data
 * controller's identity and a way to reach them, so these must be filled in
 * with the real details before launch — the bracketed values render as-is
 * on /gizlilik and /kullanim-sartlari so a missing one is obvious. */
export const legalEntity = {
  name: "[Şirket unvanı veya şahıs adı soyadı]",
  address: "[Açık adres]",
  email: "[iletisim@alanadi.com]",
  /** Court seat named in the terms' governing-law clause. */
  courtCity: "[İl]",
  /** Where the database/servers are hosted — decides whether the
   * cross-border transfer paragraph applies (KVKK md. 9). */
  hostingLocation: "[Barındırma sağlayıcısı ve ülkesi]",
};

/** Bump when either page's substance changes. */
export const legalLastUpdated = "25 Eylül 2026";
