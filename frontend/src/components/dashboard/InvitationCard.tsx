"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateLine } from "@/lib/formatDateLine";
import {
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

function Tally({ label, primary, secondary }: { label: string; primary: number; secondary: string }) {
  return (
    <div className="flex flex-col items-center gap-1 border border-gold/40 rounded-sm px-3 py-4">
      <span className="font-body text-[11px] tracking-[0.18em] uppercase text-gold-deep">{label}</span>
      <span className="font-display text-3xl text-ink tabular-nums">{primary}</span>
      <span className="font-body text-xs text-ink-soft">{secondary}</span>
    </div>
  );
}

/** One published invitation on the owner's dashboard: its details, share
 * link, RSVP tallies, and the guest replies behind them (loaded on demand,
 * since most visits only need the numbers). */
export function InvitationCard({ item, token }: { item: MyInvitation; token: string }) {
  const { invitation: inv, rsvp } = item;
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<RsvpDto[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalResponses = rsvp.attendingResponses + rsvp.maybeResponses + rsvp.notAttendingResponses;

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

  return (
    <article className="border border-gold/50 bg-parchment/40 px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl text-ink">
            {inv.brideName} &amp; {inv.groomName}
          </h2>
          <p className="font-body text-sm text-ink-soft mt-1">{formatDateLine(inv.weddingDate)}</p>
          <p className="font-body text-sm text-ink-soft truncate">{inv.venueName}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/davetiye/${inv.slug}`}
            className="font-body text-xs text-ink bg-gold-light rounded-full px-4 py-2 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.97]"
          >
            Görüntüle
          </Link>
          <Link
            href={`/davetiyelerim/${inv.id}/duzenle`}
            className="font-body text-xs text-ink-soft border border-gold/50 rounded-full px-4 py-2 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
          >
            Düzenle
          </Link>
          <button
            type="button"
            onClick={handleCopy}
            className="font-body text-xs text-ink-soft border border-gold/50 rounded-full px-4 py-2 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
          >
            {copied ? "Kopyalandı" : "Linki Kopyala"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {!inv.rsvpEnabled ? (
          <p className="font-body text-sm italic text-ink-soft">
            Bu davetiyede katılım bildirimi kapalı.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Tally
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
              <p className="mt-4 font-body text-sm text-ink-soft text-center">
                Henüz yanıt yok. Linki paylaştıkça yanıtlar burada görünecek.
              </p>
            ) : (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={toggleReplies}
                  aria-expanded={open}
                  className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold hover:text-ink"
                >
                  {open ? "Yanıtları gizle" : `Yanıtları göster (${totalResponses})`}
                </button>

                {open && (
                  <div className="mt-4">
                    {loadError ? (
                      <p role="alert" className="font-body text-sm text-ink-soft">
                        Yanıtlar yüklenemedi. Lütfen tekrar deneyin.
                      </p>
                    ) : replies === null ? (
                      <p className="font-body text-sm text-ink-soft">Yükleniyor…</p>
                    ) : (
                      <ul className="divide-y divide-gold/30 border-t border-b border-gold/30">
                        {replies.map((r) => (
                          <li key={r.id} className="py-3 flex flex-col gap-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="font-body text-sm text-ink truncate">{r.guestName}</span>
                              <span className="shrink-0 font-body text-xs text-ink-soft">
                                {ATTENDANCE_LABEL[r.attendance]}
                                {r.attendance !== "no" && ` · ${r.guestCount} kişi`}
                                {r.updatedAtUtc && " · güncellendi"}
                              </span>
                            </div>
                            {r.message && (
                              <p className="font-body text-sm italic text-ink-soft break-words">
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
    </article>
  );
}
