"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { art } from "@/lib/art";
import { Painting } from "@/components/art/Painting";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { BUTTON_PRIMARY } from "@/lib/ui";

type Copy = { eyebrow: string; title: string; body: string };

/** The not-found and error pages: the dark floral still life under a strong
 * shade, the wordmark, and one centred paper card with the message and a
 * way home — the same world as the owner pages (DESIGN.md). TR/EN through
 * the language toggle. */
export function StatusPage({ tr, en, action }: { tr: Copy; en: Copy; action?: ReactNode }) {
  const { lang } = useI18n();
  const copy = lang === "tr" ? tr : en;
  return (
    <main className="relative isolate flex min-h-svh flex-col items-center px-4 pt-8 pb-20 sm:px-10 sm:pt-10">
      <Painting piece={art.darkFlorals} shade="strong" />
      <header className="on-painting flex w-full max-w-xl flex-col items-center gap-4">
        <Link href="/" className="font-display text-4xl leading-none text-paper sm:text-5xl">
          Zarify
        </Link>
        <LanguageToggle tone="paper" />
      </header>
      <div className="paper-card paper-ground mt-10 w-full max-w-xl p-2">
        <div className="flex flex-col items-center border border-soot/25 px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="apparatus text-sm text-wine">{copy.eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.02] tracking-[-0.015em] text-soot text-balance">
            {copy.title}
          </h1>
          <DoubleRule className="mt-6 mb-8 w-32 text-soot" />
          <p className="max-w-[40ch] font-body text-xl italic leading-snug text-soot-soft">{copy.body}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {action}
            <Link href="/" className={BUTTON_PRIMARY}>
              {lang === "tr" ? "Ana Sayfaya Dön" : "Back to the Home Page"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
