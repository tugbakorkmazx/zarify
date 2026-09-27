import type { ReactNode } from "react";
import Link from "next/link";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { HEADING, TEXT_LINK } from "@/lib/ui";
import { legalLastUpdated } from "@/lib/legal";

/** Shared shell for the legal pages. They're Turkish-only: the Turkish text
 * is the binding one under KVKK and Turkish consumer law. */
export function LegalLayout({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="paper-ground min-h-svh px-6 py-16 sm:px-10 sm:py-20">
      <article className="mx-auto max-w-2xl">
        <div className="flex items-end justify-between gap-4">
          <Link href="/" className="font-display text-3xl leading-none text-soot">
            Zarify
          </Link>
          <Link href="/" className={`apparatus text-sm ${TEXT_LINK}`}>
            ← Ana sayfa
          </Link>
        </div>
        <DoubleRule className="mt-4 text-soot" />
        <p className="apparatus mt-2 text-xs text-soot-soft">{eyebrow}</p>

        <h1 className={`${HEADING} mt-16 text-soot`}>{title}</h1>
        <p className="apparatus mt-5 text-sm text-soot-soft">
          Son güncelleme: {legalLastUpdated}
        </p>
        <DoubleRule className="mt-8 mb-12 max-w-[10rem] text-soot" />

        <div className="flex flex-col gap-8 font-body text-lg leading-relaxed text-soot [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-soot [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_ul+p]:mt-3 [&_a]:underline [&_a]:decoration-olive-soft [&_a]:underline-offset-4 [&_a:hover]:text-wine [&_a:hover]:decoration-wine">
          {children}
        </div>
      </article>
    </main>
  );
}
