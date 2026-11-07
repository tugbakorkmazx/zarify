"use client";

import Link from "next/link";
import { eventCategories } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { SectionHeading } from "@/components/art/SectionHeading";
import { useInvitationDraft } from "@/lib/invitationDraft";
import { BotanicalCategoryArt } from "@/components/templates/BotanicalCategoryArt";

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
          <div className="grid grid-cols-1 gap-x-7 gap-y-5 sm:grid-cols-2">
            {eventCategories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/sablonlar/kategori/${category.slug}`}
                onClick={() => {
                  if (draft) saveDraft({ ...draft, eventType: category.slug });
                }}
                className="group relative flex min-h-44 items-center overflow-hidden border border-[#C9BEAB]/65 bg-[#F7F3EB]/65 text-soot transition-colors duration-300 hover:border-[#947B70] hover:bg-[#F8F4EE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine sm:min-h-48"
              >
                <div className="relative flex h-44 w-[42%] shrink-0 items-center justify-center overflow-hidden bg-[#EAE6DA]/45 px-4 sm:h-48">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#C5BBA9]/30" />
                  <div className="h-36 w-36 max-w-full opacity-90 transition-transform duration-500 group-hover:scale-[1.04]">
                    <BotanicalCategoryArt category={category.slug} />
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start px-4 py-5 sm:px-6">
                  <span className="font-body text-[10px] tracking-[0.22em] text-[#9A8B7C]">
                    ZARIFY · {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-4 font-display text-2xl leading-snug text-[#51313B] sm:text-[27px]">
                    {category.name}
                  </span>
                  <span className="mt-4 h-px w-9 bg-[#B6A58E] transition-all duration-300 group-hover:w-14" />
                  <span className="mt-3 font-body text-xs tracking-[0.06em] text-[#8E8175]">
                    Şablonları keşfet <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </nav>


      </div>
    </main>
  );
}
