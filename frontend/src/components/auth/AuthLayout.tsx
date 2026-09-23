import type { ReactNode } from "react";
import Link from "next/link";
import { IlluminatedRule } from "@/components/invitation/IlluminatedRule";
import { WaxSeal } from "@/components/ornament/WaxSeal";
import { BotanicalSprig } from "@/components/ornament/BotanicalSprig";

export function AuthLayout({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="paper-ground relative flex min-h-svh flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <Link
        href="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-10 font-body text-sm text-ink-soft transition-colors hover:text-ink"
      >
        ← Zarify
      </Link>

      <BotanicalSprig
        flip
        className="absolute -bottom-6 -left-6 w-20 h-28 opacity-70 pointer-events-none hidden sm:block"
      />

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <WaxSeal size={44} />
        </div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3 text-center">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink text-center">
          {title}
        </h1>
        <IlluminatedRule className="my-6 mx-auto" />

        {children}
        {footer}
      </div>
    </main>
  );
}
