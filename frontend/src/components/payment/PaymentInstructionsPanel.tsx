"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/auth";
import { getPaymentInstructions, type PaymentInstructions } from "@/lib/invitations";
import { BUTTON_SECONDARY_SM } from "@/lib/ui";

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
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="min-w-0 text-left">
        <p className="apparatus text-xs text-soot-soft">{label}</p>
        <p className={`break-all ${emphasis ? "font-display numerals text-3xl leading-tight text-wine" : "font-body text-lg text-soot"}`}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`${label} kopyala`}
        className={`shrink-0 ${BUTTON_SECONDARY_SM}`}
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
      <p role="alert" className="border border-wine/60 px-4 py-3 font-body text-base text-wine">
        {error}
      </p>
    );
  }

  if (!info) {
    return <p className="font-body text-lg text-soot-soft" role="status">Ödeme bilgileri yükleniyor…</p>;
  }

  return (
    <div className="text-left">
      <p className="mb-6 font-body text-lg leading-relaxed text-soot-soft">
        Davetiyeniz hazır ve ödeme bekliyor. Aşağıdaki hesaba havale/EFT yapın;
        açıklama kısmına <strong className="font-semibold text-soot">referans kodunu</strong> mutlaka yazın.
        Ödemeniz onaylandığında davetiyeniz yayına alınır ve linkiniz misafirlerinize açılır.
      </p>

      <div className="divide-y divide-soot/20 border-y border-soot">
        <CopyRow label="Tutar" value={TRY.format(info.amountTry)} emphasis />
        <CopyRow label="IBAN" value={info.iban} />
        <CopyRow label="Alıcı" value={info.accountHolder} />
        {info.bankName && <CopyRow label="Banka" value={info.bankName} />}
        <CopyRow label="Açıklamaya yazılacak referans kodu" value={info.reference} emphasis />
      </div>

      <p className="mt-4 font-body text-sm text-soot-soft">
        Onay genellikle aynı gün içinde yapılır. Bu sayfaya Davetiyelerim panelinizden
        her zaman geri dönebilirsiniz.
      </p>
    </div>
  );
}
