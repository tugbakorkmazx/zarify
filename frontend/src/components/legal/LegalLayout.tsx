"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { legalPages, legalSettings, legalTitle } from "@/lib/legal";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { HEADING, TEXT_LINK } from "@/lib/ui";

/** Shared shell for every legal page: Turkish and English (the toggle in
 * the header), a "draft" notice while legalSettings.showDraftNotice is on,
 * the last-updated date, and links to all the other legal pages at the
 * bottom. The Turkish text is the binding one; the English version says
 * so. `tr` and `en` are the page bodies. */
export function LegalLayout({ tr, en }: { tr: ReactNode; en: ReactNode }) {
  const { lang } = useI18n();
  const path = usePathname();
  const title = legalTitle(path, lang);

  return (
    <main className="paper-ground min-h-svh px-6 py-16 sm:px-10 sm:py-20">
      <article className="mx-auto max-w-2xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className={`apparatus text-sm ${TEXT_LINK} justify-self-start`}>
            {lang === "tr" ? "← Ana sayfa" : "← Home"}
          </Link>
          <Link href="/" className="font-display text-3xl leading-none text-soot">
            Zarify
          </Link>
          <div className="justify-self-end">
            <LanguageToggle />
          </div>
        </div>
        <DoubleRule className="mt-4 text-soot" />

        {legalSettings.showDraftNotice && (
          <p
            role="note"
            className="mt-10 border border-wine/50 bg-wine/5 px-5 py-4 font-body text-base leading-relaxed text-wine"
          >
            <strong className="apparatus mr-2 text-sm">{lang === "tr" ? "Taslak" : "Draft"}</strong>
            {lang === "tr"
              ? "Bu metin taslaktır; yayından önce hukuki ve mali kontrolden geçirilecektir. Köşeli parantez içindeki işaretli alanlar henüz doldurulmamıştır."
              : "This text is a draft and will be reviewed by a lawyer and an accountant before launch. Highlighted fields in square brackets have not been filled in yet."}
          </p>
        )}

        <h1 className={`${HEADING} mt-12 text-center text-soot`}>{title}</h1>
        <p className="apparatus mt-5 text-center text-sm text-soot-soft">
          {lang === "tr" ? "Son güncelleme" : "Last updated"}: {legalSettings.lastUpdated[lang]}
        </p>
        {lang === "en" && (
          <p className="mt-3 text-center font-body text-base italic text-soot-soft">
            This English version is provided for convenience. The Turkish version is the binding one.
          </p>
        )}
        <DoubleRule className="mx-auto mt-8 mb-12 w-40 text-soot" />

        <div className="flex flex-col gap-8 font-body text-lg leading-relaxed text-soot [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-soot [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_ul+p]:mt-3 [&_a]:underline [&_a]:decoration-olive-soft [&_a]:underline-offset-4 [&_a:hover]:text-wine [&_a:hover]:decoration-wine [&_table]:w-full [&_td]:border-t [&_td]:border-soot/20 [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-3 [&_th]:text-left [&_th]:apparatus [&_th]:text-sm">
          {lang === "tr" ? tr : en}
        </div>

        <DoubleRule className="mt-16 text-soot" />
        <nav aria-label={lang === "tr" ? "Hukuki metinler" : "Legal pages"} className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {legalPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  aria-current={page.href === path ? "page" : undefined}
                  className={`apparatus text-sm transition-colors hover:text-wine ${
                    page.href === path ? "text-wine" : "text-soot-soft"
                  }`}
                >
                  {page.title[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
    </main>
  );
}
