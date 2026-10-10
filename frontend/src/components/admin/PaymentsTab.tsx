"use client";

import { useState } from "react";
import Link from "next/link";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { BUTTON_PRIMARY_SM, TEXT_LINK } from "@/lib/ui";
import { approvePayment, getPendingPayments, rejectPayment, type AdminInvitation } from "@/lib/admin";
import { formatPrice } from "@/lib/pricing";
import { formatDateLine } from "@/lib/formatDateLine";
import { describeError } from "@/lib/apiErrors";
import { ConfirmBox, EmptyNote, ErrorLine, LoadState, NoteForm, adminHref, formatMoment, useAdminData } from "./shared";

/** The payment queue: invitations whose bank transfer hasn't been
 * confirmed yet, oldest first. Approving one publishes it; rejecting keeps
 * it pending with a note to the couple. */
export function PaymentsTab({ token }: { token: string }) {
  const { status, data, setData, reload } = useAdminData("payments", getPendingPayments);

  if (status !== "ready" || !data) return <LoadState status={status} onRetry={reload} />;

  return (
    <>
      <p className="mb-8 text-center font-body text-lg italic text-soot-soft">
        {data.length > 0
          ? `${data.length} davetiye havale onayı bekliyor. Referans kodunu banka açıklamasıyla eşleştirip onaylayın.`
          : "Onay bekleyen havale yok."}
      </p>
      {data.length === 0 ? (
        <EmptyNote>Yeni bir davetiye yayınlandığında ödemesi burada onayınızı bekler.</EmptyNote>
      ) : (
        <ul className="mx-auto max-w-3xl divide-y divide-soot/20 border-y border-soot">
          {data.map((item) => (
            <li key={item.invitation.id}>
              <PendingRow
                item={item}
                token={token}
                onApproved={() => setData(data.filter((i) => i.invitation.id !== item.invitation.id))}
              />
            </li>
          ))}
        </ul>
      )}
    </>
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
  const [error, setError] = useState<string | null>(null);

  async function handleReject(note: string) {
    setError(null);
    setRejecting(true);
    try {
      setInv(await rejectPayment(token, inv.id, note));
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
      setMode("idle");
    }
  }

  return (
    <article className="flex flex-col items-center gap-4 py-8 text-center">
      <div>
        <p className="apparatus text-xs text-soot-soft">Referans kodu</p>
        <p className="mt-1 font-display numerals text-3xl leading-none tracking-wide text-wine">
          {paymentReference ?? "—"}
        </p>
        {item.amountTry != null && (
          <p className="mt-2 font-body text-lg text-soot">{formatPrice(item.amountTry, "tr")}</p>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-2xl leading-tight text-soot">
          <CoupleNames names={`${inv.brideName} & ${inv.groomName}`} />
        </h3>
        <p className="apparatus mt-1 text-sm text-soot">{formatDateLine(inv.weddingDate)}</p>
        <p className="mt-2 font-body text-base text-soot-soft">
          <Link href={adminHref("kullanicilar", owner.id)} className={TEXT_LINK}>
            {owner.firstName} {owner.lastName}
          </Link>{" "}
          · <span className="break-all">{owner.email}</span>
        </p>
        <p className="font-body text-sm text-soot-soft">
          Oluşturulma: {formatMoment(inv.createdAtUtc)} · <span className="break-all">/{inv.slug}</span>
        </p>
        {inv.paymentRejectionNote && (
          <p className="mx-auto mt-3 max-w-md border-l-2 border-wine/60 pl-3 text-left font-body text-sm text-soot">
            <span className="apparatus text-xs text-wine">
              Reddedildi{inv.paymentRejectedAtUtc && ` · ${formatMoment(inv.paymentRejectedAtUtc)}`}
            </span>
            <br />
            {inv.paymentRejectionNote}
          </p>
        )}
      </div>

      {mode === "reject" ? (
        <NoteForm
          label="Çifte gidecek not"
          placeholder="Ör. Havale açıklamasında referans kodu yoktu."
          hint="Sipariş silinmez, ödeme bekliyor olarak kalır; not e-postayla gönderilir."
          submitLabel="Reddet ve bildir"
          busyLabel="Gönderiliyor…"
          busy={rejecting}
          onSubmit={handleReject}
          onCancel={() => setMode("idle")}
        />
      ) : mode === "approve" ? (
        <ConfirmBox
          text="Bu referansla ödeme geldiğinden emin misiniz? Davetiye hemen yayına alınır."
          confirmLabel="Evet, onayla"
          busyLabel="Onaylanıyor…"
          busy={approving}
          onConfirm={handleApprove}
          onCancel={() => setMode("idle")}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link href={`/davetiye/${inv.slug}`} className={`apparatus min-h-11 content-center text-sm ${TEXT_LINK}`}>
            Davetiyeye bak
          </Link>
          <button type="button" onClick={() => setMode("reject")} className={`apparatus min-h-11 text-sm ${TEXT_LINK}`}>
            Reddet
          </button>
          <button type="button" onClick={() => setMode("approve")} className={BUTTON_PRIMARY_SM}>
            Ödemeyi Onayla
          </button>
        </div>
      )}
      <ErrorLine error={error} />
    </article>
  );
}
