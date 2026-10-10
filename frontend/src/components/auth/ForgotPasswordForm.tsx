"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";
import { BUTTON_PRIMARY, TEXT_LINK } from "@/lib/ui";
import { describeError } from "@/lib/apiErrors";

/** Asks for a reset link. The answer is the same whether or not the
 * address has an account, so the page never confirms who's registered. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Şifremi Unuttum"
      title="Şifrenizi sıfırlayın."
      footer={
        <p className="mt-10 border-t border-soot/20 pt-6 font-body text-lg text-soot-soft">
          Şifrenizi hatırladınız mı?{" "}
          <Link href="/giris" className={TEXT_LINK}>
            Giriş yap
          </Link>
        </p>
      }
    >
      {sent ? (
        <div role="status" className="flex flex-col gap-4 font-body text-lg leading-relaxed text-soot">
          <p>
            <strong className="font-semibold">{email}</strong> adresi kayıtlıysa, şifrenizi sıfırlamanız
            için bir bağlantı gönderdik.
          </p>
          <p className="text-soot-soft">
            Bağlantı 1 saat geçerlidir. E-posta birkaç dakika içinde gelmezse gereksiz (spam) klasörünüze
            bakın ya da birazdan tekrar deneyin.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <p className="font-body text-lg leading-relaxed text-soot-soft">
            Hesabınızın e-posta adresini yazın; yeni şifre belirlemeniz için bir bağlantı gönderelim.
          </p>
          <FormField
            label="E-posta"
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={256}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <FormError message={error} />}

          <button type="submit" disabled={submitting} className={`mt-4 w-full ${BUTTON_PRIMARY}`}>
            {submitting ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
