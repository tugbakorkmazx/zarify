"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useInvitationDraft } from "@/lib/invitationDraft";
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
  // draft comes from useSyncExternalStore, already resolved to its real
  // client value by the time this component's initializer runs — no effect
  // needed to seed the form from it.
  const [form, setForm] = useState(() => draft ?? EMPTY_FORM);

  // Guard the route: only signed-in users get here. Waits for `ready` —
  // during hydration `user` is still the server's logged-out snapshot.
  useEffect(() => {
    if (ready && !user) {
      router.replace("/giris");
    }
  }, [ready, user, router]);

  function handleSubmit() {
    saveDraft(form);
    router.push("/sablonlar");
  }

  if (!user) {
    return null;
  }

  return (
    <AuthLayout eyebrow="Davetiye Bilgileri" title="Davetiyenizi anlatın." wide>
      <p className="-mt-4 mb-8 font-body text-lg italic text-soot-soft">
        Bu bilgilerle seçeceğiniz şablon otomatik doldurulacak. Yayınladıktan
        sonra da istediğiniz zaman düzenleyebilirsiniz.
      </p>

      <InvitationFields
        values={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        submitLabel="Davetiyemi Oluştur"
      />
    </AuthLayout>
  );
}
