"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";
import { coupleInitials } from "@/lib/coupleInitials";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";

type Attendance = "yes" | "maybe" | "no";

/** enabled is owner-configurable: a couple can turn RSVP collection off for
 * their invitation, in which case this section renders a closing note
 * instead of a form.
 *
 * This is the page's one deep-ink beat: every other section sits on
 * parchment, so the moment that asks for an action gets the strongest
 * contrast turn on the page instead of blending into the rest of the scroll. */
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
        headers: { "Content-Type": "application/json" },
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
        let message = t.rsvp.submitError;
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

  return (
    <section className="ink-ground px-6 sm:px-16 lg:px-24 py-20 sm:py-28">
      <div className="mx-auto max-w-md flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-parchment">
          {t.rsvp.heading}
        </h2>
        <IlluminatedRule className="my-6" />

        {!enabled ? (
          <p className="font-body text-base text-parchment/85">
            {t.rsvp.disabledNote}
          </p>
        ) : submitted ? (
          <p className="font-body text-base text-parchment" role="status">
            {t.footer.closing}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full text-left flex flex-col gap-6">
            <p className="font-body text-sm text-parchment/80 text-center -mt-2">
              {t.rsvp.intro}
              {deadlineLine && ` ${deadlineLine}`}
            </p>
            {!invitationSlug && (
              <p className="font-body text-xs italic text-parchment/60 text-center -mt-3">
                {t.rsvp.previewNote}
              </p>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs tracking-[0.15em] uppercase text-gold-light">
                {t.rsvp.nameLabel}
              </span>
              <input
                required
                type="text"
                name="name"
                className="border-b border-gold/50 bg-transparent py-1.5 font-body text-parchment outline-none focus:border-gold-light"
              />
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className="font-body text-xs tracking-[0.15em] uppercase text-gold-light mb-1">
                {t.rsvp.attendingLabel}
              </legend>
              {(
                [
                  ["yes", t.rsvp.attendingYes],
                  ["maybe", t.rsvp.attendingMaybe],
                  ["no", t.rsvp.attendingNo],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 font-body text-parchment">
                  <input
                    type="radio"
                    name="attending"
                    value={value}
                    checked={attendance === value}
                    onChange={() => setAttendance(value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {attendance !== "no" && (
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-xs tracking-[0.15em] uppercase text-gold-light">
                  {t.rsvp.guestsLabel}
                </span>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  max={20}
                  defaultValue={1}
                  className="border-b border-gold/50 bg-transparent py-1.5 font-body text-parchment outline-none focus:border-gold-light w-24"
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-xs tracking-[0.15em] uppercase text-gold-light">
                {t.rsvp.messageLabel}
              </span>
              <textarea
                name="message"
                rows={3}
                placeholder={t.rsvp.messagePlaceholder}
                className="border border-gold/50 bg-transparent rounded-sm p-2.5 font-body text-parchment placeholder:text-parchment/40 outline-none focus:border-gold-light resize-none"
              />
            </label>

            {error && (
              <p
                role="alert"
                className="border border-gold/50 bg-ink px-4 py-3 font-body text-sm text-parchment text-center"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="self-center mt-2 h-16 w-16 rounded-full font-display text-sm text-ink bg-gold-light border border-gold-deep/50 shadow-[0_2px_6px_rgba(0,0,0,0.35)] hover:brightness-105 active:brightness-95 active:scale-[0.97] transition-[filter,transform] duration-150 disabled:opacity-60"
              aria-label={t.rsvp.submit}
            >
              {signature}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
