"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BUTTON_PRIMARY, BUTTON_PRIMARY_SM, BUTTON_SECONDARY, TEXT_LINK } from "@/lib/ui";
import { PaymentInstructionsPanel } from "@/components/payment/PaymentInstructionsPanel";
import { OrderSummary } from "@/components/payment/OrderSummary";
import { RejectionNotice } from "@/components/payment/RejectionNotice";
import { useAuth, loginHref } from "@/lib/auth";
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
  // A failed request (offline, server down) — not the same as "no such
  // invitation", and worth a retry.
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(subscribeNever, getOrigin, getServerOrigin);
  const shareUrl = origin ? `${origin}/davetiye/${slug}` : "";

  useEffect(() => {
    if (!ready) return;
    // Owner-only: a pending invitation isn't visible without the owner's token.
    if (!token) {
      router.replace(loginHref());
      return;
    }
    let cancelled = false;
    getInvitationBySlug(slug, token)
      .then((result) => {
        if (cancelled) return;
        setLoadError(false);
        if (result.kind === "found") setInvitation(result.invitation);
        else setNotFound(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, ready, token, router, attempt]);

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
      <AuthLayout eyebrow="Davetiyelerim" title="Bu davetiyeyi bulamadık.">
        <Link href="/davetiyelerim" className={`apparatus text-sm ${TEXT_LINK}`}>
          ← Davetiyelerim
        </Link>
      </AuthLayout>
    );
  }

  if (loadError && !invitation) {
    return (
      <AuthLayout eyebrow="Davetiyelerim" title="Davetiyeniz şu anda yüklenemedi.">
        <p className="mb-8 font-body text-lg leading-relaxed text-soot-soft">
          Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className={BUTTON_PRIMARY}>
            Tekrar Dene
          </button>
          <Link href="/davetiyelerim" className={`apparatus text-sm ${TEXT_LINK}`}>
            ← Davetiyelerim
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const isLive = invitation?.status === "published";
  const isRemoved = invitation?.status === "removed";

  return (
    <AuthLayout
      eyebrow={
        !invitation
          ? "Davetiyeniz"
          : isLive
            ? "Davetiyeniz yayında"
            : isRemoved
              ? "Yayından kaldırıldı"
              : "Ödeme bekleniyor"
      }
      title={invitation ? `${invitation.brideName} & ${invitation.groomName}` : "Davetiyeniz yükleniyor…"}
      wide
      footer={
        <p className="mt-12 border-t border-soot/20 pt-6">
          <Link href="/davetiyelerim" className={`apparatus text-sm ${TEXT_LINK}`}>
            ← Davetiyelerim
          </Link>
        </p>
      }
    >
      {invitation && isRemoved && (
        <div role="status" className="mb-10 border-l-2 border-wine/60 bg-paper-deep px-5 py-4">
          <p className="apparatus text-sm text-wine">Davetiyeniz şu anda misafirlerinize kapalı</p>
          <p className="mt-2 font-body text-lg leading-relaxed text-soot">
            Davetiyeniz, Kullanım Şartları&apos;na uygun olmadığı değerlendirilen içerik nedeniyle yayından kaldırıldı.
            Linkiniz misafirlerinize “Bu davetiye yayında değil” gösteriyor. Davetiyeniz ve katılım yanıtları
            silinmedi; içeriği düzenleyip bize ulaştığınızda yeniden inceleyebiliriz.
          </p>
          {invitation.removalNote && (
            <p className="mt-3 font-body text-base text-soot">
              <span className="apparatus text-xs text-soot-soft">Gerekçe</span>
              <br />
              {invitation.removalNote}
            </p>
          )}
        </div>
      )}

      {invitation && invitation.paymentRejectionNote && !isLive && !isRemoved && (
        <div className="mb-8">
          <RejectionNotice invitation={invitation} />
        </div>
      )}

      {invitation && token && !isLive && !isRemoved && (
        <div className="mb-10">
          <PaymentInstructionsPanel token={token} invitationId={invitation.id} />
        </div>
      )}

      {invitation && isLive && (
        <>
          <p className="mb-6 font-body text-lg leading-relaxed text-soot-soft">
            Davetiyeniz yayında. Aşağıdaki linki misafirlerinizle paylaşabilir,
            dilediğiniz zaman kendiniz görüntüleyebilirsiniz.
          </p>

          <div className="mb-10 flex items-center gap-3 border-y border-soot py-3">
            <span className="flex-1 truncate font-body text-lg text-soot">{shareUrl}</span>
            <button type="button" onClick={handleCopy} className={`shrink-0 ${BUTTON_PRIMARY_SM}`}>
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </>
      )}

      {invitation && token && <OrderSummary token={token} invitationId={invitation.id} />}

      {invitation && (
        <div className="flex flex-wrap items-center gap-4">
          <Link href={`/davetiye/${slug}`} className={BUTTON_PRIMARY}>
            {isLive ? "Davetiyeni Görüntüle" : "Önizle"}
          </Link>
          {/* Edits the invitation in place (PUT, same slug) — in any status. */}
          <Link href={`/davetiyelerim/${invitation.id}/duzenle`} className={BUTTON_SECONDARY}>
            Bilgileri Düzenle
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
