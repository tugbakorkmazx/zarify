"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ApiError, loginHref } from "@/lib/auth";
import type { InvitationStatus } from "@/lib/invitations";
import { BOX_INPUT, BUTTON_PRIMARY_SM, BUTTON_SECONDARY_SM, FIELD_LABEL, LINE_INPUT, TEXT_LINK } from "@/lib/ui";

export const DATE_TIME = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

export const formatMoment = (utc: string | null | undefined) => (utc ? DATE_TIME.format(new Date(utc)) : "—");

export type AdminTab = "ozet" | "odemeler" | "davetiyeler" | "kullanicilar" | "iptaller" | "gecmis";

/** /yonetim?sekme=…&id=… — the tab (and the record open in it) live in the
 * URL, so a refresh, the back button and a pasted link all keep the place. */
export function adminHref(tab: AdminTab, id?: string | null): string {
  return `/yonetim?sekme=${tab}${id ? `&id=${encodeURIComponent(id)}` : ""}`;
}

type LoadStatus = "loading" | "ready" | "forbidden" | "error";

/** Loads one admin resource for the signed-in token. `key` names what's
 * being loaded (tab + filters + page): a new key fetches again and reads as
 * "loading" until it lands. A 401 signs out; a 403 reads as "forbidden". */
export function useAdminData<T>(key: string, load: (token: string) => Promise<T>) {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<{ key: string; status: LoadStatus; data?: T }>({ key, status: "loading" });
  const [nonce, setNonce] = useState(0);
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    loadRef.current(token)
      .then((data) => {
        if (!cancelled) setState({ key, status: "ready", data });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace(loginHref());
          return;
        }
        setState({ key, status: err instanceof ApiError && err.status === 403 ? "forbidden" : "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [key, token, nonce, logout, router]);

  const current = state.key === key ? state : { key, status: "loading" as LoadStatus, data: undefined };
  return {
    status: current.status,
    data: current.data,
    reload: () => setNonce((n) => n + 1),
    /** Replaces the loaded data after an action answered with the new state. */
    setData: (data: T) => setState({ key, status: "ready", data }),
  };
}

/** The loading / forbidden / error line every tab shows before its data. */
export function LoadState({ status, onRetry }: { status: LoadStatus; onRetry?: () => void }) {
  if (status === "loading") {
    return (
      <p className="py-8 text-center font-body text-lg text-soot-soft" role="status">
        Yükleniyor…
      </p>
    );
  }
  if (status === "forbidden") {
    return <Alert>Bu sayfaya erişim yetkiniz yok. Yönetici yetkisi yeni verildiyse çıkış yapıp tekrar giriş yapın.</Alert>;
  }
  if (status === "error") {
    return (
      <Alert>
        Bilgiler şu anda yüklenemedi.{" "}
        {onRetry && (
          <button type="button" onClick={onRetry} className={`apparatus text-sm ${TEXT_LINK}`}>
            Tekrar dene
          </button>
        )}
      </Alert>
    );
  }
  return null;
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mx-auto max-w-2xl border border-wine/50 px-5 py-4 text-center font-body text-lg text-wine">
      {children}
    </p>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="mx-auto max-w-2xl bg-paper-deep px-6 py-8 text-center font-body text-lg text-soot-soft">{children}</p>;
}

export const STATUS_LABEL: Record<InvitationStatus, string> = {
  draft: "Taslak",
  pendingPayment: "Ödeme bekliyor",
  published: "Yayında",
  removed: "Kaldırıldı",
};

const STATUS_TONE: Record<InvitationStatus, string> = {
  draft: "bg-soot-soft text-soot-soft",
  pendingPayment: "bg-wine text-wine",
  published: "bg-olive text-olive",
  removed: "bg-soot text-soot",
};

export function StatusBadge({ status }: { status: InvitationStatus }) {
  const [dot, text] = STATUS_TONE[status].split(" ");
  return (
    <span className="apparatus inline-flex items-center gap-2 text-sm">
      <span aria-hidden="true" className={`inline-block h-2 w-2 ${dot}`} />
      <span className={text}>{STATUS_LABEL[status]}</span>
    </span>
  );
}

/** "‹ Önceki · 2 / 7 · Sonraki ›" under a paged list. */
export function Pager({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav aria-label="Sayfalar" className="mt-8 flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className={`apparatus min-h-11 text-sm ${TEXT_LINK} disabled:pointer-events-none disabled:opacity-40`}
      >
        ‹ Önceki
      </button>
      <span className="apparatus text-sm text-soot-soft">
        {page} / {pages}
      </span>
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        className={`apparatus min-h-11 text-sm ${TEXT_LINK} disabled:pointer-events-none disabled:opacity-40`}
      >
        Sonraki ›
      </button>
    </nav>
  );
}

/** A search box that searches on submit (Enter or the button), not on
 * every keystroke. */
export function SearchBox({
  initial,
  placeholder,
  onSearch,
  label,
}: {
  initial: string;
  placeholder: string;
  label: string;
  onSearch: (q: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <form
      role="search"
      className="flex w-full max-w-xl items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
    >
      <label className="flex min-w-0 flex-1 flex-col gap-1 text-left">
        <span className={FIELD_LABEL}>{label}</span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={100}
          className={LINE_INPUT}
        />
      </label>
      <button type="submit" className={BUTTON_SECONDARY_SM}>
        Ara
      </button>
    </form>
  );
}

/** A label/value pair in a detail view. */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="apparatus text-xs text-soot-soft">{label}</dt>
      <dd className="break-words font-body text-lg text-soot">{children}</dd>
    </div>
  );
}

/** The "write a reason, then confirm" step behind rejecting a payment,
 * taking an invitation offline and suspending an account. */
export function NoteForm({
  label,
  placeholder,
  hint,
  submitLabel,
  busyLabel,
  busy,
  onSubmit,
  onCancel,
}: {
  label: string;
  placeholder: string;
  hint: string;
  submitLabel: string;
  busyLabel: string;
  busy: boolean;
  onSubmit: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState("");
  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-3 bg-paper-deep p-4 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(note.trim());
      }}
    >
      <label className="flex flex-col gap-1">
        <span className={FIELD_LABEL}>{label}</span>
        <textarea
          required
          maxLength={500}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={placeholder}
          className={`${BOX_INPUT} !p-2 !text-base`}
        />
      </label>
      <p className="font-body text-sm text-soot-soft">{hint}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy || note.trim() === ""} className={BUTTON_PRIMARY_SM}>
          {busy ? busyLabel : submitLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={`apparatus min-h-11 text-sm ${TEXT_LINK}`}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}

/** A two-step confirm for an action with no note (approve, republish,
 * reinstate). */
export function ConfirmBox({
  text,
  confirmLabel,
  busyLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  text: string;
  confirmLabel: string;
  busyLabel: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 bg-paper-deep p-4 text-left">
      <p className="font-body text-base text-soot">{text}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={onConfirm} disabled={busy} className={BUTTON_PRIMARY_SM}>
          {busy ? busyLabel : confirmLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={`apparatus min-h-11 text-sm ${TEXT_LINK}`}>
          Vazgeç
        </button>
      </div>
    </div>
  );
}

export function SectionTitle({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="font-display text-3xl leading-tight text-soot">{children}</h2>
      {note && <p className="mx-auto mt-2 max-w-[56ch] font-body text-base italic text-soot-soft">{note}</p>}
    </div>
  );
}

export function ErrorLine({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-center font-body text-base text-wine">
      {error}
    </p>
  );
}
