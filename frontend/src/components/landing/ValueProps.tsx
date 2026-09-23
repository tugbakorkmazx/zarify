"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

// A single-column manifest list with numbered dividers, not a 3-up card
// grid — its own rhythm, distinct from the step list above and the
// template grid below it on the page.
export function ValueProps() {
  const { t } = useI18n();
  const l = t.landing.valueProps;

  return (
    <section className="paper-ground px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep">
            {l.eyebrow}
          </p>
        </Reveal>
        <div className="mt-8 flex flex-col">
          {l.items.map((value, i) => (
            <Reveal key={value.title} delay={i * 90}>
              <div className="flex flex-col gap-2 py-7 border-t border-gold/30 last:border-b sm:flex-row sm:items-baseline sm:gap-10">
                <span className="font-display text-sm text-gold-deep sm:w-8 sm:shrink-0">
                  {value.index}
                </span>
                <h3 className="font-display text-xl text-ink sm:w-56 sm:shrink-0">
                  {value.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-ink-soft max-w-md">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
