"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, deleteAccount, requestPasswordReset, ApiError, loginHref } from "@/lib/auth";
import { describeError } from "@/lib/apiErrors";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";
import { BUTTON_PRIMARY, BUTTON_SECONDARY_SM, FIELD_LABEL, TEXT_LINK } from "@/lib/ui";

const SECTION_HEADING = "font-display text-2xl leading-tight text-soot";

/** Account settings: who's signed in, changing the password (by emailed
 * link — the same flow as "forgot password"), and deleting the account. */
export default function AccountPage() {
  const { ready, user, token, logout } = useAuth();
  const router = useRouter();
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (ready && !token && !deleted) {
      router.replace(loginHref());
    }
  }, [ready, token, deleted, router]);

  if (deleted) {
    return (
      <AuthLayout eyebrow="Hesap Silindi" title="Hesabınız silindi.">
        <div role="status" className="flex flex-col gap-6 font-body text-lg leading-relaxed text-soot">
          <p>
            Hesabınız, davetiyeleriniz ve misafir yanıtları silindi. Onay e-postasını birkaç dakika içinde
            alacaksınız.
          </p>
          <Link href="/" className={`w-full text-center ${BUTTON_PRIMARY}`}>
            Ana Sayfaya Dön
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (!user || !token) {
    return null;
  }

  return (
    <OwnerShell section="Hesabım" title="Hesap Ayarları" current="account">
      <div className="mx-auto flex max-w-xl flex-col gap-14 text-left">
        <section aria-labelledby="account-details" className="flex flex-col gap-4">
          <h2 id="account-details" className={SECTION_HEADING}>Bilgileriniz</h2>
          <dl className="divide-y divide-soot/15 border-y border-soot/30">
            <div className="py-3">
              <dt className={FIELD_LABEL}>Ad Soyad</dt>
              <dd className="font-body text-lg text-soot">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="py-3">
              <dt className={FIELD_LABEL}>E-posta</dt>
              <dd className="break-all font-body text-lg text-soot">{user.email}</dd>
            </div>
          </dl>
        </section>

        <PasswordSection email={user.email} />

        <DeleteSection
          token={token}
          onDeleted={() => {
            setDeleted(true);
            logout();
          }}
          onSessionExpired={() => {
            logout();
            router.replace(loginHref());
          }}
        />
      </div>
    </OwnerShell>
  );
}

function PasswordSection({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setError(null);
    setState("sending");
    try {
      await requestPasswordReset(email);
      setState("sent");
    } catch (err) {
      setError(describeError(err));
      setState("idle");
    }
  }

  return (
    <section aria-labelledby="account-password" className="flex flex-col gap-4">
      <h2 id="account-password" className={SECTION_HEADING}>Şifre</h2>
      <p className="font-body text-lg leading-relaxed text-soot-soft">
        Şifrenizi değiştirmek için e-posta adresinize bir bağlantı gönderiyoruz. Şifre değişince açık
        olan tüm oturumlarınız kapanır.
      </p>
      {state === "sent" ? (
        <p role="status" className="bg-olive px-5 py-4 font-body text-lg text-paper">
          Bağlantıyı {email} adresine gönderdik. 1 saat geçerlidir.
        </p>
      ) : (
        <div>
          <button type="button" onClick={send} disabled={state === "sending"} className={BUTTON_SECONDARY_SM}>
            {state === "sending" ? "Gönderiliyor…" : "Şifre Değiştirme Bağlantısı Gönder"}
          </button>
        </div>
      )}
      {error && <FormError message={error} />}
    </section>
  );
}

function DeleteSection({
  token,
  onDeleted,
  onSessionExpired,
}: {
  token: string;
  onDeleted: () => void;
  onSessionExpired: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    setBusy(true);
    try {
      await deleteAccount(token, password);
      setConfirmOpen(false);
      onDeleted();
    } catch (err) {
      setConfirmOpen(false);
      setBusy(false);
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired();
        return;
      }
      setError(describeError(err));
    }
  }

  return (
    <section aria-labelledby="account-delete" className="flex flex-col gap-4 border-t border-wine/40 pt-10">
      <h2 id="account-delete" className={`${SECTION_HEADING} text-wine`}>Hesabımı sil</h2>
      <div className="flex flex-col gap-3 font-body text-lg leading-relaxed text-soot-soft">
        <p>
          Hesabınızı sildiğinizde hesabınız, tüm davetiyeleriniz ve misafirlerinizin katılım yanıtları
          hemen ve kalıcı olarak silinir; yayındaki davetiye linkleriniz çalışmayı durdurur. Ödemesi
          onaylanmamış siparişleriniz iptal edilir.
        </p>
        <p>
          Mesafeli satış sözleşmesi ve onay kayıtlarınız, yasal saklama süresi (en az 3 yıl) boyunca
          saklanır. Ayrıntılar{" "}
          <Link href="/kvkk-aydinlatma-metni" className={TEXT_LINK}>KVKK Aydınlatma Metni</Link>&apos;nde.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Onaylamak için şifreniz"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <FormError message={error} />}
        <div>
          <button type="submit" className={BUTTON_PRIMARY}>
            Hesabımı Sil
          </button>
        </div>
      </form>
      <DeleteAccountDialog
        open={confirmOpen}
        busy={busy}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
