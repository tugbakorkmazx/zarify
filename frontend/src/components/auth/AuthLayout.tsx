import type { ReactNode } from "react";
import Link from "next/link";
import { art } from "@/lib/art";
import { Painting } from "@/components/art/Painting";
import { DoubleRule } from "@/components/herbarium/DoubleRule";

/** Sign-in, sign-up and the invitation forms: the dark floral still life
 * full-bleed under a dark veil, the wordmark centred above, and the form
 * in an ivory paper card in the middle of the screen. No side panel.
 * `eyebrow` is the small-caps line over the heading. */
export function AuthLayout({
  eyebrow,
  title,
  children,
  footer,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** For longer forms (the invitation details form) that need more than a
   * login card's width. */
  wide?: boolean;
}) {
  return (
    <main className="relative isolate flex min-h-svh flex-col items-center px-4 py-8 sm:px-10 sm:py-12">
      <Painting piece={art.darkFlorals} shade="strong" priority />

      <Link href="/" className="on-painting font-display text-4xl leading-none sm:text-5xl">
        Zarify
      </Link>

      <div
        className={`paper-card paper-ground mt-8 w-full ${wide ? "max-w-2xl" : "max-w-md"} p-2 sm:mt-10`}
      >
        <div className="border border-soot/25 px-6 py-10 sm:px-12 sm:py-12">
          <div className="flex flex-col items-center text-center">
            <p className="apparatus text-sm text-wine">{eyebrow}</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.02] tracking-[-0.015em] text-soot text-balance">
              {title}
            </h1>
            <DoubleRule className="mt-5 mb-10 w-32 text-soot" />
          </div>

          {children}
          {footer}
        </div>
      </div>
    </main>
  );
}
