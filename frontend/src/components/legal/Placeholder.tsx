"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { business, placeholderLabel, type BusinessField } from "@/lib/legal";
import { formatPrice, usePricing } from "@/lib/pricing";
import { getInvitationAgreement } from "@/lib/invitations";

const MARK = "rounded-sm bg-wine/10 px-1 font-semibold text-wine";

/** A business detail from lib/legal.ts — or, while it's still null, a
 * highlighted "[LABEL]" placeholder that can't be mistaken for real text. */
export function Biz({ field }: { field: BusinessField }) {
  const { lang } = useI18n();
  const value = business[field];
  if (value) return <>{value}</>;
  return <mark className={MARK}>[{placeholderLabel[field][lang]}]</mark>;
}

/** `?siparis=<invitation id>` on a legal page: the owner opened the texts
 * from their order (see OrderSummary) and should see the price fixed on
 * it, not today's. Read after mount — these pages are prerendered. */
function useOrderAmount(): number | null {
  const { ready, token } = useAuth();
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!ready || !token) return;
    const orderId = new URLSearchParams(window.location.search).get("siparis");
    if (!orderId) return;
    let cancelled = false;
    getInvitationAgreement(token, orderId)
      .then((agreement) => {
        if (!cancelled) setAmount(agreement.amountTry);
      })
      .catch(() => {
        // not the owner's order, or no record — fall back to the list price
      });
    return () => {
      cancelled = true;
    };
  }, [ready, token]);

  return amount;
}

/** The invitation price: the one fixed on the owner's order when the page
 * was opened from it, otherwise the current price from the API, or a
 * placeholder until that's set. */
export function Price() {
  const { lang } = useI18n();
  const pricing = usePricing();
  const orderAmount = useOrderAmount();
  if (orderAmount != null) {
    return (
      <>
        <strong>{formatPrice(orderAmount, lang)}</strong>{" "}
        {lang === "tr" ? "(siparişinizde kayıtlı tutar)" : "(the amount recorded on your order)"}
      </>
    );
  }
  if (pricing === undefined) return <span className="text-soot-soft">…</span>;
  if (pricing.amountTry == null) {
    return <mark className={MARK}>[{lang === "tr" ? "FİYAT — ödeme ayarlarından" : "PRICE — from payment settings"}]</mark>;
  }
  return <strong>{formatPrice(pricing.amountTry, lang)}</strong>;
}
