"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword, useAuth } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";
import { BUTTON_PRIMARY } from "@/lib/ui";
import { ApiError, describeError } from "@/lib/apiErrors";

/** The page the emailed link opens (/sifre-sifirla?token=…). On success
 * every session ends server-side, so this browser's stored one is dropped
 * too and the owner goes to sign in with the new password. */
export function ResetPasswordForm({ token }: { token: string | null }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [linkDead, setLinkDead] = useState(!token);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (password !== confirm) {
      setError("Şifreler birbiriyle aynı değil.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      logout();
      router.replace("/giris?sifre=degisti");
    } catch (err) {
      if (err instanceof ApiError && err.code === "RESET_TOKEN_INVALID") {
        setLinkDead(true);
      } else {
        setError(describeError(err));
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout eyebrow="Şifre Sıfırlama" title="Yeni şifrenizi belirleyin.">
      {linkDead ? (
        <div role="alert" className="flex flex-col gap-6 font-body text-lg leading-relaxed text-soot">
          <p>
            Bu bağlantı geçersiz ya da süresi dolmuş. Bağlantılar 1 saat geçerlidir, yalnızca bir kez
            kullanılabilir ve yeni bir istek yapıldığında öncekiler geçersiz olur.
          </p>
          <Link href="/sifremi-unuttum" className={`w-full text-center ${BUTTON_PRIMARY}`}>
            Yeni Bağlantı İste
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormField
            label="Yeni şifre"
            hint="En az 8 karakter"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormField
            label="Yeni şifre (tekrar)"
            type="password"
            name="confirm"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <FormError message={error} />}

          <button type="submit" disabled={submitting} className={`mt-4 w-full ${BUTTON_PRIMARY}`}>
            {submitting ? "Kaydediliyor…" : "Şifremi Değiştir"}
          </button>
          <p className="font-body text-sm leading-relaxed text-soot-soft">
            Şifreniz değişince açık olan tüm oturumlarınız kapanır; yeni şifrenizle tekrar giriş yaparsınız.
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
