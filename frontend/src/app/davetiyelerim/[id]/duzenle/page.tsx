"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError, loginHref } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InvitationFields } from "@/components/invitation-details/InvitationFields";
import {
  getMyInvitations,
  isPaid,
  updateInvitation,
  type InvitationDto,
} from "@/lib/invitations";
import { fromInvitation, toApiFields, type InvitationFormValues } from "@/lib/invitationForm";
import { clearEditDraft, readEditDraft, writeEditDraft } from "@/lib/editDraft";
import { writePreview } from "@/lib/editPreview";
import { BUTTON_SECONDARY, TEXT_LINK } from "@/lib/ui";
import { describeError } from "@/lib/apiErrors";

type Status = "loading" | "ready" | "not-found" | "error";

/** Editing a published invitation: loads it from the owner's own list (so
 * someone else's id simply isn't found), saves with PUT, and keeps the same
 * slug — every link already shared with guests keeps working. Once it's
 * paid for, the couple's names are locked (the API refuses a change too). */
export default function EditInvitationPage() {
  const { id } = useParams<{ id: string }>();
  const { ready, token, logout } = useAuth();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationDto | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace(loginHref());
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
          router.replace(loginHref());
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
        <p className="font-body text-lg text-soot-soft" role="status">
          {status === "loading" && "Davetiye yükleniyor…"}
          {status === "not-found" && "Bu davetiye bulunamadı ya da size ait değil."}
          {status === "error" && "Davetiye şu anda yüklenemedi. Lütfen biraz sonra tekrar deneyin."}
        </p>
        {status !== "loading" && (
          <p className="mt-8">
            <Link
              href="/davetiyelerim"
              className={`apparatus text-sm ${TEXT_LINK}`}
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
    router.replace(loginHref());
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
  // What's saved on the server; the form is "dirty" while it differs.
  const [saved, setSaved] = useState(invitation);
  // Unsaved edits from an earlier visit (a session that ended mid-edit, a
  // closed tab) come back here — read once, on mount.
  const [restored] = useState(() => {
    const draft = readEditDraft(invitation.id);
    return draft && !sameFields(draft.values, fromInvitation(invitation)) ? draft : null;
  });
  const [values, setValues] = useState(() => restored?.values ?? fromInvitation(invitation));
  const [showRestored, setShowRestored] = useState(restored !== null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const dirty = !sameFields(values, fromInvitation(saved));

  // Every change is kept locally until it's saved or discarded.
  function handleChange(next: InvitationFormValues) {
    setValues(next);
    setSavedAt(null);
    if (sameFields(next, fromInvitation(saved))) clearEditDraft(invitation.id);
    else writeEditDraft(invitation.id, next, saved.updatedAtUtc);
  }

  function discard() {
    clearEditDraft(invitation.id);
    setValues(fromInvitation(saved));
    setShowRestored(false);
  }

  // Leaving with unsaved changes: the browser's own prompt for reloads and
  // closing the tab, a confirm for links inside the site.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link || link.getAttribute("target") === "_blank" || event.defaultPrevented) return;
      const leave = window.confirm(
        "Kaydedilmemiş değişiklikleriniz var. Sayfadan çıkmak istiyor musunuz? (Değişiklikler bu tarayıcıda saklanır.)",
      );
      if (!leave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  function openPreview() {
    writePreview(invitation.id, values);
    window.open(`/davetiyelerim/${invitation.id}/onizleme`, "_blank", "noopener");
  }

  async function handleSave() {
    setError(null);
    setSavedAt(null);
    setSaving(true);
    try {
      const updated = await updateInvitation(token, invitation.id, toApiFields(values));
      clearEditDraft(invitation.id);
      setSaved(updated);
      setValues(fromInvitation(updated));
      setShowRestored(false);
      setSavedAt(new Date());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // The session couldn't be renewed. The edits are kept locally and
        // come back after signing in (?next= returns here).
        writeEditDraft(invitation.id, values, saved.updatedAtUtc);
        onSessionExpired();
        return;
      }
      setError(describeError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Davetiyeyi Düzenle"
      title={`${saved.brideName} & ${saved.groomName}`}
      wide
    >
      <p className="-mt-4 mb-8 font-body text-lg italic leading-relaxed text-soot-soft">
        Değişiklikleriniz kaydettiğiniz anda yayındaki davetiyede görünür; kaydetmeden önce
        &ldquo;Önizle&rdquo; ile yeni sekmede bakabilirsiniz. Davetiye linkiniz değişmez.
      </p>

      {showRestored && restored && (
        <div role="status" className="mb-8 border-l-2 border-wine/60 bg-paper-deep px-5 py-4">
          <p className="font-body text-lg text-soot">
            Kaydedilmemiş değişiklikleriniz geri yüklendi
            {restored.basedOn !== saved.updatedAtUtc && " (davetiye bu arada başka bir yerden güncellenmiş olabilir)"}.
            Kaydedene kadar yayındaki davetiye değişmez.
          </p>
          <button type="button" onClick={discard} className={`apparatus mt-2 text-sm ${TEXT_LINK}`}>
            Değişiklikleri at
          </button>
        </div>
      )}

      {savedAt && (
        <div
          role="status"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 bg-olive px-5 py-4 text-paper"
        >
          <span className="font-body text-lg">Değişiklikler kaydedildi.</span>
          <Link
            href={`/davetiye/${invitation.slug}`}
            className="apparatus text-sm text-paper underline decoration-paper/60 underline-offset-4 hover:decoration-paper"
          >
            Davetiyeyi görüntüle →
          </Link>
        </div>
      )}

      <InvitationFields
        values={values}
        onChange={handleChange}
        onSubmit={handleSave}
        submitLabel={saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
        submitting={saving}
        error={error}
        namesLocked={isPaid(saved.status)}
        savedWeddingDate={saved.weddingDate}
      />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="button" onClick={openPreview} className={BUTTON_SECONDARY}>
          Önizle
        </button>
        {dirty && <span className="font-body text-base italic text-wine">Kaydedilmemiş değişiklikler var.</span>}
      </div>

      <p className="mt-12 border-t border-soot/20 pt-6">
        <Link
          href="/davetiyelerim"
          className={`apparatus text-sm ${TEXT_LINK}`}
        >
          ← Davetiyelerim
        </Link>
      </p>
    </AuthLayout>
  );
}

function sameFields(a: InvitationFormValues, b: InvitationFormValues): boolean {
  return JSON.stringify(toApiFields(a)) === JSON.stringify(toApiFields(b));
}
