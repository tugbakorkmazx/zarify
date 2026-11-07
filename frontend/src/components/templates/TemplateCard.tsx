"use client";

import Link from "next/link";
import type { TemplateSummary } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { CoverMiniature } from "@/components/art/CoverMiniature";

/** A template's card doubles as its own preview: the real cover in
 * miniature — swan lake and lace card — with the name and description
 * centred under it. */
export function TemplateCard({ template }: { template: TemplateSummary }) {
  const { t } = useI18n();
  const l = t.landing.templateTeaser;

  return (
    <Link
      href={template.slug === "hikaye-kitabi" ? "/sablonlar/hikaye-kitabi" : `/sablonlar/${template.slug}`}
      className="group paper-card block bg-paper transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-[0.99]"
    >
      {template.slug === "hikaye-kitabi" ? (
        <div className="flex aspect-[16/10] items-center justify-center bg-[#c5c2a8]">
          <div className="flex aspect-[3/4] h-[75%] flex-col items-center justify-center border-[5px] border-[#35442f] bg-[#526248] font-serif text-[#e3d1a9] shadow-xl">
            <span className="text-3xl">❦</span>
            <span className="mt-3 text-center text-xl">Hikâye<br />Kitabı</span>
          </div>
        </div>
      ) : (
        <CoverMiniature
          names={t.landing.hero.mockupNames}
          sizes="(min-width: 768px) 48rem, 100vw"
          className="aspect-[16/10]"
        />
      )}
      <div className="flex flex-col items-center gap-3 px-6 py-8 text-center sm:px-10">
        <h3 className="font-display text-3xl leading-tight text-soot sm:text-4xl">{template.name}</h3>
        <p className="max-w-[46ch] font-body text-lg leading-relaxed text-soot-soft">{template.description}</p>
        <span className="apparatus mt-2 inline-flex items-center gap-2 text-sm text-wine">
          {l.liveLabel}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
