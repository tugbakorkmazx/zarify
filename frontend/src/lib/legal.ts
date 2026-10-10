/** Everything the legal pages need to know about the business, in ONE
 * place. Fill the nulls with the real details before launch: every legal
 * page reads from here, and any value still null renders as a highlighted
 * "[…]" placeholder, so a missing one is impossible to overlook.
 *
 * The texts are DRAFTS pending review by a lawyer and an accountant — see
 * `showDraftNotice` below. */

export type BusinessField =
  | "tradeName"
  | "address"
  | "taxOffice"
  | "taxNumber"
  | "mersisNumber"
  | "email"
  | "phone"
  | "kepAddress"
  | "courtCity"
  | "hostingProvider"
  | "emailProvider"
  | "servicePeriod";

export const business: Record<BusinessField, string | null> = {
  /** Unvan — company name, or the owner's full name for a sole trader. */
  tradeName: null,
  address: null,
  taxOffice: null,
  taxNumber: null,
  /** MERSİS no — companies only; leave null for a sole trader. */
  mersisNumber: null,
  email: null,
  phone: null,
  /** KEP address, if there is one. */
  kepAddress: null,
  /** Court seat named in the governing-law clauses. */
  courtCity: null,
  /** Where the database and servers are hosted, and in which country —
   * decides whether the cross-border transfer paragraph (KVKK md. 9)
   * applies. */
  hostingProvider: null,
  /** Who delivers the transactional emails (the SMTP service), and in
   * which country — it receives addresses, names and email contents. */
  emailProvider: null,
  /** How long a published invitation stays online, e.g. "düğün tarihinden
   * itibaren 12 ay". */
  servicePeriod: null,
};

/** What a missing field says, per language. */
export const placeholderLabel: Record<BusinessField, { tr: string; en: string }> = {
  tradeName: { tr: "ŞİRKET UNVANI / AD SOYAD", en: "COMPANY NAME / FULL NAME" },
  address: { tr: "AÇIK ADRES", en: "REGISTERED ADDRESS" },
  taxOffice: { tr: "VERGİ DAİRESİ", en: "TAX OFFICE" },
  taxNumber: { tr: "VERGİ NUMARASI", en: "TAX NUMBER" },
  mersisNumber: { tr: "MERSİS NO (varsa)", en: "MERSIS NO (if any)" },
  email: { tr: "İLETİŞİM E-POSTASI", en: "CONTACT EMAIL" },
  phone: { tr: "TELEFON", en: "PHONE" },
  kepAddress: { tr: "KEP ADRESİ (varsa)", en: "KEP ADDRESS (if any)" },
  courtCity: { tr: "YETKİLİ MAHKEME İLİ", en: "COURT CITY" },
  hostingProvider: { tr: "BARINDIRMA SAĞLAYICISI VE ÜLKESİ", en: "HOSTING PROVIDER AND COUNTRY" },
  emailProvider: { tr: "E-POSTA GÖNDERİM SAĞLAYICISI VE ÜLKESİ", en: "EMAIL DELIVERY PROVIDER AND COUNTRY" },
  servicePeriod: { tr: "DAVETİYENİN YAYINDA KALACAĞI SÜRE", en: "HOW LONG THE INVITATION STAYS ONLINE" },
};

export const legalSettings = {
  /** Shows the "Taslak / Draft" notice on top of every legal page. Set to
   * false once the lawyer and accountant have approved the texts. */
  showDraftNotice: true,
  /** Bump whenever the substance of any legal text changes. Also stored
   * with each invitation when the owner accepts the distance-sales texts,
   * so we know which version they agreed to. */
  version: "2026-10-09",
  lastUpdated: { tr: "9 Ekim 2026", en: "9 October 2026" },
};

/** How long payment approval takes — the one wording used everywhere it's
 * promised (payment screen, pre-contract form, contract). Change it here
 * only, and bump legalSettings.version when you do. */
export const paymentApprovalNote = {
  tr: "Ödemeniz genellikle aynı gün, en geç 2 iş günü içinde onaylanır.",
  en: "Your payment is usually approved the same day, and within 2 business days at the latest.",
};

export interface LegalPageLink {
  href: string;
  title: { tr: string; en: string };
}

/** Every legal page, in footer order. */
export const legalPages: LegalPageLink[] = [
  { href: "/kvkk-aydinlatma-metni", title: { tr: "KVKK Aydınlatma Metni", en: "Personal Data Notice (KVKK)" } },
  { href: "/gizlilik", title: { tr: "Gizlilik Politikası", en: "Privacy Policy" } },
  { href: "/cerez-politikasi", title: { tr: "Çerez Politikası", en: "Cookie Policy" } },
  { href: "/kullanim-sartlari", title: { tr: "Kullanım Şartları", en: "Terms of Use" } },
  { href: "/on-bilgilendirme-formu", title: { tr: "Ön Bilgilendirme Formu", en: "Pre-Contract Information Form" } },
  { href: "/mesafeli-satis-sozlesmesi", title: { tr: "Mesafeli Satış Sözleşmesi", en: "Distance Sales Contract" } },
  { href: "/iptal-ve-iade", title: { tr: "İptal ve İade Politikası", en: "Cancellation & Refund Policy" } },
];

export function legalTitle(href: string, lang: "tr" | "en"): string {
  return legalPages.find((p) => p.href === href)?.title[lang] ?? href;
}
