"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { BUTTON_PRIMARY_SM, TEXT_LINK } from "@/lib/ui";
import { approvePayment, getPendingPayments, type AdminInvitation } from "@/lib/admin";
import { formatDateLine } from "@/lib/formatDateLine";
import { describeError } from "@/lib/apiErrors";

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
    <OwnerShell
      section="Yönetim"
      title="Ödeme Bekleyenler"
      lede={
        status === "ready"
          ? items.length > 0
            ? `${items.length} davetiye havale onayı bekliyor. Referans kodunu banka açıklamasıyla eşleştirip onaylayın.`
            : "Onay bekleyen havale yok."
          : undefined
      }
      current="admin"
    >
      {status === "loading" && (
        <p className="font-body text-lg text-soot-soft" role="status">
          Yükleniyor…
        </p>
      )}

      {status === "forbidden" && (
        <p role="alert" className="border border-wine/50 px-5 py-4 font-body text-lg text-wine">
          Bu sayfaya erişim yetkiniz yok.
          {user?.role !== "admin" &&
            " Yönetici yetkisi yeni verildiyse çıkış yapıp tekrar giriş yapmanız gerekir."}
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="border border-wine/50 px-5 py-4 font-body text-lg text-wine">
          Liste şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.
        </p>
      )}

      {status === "ready" && items.length === 0 && (
        <p className="bg-paper-deep px-6 py-8 font-body text-lg text-soot-soft">
          Yeni bir davetiye yayınlandığında ödemesi burada onayınızı bekler.
        </p>
      )}

      {status === "ready" && items.length > 0 && (
        <>
          <div
            aria-hidden="true"
            className="apparatus hidden grid-cols-12 gap-6 pb-3 text-xs text-soot-soft lg:grid"
          >
            <span className="col-span-3">Referans kodu</span>
            <span className="col-span-5">Davetiye · sahibi</span>
            <span className="col-span-4 text-right">İşlem</span>
          </div>
          <ul className="border-t border-soot">
            {items.map((item) => (
              <li key={item.invitation.id} className="border-b border-soot/25">
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
        </>
      )}
    </OwnerShell>
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
      setError(describeError(err));
      setApproving(false);
      setConfirming(false);
    }
  }

  return (
    <article className="grid gap-4 py-6 lg:grid-cols-12 lg:items-start lg:gap-6">
      <div className="lg:col-span-3">
        <p className="apparatus text-xs text-soot-soft lg:hidden">Referans kodu</p>
        <p className="font-display numerals text-3xl leading-none tracking-wide text-wine">
          {paymentReference ?? "—"}
        </p>
        <p className="mt-2 break-all font-body text-sm text-soot-soft">/{inv.slug}</p>
      </div>

      <div className="min-w-0 lg:col-span-5">
        <h2 className="font-display text-2xl leading-tight text-soot">
          <CoupleNames names={`${inv.brideName} & ${inv.groomName}`} />
        </h2>
        <p className="apparatus mt-1 text-sm text-soot">{formatDateLine(inv.weddingDate)}</p>
        <p className="mt-2 font-body text-base text-soot-soft">
          {owner.firstName} {owner.lastName} · <span className="break-all">{owner.email}</span>
        </p>
        <p className="font-body text-sm text-soot-soft">
          Oluşturulma: {DATE_TIME.format(new Date(inv.createdAtUtc))}
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
        {!confirming ? (
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <Link href={`/davetiye/${inv.slug}`} className={`apparatus text-sm ${TEXT_LINK}`}>
              Davetiyeye bak
            </Link>
            <button type="button" onClick={() => setConfirming(true)} className={BUTTON_PRIMARY_SM}>
              Ödemeyi Onayla
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 bg-paper-deep p-4 lg:max-w-xs">
            <p className="font-body text-base text-soot">
              Bu referansla ödeme geldiğinden emin misiniz? Davetiye hemen yayına alınır.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleApprove}
                disabled={approving}
                className={BUTTON_PRIMARY_SM}
              >
                {approving ? "Onaylanıyor…" : "Evet, onayla"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={approving}
                className={`apparatus text-sm ${TEXT_LINK}`}
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="font-body text-base text-wine">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
