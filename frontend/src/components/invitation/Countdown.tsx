"use client";

import { useI18n } from "@/lib/i18n";
import { useCountdown } from "@/lib/useCountdown";
import { FlipUnit } from "./FlipUnit";

export function Countdown({ target }: { target: Date }) {
  const { t, lang } = useI18n();
  const shown = useCountdown(target);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-body text-xs sm:text-sm tracking-[0.25em] uppercase text-ink-soft">
        {t.countdown.heading}
      </p>
      <div className="flex items-start gap-3 sm:gap-4">
        <FlipUnit value={shown.days} label={t.countdown.days} />
        <FlipUnit value={shown.hours} label={t.countdown.hours} />
        <FlipUnit value={shown.minutes} label={t.countdown.minutes} />
        <FlipUnit value={shown.seconds} label={t.countdown.seconds} />
      </div>
      <p className="sr-only" role="status" lang={lang}>
        {`${shown.days} ${t.countdown.days} ${shown.hours} ${t.countdown.hours} ${shown.minutes} ${t.countdown.minutes}`}
      </p>
    </div>
  );
}
