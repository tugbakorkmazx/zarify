"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { IlluminatedRule } from "@/components/invitation/IlluminatedRule";
import { approvePayment, getPendingPayments, type AdminInvitation } from "@/lib/admin";
import { formatDateLine } from "@/lib/formatDateLine";

type Status = "loading" | "ready" | "forbidden" | "error";

const DATE_TIME = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" });

/** The operator's payment queue: invitations whose bank transfer hasn't
 * been confirmed yet. Approving one publishes it. Admin only — the API
 * enforces the role; the client check just avoids showing an empty shell. */
export default function AdminPage() {
  const { ready, user, token, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AdminInvitation[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/giris");
      return;
    }
    let cancelled = false;
    getPendingPayments(token)
      .then((result) => {
        if (cancelled) return;
        setItems(result);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/giris");
          return;
        }
        setStatus(err instanceof ApiError && err.status === 403 ? "forbidden" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [ready, token, router, logout]);

  if (!token) {
    return null;
  }

  return (
    <main className="paper-ground min-h-svh px-6 py-8 sm:px-10">
      <Link
        href="/davetiyelerim"
        className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
      >
        ← Davetiyelerim
      </Link>

      <div className="mx-auto max-w-3xl pt-12 sm:pt-16">
        <header className="text-center">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">Yönetim</p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink">Ödeme Bekleyenler</h1>
          <IlluminatedRule className="my-6 mx-auto" />
        </header>

        {status === "loading" && (
          <p className="text-center font-body text-sm text-ink-soft">Yükleniyor…</p>
        )}

        {status === "forbidden" && (
          <p role="alert" className="text-center font-body text-sm text-ink-soft">
            Bu sayfaya erişim yetkiniz yok.
            {user?.role !== "admin" &&
              " Yönetici yetkisi yeni verildiyse çıkış yapıp tekrar giriş yapmanız gerekir."}
          </p>
        )}

        {status === "error" && (
          <p role="alert" className="text-center font-body text-sm text-ink-soft">
            Liste yüklenemedi. Lütfen daha sonra tekrar deneyin.
          </p>
        )}

        {status === "ready" && items.length === 0 && (
          <p className="text-center font-body text-base text-ink-soft">
            Ödeme bekleyen davetiye yok.
          </p>
        )}

        {status === "ready" && items.length > 0 && (
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <li key={item.invitation.id}>
                <PendingRow
                  item={item}
                  token={token}
                  onApproved={() =>
                    setItems((current) => current.filter((i) => i.invitation.id !== item.invitation.id))
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function PendingRow({
  item,
  token,
  onApproved,
}: {
  item: AdminInvitation;
  token: string;
  onApproved: () => void;
}) {
  const { invitation: inv, owner, paymentReference } = item;
  const [confirming, setConfirming] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setError(null);
    setApproving(true);
    try {
      await approvePayment(token, inv.id);
      onApproved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sunucuya ulaşılamadı.");
      setApproving(false);
      setConfirming(false);
    }
  }

  return (
    <article className="border border-gold/50 bg-parchment/40 px-5 py-5 sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl text-ink">
            {inv.brideName} &amp; {inv.groomName}
          </h2>
          <p className="font-body text-sm text-ink-soft">{formatDateLine(inv.weddingDate)}</p>
          <p className="font-body text-sm text-ink-soft mt-2">
            {owner.firstName} {owner.lastName} · <span className="break-all">{owner.email}</span>
          </p>
          <p className="font-body text-xs text-ink-soft mt-1">
            Oluşturulma: {DATE_TIME.format(new Date(inv.createdAtUtc))}
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="font-body text-[11px] tracking-[0.18em] uppercase text-gold-deep">Referans kodu</p>
          <p className="font-body text-lg text-ink font-semibold tracking-wider">
            {paymentReference ?? "—"}
          </p>
          <p className="font-body text-xs text-ink-soft mt-1 break-all">Link: {inv.slug}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="font-body text-sm text-ink bg-gold-light rounded-full px-5 py-2 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.97]"
          >
            Ödemeyi Onayla
          </button>
        ) : (
          <>
            <span className="font-body text-sm text-ink">
              Bu referansla ödeme geldiğinden emin misiniz? Davetiye hemen yayına alınır.
            </span>
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              className="font-body text-sm text-ink bg-gold-light rounded-full px-5 py-2 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.97] disabled:opacity-60"
            >
              {approving ? "Onaylanıyor…" : "Evet, onayla"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={approving}
              className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:text-ink"
            >
              Vazgeç
            </button>
          </>
        )}
        <Link
          href={`/davetiye/${inv.slug}`}
          className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          Davetiyeye bak
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-3 font-body text-sm text-ink">
          {error}
        </p>
      )}
    </article>
  );
}
