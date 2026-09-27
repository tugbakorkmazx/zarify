"use client";

import Link from "next/link";
import { templates } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { SectionHeading } from "@/components/art/SectionHeading";

export function TemplateGalleryBody() {
  const { t } = useI18n();
  const l = t.landing.gallery;

  return (
    <main className="paper-ground min-h-svh px-5 pt-5 pb-24 sm:px-10 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="apparatus text-sm text-soot-soft transition-colors hover:text-wine"
          >
            {l.back}
          </Link>
          <LanguageToggle />
        </div>
        <DoubleRule className="mt-4 text-soot" />
        

        <SectionHeading as="h1" eyebrow={l.eyebrow} className="mt-16">
          {l.heading}
        </SectionHeading>
        <p className="mx-auto mt-6 max-w-[52ch] text-center font-body text-xl leading-relaxed text-soot-soft">{l.body}</p>

        <div className="mx-auto mt-16 grid max-w-3xl gap-8">
          {templates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      </div>
    </main>
  );
}
