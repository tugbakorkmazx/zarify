"use client";

import { useEffect, useRef } from "react";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/lib/ui";

/** The last confirmation before an account is deleted — after the password
 * has been typed on the page. Spells out what goes and what stays. */
export function DeleteAccountDialog({
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
      aria-labelledby="delete-account-title"
      className="paper-card paper-ground m-auto w-[min(92vw,32rem)] p-2 backdrop:bg-ink/70"
    >
      <div className="border border-soot/25 px-6 py-8 text-center sm:px-10">
        <h2 id="delete-account-title" className="font-display text-3xl leading-tight text-soot">
          Hesabınız silinsin mi?
        </h2>
        <p className="mt-4 font-body text-lg leading-relaxed text-soot-soft">
          Hesabınız, tüm davetiyeleriniz ve misafirlerinizin katılım yanıtları{" "}
          <strong className="font-semibold text-soot">kalıcı olarak silinecek</strong>; yayındaki davetiye
          linkleriniz çalışmayı durduracak. Bu işlem geri alınamaz.
        </p>

        <div className="mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} disabled={busy} className={BUTTON_SECONDARY}>
            Vazgeç
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={BUTTON_PRIMARY}>
            {busy ? "Siliniyor…" : "Evet, hesabımı sil"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
