"use client";

import { useEffect, useRef } from "react";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/lib/ui";

/** Confirms cancelling an order that isn't published yet. Cancelling deletes
 * the invitation for good; the contract record is kept (see the API). If
 * the couple already sent the transfer, the refund goes through the
 * Cancellation & Refund Policy — said here so nobody cancels expecting the
 * money to come back by itself. */
export function CancelOrderDialog({
  open,
  busy,
  names,
  error,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  busy: boolean;
  names: string;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      aria-labelledby="cancel-order-title"
      className="paper-card paper-ground m-auto w-[min(92vw,32rem)] p-2 backdrop:bg-ink/70"
    >
      <div className="border border-soot/25 px-6 py-8 text-center sm:px-10">
        <h2 id="cancel-order-title" className="font-display text-3xl leading-tight text-soot">
          Siparişi iptal et
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-soot-soft">
          <strong className="font-semibold text-soot">{names}</strong> davetiyesi ve tüm bilgileri kalıcı
          olarak silinecek; bu işlem geri alınamaz. Havalenizi zaten yaptıysanız iade için{" "}
          <a href="/iptal-ve-iade" target="_blank" rel="noopener" className="text-wine underline underline-offset-4">
            İptal ve İade Politikası
          </a>
          &apos;ndaki adımları izleyin.
        </p>

        {error && (
          <p role="alert" className="mt-5 border border-wine/60 px-4 py-3 font-body text-base text-wine">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} disabled={busy} className={BUTTON_SECONDARY}>
            Vazgeç
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={BUTTON_PRIMARY}>
            {busy ? "İptal ediliyor…" : "Evet, iptal et ve sil"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
