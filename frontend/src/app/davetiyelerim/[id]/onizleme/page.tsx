"use client";

import { useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import { HerbaryumTemplate } from "@/components/templates/HerbaryumTemplate";
import { readPreview } from "@/lib/editPreview";
import { contentFromValues, withFormDefaults, type InvitationFormValues } from "@/lib/invitationForm";
import { formatDateLine } from "@/lib/formatDateLine";
import { venueMapUrl } from "@/lib/mapUrl";
import { useI18n } from "@/lib/i18n";

function subscribeNever() {
  return () => {};
}

function parse(raw: string | null): InvitationFormValues | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? withFormDefaults(parsed) : null;
  } catch {
    return null;
  }
}

/** The edit page's "Önizle" tab: the invitation with the form's current,
 * unsaved values (handed over in localStorage), as guests would see it
 * after saving. Nothing here touches the server; the RSVP form runs in
 * preview mode. */
export default function EditPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useI18n();
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  // A string snapshot (stable between renders); null on the server.
  const raw = useSyncExternalStore(subscribeNever, () => readPreview(id), () => null);

  if (!hydrated) return null;
  const values = parse(raw);
  if (!values) {
    return (
      <main className="paper-ground flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-3xl text-soot">Önizlenecek değişiklik bulunamadı.</p>
        <p className="max-w-sm font-body text-lg text-soot-soft">
          Düzenleme sayfasındaki &ldquo;Önizle&rdquo; düğmesiyle tekrar açın.
        </p>
      </main>
    );
  }

  const names = `${values.brideName} & ${values.groomName}`;
  return (
    <main>
      <div role="status" className="border-b border-wine/40 bg-paper-deep px-6 py-3 text-center">
        <p className="font-body text-base text-wine">
          Önizleme — bu değişiklikler henüz kaydedilmedi. Yayındaki davetiyeye geçmesi için düzenleme sayfasında
          &ldquo;Değişiklikleri Kaydet&rdquo;e basın.
        </p>
      </div>
      <HerbaryumTemplate
        eventDate={new Date(`${values.weddingDate}T${values.weddingTime || "00:00"}:00+03:00`)}
        names={names}
        dateLine={values.weddingDate ? formatDateLine(values.weddingDate, lang) : undefined}
        venueLine={`${values.venueName}, ${values.venueAddress}`}
        venueName={values.venueName}
        venueAddress={values.venueAddress}
        mapUrl={venueMapUrl(values.venueName, values.venueAddress)}
        content={contentFromValues(values)}
        rsvpEnabled={values.rsvpEnabled}
      />
    </main>
  );
}
