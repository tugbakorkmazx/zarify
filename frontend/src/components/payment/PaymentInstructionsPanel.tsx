"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/auth";
import { getPaymentInstructions, type PaymentInstructions } from "@/lib/invitations";

const TRY = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

function CopyRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      // IBANs are displayed grouped for reading but pasted without spaces
      await navigator.clipboard.writeText(label === "IBAN" ? value.replace(/\s+/g, "") : value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the value is still selectable text
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0 text-left">
        <p className="font-body text-[11px] tracking-[0.18em] uppercase text-gold-deep">{label}</p>
        <p className={`font-body text-ink break-all ${emphasis ? "text-lg font-semibold" : "text-base"}`}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`${label} kopyala`}
        className="shrink-0 font-body text-xs text-ink-soft border border-gold/50 rounded-full px-3 py-1.5 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
      >
        {copied ? "Kopyalandı" : "Kopyala"}
      </button>
    </div>
  );
}

/** What the couple sees after publishing: where to send the bank transfer
 * and the reference code to put in its description, so the operator can
 * match the transfer to this invitation and approve it. */
export function PaymentInstructionsPanel({ token, invitationId }: { token: string; invitationId: string }) {
  const [info, setInfo] = useState<PaymentInstructions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPaymentInstructions(token, invitationId)
      .then((result) => {
        if (!cancelled) setInfo(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Ödeme bilgileri yüklenemedi.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, invitationId]);

  if (error) {
    return (
      <p role="alert" className="border border-gold-deep/50 bg-parchment-deep px-4 py-3 font-body text-sm text-ink">
        {error}
      </p>
    );
  }

  if (!info) {
    return <p className="font-body text-sm text-ink-soft">Ödeme bilgileri yükleniyor…</p>;
  }

  return (
    <div className="text-left">
      <p className="font-body text-sm text-ink-soft mb-5 text-center">
        Davetiyeniz hazır ve ödeme bekliyor. Aşağıdaki hesaba havale/EFT yapın;
        açıklama kısmına <strong className="text-ink">referans kodunu</strong> mutlaka yazın.
        Ödemeniz onaylandığında davetiyeniz yayına alınır ve linkiniz misafirlerinize açılır.
      </p>

      <div className="border border-gold/50 px-5 divide-y divide-gold/30">
        <CopyRow label="Tutar" value={TRY.format(info.amountTry)} emphasis />
        <CopyRow label="IBAN" value={info.iban} />
        <CopyRow label="Alıcı" value={info.accountHolder} />
        {info.bankName && <CopyRow label="Banka" value={info.bankName} />}
        <CopyRow label="Açıklamaya yazılacak referans kodu" value={info.reference} emphasis />
      </div>

      <p className="font-body text-xs text-ink-soft mt-4 text-center">
        Onay genellikle aynı gün içinde yapılır. Bu sayfaya Davetiyelerim panelinizden
        her zaman geri dönebilirsiniz.
      </p>
    </div>
  );
}
