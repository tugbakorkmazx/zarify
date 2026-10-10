import type { FormEvent } from "react";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { ToggleField } from "@/components/forms/ToggleField";
import { ScheduleEditor } from "./ScheduleEditor";
import type { InvitationFormValues } from "@/lib/invitationForm";
import { BUTTON_PRIMARY, TEXT_LINK } from "@/lib/ui";
import { business } from "@/lib/legal";

function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="border-t border-soot pt-6">
      <h2 className="font-display text-2xl leading-tight text-soot">{title}</h2>
      {note && <p className="mt-1 font-body text-base italic text-soot-soft">{note}</p>}
    </div>
  );
}

/** The invitation form body shared by the create flow and the edit page —
 * the same fields, validation and wording either way; only what happens on
 * submit differs. */
export function InvitationFields({
  values,
  onChange,
  onSubmit,
  submitLabel,
  submitting = false,
  error,
  namesLocked = false,
}: {
  values: InvitationFormValues;
  onChange: (values: InvitationFormValues) => void;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  error?: string | null;
  /** The invitation is paid for: the couple's names are fixed (only an
   * admin corrects a typo), every other field stays editable. */
  namesLocked?: boolean;
}) {
  const set = <K extends keyof InvitationFormValues>(key: K, value: InvitationFormValues[K]) =>
    onChange({ ...values, [key]: value });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Gelin Adı"
            type="text"
            required
            maxLength={100}
            readOnly={namesLocked}
            aria-describedby={namesLocked ? "names-locked-note" : undefined}
            value={values.brideName}
            onChange={(e) => set("brideName", e.target.value)}
          />
          <FormField
            label="Damat Adı"
            type="text"
            required
            maxLength={100}
            readOnly={namesLocked}
            aria-describedby={namesLocked ? "names-locked-note" : undefined}
            value={values.groomName}
            onChange={(e) => set("groomName", e.target.value)}
          />
        </div>
        {namesLocked && (
          <p id="names-locked-note" className="font-body text-sm italic text-soot-soft">
            Yayındaki davetiyede çift adları değiştirilemez. Yazım hatası mı?{" "}
            {business.email ? (
              <a href={`mailto:${business.email}`} className={`not-italic ${TEXT_LINK}`}>
                Bize ulaşın
              </a>
            ) : (
              "Bize ulaşın"
            )}
            , düzeltelim.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Düğün Tarihi"
          type="date"
          required
          value={values.weddingDate}
          onChange={(e) => set("weddingDate", e.target.value)}
        />
        <FormField
          label="Saat"
          type="time"
          required
          value={values.weddingTime}
          onChange={(e) => set("weddingTime", e.target.value)}
        />
      </div>

      <FormField
        label="Mekan Adı"
        type="text"
        required
        maxLength={150}
        value={values.venueName}
        onChange={(e) => set("venueName", e.target.value)}
      />
      <FormField
        label="Adres / Konum"
        type="text"
        required
        maxLength={300}
        value={values.venueAddress}
        onChange={(e) => set("venueAddress", e.target.value)}
      />

      <SectionHeading
        title="İsteğe Bağlı Bölümler"
        note="Boş bıraktığınız her bölüm davetiyede hiç görünmez."
      />

      <TextAreaField
        label="Hikayemiz"
        rows={4}
        maxLength={2000}
        placeholder="Nasıl tanıştınız, bu güne nasıl geldiniz?"
        value={values.storyText}
        onChange={(e) => set("storyText", e.target.value)}
      />

      <ScheduleEditor rows={values.schedule} onChange={(rows) => set("schedule", rows)} />

      <TextAreaField
        label="Kıyafet Kodu"
        maxLength={1000}
        placeholder="Örn. Şık, koyu tonlar tercih edilir."
        value={values.dressCode}
        onChange={(e) => set("dressCode", e.target.value)}
      />
      <TextAreaField
        label="Hediye"
        maxLength={1000}
        placeholder="Örn. Varlığınız en büyük hediyemiz."
        value={values.giftNote}
        onChange={(e) => set("giftNote", e.target.value)}
      />
      <TextAreaField
        label="Konaklama"
        maxLength={1000}
        placeholder="Şehir dışından gelecek misafirler için öneriler"
        value={values.accommodationNote}
        onChange={(e) => set("accommodationNote", e.target.value)}
      />

      <SectionHeading title="Katılım Bildirimi" />

      <ToggleField
        legend="Katılım Bildirimi (RSVP) Açık Olsun mu?"
        name="rsvpEnabled"
        value={values.rsvpEnabled}
        onChange={(v) => set("rsvpEnabled", v)}
      />
      {values.rsvpEnabled && (
        <FormField
          label="Son Bildirim Tarihi"
          hint="İsteğe bağlı. Boş bırakırsanız davetiyede tarih yazmaz."
          type="date"
          max={values.weddingDate || undefined}
          value={values.rsvpDeadline}
          onChange={(e) => set("rsvpDeadline", e.target.value)}
        />
      )}

      {error && <FormError message={error} />}

      <button
        type="submit"
        disabled={submitting}
        className={`mt-4 w-full ${BUTTON_PRIMARY}`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
