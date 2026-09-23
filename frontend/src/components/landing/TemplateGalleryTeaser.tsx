"use client";

import Link from "next/link";
import { templates } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Reveal } from "./Reveal";

export function TemplateGalleryTeaser() {
  const { t } = useI18n();
  const l = t.landing.templateTeaser;

  return (
    <section className="paper-ground-deep px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">
              {l.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              {l.heading}
            </h2>
            <p className="font-body text-sm text-ink-soft mt-2 max-w-sm">
              {l.body}
            </p>
          </div>
          <Link
            href="/sablonlar"
            className="font-body text-sm text-ink-soft border-b border-gold/50 pb-0.5 transition-colors hover:border-gold hover:text-ink"
          >
            {l.linkAll}
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, i) => (
            <Reveal key={template.slug} delay={i * 90}>
              <TemplateCard template={template} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
