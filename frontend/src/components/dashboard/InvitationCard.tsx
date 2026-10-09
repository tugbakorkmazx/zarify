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
import {
  cancelInvitation,
  getInvitationRsvps,
  type MyInvitation,
  type RsvpAttendance,
  type RsvpDto,
} from "@/lib/invitations";

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
  const { invitation: inv, rsvp } = item;
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<RsvpDto[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

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
                className={`inline-block h-2 w-2 ${isLive ? "bg-olive" : "bg-wine"}`}
              />
              <span className={isLive ? "text-olive" : "text-wine"}>
                {isLive ? "Yayında" : "Ödeme bekleniyor"}
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
            {!isLive && (
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
            {!isLive && (
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
          {!isLive ? (
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
              <div className="mx-auto grid max-w-xl grid-cols-3">
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

              {totalResponses === 0 ? (
                <p className="mt-6 font-body text-lg text-soot-soft">
                  Henüz yanıt yok. Linki paylaştıkça yanıtlar burada görünecek.
                </p>
              ) : (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={toggleReplies}
                    aria-expanded={open}
                    className={`apparatus text-sm ${TEXT_LINK}`}
                  >
                    {open ? "Yanıtları gizle" : `Yanıtları göster (${totalResponses})`}
                  </button>

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
                                <span className="truncate font-body text-lg text-soot">{r.guestName}</span>
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
    </article>
  );
}
