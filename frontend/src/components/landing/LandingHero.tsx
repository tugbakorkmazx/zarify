"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { WaxSeal } from "@/components/ornament/WaxSeal";
import { BotanicalSprig } from "@/components/ornament/BotanicalSprig";
import { DeckleEdge } from "@/components/ornament/DeckleEdge";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";

const STAGE_DELAY_MS = 90;

const PILL_BUTTON =
  "transition-[filter,transform] duration-150 active:scale-[0.97]";
const GHOST_PILL = "transition-[color,border-color,transform] duration-150 active:scale-[0.97]";

export function LandingHero() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const l = t.landing;

  // A pure CSS keyframe animation (see .hero-rise / @keyframes hero-rise in
  // globals.css) staggered per stage — this plays on first paint whether or
  // not JS has hydrated yet, so above-the-fold content never gets stuck
  // invisible waiting on a JS-flipped "mounted" flag.
  const stageStyle = (index: number) => ({
    animation: `hero-rise 850ms var(--ease-out-strong) ${index * STAGE_DELAY_MS}ms both`,
  });

  return (
    <section className="relative overflow-hidden paper-ground">
      <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <div className="group flex items-center gap-2.5">
          <WaxSeal size={30} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide text-ink">
              Zarify
            </span>
            <span className="font-body italic text-sm text-gold-deep -mt-0.5">
              {l.tagline}
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/sablonlar"
            className="hidden font-body text-sm text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            {l.nav.templates}
          </Link>
          <LanguageToggle />
          {user ? (
            <>
              <Link
                href="/davetiyelerim"
                className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {l.nav.myInvitations}
              </Link>
              {/* Operator-only; the API enforces the role on every admin call. */}
              {user.role === "admin" && (
                <Link
                  href="/yonetim"
                  className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {l.nav.admin}
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className={`font-body text-sm text-ink-soft border border-gold/50 rounded-full px-4 py-1.5 hover:border-gold hover:text-ink ${GHOST_PILL}`}
              >
                {l.nav.logout}
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className={`font-body text-sm text-ink-soft border border-gold/50 rounded-full px-4 py-1.5 hover:border-gold hover:text-ink ${GHOST_PILL}`}
            >
              {l.nav.login}
            </Link>
          )}
          <Link
            href={user ? "/davetiye-bilgileri" : "/kayit"}
            className={`font-body text-sm text-ink bg-gold-light rounded-full px-4 py-1.5 border border-gold-deep/40 hover:brightness-105 ${PILL_BUTTON}`}
          >
            {l.nav.cta}
          </Link>
        </nav>
      </div>

      <div className="grid gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8 lg:px-16 lg:py-24">
        <div className="max-w-xl">
          <p
            className="font-body text-xs sm:text-sm tracking-[0.2em] uppercase text-gold-deep mb-5"
            style={stageStyle(0)}
          >
            {l.hero.eyebrow}
          </p>
          <h1
            className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.98] text-ink"
            style={stageStyle(1)}
          >
            {l.hero.headline}
          </h1>
          <p
            className="font-body text-lg text-ink-soft mt-6 max-w-md"
            style={stageStyle(2)}
          >
            {l.hero.body}
          </p>
          <div
            className="flex flex-wrap items-center gap-4 mt-9"
            style={stageStyle(3)}
          >
            <Link
              href={user ? "/davetiye-bilgileri" : "/kayit"}
              className={`font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 hover:brightness-105 ${PILL_BUTTON}`}
            >
              {l.hero.ctaPrimary}
            </Link>
            <Link
              href="/sablonlar"
              className={`font-body text-sm text-ink-soft border border-gold/50 rounded-full px-6 py-3 hover:border-gold hover:text-ink ${GHOST_PILL}`}
            >
              {l.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto"
          style={stageStyle(4)}
        >
          <HeroInvitationMockup />
        </div>
      </div>
    </section>
  );
}

/** A miniature of the platform's own Nikâh Tezhibi template — grounded in
 * the actual product rather than a stock illustration or abstract shape. */
function HeroInvitationMockup() {
  const { t } = useI18n();
  const l = t.landing.hero;

  return (
    <div className="group relative rotate-[1.5deg]">
      <BotanicalSprig
        flip
        delay={700}
        className="absolute -bottom-10 -left-10 w-16 h-24 opacity-90 pointer-events-none"
      />
      <div className="paper-ground-deep border border-gold/50 px-8 pt-12 pb-6 sm:px-10 sm:pt-14">
        <p className="font-script text-lg text-ink-soft mb-2">{l.mockupInvite}</p>
        <p className="font-display text-4xl sm:text-5xl leading-[0.95] text-ink">
          {l.mockupNames}
        </p>
        <svg
          viewBox="0 0 240 16"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="w-32 h-4 my-5"
        >
          <line x1="0" y1="8" x2="102" y2="8" stroke="var(--color-gold)" strokeWidth="1" opacity="0.8" />
          <line x1="138" y1="8" x2="240" y2="8" stroke="var(--color-gold)" strokeWidth="1" opacity="0.8" />
          <path d="M120 2 L126 8 L120 14 L114 8 Z" fill="none" stroke="var(--color-gold)" strokeWidth="1" />
          <circle cx="120" cy="8" r="1.4" fill="var(--color-gold)" />
        </svg>
        <p className="font-body text-sm text-ink">{l.mockupDate}</p>
        <p className="font-body text-sm text-ink-soft mb-3">{l.mockupVenue}</p>
        <DeckleEdge />
      </div>
      <span
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 h-full w-full border border-gold/30 -z-10"
      />
    </div>
  );
}
