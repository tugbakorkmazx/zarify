"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";

export interface Pricing {
  amountTry: number | null;
  currency: string;
}

/** The invitation price, from the same setting the payment screen uses
 * (GET /api/pricing). `undefined` while loading; `amountTry: null` when it
 * isn't configured yet or the API can't be reached — callers then show a
 * placeholder rather than a made-up number. */
export function usePricing(): Pricing | undefined {
  const [pricing, setPricing] = useState<Pricing>();
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/pricing`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body: Pricing | null) => {
        if (!cancelled) setPricing(body ?? { amountTry: null, currency: "TRY" });
      })
      .catch(() => {
        if (!cancelled) setPricing({ amountTry: null, currency: "TRY" });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return pricing;
}

export function formatPrice(amountTry: number, lang: "tr" | "en"): string {
  return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-GB", {
    style: "currency",
    currency: "TRY",
  }).format(amountTry);
}
