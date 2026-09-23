"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";

export function LoginForm() {
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
      router.push("/davetiyelerim");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
      );
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Hesabım"
      title="Tekrar hoş geldiniz."
      footer={
        <p className="mt-8 text-center font-body text-sm text-ink-soft">
          Hesabın yok mu?{" "}
          <Link
            href="/kayit"
            className="text-ink underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            Kayıt ol
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

        {error && <FormError message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97] disabled:opacity-60"
        >
          {submitting ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
    </AuthLayout>
  );
}
