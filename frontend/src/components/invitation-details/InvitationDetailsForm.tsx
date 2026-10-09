"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useInvitationDraft, type InvitationDraft } from "@/lib/invitationDraft";
import { EMPTY_FORM } from "@/lib/invitationForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InvitationFields } from "./InvitationFields";

/** Step one of creating an invitation: the details are saved as a local
 * draft, then previewed on a template and published from there. Editing an
 * already-published invitation is a different page
 * (/davetiyelerim/[id]/duzenle) that saves straight to the API. */
export function InvitationDetailsForm() {
  const { ready, user } = useAuth();
  const { draft, saveDraft } = useInvitationDraft();
  const router = useRouter();

  // Guard the route: only signed-in users get here. Waits for `ready` —
  // during hydration `user` is still the server's logged-out snapshot.
  useEffect(() => {
    if (ready && !user) {
      router.replace("/giris");
    }
  }, [ready, user, router]);

  // During SSR and the hydration render the stored draft reads as null (the
  // server snapshot) even when one exists, so the form can't be seeded yet:
  // seeding it then would show an empty form on a refresh, and submitting
  // that would overwrite the saved draft. Nothing is rendered — so nothing
  // can be submitted — until the first client render, where `draft` is the
  // real stored value.
  if (!ready || !user) {
    return (
      <AuthLayout eyebrow="Davetiye Bilgileri" title="Davetiyenizi anlatın." wide>
        <p className="font-body text-lg text-soot-soft" role="status">
          Bilgileriniz yükleniyor…
        </p>
      </AuthLayout>
    );
  }

  return (
    <DraftForm
      initial={draft}
      onSave={(values) => {
        saveDraft(values);
        router.push("/sablonlar");
      }}
    />
  );
}

/** Mounted only once the stored draft is known, so its initial state is the
 * real draft (or a blank form when there truly is none). */
function DraftForm({
  initial,
  onSave,
}: {
  initial: InvitationDraft | null;
  onSave: (values: InvitationDraft) => void;
}) {
  const [form, setForm] = useState(() => initial ?? EMPTY_FORM);

  return (
    <AuthLayout eyebrow="Davetiye Bilgileri" title="Davetiyenizi anlatın." wide>
      <p className="-mt-4 mb-8 font-body text-lg italic text-soot-soft">
        Bu bilgilerle seçeceğiniz şablon otomatik doldurulacak. Yayınladıktan
        sonra da istediğiniz zaman düzenleyebilirsiniz.
      </p>

      <InvitationFields
        values={form}
        onChange={setForm}
        onSubmit={() => onSave(form)}
        submitLabel="Davetiyemi Oluştur"
      />
    </AuthLayout>
  );
}
