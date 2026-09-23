"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { WaxSeal } from "@/components/ornament/WaxSeal";
import { IlluminatedRule } from "@/components/invitation/IlluminatedRule";
import { PaymentInstructionsPanel } from "@/components/payment/PaymentInstructionsPanel";
import { useAuth } from "@/lib/auth";
import { getInvitationBySlug, type InvitationDto } from "@/lib/invitations";

// origin never changes over the page's lifetime, so there's nothing to
// subscribe to — this just gives the SSR-safe value (empty on the server,
// the real origin once mounted) without a setState-in-effect.
function subscribeNever() {
  return () => {};
}
function getOrigin() {
  return window.location.origin;
}
function getServerOrigin() {
  return "";
}

/** The owner's page for one invitation, where the publish flow on
 * /sablonlar/nikah-tezhibi lands. While the bank transfer is pending it
 * shows the payment instructions; once an admin confirms it, the share
 * link. Separate from the guest-facing /davetiye/[slug] page. */
export default function InvitationReadyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { ready, token } = useAuth();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationDto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(subscribeNever, getOrigin, getServerOrigin);
  const shareUrl = origin ? `${origin}/davetiye/${slug}` : "";

  useEffect(() => {
    if (!ready) return;
    // Owner-only: a pending invitation isn't visible without the owner's token.
    if (!token) {
      router.replace("/giris");
      return;
    }
    let cancelled = false;
    getInvitationBySlug(slug, token)
      .then((result) => {
        if (cancelled) return;
        if (result.kind === "found") setInvitation(result.invitation);
        else setNotFound(true);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, ready, token, router]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (permissions, insecure context, …) — the link
      // is still visible as selectable text
    }
  }

  if (notFound) {
    return (
      <main className="paper-ground min-h-svh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-ink">Bu davetiyeyi bulamadık.</p>
        <Link
          href="/davetiyelerim"
          className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          ← Davetiyelerim
        </Link>
      </main>
    );
  }

  const isLive = invitation?.status === "published";

  return (
    <main className="paper-ground relative flex min-h-svh flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <Link
        href="/davetiyelerim"
        className="absolute top-6 left-6 sm:top-8 sm:left-10 font-body text-sm text-ink-soft transition-colors hover:text-ink"
      >
        ← Davetiyelerim
      </Link>

      <div className="relative w-full max-w-md text-center">
        <div className="flex justify-center mb-5">
          <WaxSeal size={44} />
        </div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">
          {!invitation ? "Davetiyeniz" : isLive ? "Davetiyeniz Yayında" : "Ödeme Bekleniyor"}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">
          {invitation ? `${invitation.brideName} & ${invitation.groomName}` : "Davetiyeniz yükleniyor…"}
        </h1>
        <IlluminatedRule className="my-6 mx-auto" />

        {invitation && token && !isLive && (
          <div className="mb-8">
            <PaymentInstructionsPanel token={token} invitationId={invitation.id} />
          </div>
        )}

        {invitation && isLive && (
          <>
            <p className="font-body text-sm text-ink-soft mb-6">
              Davetiyeniz yayında. Aşağıdaki linki misafirlerinizle paylaşabilir,
              dilediğiniz zaman kendiniz görüntüleyebilirsiniz.
            </p>

            <div className="flex items-center gap-2 border border-gold/50 rounded-full pl-5 pr-1.5 py-1.5 mb-6">
              <span className="flex-1 truncate font-body text-sm text-ink text-left">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 font-body text-xs text-ink bg-gold-light rounded-full px-4 py-2 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97]"
              >
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>
          </>
        )}

        {invitation && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/davetiye/${slug}`}
              className="font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97]"
            >
              {isLive ? "Davetiyeni Görüntüle" : "Önizle"}
            </Link>
            {/* Edits the invitation in place (PUT, same slug) — in any status. */}
            <Link
              href={`/davetiyelerim/${invitation.id}/duzenle`}
              className="font-body text-sm text-ink-soft border border-gold/50 rounded-full px-6 py-3 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
            >
              Bilgileri Düzenle
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
