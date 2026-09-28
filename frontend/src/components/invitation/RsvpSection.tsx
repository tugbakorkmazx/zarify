"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SectionHeading } from "@/components/art/SectionHeading";
import { BUTTON_PRIMARY } from "@/lib/ui";
import { coupleInitials } from "@/lib/coupleInitials";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";

type Attendance = "yes" | "maybe" | "no";

/** enabled is owner-configurable: a couple can turn RSVP collection off for
 * their invitation, in which case this section renders a closing note
 * instead of a form.
 *
 * On the wine band, centred: the heading and intro, then the form inside an
 * ivory paper card. */
export function RsvpSection({
  enabled = true,
  names,
  invitationSlug,
  deadline,
}: {
  enabled?: boolean;
  /** The published invitation replies are saved against. Absent on the
   * draft preview, where submitting just shows the thank-you state so the
   * couple can see the flow without writing anything. */
  invitationSlug?: string;
  /** Draft couple names, if any — used for the submit button / closing
   * signature so they match the hero instead of the template's static
   * placeholder monogram. */
  names?: string;
  /** "2027-05-01" — mentioned in the intro only when the couple set one. */
  deadline?: string | null;
}) {
  const { t, lang } = useI18n();
  const deadlineLine = deadline
    ? t.rsvp.deadline.replace(
        "{date}",
        new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(`${deadline}T00:00:00`)),
      )
    : null;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const signature = names ? coupleInitials(names) : t.footer.signature;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    if (!invitationSlug) {
      setSubmitted(true);
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": lang },
        body: JSON.stringify({
          invitationSlug,
          name: data.get("name"),
          attendance,
          guests: attendance === "no" ? 1 : Number(data.get("guests")) || 1,
          message: data.get("message") || null,
        }),
      });
      if (!res.ok) {
        // The API explains rejections it expects a guest to hit (too many
        // attempts, RSVP closed) in its own message — show that rather
        // than the generic "couldn't reach the server".
        let message = res.status === 429 ? t.rsvp.rateLimited : t.rsvp.submitError;
        try {
          const body = await res.json();
          if (typeof body?.message === "string") message = body.message;
        } catch {
          // not JSON — keep the generic message
        }
        setError(message);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(t.rsvp.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass = "apparatus text-sm text-soot-soft";
  const lineInput =
    "border-b border-soot-soft/60 bg-transparent py-2 font-body text-lg text-soot outline-none transition-[border-color,box-shadow] focus:border-wine focus:shadow-[0_1px_0_var(--color-wine)]";

  return (
    <section className="wine-band px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <SectionHeading tone="light">{t.rsvp.heading}</SectionHeading>
        <p className="mt-8 max-w-[40ch] text-center font-body text-xl italic leading-snug text-paper/90">
          {t.rsvp.intro}
        </p>
        {deadlineLine && (
          <p className="apparatus mt-3 text-center text-sm text-wine-pale">{deadlineLine}</p>
        )}

        <div className="mt-12 w-full max-w-xl">
          <div className="paper-card paper-ground p-2">
            <div className="border border-soot/30 p-6 sm:p-10">
              {!enabled ? (
                <p className="font-body text-lg leading-relaxed text-soot">
                  {t.rsvp.disabledNote}
                </p>
              ) : submitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center" role="status">
                  <p className="font-display text-3xl text-soot">{t.footer.closing}</p>
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-wine font-display text-lg text-paper shadow-[0_2px_6px_rgba(31,28,23,0.4)]">
                    {signature}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {!invitationSlug && (
                    <p className="font-body text-sm italic text-soot-soft">
                      {t.rsvp.previewNote}
                    </p>
                  )}

                  <label className="flex flex-col gap-1">
                    <span className={labelClass}>{t.rsvp.nameLabel}</span>
                    <input required type="text" name="name" autoComplete="name" className={lineInput} />
                  </label>

                  <fieldset className="flex flex-col gap-3">
                    <legend className={`${labelClass} mb-3`}>{t.rsvp.attendingLabel}</legend>
                    {(
                      [
                        ["yes", t.rsvp.attendingYes],
                        ["maybe", t.rsvp.attendingMaybe],
                        ["no", t.rsvp.attendingNo],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className="flex cursor-pointer items-center gap-3 font-body text-lg text-soot"
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={value}
                          checked={attendance === value}
                          onChange={() => setAttendance(value)}
                          className="h-4 w-4 accent-wine"
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>

                  {attendance !== "no" && (
                    <label className="flex flex-col gap-1">
                      <span className={labelClass}>{t.rsvp.guestsLabel}</span>
                      <input
                        type="number"
                        name="guests"
                        min={1}
                        max={20}
                        defaultValue={1}
                        className={`${lineInput} numerals w-24`}
                      />
                    </label>
                  )}

                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>{t.rsvp.messageLabel}</span>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={t.rsvp.messagePlaceholder}
                      className="resize-none border border-soot-soft/60 bg-transparent p-3 font-body text-lg text-soot placeholder:text-soot-soft/70 outline-none transition-colors focus:border-wine"
                    />
                  </label>

                  {error && (
                    <p
                      role="alert"
                      className="border border-wine/60 px-4 py-3 font-body text-base text-wine"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col-reverse items-center gap-6 text-center">
                    <p className="max-w-[40ch] font-body text-sm text-soot-soft">
                      {t.rsvp.privacyNote}{" "}
                      <Link
                        href="/gizlilik"
                        className="underline decoration-olive-soft underline-offset-4 hover:text-wine hover:decoration-wine"
                      >
                        {t.rsvp.privacyLink}
                      </Link>
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-busy={submitting}
                      className={`${BUTTON_PRIMARY} min-w-[12rem]`}
                    >
                      {t.rsvp.submit}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
