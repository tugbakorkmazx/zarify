"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError, loginHref } from "@/lib/auth";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { CoverMiniature } from "@/components/art/CoverMiniature";
import { BUTTON_PRIMARY } from "@/lib/ui";
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
      router.replace(loginHref());
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
          router.replace(loginHref());
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
    <OwnerShell
      section="Hesabım"
      title="Davetiyelerim"
      lede={`Merhaba, ${user.firstName}. Davetiyelerin, ödeme durumları ve gelen yanıtlar burada.`}
      current="invitations"
    >
      {status === "loading" && (
        <p className="font-body text-lg text-soot-soft" role="status">
          Davetiyeler yükleniyor…
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="border border-wine/50 px-5 py-4 font-body text-lg text-wine">
          Davetiyeler şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin.
        </p>
      )}

      {status === "ready" && items.length === 0 && (
        <div className="flex flex-col items-center text-center">
          <CoverMiniature names="Elif & Kerem" sizes="28rem" className="aspect-[16/10] w-full max-w-md" />
          <div className="mt-10 flex flex-col items-center gap-6">
            <h2 className="font-display text-3xl leading-tight text-soot sm:text-4xl">
              İlk sayınızı birlikte hazırlayalım.
            </h2>
            <p className="max-w-[46ch] font-body text-lg leading-relaxed text-soot-soft">
              Henüz yayınlanmış bir davetiyeniz yok. Bilgilerinizi girip bir şablon
              seçerek ilk davetiyenizi birkaç dakikada hazırlayabilirsiniz.
            </p>
            <Link href="/davetiye-bilgileri" className={BUTTON_PRIMARY}>
              İlk Davetiyeni Oluştur
            </Link>
          </div>
        </div>
      )}

      {status === "ready" && items.length > 0 && (
        <ul className="flex flex-col divide-y divide-soot/40 [&>li]:py-12 [&>li:first-child]:pt-0">
          {items.map((item) => (
            <li key={item.invitation.id}>
              <InvitationCard
                item={item}
                token={token}
                onCancelled={() =>
                  setItems((current) => current.filter((i) => i.invitation.id !== item.invitation.id))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </OwnerShell>
  );
}
