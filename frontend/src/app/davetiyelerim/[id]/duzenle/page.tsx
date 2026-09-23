"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InvitationFields } from "@/components/invitation-details/InvitationFields";
import {
  getMyInvitations,
  updateInvitation,
  type InvitationDto,
} from "@/lib/invitations";
import { fromInvitation, toApiFields } from "@/lib/invitationForm";

type Status = "loading" | "ready" | "not-found" | "error";

/** Editing a published invitation: loads it from the owner's own list (so
 * someone else's id simply isn't found), saves with PUT, and keeps the same
 * slug — every link already shared with guests keeps working. */
export default function EditInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const { ready, token, logout } = useAuth();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationDto | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace("/giris");
      return;
    }
    let cancelled = false;
    getMyInvitations(token)
      .then((items) => {
        if (cancelled) return;
        const match = items.find((item) => item.invitation.id === id)?.invitation ?? null;
        setInvitation(match);
        setStatus(match ? "ready" : "not-found");
      })
      .catch((err) => {
        if (cancelled) return;
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
  }, [ready, token, id, router, logout]);

  if (!token) {
    return null;
  }

  if (status !== "ready" || !invitation) {
    return (
      <AuthLayout eyebrow="Davetiyeyi Düzenle" title="Davetiyeniz">
        <p className="text-center font-body text-sm text-ink-soft">
          {status === "loading" && "Davetiye yükleniyor…"}
          {status === "not-found" && "Bu davetiye bulunamadı ya da size ait değil."}
          {status === "error" && "Davetiye yüklenemedi. Lütfen daha sonra tekrar deneyin."}
        </p>
        {status !== "loading" && (
          <p className="mt-6 text-center">
            <Link
              href="/davetiyelerim"
              className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
            >
              ← Davetiyelerim
            </Link>
          </p>
        )}
      </AuthLayout>
    );
  }

  function handleSessionExpired() {
    logout();
    router.replace("/giris");
  }

  // Keyed so the form's initial state is taken from the loaded invitation.
  return (
    <EditForm
      key={invitation.id}
      invitation={invitation}
      token={token}
      onSessionExpired={handleSessionExpired}
    />
  );
}

function EditForm({
  invitation,
  token,
  onSessionExpired,
}: {
  invitation: InvitationDto;
  token: string;
  onSessionExpired: () => void;
}) {
  const [values, setValues] = useState(() => fromInvitation(invitation));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function handleSave() {
    setError(null);
    setSavedAt(null);
    setSaving(true);
    try {
      const updated = await updateInvitation(token, invitation.id, toApiFields(values));
      setValues(fromInvitation(updated));
      setSavedAt(new Date());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired();
        return;
      }
      setError(err instanceof ApiError ? err.message : "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Davetiyeyi Düzenle"
      title={`${invitation.brideName} & ${invitation.groomName}`}
      wide
    >
      <p className="font-body text-sm text-ink-soft -mt-2 mb-6">
        Değişiklikleriniz kaydettiğiniz anda yayındaki davetiyede görünür.
        Davetiye linkiniz değişmez; misafirlerinize gönderdiğiniz link aynen çalışmaya devam eder.
      </p>

      {savedAt && (
        <div
          role="status"
          className="mb-6 border border-gold/60 bg-parchment-deep px-4 py-3 flex flex-wrap items-center justify-between gap-3"
        >
          <span className="font-body text-sm text-ink">Değişiklikler kaydedildi.</span>
          <Link
            href={`/davetiye/${invitation.slug}`}
            className="font-body text-sm text-ink underline decoration-gold-deep/60 underline-offset-4 hover:decoration-gold-deep"
          >
            Davetiyeyi görüntüle →
          </Link>
        </div>
      )}

      <InvitationFields
        values={values}
        onChange={(next) => {
          setValues(next);
          setSavedAt(null);
        }}
        onSubmit={handleSave}
        submitLabel={saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
        submitting={saving}
        error={error}
      />

      <p className="mt-8 text-center">
        <Link
          href="/davetiyelerim"
          className="font-body text-sm text-ink-soft underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
        >
          ← Davetiyelerim
        </Link>
      </p>
    </AuthLayout>
  );
}
