"use client";

import { useI18n } from "@/lib/i18n";
import { business, placeholderLabel, type BusinessField } from "@/lib/legal";
import { formatPrice, usePricing } from "@/lib/pricing";

const MARK = "rounded-sm bg-wine/10 px-1 font-semibold text-wine";

/** A business detail from lib/legal.ts — or, while it's still null, a
 * highlighted "[LABEL]" placeholder that can't be mistaken for real text. */
export function Biz({ field }: { field: BusinessField }) {
  const { lang } = useI18n();
  const value = business[field];
  if (value) return <>{value}</>;
  return <mark className={MARK}>[{placeholderLabel[field][lang]}]</mark>;
}

/** The invitation price from the API, or a placeholder until it's set. */
export function Price() {
  const { lang } = useI18n();
  const pricing = usePricing();
  if (pricing === undefined) return <span className="text-soot-soft">…</span>;
  if (pricing.amountTry == null) {
    return <mark className={MARK}>[{lang === "tr" ? "FİYAT — ödeme ayarlarından" : "PRICE — from payment settings"}]</mark>;
  }
  return <strong>{formatPrice(pricing.amountTry, lang)}</strong>;
}
