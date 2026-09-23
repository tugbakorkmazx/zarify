"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NikahTezhibiTemplate } from "@/components/templates/NikahTezhibiTemplate";
import { EnvelopeIntro } from "@/components/invitation/EnvelopeIntro";
import { useAuth } from "@/lib/auth";
import { getInvitationBySlug, type InvitationDto } from "@/lib/invitations";
import { formatDateLine } from "@/lib/formatDateLine";
import { contentFromInvitation } from "@/lib/invitationForm";

type Status = "loading" | "found" | "not-found" | "not-published" | "error";

const MESSAGES: Record<"not-found" | "not-published" | "error", { title: string; body: string }> = {
  "not-found": {
    title: "Bu davetiyeyi bulamadık.",
    body: "Link yanlış yazılmış ya da davetiye kaldırılmış olabilir.",
  },
  "not-published": {
    title: "Bu davetiye henüz yayında değil.",
    body: "Davetiye sahibi yayına aldığında bu link çalışmaya başlayacak. Lütfen daha sonra tekrar deneyin.",
  },
  error: {
    title: "Davetiye yüklenemedi.",
    body: "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.",
  },
};

/** The public, guest-facing page a shared invitation link opens — no
 * account, no login, just the couple's actual saved details fetched by
 * slug. This is the real counterpart to the local-draft preview under
 * /sablonlar/[template].
 *
 * Guests only ever see a Published invitation. If the owner opens their own
 * link while the payment is still pending, their session token lets them
 * see it as a preview (banner on top, RSVP form in preview mode). */
export default function PublicInvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { ready, token } = useAuth();
  const [invitation, setInvitation] = useState<InvitationDto | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    // Wait for the stored session to be read, so an owner's token goes
    // along with the first request instead of racing it.
    if (!ready) return;
    let cancelled = false;
    getInvitationBySlug(slug, token)
      .then((result) => {
        if (cancelled) return;
        if (result.kind === "found") {
          setInvitation(result.invitation);
          setStatus("found");
        } else {
          setStatus(result.kind);
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug, ready, token]);

  if (status === "loading") {
    return (
      <main className="paper-ground min-h-svh flex items-center justify-center px-6">
        <p className="font-body text-sm text-ink-soft">Davetiye yükleniyor…</p>
      </main>
    );
  }

  if (status !== "found") {
    const message = MESSAGES[status];
    return (
      <main className="paper-ground min-h-svh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-ink">{message.title}</p>
        <p className="font-body text-sm text-ink-soft max-w-sm">{message.body}</p>
        <Link
          href="/"
          className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          ← Zarify anasayfasına dön
        </Link>
      </main>
    );
  }

  const inv = invitation as InvitationDto;
  const eventDate = new Date(`${inv.weddingDate}T${inv.weddingTime}+03:00`);
  const names = `${inv.brideName} & ${inv.groomName}`;
  const isLive = inv.status === "published";

  const page = (
    <main>
      {!isLive && (
        <div
          role="status"
          className="paper-ground-deep border-b border-gold/40 px-6 py-3 flex flex-wrap items-center justify-center gap-3 text-center"
        >
          <p className="font-body text-sm text-ink">
            Önizleme — bu davetiye ödemeniz onaylandığında misafirlerinize açılacak.
          </p>
          <Link
            href={`/davetiyem/${inv.slug}`}
            className="font-body text-sm text-ink underline decoration-gold-deep/60 underline-offset-4 hover:decoration-gold-deep"
          >
            Ödeme bilgileri
          </Link>
        </div>
      )}
      <NikahTezhibiTemplate
        eventDate={eventDate}
        names={names}
        dateLine={formatDateLine(inv.weddingDate)}
        venueLine={`${inv.venueName}, ${inv.venueAddress}`}
        venueName={inv.venueName}
        venueAddress={inv.venueAddress}
        content={contentFromInvitation(inv)}
        rsvpEnabled={inv.rsvpEnabled}
        // Not live yet → the RSVP form runs in preview mode (nothing saved).
        invitationSlug={isLive ? inv.slug : undefined}
      />
    </main>
  );

  // The envelope ceremony is for guests; an owner previewing a pending
  // invitation goes straight to the page.
  return isLive ? (
    <EnvelopeIntro invitationId={inv.slug} names={names}>
      {page}
    </EnvelopeIntro>
  ) : (
    page
  );
}
