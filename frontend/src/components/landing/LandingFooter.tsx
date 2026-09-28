"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { legalPages } from "@/lib/legal";

const LINK = "apparatus text-sm text-soot-soft transition-colors hover:text-wine";

/** The colophon on the centre axis, with the page's one script line, the
 * site links, and every legal page in the current language. */
export function LandingFooter() {
  const { t, lang } = useI18n();
  const l = t.landing.footer;

  return (
    <footer className="paper-ground px-5 pt-16 pb-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <DoubleRule className="w-full text-soot" />
        <p className="mt-12 font-display text-4xl leading-none text-soot">Zarify</p>
        <p className="mt-1 font-script text-3xl text-wine">{t.landing.tagline}</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          <Link href="/sablonlar" className={LINK}>
            {l.templates}
          </Link>
          <Link href="/giris" className={LINK}>
            {l.login}
          </Link>
          <Link href="/kayit" className={LINK}>
            {l.register}
          </Link>
        </nav>
        <nav aria-label={l.legalHeading} className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {legalPages.map((page) => (
            <Link key={page.href} href={page.href} className={LINK}>
              {page.title[lang]}
            </Link>
          ))}
        </nav>
        <p className="apparatus mt-10 text-xs text-soot-soft">© {new Date().getFullYear()} Zarify</p>
      </div>
    </footer>
  );
}
