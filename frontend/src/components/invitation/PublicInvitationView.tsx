"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HerbaryumTemplate } from "@/components/templates/HerbaryumTemplate";
import { EnvelopeIntro } from "@/components/invitation/EnvelopeIntro";
import { useAuth } from "@/lib/auth";
import { getInvitationBySlug, type InvitationDto } from "@/lib/invitations";
import { formatDateLine } from "@/lib/formatDateLine";
import { contentFromInvitation } from "@/lib/invitationForm";
import { venueMapUrl } from "@/lib/mapUrl";

type Status = "loading" | "found" | "not-found" | "removed" | "error";

const MESSAGES: Record<"not-found" | "removed" | "error", { title: string; body: string }> = {
  "not-found": {
    title: "Bu davetiyeyi bulamadık.",
    body: "Link yanlış yazılmış ya da davetiye kaldırılmış olabilir.",
  },
  removed: {
    title: "Bu davetiye yayında değil.",
    body: "Bu davetiye şu anda görüntülenemiyor. Davet eden kişiyle iletişime geçebilirsiniz.",
  },
  error: {
    title: "Davetiye şu anda yüklenemedi.",
    body: "Bir sorun oluştu. Lütfen biraz sonra tekrar deneyin.",
  },
};

/** The public, guest-facing invitation a shared link opens — no account,
 * no login, just the couple's actual saved details fetched by slug. This is
 * the real counterpart to the local-draft preview under
 * /sablonlar/[template]. Rendered by app/davetiye/[slug]/page.tsx, which
 * adds the share-preview metadata on the server.
 *
 * Guests only ever see a Published invitation. If the owner opens their own
 * link while the payment is still pending (or after an admin took it
 * offline), their session token lets them see it as a preview (banner on
 * top, RSVP form in preview mode). An admin gets the same preview with a
 * banner of their own — the owner's payment page isn't theirs to open. */
export function PublicInvitationView({ slug }: { slug: string }) {
  const { ready, token, user } = useAuth();
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
        <p className="font-body text-lg text-soot-soft" role="status">Davetiye yükleniyor…</p>
      </main>
    );
  }

  if (status !== "found") {
    const message = MESSAGES[status];
    return (
      <main className="paper-ground min-h-svh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-3xl text-soot">{message.title}</p>
        <p className="max-w-sm font-body text-lg text-soot-soft">{message.body}</p>
        <Link
          href="/"
          className="apparatus text-sm text-soot underline decoration-olive-soft underline-offset-4 hover:text-wine hover:decoration-wine"
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
  const isAdmin = user?.role === "admin";

  const page = (
    <main>
      {!isLive && (
        <div
          role="status"
          className="bg-paper-deep border-b border-wine/40 px-6 py-3 flex flex-wrap items-center justify-center gap-3 text-center"
        >
          <p className="font-body text-base text-wine">
            {isAdmin
              ? inv.status === "removed"
                ? "Yönetici önizlemesi — bu davetiye yayından kaldırıldı, misafirler göremiyor."
                : "Yönetici önizlemesi — bu davetiye henüz misafirlere açık değil."
              : inv.status === "removed"
                ? "Önizleme — bu davetiye yayından kaldırıldı; misafirleriniz şu anda göremiyor."
                : "Önizleme — bu davetiye ödemeniz onaylandığında misafirlerinize açılacak."}
          </p>
          <Link
            href={isAdmin ? `/yonetim?sekme=davetiyeler&id=${inv.id}` : `/davetiyem/${inv.slug}`}
            className="apparatus text-sm text-soot underline decoration-olive-soft underline-offset-4 hover:text-wine hover:decoration-wine"
          >
            {isAdmin ? "Yönetim paneli" : inv.status === "removed" ? "Ayrıntılar" : "Ödeme bilgileri"}
          </Link>
        </div>
      )}
      <HerbaryumTemplate
        eventDate={eventDate}
        names={names}
        dateLine={formatDateLine(inv.weddingDate)}
        venueLine={`${inv.venueName}, ${inv.venueAddress}`}
        venueName={inv.venueName}
        venueAddress={inv.venueAddress}
        mapUrl={venueMapUrl(inv.venueName, inv.venueAddress)}
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
