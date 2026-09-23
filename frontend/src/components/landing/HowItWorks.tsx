"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

// Deliberately asymmetric — a sticky intro column beside a stacked step
// list, echoing the hero's own two-thirds/one-third split, rather than the
// evenly-weighted grid a generic "how it works" section defaults to.
export function HowItWorks() {
  const { t } = useI18n();
  const l = t.landing.howItWorks;

  return (
    <section className="paper-ground-deep px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <Reveal>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">
            {l.eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink lg:sticky lg:top-24">
            {l.heading}
          </h2>
        </Reveal>

        <div className="flex flex-col">
          {l.steps.map((step, i) => (
            <Reveal key={step.numeral} delay={i * 90}>
              <div className="flex items-baseline gap-6 py-6 border-t border-gold/40 last:border-b">
                <span className="font-display text-2xl text-gold-deep w-8 shrink-0">
                  {step.numeral}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-lg text-ink">{step.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
