"use client";

import Link from "next/link";
import { templates } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";

export function TemplateGalleryBody() {
  const { t } = useI18n();
  const l = t.landing.gallery;

  return (
    <main className="paper-ground min-h-svh px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/"
            className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
          >
            {l.back}
          </Link>
          <LanguageToggle />
        </div>

        <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mt-10 mb-3">
          {l.eyebrow}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink max-w-xl">
          {l.heading}
        </h1>
        <p className="font-body text-base text-ink-soft mt-4 max-w-lg">{l.body}</p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
      </div>
    </main>
  );
}
