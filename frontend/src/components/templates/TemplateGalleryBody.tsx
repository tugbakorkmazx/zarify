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
          className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-2"
        >
          {eventCategories.map((category) => {
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
                className={`rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                  isSelected
                    ? "border-wine bg-wine text-white"
                    : "border-soot/20 bg-white/50 text-soot-soft hover:border-wine hover:text-wine"
                }`}
              >
                {category.name}
              </button>
            );
          })}
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
