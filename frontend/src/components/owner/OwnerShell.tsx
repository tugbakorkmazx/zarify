"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { art } from "@/lib/art";
import { Painting } from "@/components/art/Painting";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { BUTTON_PRIMARY_LIGHT } from "@/lib/ui";

const NAV_LINK = "apparatus whitespace-nowrap text-sm transition-colors hover:text-paper";

/** Every signed-in owner page (dashboard, admin): the dark floral still
 * life full-bleed under a dark veil, the wordmark and the owner's nav
 * centred in ivory on top, and the page itself in a wide ivory paper card
 * on the centre axis. */
export function OwnerShell({
  section,
  title,
  lede,
  current,
  children,
}: {
  /** Small-caps line over the heading, e.g. "Hesabım". */
  section: string;
  title: string;
  lede?: ReactNode;
  current: "invitations" | "account" | "admin";
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const tone = (key: typeof current) => (key === current ? "text-paper" : "text-paper/70");

  return (
    <main className="relative isolate min-h-svh px-4 pt-8 pb-20 sm:px-10 sm:pt-10">
      <Painting piece={art.darkFlorals} shade="strong" priority />

      <header className="on-painting flex flex-col items-center gap-5">
        <Link href="/" className="font-display text-4xl leading-none sm:text-5xl">
          Zarify
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href="/davetiyelerim"
            aria-current={current === "invitations" ? "page" : undefined}
            className={`${NAV_LINK} ${tone("invitations")}`}
          >
            Davetiyelerim
          </Link>
          <Link
            href="/hesabim"
            aria-current={current === "account" ? "page" : undefined}
            className={`${NAV_LINK} ${tone("account")}`}
          >
            Hesabım
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/yonetim"
              aria-current={current === "admin" ? "page" : undefined}
              className={`${NAV_LINK} ${tone("admin")}`}
            >
              Yönetim
            </Link>
          )}
          <button type="button" onClick={handleLogout} className={`${NAV_LINK} text-paper/70`}>
            Çıkış Yap
          </button>
          <Link href="/davetiye-bilgileri" className={`${BUTTON_PRIMARY_LIGHT} !px-4 !py-2 !text-sm`}>
            Yeni Davetiye
          </Link>
        </nav>
      </header>

      <div className="paper-card paper-ground mx-auto mt-10 w-full max-w-5xl p-2">
        <div className="border border-soot/25 px-5 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <p className="apparatus text-sm text-wine">{section}</p>
            <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.015em] text-soot text-balance">
              {title}
            </h1>
            {lede && (
              <p className="mt-4 max-w-[52ch] font-body text-xl italic leading-snug text-soot-soft">{lede}</p>
            )}
            <DoubleRule className="mt-6 mb-12 w-40 text-soot" />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
