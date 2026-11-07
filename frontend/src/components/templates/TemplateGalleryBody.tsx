"use client";

import Link from "next/link";
import { eventCategories } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { SectionHeading } from "@/components/art/SectionHeading";
import { useInvitationDraft } from "@/lib/invitationDraft";
import { CategoryIllustration } from "@/components/templates/CategoryIllustration";

export function TemplateGalleryBody() {
  const { t } = useI18n();
  const l = t.landing.gallery;
  const { draft, saveDraft } = useInvitationDraft();

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
        <p className="mx-auto mt-6 max-w-[52ch] text-center font-body text-xl leading-relaxed text-soot-soft">
          {l.body}
        </p>

        <nav
          aria-label="Davet kategorileri"
          className="mx-auto mt-12 max-w-5xl"
        >
          <p className="mb-5 text-center font-body text-xs uppercase tracking-[0.2em] text-soot-soft">
            Davet türünüzü seçin
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {eventCategories.map((category, index) => {
              return (
                <Link
                  key={category.slug}
                  href={`/sablonlar/kategori/${category.slug}`}
                  onClick={() => {
                    if (draft) saveDraft({ ...draft, eventType: category.slug });
                  }}
                  className="group relative flex min-h-28 flex-col items-start justify-between rounded-xl border border-soot/15 bg-white/50 px-4 py-4 text-left text-soot transition-all duration-200 hover:border-wine/70 hover:bg-white/80 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine sm:min-h-32 sm:px-5 sm:py-5"                >
                  <span className="font-body text-xs tracking-[0.16em] text-soot-soft/70">{String(index + 1).padStart(2, "0")}</span>
                  <div className="mt-3 flex w-full items-end justify-between gap-2">
                    <span className="font-display text-lg leading-snug sm:text-xl">
                      {category.name}
                    </span>
                    <CategoryIllustration
                      category={category.slug}
                      className="h-12 w-12 shrink-0 text-wine/75 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
                    />
                  </div>
                  <span aria-hidden="true" className="absolute right-4 top-4 text-base text-wine/50 transition-transform group-hover:translate-x-0.5">↗</span>
                </Link>
              );
            })}
          </div>
        </nav>


      </div>
    </main>
  );
}
