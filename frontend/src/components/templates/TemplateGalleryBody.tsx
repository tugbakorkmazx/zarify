"use client";

import { useState } from "react";
import Link from "next/link";
import { eventCategories, templates } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { SectionHeading } from "@/components/art/SectionHeading";
import { useInvitationDraft } from "@/lib/invitationDraft";

export function TemplateGalleryBody() {
  const { t } = useI18n();
  const l = t.landing.gallery;
  const { draft, saveDraft } = useInvitationDraft();
  const [categoryOverride, setCategoryOverride] = useState<string | null>(null);
  const selectedCategory = categoryOverride ?? draft?.eventType ?? "dugun";
  const visibleTemplates = templates.filter(
    (template) => template.categorySlug === selectedCategory,
  );
  const selectedCategoryName =
    eventCategories.find((category) => category.slug === selectedCategory)?.name ??
    "Davet";

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
              const isSelected = selectedCategory === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => {
                    setCategoryOverride(category.slug);
                    if (draft) saveDraft({ ...draft, eventType: category.slug });
                  }}
                  aria-pressed={isSelected}
                  className={`group relative flex min-h-28 flex-col items-start justify-between rounded-xl border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine sm:min-h-32 sm:px-5 sm:py-5 ${
                    isSelected
                      ? "border-wine bg-wine text-white shadow-md"
                      : "border-soot/15 bg-white/50 text-soot hover:border-wine/70 hover:bg-white/80 hover:shadow-sm"
                  }`}
                >
                  <span className={`font-body text-xs tracking-[0.16em] ${
                    isSelected ? "text-white/70" : "text-soot-soft/70"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-4 pr-4 font-display text-lg leading-snug sm:text-xl">
                    {category.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute right-4 top-4 text-base transition-transform group-hover:translate-x-0.5 ${
                      isSelected ? "text-white" : "text-wine/50"
                    }`}
                  >
                    {isSelected ? "✓" : "↗"}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mx-auto mt-12 grid max-w-3xl gap-8">
          {visibleTemplates.length > 0 ? (
            visibleTemplates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))
          ) : (
            <div className="rounded-2xl border border-soot/15 bg-white/40 px-6 py-12 text-center">
              <p className="font-display text-2xl text-soot">
                {selectedCategoryName}
              </p>
              <p className="mx-auto mt-3 max-w-md font-body text-base leading-relaxed text-soot-soft">
                Bu kategori için şablonlarımız hazırlanıyor. Yeni tasarımlar
                eklendiğinde burada görünecek.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
