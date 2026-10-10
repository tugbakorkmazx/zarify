"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { BUTTON_PRIMARY_SM, TEXT_LINK } from "@/lib/ui";
import { approvePayment, getCancelledOrders, getPendingPayments, rejectPayment, type AdminInvitation } from "@/lib/admin";
import type { SalesAgreement } from "@/lib/invitations";
import { formatPrice } from "@/lib/pricing";
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
  const [cancelledOrders, setCancelledOrders] = useState<SalesAgreement[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/giris");
      return;
    }
    let cancelled = false;
    Promise.all([getPendingPayments(token), getCancelledOrders(token)])
      .then(([pending, cancelledList]) => {
        if (cancelled) return;
        setItems(pending);
        setCancelledOrders(cancelledList);
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

      {status === "ready" && (
        <section aria-labelledby="cancelled-orders" className="mt-16 text-center">
          <h2 id="cancelled-orders" className="font-display text-3xl leading-tight text-soot">
            İptal Edilen Siparişler
          </h2>
          <p className="mx-auto mt-2 max-w-[52ch] font-body text-base italic text-soot-soft">
            Sahibi tarafından yayından önce iptal edilen siparişler. Davetiye silinmiştir; sözleşme kaydı
            saklanır. Bu referansla havale geldiyse iade edin.
          </p>
          {cancelledOrders.length === 0 ? (
            <p className="mt-6 bg-paper-deep px-6 py-6 font-body text-lg text-soot-soft">
              İptal edilen sipariş yok.
            </p>
          ) : (
            <ul className="mx-auto mt-6 max-w-3xl divide-y divide-soot/20 border-y border-soot">
              {cancelledOrders.map((order) => (
                <li key={order.id} className="flex flex-col items-center gap-1 py-5">
                  <p className="font-display numerals text-2xl leading-none text-wine">
                    {order.paymentReference ?? "—"}
                    <span className="ml-3 font-body text-lg text-soot">{formatPrice(order.amountTry, "tr")}</span>
                  </p>
                  <p className="font-body text-lg text-soot">
                    <CoupleNames names={order.coupleNames} />
                  </p>
                  <p className="font-body text-base text-soot-soft">
                    {order.userFirstName} {order.userLastName} ·{" "}
                    <span className="break-all">{order.userEmail}</span>
                  </p>
                  <p className="font-body text-sm text-soot-soft">
                    Sipariş: {DATE_TIME.format(new Date(order.acceptedAtUtc))} · İptal:{" "}
                    {order.cancelledAtUtc ? DATE_TIME.format(new Date(order.cancelledAtUtc)) : "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
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
  const { invitation: initial, owner, paymentReference } = item;
  // Replaced by the API's answer after a rejection, so the note shows here.
  const [inv, setInv] = useState(initial);
  const [mode, setMode] = useState<"idle" | "approve" | "reject">("idle");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const confirming = mode === "approve";
  const setConfirming = (on: boolean) => setMode(on ? "approve" : "idle");

  async function handleReject() {
    setError(null);
    setRejecting(true);
    try {
      setInv(await rejectPayment(token, inv.id, note));
      setNote("");
      setMode("idle");
    } catch (err) {
      setError(describeError(err));
    } finally {
      setRejecting(false);
    }
  }

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
        {item.amountTry != null && (
          <p className="mt-2 font-body text-lg text-soot">{formatPrice(item.amountTry, "tr")}</p>
        )}
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
        {inv.paymentRejectionNote && (
          <p className="mt-2 border-l-2 border-wine/60 pl-3 font-body text-sm text-soot">
            <span className="apparatus text-xs text-wine">
              Reddedildi{inv.paymentRejectedAtUtc && ` · ${DATE_TIME.format(new Date(inv.paymentRejectedAtUtc))}`}
            </span>
            <br />
            {inv.paymentRejectionNote}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
        {mode === "reject" ? (
          <form
            className="flex w-full flex-col gap-3 bg-paper-deep p-4 lg:max-w-xs"
            onSubmit={(event) => {
              event.preventDefault();
              handleReject();
            }}
          >
            <label className="flex flex-col gap-1">
              <span className="apparatus text-sm text-soot-soft">Çifte gidecek not</span>
              <textarea
                required
                maxLength={500}
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ör. Havale açıklamasında referans kodu yoktu."
                className="border border-soot-soft/60 bg-transparent p-2 font-body text-base text-soot outline-none focus:border-wine"
              />
            </label>
            <p className="font-body text-sm text-soot-soft">
              Sipariş silinmez, ödeme bekliyor olarak kalır; not e-postayla gönderilir.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={rejecting || note.trim() === ""} className={BUTTON_PRIMARY_SM}>
                {rejecting ? "Gönderiliyor…" : "Reddet ve bildir"}
              </button>
              <button
                type="button"
                onClick={() => setMode("idle")}
                disabled={rejecting}
                className={`apparatus text-sm ${TEXT_LINK}`}
              >
                Vazgeç
              </button>
            </div>
          </form>
        ) : !confirming ? (
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <Link href={`/davetiye/${inv.slug}`} className={`apparatus text-sm ${TEXT_LINK}`}>
              Davetiyeye bak
            </Link>
            <button type="button" onClick={() => setMode("reject")} className={`apparatus text-sm ${TEXT_LINK}`}>
              Reddet
            </button>
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
