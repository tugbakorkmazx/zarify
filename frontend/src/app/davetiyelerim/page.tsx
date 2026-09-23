"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { WaxSeal } from "@/components/ornament/WaxSeal";
import { IlluminatedRule } from "@/components/invitation/IlluminatedRule";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { getMyInvitations, type MyInvitation } from "@/lib/invitations";

type Status = "loading" | "ready" | "error";

/** The owner's home after signing in: every invitation they've published,
 * each with its RSVP tallies and a way to open the guest list. */
export default function MyInvitationsPage() {
  const { ready, user, token, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<MyInvitation[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  // Same guard as /davetiye-bilgileri — only signed-in owners get here.
  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/giris");
      return;
    }
    let cancelled = false;
    getMyInvitations(token)
      .then((result) => {
        if (cancelled) return;
        setItems(result);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        // A stored token the API no longer accepts (expired early, account
        // removed) — clear it rather than leaving the owner on a dead page.
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/giris");
          return;
        }
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [ready, token, router, logout]);

  if (!user || !token) {
    return null;
  }

  return (
    <main className="paper-ground min-h-svh px-6 py-8 sm:px-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-body text-sm text-ink-soft transition-colors hover:text-ink"
        >
          ← Zarify
        </Link>
        <div className="flex items-center gap-4">
          {user.role === "admin" && (
            <Link
              href="/yonetim"
              className="font-body text-sm text-ink-soft border border-gold/50 rounded-full px-4 py-1.5 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
            >
              Yönetim
            </Link>
          )}
          <Link
            href="/davetiye-bilgileri"
            className="font-body text-sm text-ink bg-gold-light rounded-full px-4 py-1.5 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.97]"
          >
            Yeni Davetiye
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl pt-12 sm:pt-16">
        <header className="text-center">
          <div className="flex justify-center mb-5">
            <WaxSeal size={40} />
          </div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">
            Merhaba, {user.firstName}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink">Davetiyelerim</h1>
          <IlluminatedRule className="my-6 mx-auto" />
        </header>

        {status === "loading" && (
          <p className="text-center font-body text-sm text-ink-soft">Davetiyeler yükleniyor…</p>
        )}

        {status === "error" && (
          <p role="alert" className="text-center font-body text-sm text-ink-soft">
            Davetiyeler yüklenemedi. Sunucuya ulaşılamadı; lütfen daha sonra tekrar deneyin.
          </p>
        )}

        {status === "ready" && items.length === 0 && (
          <div className="text-center flex flex-col items-center gap-5">
            <p className="font-body text-base text-ink-soft max-w-sm">
              Henüz yayınlanmış bir davetiyeniz yok. Bilgilerinizi girip bir şablon
              seçerek ilk davetiyenizi birkaç dakikada hazırlayabilirsiniz.
            </p>
            <Link
              href="/davetiye-bilgileri"
              className="font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:scale-[0.97]"
            >
              İlk Davetiyeni Oluştur
            </Link>
          </div>
        )}

        {status === "ready" && items.length > 0 && (
          <ul className="flex flex-col gap-8">
            {items.map((item) => (
              <li key={item.invitation.id}>
                <InvitationCard item={item} token={token} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
