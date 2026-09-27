"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { Painting } from "@/components/art/Painting";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { BUTTON_PRIMARY, BUTTON_SECONDARY_LIGHT } from "@/lib/ui";

const NAV_LINK = "apparatus whitespace-nowrap text-sm text-paper/80 transition-colors hover:text-paper";

/** The house cover: the letters-and-lilies still life full-bleed under a
 * dark veil, the wordmark centred between two short navs, and the
 * headline, body and both actions in ivory in the middle of the screen. */
export function LandingHero() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const l = t.landing;
  const startHref = user ? "/davetiye-bilgileri" : "/kayit";

  // Pure CSS keyframes (see @keyframes hero-rise in globals.css), so the
  // cover reveals on first paint whether or not JS has hydrated yet.
  const rise = (index: number) => ({
    animation: `hero-rise 850ms var(--ease-out-strong) ${index * 90}ms both`,
  });

  return (
    <section className="on-painting relative isolate flex min-h-[100svh] flex-col overflow-hidden px-5 pt-5 sm:px-10 sm:pt-7">
      <Painting piece={art.stillLifeLetters} shade="centre" priority />

      <header className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3">
        <nav className="flex items-center gap-5">
          <Link href="/sablonlar" className={`hidden sm:inline ${NAV_LINK}`}>
            {l.nav.templates}
          </Link>
          {user && (
            <Link href="/davetiyelerim" className={`hidden sm:inline ${NAV_LINK}`}>
              {l.nav.myInvitations}
            </Link>
          )}
          {/* Operator-only; the API enforces the role on every admin call. */}
          {user?.role === "admin" && (
            <Link href="/yonetim" className={`hidden md:inline ${NAV_LINK}`}>
              {l.nav.admin}
            </Link>
          )}
        </nav>

        <Link href="/" className="flex flex-col items-center text-center">
          <span className="font-display text-4xl leading-none sm:text-5xl">Zarify</span>
          <span className="mt-1 hidden font-body text-base italic text-paper/80 sm:block">{l.tagline}</span>
        </Link>

        <nav className="flex items-center justify-end gap-3 sm:gap-5">
          {user ? (
            <button type="button" onClick={logout} className={NAV_LINK}>
              {l.nav.logout}
            </button>
          ) : (
            <Link href="/giris" className={NAV_LINK}>
              {l.nav.login}
            </Link>
          )}
          <LanguageToggle tone="paper" />
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="apparatus text-sm text-wine-pale" style={rise(0)}>
          {l.hero.eyebrow}
        </p>
        <h1
          className="mt-5 max-w-[14ch] font-display text-[clamp(3rem,8vw,6rem)] leading-[0.98] tracking-[-0.02em] text-balance"
          style={rise(1)}
        >
          {l.hero.headline}
        </h1>
        <p className="mt-7 max-w-[46ch] font-body text-xl leading-relaxed text-paper/90" style={rise(2)}>
          {l.hero.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4" style={rise(3)}>
          <Link href={startHref} className={BUTTON_PRIMARY}>
            {l.hero.ctaPrimary}
          </Link>
          <Link href="/sablonlar" className={BUTTON_SECONDARY_LIGHT}>
            {l.hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
