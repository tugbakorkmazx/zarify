"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Price } from "@/components/legal/Placeholder";
import { paymentApprovalNote } from "@/lib/legal";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/lib/ui";

/** The last step before an invitation is created and the payment screen
 * shown: the price, what happens next, and a required checkbox confirming
 * the Pre-Contract Information Form and the Distance Sales Contract have
 * been read. The server records when (its own clock) and which version
 * (legalSettings.version) was accepted. The legal pages open in a new tab
 * so the draft and this dialog stay put. */
export function PublishConfirmDialog({
  open,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const [accepted, setAccepted] = useState(false);
  const checkboxId = useId();
  const tr = lang === "tr";

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setAccepted(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const legalLink = (href: string, label: string) => (
    <Link href={href} target="_blank" rel="noopener" className="text-wine underline underline-offset-4">
      {label}
    </Link>
  );

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      aria-labelledby={`${checkboxId}-title`}
      className="paper-card paper-ground m-auto w-[min(92vw,34rem)] p-2 backdrop:bg-ink/70"
    >
      <div className="border border-soot/25 px-6 py-8 text-center sm:px-10">
        <h2 id={`${checkboxId}-title`} className="font-display text-3xl leading-tight text-soot">
          {tr ? "Yayınlamadan önce" : "Before you publish"}
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-soot-soft">
          {tr ? (
            <>
              Davetiye bedeli <Price />. Bir sonraki adımda havale bilgilerini ve size özel ödeme kodunu
              göreceksiniz; ödemeniz onaylanınca davetiyeniz yayına alınır. {paymentApprovalNote.tr}
            </>
          ) : (
            <>
              The invitation costs <Price />. Next you&apos;ll see the bank-transfer details and your own
              payment reference; your invitation goes live once the payment is confirmed. {paymentApprovalNote.en}
            </>
          )}
        </p>

        <div className="mt-6 flex items-start gap-3 border-t border-soot/20 pt-6 text-left">
          <input
            id={checkboxId}
            type="checkbox"
            required
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1.5 h-5 w-5 shrink-0 accent-wine"
          />
          <label htmlFor={checkboxId} className="font-body text-base leading-relaxed text-soot">
            {tr ? (
              <>
                {legalLink("/on-bilgilendirme-formu", "Ön Bilgilendirme Formu")}&apos;nu ve{" "}
                {legalLink("/mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi")}&apos;ni okudum ve kabul
                ediyorum. Hizmetin ifasına ödememin onaylanmasıyla başlanacağını ve davetiyem yayına
                alındıktan sonra cayma hakkımın bulunmadığını biliyorum.
              </>
            ) : (
              <>
                I have read and accept the {legalLink("/on-bilgilendirme-formu", "Pre-Contract Information Form")} and the{" "}
                {legalLink("/mesafeli-satis-sozlesmesi", "Distance Sales Contract")}. I understand the service
                starts once my payment is confirmed and that I can&apos;t withdraw after my invitation is published.
              </>
            )}
          </label>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} disabled={busy} className={BUTTON_SECONDARY}>
            {tr ? "Vazgeç" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!accepted || busy}
            aria-disabled={!accepted || busy}
            className={BUTTON_PRIMARY}
          >
            {busy ? (tr ? "Hazırlanıyor…" : "Preparing…") : tr ? "Onayla ve Ödemeye Geç" : "Confirm and continue"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
