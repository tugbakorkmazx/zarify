"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WaxSeal } from "@/components/ornament/WaxSeal";
import { IlluminatedRule } from "@/components/invitation/IlluminatedRule";
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

/** The "your invitation is ready" result screen the publish flow on
 * /sablonlar/nikah-tezhibi redirects to — separate from the public
 * /davetiye/[slug] page itself, since this one is for the owner: the share
 * link plus a way to jump to the real thing or go back and edit. */
export default function InvitationReadyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<InvitationDto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(subscribeNever, getOrigin, getServerOrigin);
  const shareUrl = origin ? `${origin}/davetiye/${slug}` : "";

  useEffect(() => {
    let cancelled = false;
    getInvitationBySlug(slug).then((result) => {
      if (cancelled) return;
      if (result) setInvitation(result);
      else setNotFound(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

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
          href="/davetiye-bilgileri"
          className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          ← Yeniden oluştur
        </Link>
      </main>
    );
  }

  return (
    <main className="paper-ground relative flex min-h-svh flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <Link
        href="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-10 font-body text-sm text-ink-soft transition-colors hover:text-ink"
      >
        ← Zarify
      </Link>

      <div className="relative w-full max-w-md text-center">
        <div className="flex justify-center mb-5">
          <WaxSeal size={44} />
        </div>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-deep mb-3">
          Davetiyeniz Hazır
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">
          {invitation ? `${invitation.brideName} & ${invitation.groomName}` : "Davetiyeniz hazırlanıyor…"}
        </h1>
        <IlluminatedRule className="my-6 mx-auto" />

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

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/davetiye/${slug}`}
            className="font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97]"
          >
            Davetiyeni Görüntüle
          </Link>
          <Link
            href="/davetiye-bilgileri"
            className="font-body text-sm text-ink-soft border border-gold/50 rounded-full px-6 py-3 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
          >
            Bilgileri Düzenle
          </Link>
        </div>
      </div>
    </main>
  );
}
