"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

/** The page's one dark ink beat, reserved for the single most important
 * action on the page: starting a new invitation. */
export function CtaBeat() {
  const { user } = useAuth();
  const { t } = useI18n();
  const l = t.landing.cta;

  return (
    <section className="ink-ground px-6 py-24 sm:px-10 sm:py-32">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-parchment">
          {l.heading}
        </h2>
        <p className="font-body text-base text-parchment/80 max-w-md">{l.body}</p>
        <Link
          href={user ? "/davetiye-bilgileri" : "/kayit"}
          className="mt-2 font-body text-sm text-ink bg-gold-light rounded-full px-8 py-4 border border-gold-deep/40 shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97]"
        >
          {l.button}
        </Link>
      </Reveal>
    </section>
  );
}
