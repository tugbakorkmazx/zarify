"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/auth/FormField";
import { FormError } from "@/components/auth/FormError";
import { BUTTON_PRIMARY, TEXT_LINK } from "@/lib/ui";

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
        <p className="mt-10 border-t border-soot/20 pt-6 font-body text-lg text-soot-soft">
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className={TEXT_LINK}
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
          className={`mt-4 w-full ${BUTTON_PRIMARY}`}
        >
          {submitting ? "Hesap oluşturuluyor…" : "Hesap Oluştur"}
        </button>

        <p className="font-body text-sm leading-relaxed text-soot-soft">
          Hesap oluşturarak{" "}
          <Link
            href="/kullanim-sartlari"
            className={TEXT_LINK}
          >
            Kullanım Şartları
          </Link>
          &apos;nı kabul etmiş olursunuz. Verilerinizin nasıl işlendiğini{" "}
          <Link
            href="/gizlilik"
            className={TEXT_LINK}
          >
            Gizlilik Politikası
          </Link>
          &apos;nda bulabilirsiniz.
        </p>
      </form>
    </AuthLayout>
  );
}
