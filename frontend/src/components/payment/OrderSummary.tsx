"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInvitationAgreement, type SalesAgreement } from "@/lib/invitations";
import { formatPrice } from "@/lib/pricing";

const DATE_TIME = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" });

/** The order as the owner agreed to it: the price fixed when they
 * published, when they accepted the contract and which version — with
 * links to the texts showing that same price (?siparis=). Quietly renders
 * nothing if the record can't be loaded; the payment panel above carries
 * what's needed to pay. */
export function OrderSummary({ token, invitationId }: { token: string; invitationId: string }) {
  const [agreement, setAgreement] = useState<SalesAgreement | null>(null);

  useEffect(() => {
    let cancelled = false;
    getInvitationAgreement(token, invitationId)
      .then((result) => {
        if (!cancelled) setAgreement(result);
      })
      .catch(() => {
        // older invitations may have no record; nothing to show then
      });
    return () => {
      cancelled = true;
    };
  }, [token, invitationId]);

  if (!agreement) return null;

  const query = `?siparis=${encodeURIComponent(invitationId)}`;
  const link = "underline decoration-olive-soft underline-offset-4 hover:text-wine hover:decoration-wine";

  return (
    <div className="mb-10 border-y border-soot/30 py-4 text-left font-body text-base leading-relaxed text-soot-soft">
      <p className="apparatus text-xs text-soot-soft">Siparişiniz</p>
      <p className="mt-1 text-soot">
        Tutar <strong className="font-semibold">{formatPrice(agreement.amountTry, "tr")}</strong>
        {agreement.paymentReference && <> · Referans {agreement.paymentReference}</>}
      </p>
      <p>
        {DATE_TIME.format(new Date(agreement.acceptedAtUtc))} tarihinde{" "}
        <Link href={`/on-bilgilendirme-formu${query}`} target="_blank" rel="noopener" className={link}>
          Ön Bilgilendirme Formu
        </Link>
        &apos;nu ve{" "}
        <Link href={`/mesafeli-satis-sozlesmesi${query}`} target="_blank" rel="noopener" className={link}>
          Mesafeli Satış Sözleşmesi
        </Link>
        &apos;ni onayladınız{agreement.version && <> (metin sürümü {agreement.version})</>}.
      </p>
    </div>
  );
}
