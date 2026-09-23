"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { WaxSeal } from "@/components/ornament/WaxSeal";

export function LandingFooter() {
  const { t } = useI18n();
  const l = t.landing.footer;

  return (
    <footer className="paper-ground px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <span className="flex items-center gap-2">
          <WaxSeal size={26} />
          <span className="font-display text-lg text-gold-deep">Zarify</span>
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-6 font-body text-sm text-ink-soft">
          <Link href="/sablonlar" className="transition-colors hover:text-ink">
            {l.templates}
          </Link>
          <Link href="/giris" className="transition-colors hover:text-ink">
            {l.login}
          </Link>
          <Link href="/kayit" className="transition-colors hover:text-ink">
            {l.register}
          </Link>
        </nav>
        <span className="font-body text-xs text-ink-soft/70">
          © {new Date().getFullYear()} Zarify
        </span>
      </div>
    </footer>
  );
}
