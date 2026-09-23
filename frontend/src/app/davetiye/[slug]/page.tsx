"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NikahTezhibiTemplate } from "@/components/templates/NikahTezhibiTemplate";
import { EnvelopeIntro } from "@/components/invitation/EnvelopeIntro";
import { getInvitationBySlug, type InvitationDto } from "@/lib/invitations";
import { formatDateLine } from "@/lib/formatDateLine";
import { contentFromInvitation } from "@/lib/invitationForm";

type Status = "loading" | "found" | "not-found" | "error";

/** The public, guest-facing page a shared invitation link opens — no
 * account, no login, just the couple's actual saved details fetched by
 * slug. This is the real counterpart to the local-draft preview under
 * /sablonlar/[template]. */
export default function PublicInvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationDto | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    getInvitationBySlug(slug)
      .then((result) => {
        if (cancelled) return;
        setInvitation(result);
        setStatus(result ? "found" : "not-found");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <main className="paper-ground min-h-svh flex items-center justify-center px-6">
        <p className="font-body text-sm text-ink-soft">Davetiye yükleniyor…</p>
      </main>
    );
  }

  if (status === "not-found" || status === "error") {
    return (
      <main className="paper-ground min-h-svh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-ink">
          {status === "not-found" ? "Bu davetiyeyi bulamadık." : "Davetiye yüklenemedi."}
        </p>
        <p className="font-body text-sm text-ink-soft max-w-sm">
          {status === "not-found"
            ? "Link yanlış yazılmış ya da davetiye kaldırılmış olabilir."
            : "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin."}
        </p>
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

  return (
    <EnvelopeIntro invitationId={inv.slug} names={names}>
      <main>
        <NikahTezhibiTemplate
          eventDate={eventDate}
          names={names}
          dateLine={formatDateLine(inv.weddingDate)}
          venueLine={`${inv.venueName}, ${inv.venueAddress}`}
          venueName={inv.venueName}
          venueAddress={inv.venueAddress}
          content={contentFromInvitation(inv)}
          rsvpEnabled={inv.rsvpEnabled}
          invitationSlug={inv.slug}
        />
      </main>
    </EnvelopeIntro>
  );
}
