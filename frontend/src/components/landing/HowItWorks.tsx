"use client";

import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { Framed } from "@/components/art/Framed";
import { SectionHeading } from "@/components/art/SectionHeading";
import { Reveal } from "./Reveal";

/** How it works, on ivory paper: the swan close-up in a gilded frame
 * centred on top, one line of script under it, then the heading and the
 * four steps as equal centred columns. */
export function HowItWorks() {
  const { t } = useI18n();
  const l = t.landing.howItWorks;

  return (
    <section className="paper-ground px-5 py-24 sm:px-10 sm:py-32">
      <Reveal className="flex flex-col items-center">
        <Framed
          shape="rect"
          painting={art.swanCloseup}
          focus="45% 45%"
          sizes="(min-width: 640px) 16rem, 56vw"
          className="w-[min(56vw,13rem)] sm:w-64"
        />
        <p className="mt-6 mb-12 font-script text-4xl leading-tight text-wine sm:text-5xl">{l.motto}</p>
        <SectionHeading eyebrow={l.eyebrow}>{l.heading}</SectionHeading>
      </Reveal>

      <ol className="mx-auto mt-16 grid max-w-6xl gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {l.steps.map((step, i) => (
          <Reveal key={step.numeral} delay={i * 90}>
            <li className="flex flex-col items-center gap-3 text-center">
              <span className="font-display text-5xl leading-none text-wine sm:text-6xl">{step.numeral}</span>
              <span aria-hidden="true" className="h-px w-10 bg-soot/40" />
              <h3 className="font-display text-2xl leading-tight text-soot">{step.title}</h3>
              <p className="max-w-[30ch] font-body text-lg leading-relaxed text-soot-soft">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
