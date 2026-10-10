"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";
import { BUTTON_PRIMARY, TEXT_LINK } from "@/lib/ui";
import { describeError } from "@/lib/apiErrors";

export function LoginForm({ passwordChanged = false, next = null }: { passwordChanged?: boolean; next?: string | null }) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(next ?? "/davetiyelerim");
    } catch (err) {
      setError(describeError(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Hesabım"
      title="Tekrar hoş geldiniz."
      footer={
        <p className="mt-10 border-t border-soot/20 pt-6 font-body text-lg text-soot-soft">
          Hesabın yok mu?{" "}
          <Link
            href="/kayit"
            className={TEXT_LINK}
          >
            Kayıt ol
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {next && !passwordChanged && (
          <p role="status" className="bg-paper-deep px-5 py-4 font-body text-lg text-soot">
            Oturumunuz sona erdi. Giriş yaptıktan sonra kaldığınız sayfaya döneceksiniz.
          </p>
        )}
        {passwordChanged && (
          <p role="status" className="bg-olive px-5 py-4 font-body text-lg text-paper">
            Şifreniz değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.
          </p>
        )}
        <FormField
          label="E-posta"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="Şifre"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="-mt-3 text-right">
          <Link href="/sifremi-unuttum" className={`apparatus text-sm ${TEXT_LINK}`}>
            Şifremi unuttum
          </Link>
        </p>

        {error && <FormError message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className={`mt-4 w-full ${BUTTON_PRIMARY}`}
        >
          {submitting ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
    </AuthLayout>
  );
}
