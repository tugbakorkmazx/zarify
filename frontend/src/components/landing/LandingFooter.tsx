"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { DoubleRule } from "@/components/herbarium/DoubleRule";

const LINK = "apparatus text-sm text-soot-soft transition-colors hover:text-wine";

/** The colophon on the centre axis, with the page's one script line. */
export function LandingFooter() {
  const { t } = useI18n();
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
          <Link href="/gizlilik" className={LINK}>
            {l.privacy}
          </Link>
          <Link href="/kullanim-sartlari" className={LINK}>
            {l.terms}
          </Link>
        </nav>
        <p className="apparatus mt-10 text-xs text-soot-soft">© {new Date().getFullYear()} Zarify</p>
      </div>
    </footer>
  );
}
