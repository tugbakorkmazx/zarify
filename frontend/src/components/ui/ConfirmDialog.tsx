"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/lib/ui";

/** A modal "are you sure?" for an action that can't be undone, in the paper
 * card style of the other dialogs. Escape and "Vazgeç" cancel unless busy. */
export function ConfirmDialog({
  open,
  busy,
  title,
  children,
  confirmLabel,
  busyLabel,
  error,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  busy: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel: string;
  error?: string | null;
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
      aria-label={title}
      className="paper-card paper-ground m-auto w-[min(92vw,32rem)] p-2 backdrop:bg-ink/70"
    >
      <div className="border border-soot/25 px-6 py-8 text-center sm:px-10">
        <h2 className="font-display text-3xl leading-tight text-soot">{title}</h2>
        <div className="mt-4 font-body text-lg leading-relaxed text-soot-soft">{children}</div>
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
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
