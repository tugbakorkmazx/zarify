"use client";

import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { Framed } from "@/components/art/Framed";
import { SectionHeading } from "@/components/art/SectionHeading";
import { Reveal } from "./Reveal";

/** Why Zarify, on the dark olive band: a detail of the dark floral still
 * life in the gilded oval frame, centred on top, then the heading and the
 * three features as equal centred columns divided by hairlines. */
export function ValueProps() {
  const { t } = useI18n();
  const l = t.landing.valueProps;

  return (
    <section className="olive-band px-5 py-24 sm:px-10 sm:py-32">
      <Reveal className="flex flex-col items-center">
        <Framed
          shape="oval"
          painting={art.darkFlorals}
          focus="55% 45%"
          sizes="(min-width: 640px) 15rem, 50vw"
          className="mb-12 w-[min(50vw,12rem)] sm:w-60"
        />
        <SectionHeading tone="light">{l.eyebrow}</SectionHeading>
      </Reveal>
      <div className="mx-auto mt-16 grid max-w-5xl gap-y-12 md:grid-cols-3">
        {l.items.map((value, i) => (
          <Reveal key={value.title} delay={i * 90}>
            <div
              className={`flex flex-col items-center gap-3 text-center md:px-8 ${
                i === 0 ? "" : "md:border-l md:border-paper/20"
              }`}
            >
              <h3 className="font-display text-2xl leading-tight text-paper sm:text-3xl">{value.title}</h3>
              <p className="max-w-[34ch] font-body text-lg leading-relaxed text-paper/85">{value.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
