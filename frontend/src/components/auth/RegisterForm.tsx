"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ email, password, firstName, lastName });
      router.push("/davetiye-bilgileri");
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
      eyebrow="Hesap Oluştur"
      title="Davetiyenize başlayın."
      footer={
        <p className="mt-8 text-center font-body text-sm text-ink-soft">
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className="text-ink underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            Giriş yap
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Ad"
            type="text"
            name="firstName"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FormField
            label="Soyad"
            type="text"
            name="lastName"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
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
          hint="En az 8 karakter"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <FormError message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 font-body text-sm text-ink bg-gold-light rounded-full px-6 py-3 border border-gold-deep/40 transition-[filter,transform] duration-150 hover:brightness-105 active:brightness-95 active:scale-[0.97] disabled:opacity-60"
        >
          {submitting ? "Hesap oluşturuluyor…" : "Hesap Oluştur"}
        </button>
      </form>
    </AuthLayout>
  );
}
