"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NikahTezhibiTemplate } from "@/components/templates/NikahTezhibiTemplate";
import { useAuth, ApiError } from "@/lib/auth";
import { useInvitationDraft } from "@/lib/invitationDraft";
import { createInvitation } from "@/lib/invitations";
import { formatDateLine } from "@/lib/formatDateLine";
import { contentFromValues, toApiFields } from "@/lib/invitationForm";

// Fallback placeholder content for the "Nikâh Tezhibi" template — used when
// no invitation-details draft exists yet (e.g. someone browsing the gallery
// before signing up). Once a draft exists, it fills every field below.
const PLACEHOLDER_EVENT_DATE = new Date("2026-06-14T16:00:00+03:00");
const PLACEHOLDER_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Bo%C4%9Fazi%C3%A7i+Yal%C4%B1s%C4%B1+%C3%9Csk%C3%BCdar";

export default function NikahTezhibiPreviewPage() {
  const { user, token, logout } = useAuth();
  const { draft, clearDraft } = useInvitationDraft();
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const eventDate =
    draft && draft.weddingDate && draft.weddingTime
      ? new Date(`${draft.weddingDate}T${draft.weddingTime}:00+03:00`)
      : PLACEHOLDER_EVENT_DATE;

  const names = draft ? `${draft.brideName} & ${draft.groomName}` : undefined;
  const dateLine = draft?.weddingDate ? formatDateLine(draft.weddingDate) : undefined;
  const venueLine = draft ? `${draft.venueName}, ${draft.venueAddress}` : undefined;
  const rsvpEnabled = draft?.rsvpEnabled ?? true;
  // No draft → gallery showcase with the template's sample content; with a
  // draft, only what the couple actually filled in (see NikahTezhibiTemplate).
  const content = draft ? contentFromValues(draft) : undefined;

  // The draft is only ever staged locally up to this point — this is where
  // the form + chosen template actually become a real, shareable invitation.
  async function handlePublish() {
    if (!draft || !token) return;
    setPublishError(null);
    setSessionExpired(false);
    setPublishing(true);
    try {
      const invitation = await createInvitation(token, {
        templateSlug: "nikah-tezhibi",
        ...toApiFields(draft),
      });
      clearDraft();
      router.push(`/davetiyem/${invitation.slug}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // The stored token no longer maps to a real account (expired, or
        // the account is gone) — clear it so the rest of the UI stops
        // claiming the visitor is signed in too.
        logout();
        setSessionExpired(true);
        setPublishError("Oturumunuz sona ermiş. Devam etmek için tekrar giriş yapın.");
      } else {
        setPublishError(
          err instanceof ApiError ? err.message : "Davetiye oluşturulamadı. Lütfen tekrar deneyin.",
        );
      }
      setPublishing(false);
    }
  }

  const editCta = draft
    ? { href: "/davetiye-bilgileri", label: "Bilgileri Düzenle" }
    : user
      ? { href: "/davetiye-bilgileri", label: "Bilgilerini Gir" }
      : { href: "/kayit", label: "Bu Şablonla Başla" };

  return (
    <main>
      <div className="paper-ground-deep px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-gold/30">
        <Link
          href="/sablonlar"
          className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
        >
          ← Şablonlar
        </Link>
        <span className="font-body text-xs tracking-[0.15em] uppercase text-gold-deep">
          {draft ? "Davetiyeniz — Nikâh Tezhibi" : "Şablon Önizlemesi — Nikâh Tezhibi"}
        </span>
        <div className="flex items-center gap-3">
          <Link
            href={editCta.href}
            className="font-body text-sm text-ink-soft border border-gold/50 rounded-full px-4 py-1.5 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
          >
            {editCta.label}
          </Link>
          {draft && user && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="font-body text-sm text-ink bg-gold-light rounded-full px-4 py-1.5 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97] disabled:opacity-60"
            >
              {publishing ? "Yayınlanıyor…" : "Davetiyemi Yayınla"}
            </button>
          )}
        </div>
      </div>

      {publishError && (
        <div
          role="alert"
          className="paper-ground-deep border-b border-gold/40 px-6 py-3 flex flex-wrap items-center justify-center gap-3 text-center"
        >
          <p className="font-body text-sm text-ink">{publishError}</p>
          {sessionExpired && (
            <Link
              href="/giris"
              className="font-body text-sm text-ink underline decoration-gold-deep/60 underline-offset-4 hover:decoration-gold-deep"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      )}

      <NikahTezhibiTemplate
        eventDate={eventDate}
        names={names}
        dateLine={dateLine}
        venueLine={venueLine}
        venueName={draft?.venueName}
        venueAddress={draft?.venueAddress}
        mapUrl={draft ? undefined : PLACEHOLDER_MAP_URL}
        content={content}
        rsvpEnabled={rsvpEnabled}
      />
    </main>
  );
}
