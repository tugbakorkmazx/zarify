"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateLine } from "@/lib/formatDateLine";
import { CoverMiniature } from "@/components/art/CoverMiniature";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { BUTTON_PRIMARY_SM, BUTTON_SECONDARY_SM, TEXT_LINK } from "@/lib/ui";
import { paymentApprovalNote } from "@/lib/legal";
import { describeError } from "@/lib/apiErrors";
import { CancelOrderDialog } from "@/components/payment/CancelOrderDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RejectionNotice } from "@/components/payment/RejectionNotice";
import {
  cancelInvitation,
  deleteRsvp,
  downloadRsvpsCsv,
  getInvitationRsvps,
  setRsvpDeadline,
  type InvitationDto,
  type MyInvitation,
  type RsvpAttendance,
  type RsvpDto,
} from "@/lib/invitations";

const DAY = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeZone: "Europe/Istanbul" });

/** "yyyy-mm-dd" for today in Türkiye — the earliest deadline worth setting. */
function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
}

const ATTENDANCE_LABEL: Record<RsvpAttendance, string> = {
  yes: "Geliyor",
  maybe: "Belirsiz",
  no: "Gelmiyor",
};

/** One RSVP figure: its label over a large wine numeral, centred in a
 * column divided from its neighbours by a hairline rule. */
function Tally({
  label,
  primary,
  secondary,
  first = false,
}: {
  label: string;
  primary: number;
  secondary: string;
  first?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 px-3 text-center sm:px-6 ${first ? "" : "border-l border-soot/20"}`}>
      <span className="apparatus text-sm text-soot-soft">{label}</span>
      <span className="font-display numerals text-4xl leading-none text-wine sm:text-5xl">{primary}</span>
      <span className="font-body text-sm text-soot-soft">{secondary}</span>
    </div>
  );
}

/** One invitation on the owner's dashboard: its details, share link, RSVP
 * tallies, and the guest replies behind them (loaded on demand, since most
 * visits only need the numbers). An order that isn't published yet can be
 * cancelled from here; a published one can't. */
export function InvitationCard({
  item,
  token,
  onCancelled,
}: {
  item: MyInvitation;
  token: string;
  onCancelled: () => void;
}) {
  // Kept locally so deleting a reply or moving the deadline updates the
  // card without reloading the whole dashboard.
  const [inv, setInv] = useState<InvitationDto>(item.invitation);
  const [rsvp, setRsvp] = useState(item.rsvp);
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<RsvpDto[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<RsvpDto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [csvBusy, setCsvBusy] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  async function handleDeleteReply() {
    if (!toDelete) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteRsvp(token, inv.id, toDelete.id);
      const gone = toDelete;
      setReplies((current) => current?.filter((r) => r.id !== gone.id) ?? null);
      setRsvp((s) => ({
        ...s,
        attendingResponses: s.attendingResponses - (gone.attendance === "yes" ? 1 : 0),
        attendingGuests: s.attendingGuests - (gone.attendance === "yes" ? gone.guestCount : 0),
        maybeResponses: s.maybeResponses - (gone.attendance === "maybe" ? 1 : 0),
        maybeGuests: s.maybeGuests - (gone.attendance === "maybe" ? gone.guestCount : 0),
        notAttendingResponses: s.notAttendingResponses - (gone.attendance === "no" ? 1 : 0),
      }));
      setToDelete(null);
    } catch (err) {
      setDeleteError(describeError(err));
    } finally {
      setDeleting(false);
    }
  }

  async function handleCsv() {
    setCsvError(null);
    setCsvBusy(true);
    try {
      await downloadRsvpsCsv(token, inv.id, inv.slug);
    } catch (err) {
      setCsvError(describeError(err));
    } finally {
      setCsvBusy(false);
    }
  }

  async function handleCancel() {
    setCancelError(null);
    setCancelling(true);
    try {
      await cancelInvitation(token, inv.id);
      setCancelOpen(false);
      onCancelled();
    } catch (err) {
      setCancelError(describeError(err));
      setCancelling(false);
    }
  }

  const totalResponses = rsvp.attendingResponses + rsvp.maybeResponses + rsvp.notAttendingResponses;
  const isLive = inv.status === "published";
  const isRemoved = inv.status === "removed";
  // Not paid yet — what the payment button and order cancellation are for.
  const isPending = !isLive && !isRemoved;

  async function toggleReplies() {
    const next = !open;
    setOpen(next);
    if (next && replies === null) {
      setLoadError(false);
      try {
        setReplies(await getInvitationRsvps(token, inv.id));
      } catch {
        setLoadError(true);
      }
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/davetiye/${inv.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the "Görüntüle" link still leads to the page
    }
  }

  const names = `${inv.brideName} & ${inv.groomName}`;

  return (
    <article className="flex flex-col items-center text-center">
      {/* The couple's cover, in miniature. */}
      <Link
        href={`/davetiye/${inv.slug}`}
        aria-label={`${names} davetiyesini aç`}
        className="group block w-full max-w-md"
      >
        <CoverMiniature names={names} sizes="28rem" className="aspect-[16/10]" />
      </Link>

      <div className="mt-8 w-full min-w-0">
        <div className="flex flex-col items-center gap-6">
          <div className="min-w-0">
            <p className="apparatus flex items-center justify-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 ${isLive ? "bg-olive" : isRemoved ? "bg-soot" : "bg-wine"}`}
              />
              <span className={isLive ? "text-olive" : isRemoved ? "text-soot" : "text-wine"}>
                {isLive ? "Yayında" : isRemoved ? "Yayından kaldırıldı" : "Ödeme bekleniyor"}
              </span>
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-soot sm:text-4xl">
              <CoupleNames names={names} />
            </h2>
            <p className="apparatus mt-2 text-sm text-soot">{formatDateLine(inv.weddingDate)}</p>
            <p className="apparatus truncate text-sm text-soot-soft">{inv.venueName}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {/* While payment is pending, paying is the one thing to do next —
                it gets the primary button; previewing drops to secondary. */}
            {isPending && (
              <Link href={`/davetiyem/${inv.slug}`} className={BUTTON_PRIMARY_SM}>
                Ödeme Bilgileri
              </Link>
            )}
            <Link
              href={`/davetiye/${inv.slug}`}
              className={isLive ? BUTTON_PRIMARY_SM : BUTTON_SECONDARY_SM}
            >
              {isLive ? "Görüntüle" : "Önizle"}
            </Link>
            <Link href={`/davetiyelerim/${inv.id}/duzenle`} className={BUTTON_SECONDARY_SM}>
              Düzenle
            </Link>
            {/* Only before publishing — a live invitation's link is already out. */}
            {isPending && (
              <button
                type="button"
                onClick={() => {
                  setCancelError(null);
                  setCancelOpen(true);
                }}
                className={BUTTON_SECONDARY_SM}
              >
                Siparişi İptal Et
              </button>
            )}
            {/* The share link only works for guests once the invitation is live. */}
            {isLive && (
              <button type="button" onClick={handleCopy} className={BUTTON_SECONDARY_SM}>
                {copied ? "Kopyalandı" : "Linki Kopyala"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          {isRemoved ? (
            <div className="mx-auto max-w-2xl border-l-2 border-wine/60 bg-paper-deep px-5 py-4 text-left">
              <p className="font-body text-lg leading-relaxed text-soot">
                Davetiyeniz Kullanım Şartları&apos;na uygun olmadığı değerlendirilen içerik nedeniyle yayından
                kaldırıldı; misafirleriniz şu anda göremiyor. Yanıtlarınız silinmedi.
              </p>
              {inv.removalNote && (
                <p className="mt-2 font-body text-base text-soot">
                  <span className="apparatus text-xs text-soot-soft">Gerekçe</span>
                  <br />
                  {inv.removalNote}
                </p>
              )}
            </div>
          ) : !isLive && inv.paymentRejectionNote ? (
            <div className="mx-auto max-w-2xl">
              <RejectionNotice invitation={inv} />
            </div>
          ) : !isLive ? (
            <p className="mx-auto max-w-2xl bg-paper-deep px-5 py-4 font-body text-lg leading-relaxed text-soot">
              Davetiyeniz hazır. Ödemeniz onaylanınca yayına alınır ve linkiniz misafirlerinize
              açılır — IBAN ve referans kodu için <strong className="font-semibold">Ödeme Bilgileri</strong>&apos;ne tıklayın.
              {" "}{paymentApprovalNote.tr}
            </p>
          ) : !inv.rsvpEnabled ? (
            <p className="font-body text-lg italic text-soot-soft">
              Bu davetiyede katılım bildirimi kapalı.
            </p>
          ) : (
            <>
              <RsvpDeadlineControl invitation={inv} token={token} onChanged={setInv} />

              <div className="mx-auto mt-6 grid max-w-xl grid-cols-3">
                <Tally
                  first
                  label="Geliyor"
                  primary={rsvp.attendingGuests}
                  secondary={`kişi · ${rsvp.attendingResponses} yanıt`}
                />
                <Tally
                  label="Belirsiz"
                  primary={rsvp.maybeGuests}
                  secondary={`kişi · ${rsvp.maybeResponses} yanıt`}
                />
                <Tally
                  label="Gelmiyor"
                  primary={rsvp.notAttendingResponses}
                  secondary="yanıt"
                />
              </div>

              {rsvp.duplicateNameResponses > 0 && (
                <p className="mx-auto mt-6 max-w-xl bg-paper-deep px-5 py-3 font-body text-base text-soot">
                  {rsvp.duplicateNameResponses} yanıt başka bir yanıtla aynı ismi taşıyor — aynı kişi farklı
                  cihazdan yanıtlamış olabilir. Yanıtlarda işaretli olanları kontrol edin.
                </p>
              )}

              {totalResponses === 0 ? (
                <p className="mt-6 font-body text-lg text-soot-soft">
                  Henüz yanıt yok. Linki paylaştıkça yanıtlar burada görünecek.
                </p>
              ) : (
                <div className="mt-6">
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <button
                      type="button"
                      onClick={toggleReplies}
                      aria-expanded={open}
                      className={`apparatus min-h-11 text-sm ${TEXT_LINK}`}
                    >
                      {open ? "Yanıtları gizle" : `Yanıtları göster (${totalResponses})`}
                    </button>
                    <button
                      type="button"
                      onClick={handleCsv}
                      disabled={csvBusy}
                      className={`apparatus min-h-11 text-sm ${TEXT_LINK} disabled:opacity-60`}
                    >
                      {csvBusy ? "Hazırlanıyor…" : "Yanıtları indir (CSV)"}
                    </button>
                  </div>
                  {csvError && (
                    <p role="alert" className="mt-2 font-body text-base text-wine">
                      {csvError}
                    </p>
                  )}

                  {open && (
                    <div className="mx-auto mt-4 max-w-xl text-left">
                      {loadError ? (
                        <p role="alert" className="font-body text-base text-wine">
                          Yanıtlar yüklenemedi. Lütfen tekrar deneyin.
                        </p>
                      ) : replies === null ? (
                        <p className="font-body text-base text-soot-soft" role="status">
                          Yükleniyor…
                        </p>
                      ) : (
                        <ul className="divide-y divide-soot/15 border-y border-soot/25">
                          {replies.map((r) => (
                            <li key={r.id} className="flex flex-col gap-1 py-3">
                              <div className="flex items-baseline justify-between gap-3">
                                <span className="min-w-0 font-body text-lg text-soot">
                                  <span className="break-words">{r.guestName}</span>
                                  {r.duplicateName && (
                                    <span className="apparatus ml-2 inline-block bg-wine/10 px-1.5 text-xs text-wine">
                                      aynı isimde birden fazla yanıt
                                    </span>
                                  )}
                                </span>
                                <span className="apparatus shrink-0 text-sm text-soot-soft">
                                  <span
                                    className={
                                      r.attendance === "yes"
                                        ? "text-olive"
                                        : r.attendance === "no"
                                          ? "text-wine"
                                          : ""
                                    }
                                  >
                                    {ATTENDANCE_LABEL[r.attendance]}
                                  </span>
                                  {r.attendance !== "no" && ` · ${r.guestCount} kişi`}
                                  {r.updatedAtUtc && " · güncellendi"}
                                </span>
                              </div>
                              {r.message && (
                                <p className="break-words font-body text-base italic text-soot-soft">
                                  “{r.message}”
                                </p>
                              )}
                              <p className="text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteError(null);
                                    setToDelete(r);
                                  }}
                                  className={`apparatus text-xs ${TEXT_LINK}`}
                                >
                                  Yanıtı sil
                                </button>
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="mt-8">
        <Link href={`/davetiyelerim/${inv.id}/sozlesme`} className={`apparatus text-sm ${TEXT_LINK}`}>
          Sözleşmemi görüntüle
        </Link>
      </p>

      <ConfirmDialog
        open={toDelete !== null}
        busy={deleting}
        title="Yanıtı sil"
        confirmLabel="Evet, sil"
        busyLabel="Siliniyor…"
        error={deleteError}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDeleteReply}
      >
        <strong className="font-semibold text-soot">{toDelete?.guestName}</strong> adlı misafirin yanıtı kalıcı
        olarak silinecek ve sayılardan düşülecek. Bu işlem geri alınamaz.
      </ConfirmDialog>

      {isPending && (
        <CancelOrderDialog
          open={cancelOpen}
          busy={cancelling}
          names={names}
          error={cancelError}
          onCancel={() => setCancelOpen(false)}
          onConfirm={handleCancel}
        />
      )}
    </article>
  );
}

/** "Katılım bildirimi 1 Haziran'a kadar açık" plus a small form to move the
 * deadline (never past the wedding day — the API refuses that too). */
function RsvpDeadlineControl({
  invitation,
  token,
  onChanged,
}: {
  invitation: InvitationDto;
  token: string;
  onChanged: (invitation: InvitationDto) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(invitation.rsvpDeadline ?? invitation.weddingDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(() => Date.now());
  const closed = new Date(invitation.rsvpClosesAtUtc).getTime() <= now;
  // After the wedding there's nothing left to extend (the deadline can't
  // pass the wedding day).
  const weddingOver = invitation.weddingDate < todayIso();
  const lastDay = DAY.format(new Date(new Date(invitation.rsvpClosesAtUtc).getTime() - 1));

  async function save() {
    setError(null);
    setBusy(true);
    try {
      onChanged(await setRsvpDeadline(token, invitation.id, value || null));
      setEditing(false);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className={`font-body text-base ${closed ? "text-wine" : "text-soot-soft"}`}>
        {closed
          ? `Katılım bildirimi süresi doldu (${lastDay}).`
          : `Katılım bildirimi ${lastDay} gününün sonuna kadar açık.`}{" "}
        {!editing && !weddingOver && (
          <button type="button" onClick={() => setEditing(true)} className={`apparatus text-sm ${TEXT_LINK}`}>
            {closed ? "Süreyi uzat" : "Son tarihi değiştir"}
          </button>
        )}
      </p>
      {editing && (
        <form
          className="mt-3 flex flex-wrap items-end justify-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <label className="flex flex-col gap-1 text-left">
            <span className="apparatus text-xs text-soot-soft">Son tarih</span>
            <input
              type="date"
              required
              value={value}
              min={todayIso()}
              max={invitation.weddingDate}
              onChange={(e) => setValue(e.target.value)}
              className="border-b border-soot-soft/60 bg-transparent py-1 font-body text-lg text-soot outline-none focus:border-wine"
            />
          </label>
          <button type="submit" disabled={busy} className={BUTTON_PRIMARY_SM}>
            {busy ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button type="button" onClick={() => setEditing(false)} disabled={busy} className={`apparatus text-sm ${TEXT_LINK}`}>
            Vazgeç
          </button>
        </form>
      )}
      {editing && (
        <p className="mt-2 font-body text-sm text-soot-soft">En geç düğün günü olabilir.</p>
      )}
      {error && (
        <p role="alert" className="mt-2 font-body text-base text-wine">
          {error}
        </p>
      )}
    </div>
  );
}
