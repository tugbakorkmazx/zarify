"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useInvitationDraft } from "@/lib/invitationDraft";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { ToggleField } from "@/components/forms/ToggleField";

const DEFAULTS = {
  brideName: "",
  groomName: "",
  weddingDate: "",
  weddingTime: "16:00",
  venueName: "",
  venueAddress: "",
  includePhotoAlbum: true,
  includeDressCode: true,
  rsvpEnabled: true,
};

export function InvitationDetailsForm() {
  const { ready, user } = useAuth();
  const { draft, saveDraft } = useInvitationDraft();
  const router = useRouter();
  // draft comes from useSyncExternalStore, already resolved to its real
  // client value by the time this component's initializer runs — no effect
  // needed to seed the form from it.
  const [form, setForm] = useState(() => draft ?? DEFAULTS);

  // Guard the route: only signed-in users get here. Waits for `ready` —
  // during hydration `user` is still the server's logged-out snapshot.
  useEffect(() => {
    if (ready && !user) {
      router.replace("/giris");
    }
  }, [ready, user, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDraft(form);
    router.push("/sablonlar");
  }

  if (!user) {
    return null;
  }

  return (
    <AuthLayout
      eyebrow="Davetiye Bilgileri"
      title="Davetiyenizi anlatın."
    >
      <p className="font-body text-sm text-ink-soft -mt-2 mb-6">
        Bu bilgilerle seçeceğiniz şablon otomatik doldurulacak; ince ayarları
        sonradan değiştirebilirsiniz.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Gelin Adı"
            type="text"
            required
            value={form.brideName}
            onChange={(e) => setForm((f) => ({ ...f, brideName: e.target.value }))}
          />
          <FormField
            label="Damat Adı"
            type="text"
            required
            value={form.groomName}
            onChange={(e) => setForm((f) => ({ ...f, groomName: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Düğün Tarihi"
            type="date"
            required
            value={form.weddingDate}
            onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))}
          />
          <FormField
            label="Saat"
            type="time"
            required
            value={form.weddingTime}
            onChange={(e) => setForm((f) => ({ ...f, weddingTime: e.target.value }))}
          />
        </div>

        <FormField
          label="Mekan Adı"
          type="text"
          required
          value={form.venueName}
          onChange={(e) => setForm((f) => ({ ...f, venueName: e.target.value }))}
        />
        <FormField
          label="Adres / Konum"
          type="text"
          required
          value={form.venueAddress}
          onChange={(e) => setForm((f) => ({ ...f, venueAddress: e.target.value }))}
        />

        <ToggleField
          legend="Fotoğraf Albümü Eklensin mi?"
          name="includePhotoAlbum"
          value={form.includePhotoAlbum}
          onChange={(v) => setForm((f) => ({ ...f, includePhotoAlbum: v }))}
        />
        <ToggleField
          legend="Kıyafet Kodu Bilgisi Eklensin mi?"
          name="includeDressCode"
          value={form.includeDressCode}
          onChange={(v) => setForm((f) => ({ ...f, includeDressCode: v }))}
        />
        <ToggleField
          legend="Katılım Bildirimi (RSVP) Açık Olsun mu?"
          name="rsvpEnabled"
          value={form.rsvpEnabled}
          onChange={(v) => setForm((f) => ({ ...f, rsvpEnabled: v }))}
        />

        <button
          type="submit"
          className="mt-2 font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97]"
        >
          Davetiyemi Oluştur
        </button>
      </form>
    </AuthLayout>
  );
}
