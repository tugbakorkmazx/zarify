"use client";

import Link from "next/link";
import { templates } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { Reveal } from "./Reveal";

export function TemplateGalleryTeaser() {
  const { t } = useI18n();
  const l = t.landing.templateTeaser;

  return (
    <section className="paper-ground relative overflow-hidden px-5 py-24 sm:px-10 sm:py-36">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="apparatus text-sm text-wine">{l.eyebrow}</p>
        <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-[-0.015em] text-soot">
          {l.heading}
        </h2>
        <DoubleRule className="mx-auto mt-6 max-w-[10rem] text-soot" />
        <p className="mx-auto mt-6 max-w-[44ch] font-body text-lg leading-relaxed text-soot-soft">
          {l.body}
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-3xl gap-8">
        {templates.map((template, i) => (
          <Reveal key={template.slug} delay={i * 90}>
            <TemplateCard template={template} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/sablonlar"
          className="apparatus text-sm text-soot underline decoration-olive-soft underline-offset-[6px] transition-colors hover:text-wine hover:decoration-wine"
        >
          {l.linkAll}
        </Link>
      </div>
    </section>
  );
}
