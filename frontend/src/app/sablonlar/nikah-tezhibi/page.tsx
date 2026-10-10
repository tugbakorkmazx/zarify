"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HerbaryumTemplate } from "@/components/templates/HerbaryumTemplate";
import { useAuth, ApiError } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useInvitationDraft } from "@/lib/invitationDraft";
import { createInvitation } from "@/lib/invitations";
import { formatDateLine } from "@/lib/formatDateLine";
import { venueMapUrl } from "@/lib/mapUrl";
import { contentFromValues, toApiFields } from "@/lib/invitationForm";
import { describeError } from "@/lib/apiErrors";
import { legalSettings } from "@/lib/legal";
import { PublishConfirmDialog } from "@/components/payment/PublishConfirmDialog";
import { EnvelopeIntro } from "@/components/invitation/EnvelopeIntro";

// Fallback placeholder content for the "Herbaryum" template — used when
// no invitation-details draft exists yet (e.g. someone browsing the gallery
// before signing up). Once a draft exists, it fills every field below.
const PLACEHOLDER_EVENT_DATE = new Date("2027-06-12T16:00:00+03:00");
const PLACEHOLDER_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Bo%C4%9Fazi%C3%A7i+Yal%C4%B1s%C4%B1+%C3%9Csk%C3%BCdar";

export default function HerbaryumPreviewPage() {
  const { user, token, logout, ready } = useAuth();
  const { draft, clearDraft } = useInvitationDraft();
  const { lang } = useI18n();
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // The envelope guests see first — shown here too so the owner can watch
  // it before publishing. Mounted only once running in the browser (it
  // reads sessionStorage and the reduced-motion setting; `ready` is false
  // during server rendering); bumping the key replays it.
  const [envelopeKey, setEnvelopeKey] = useState(0);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const eventDate =
    draft && draft.weddingDate && draft.weddingTime
      ? new Date(`${draft.weddingDate}T${draft.weddingTime}:00+03:00`)
      : PLACEHOLDER_EVENT_DATE;

  const names = draft ? `${draft.brideName} & ${draft.groomName}` : undefined;
  const dateLine = draft?.weddingDate ? formatDateLine(draft.weddingDate, lang) : undefined;
  const venueLine = draft ? `${draft.venueName}, ${draft.venueAddress}` : undefined;
  const rsvpEnabled = draft?.rsvpEnabled ?? true;
  // No draft → gallery showcase with the template's sample content; with a
  // draft, only what the couple actually filled in (see HerbaryumTemplate).
  const content = draft ? contentFromValues(draft) : undefined;

  // The draft is only ever staged locally up to this point — this is where
  // the form + chosen template actually become a real, shareable invitation.
  // Runs only from the confirmation dialog, after the owner has accepted
  // the pre-contract information and the distance sales contract.
  async function handlePublish(contractHtml: string) {
    if (!draft || !token) return;
    setPublishError(null);
    setSessionExpired(false);
    setPublishing(true);
    try {
      const invitation = await createInvitation(token, {
        templateSlug: "nikah-tezhibi",
        ...toApiFields(draft),
        acceptDistanceSales: true,
        distanceSalesVersion: legalSettings.version,
        contractHtml,
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
        setPublishError(describeError(err));
      }
      setConfirmOpen(false);
      setPublishing(false);
    }
  }

  const template = (
    <HerbaryumTemplate
      eventDate={eventDate}
      names={names}
      dateLine={dateLine}
      venueLine={venueLine}
      venueName={draft?.venueName}
      venueAddress={draft?.venueAddress}
      mapUrl={draft ? venueMapUrl(draft.venueName, draft.venueAddress) : PLACEHOLDER_MAP_URL}
      content={content}
      rsvpEnabled={rsvpEnabled}
    />
  );

  const editCta = draft
    ? { href: "/davetiye-bilgileri", label: "Bilgileri Düzenle" }
    : user
      ? { href: "/davetiye-bilgileri", label: "Bilgilerini Gir" }
      : { href: "/kayit", label: "Bu Şablonla Başla" };

  return (
    <main>
      <div className="bg-soot text-paper px-5 py-3 flex flex-wrap items-center justify-between gap-3 sm:px-10">
        <Link
          href="/sablonlar"
          className="apparatus text-sm text-paper/80 transition-colors hover:text-paper"
        >
          ← Şablonlar
        </Link>
        <span className="apparatus text-sm text-olive-pale">
          {draft ? "Davetiyeniz — Herbaryum" : "Şablon Önizlemesi — Herbaryum"}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0 });
              setEnvelopeKey((k) => k + 1);
            }}
            className="apparatus text-sm text-paper/80 underline decoration-paper/40 underline-offset-4 transition-colors hover:text-paper"
          >
            Zarf açılışını izle
          </button>
          <Link
            href={editCta.href}
            className="apparatus text-sm text-paper border border-paper/50 px-4 py-1.5 transition-[background-color,color,border-color,transform] duration-150 hover:border-paper hover:bg-paper hover:text-soot active:scale-[0.97]"
          >
            {editCta.label}
          </Link>
          {draft && user && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={publishing}
              className="apparatus text-sm text-paper bg-wine px-4 py-1.5 transition-[background-color,transform] duration-150 hover:bg-wine-deep active:scale-[0.97] disabled:opacity-60"
            >
              {publishing ? "Yayınlanıyor…" : "Davetiyemi Yayınla"}
            </button>
          )}
        </div>
      </div>

      {publishError && (
        <div
          role="alert"
          className="bg-paper-deep border-b border-wine/40 px-6 py-3 flex flex-wrap items-center justify-center gap-3 text-center"
        >
          <p className="font-body text-base text-wine">{publishError}</p>
          {sessionExpired && (
            <Link
              href="/giris?next=/sablonlar/nikah-tezhibi"
              className="apparatus text-sm text-soot underline decoration-olive-soft underline-offset-4 hover:text-wine hover:decoration-wine"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      )}

      <PublishConfirmDialog
        open={confirmOpen}
        busy={publishing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handlePublish}
      />

      {ready ? (
        <EnvelopeIntro key={envelopeKey} invitationId="onizleme" names={names ?? "Elif & Kerem"} remember={false}>
          {template}
        </EnvelopeIntro>
      ) : (
        template
      )}
    </main>
  );
}
