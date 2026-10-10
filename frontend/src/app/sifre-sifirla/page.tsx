import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Yeni Şifre — Zarify",
  // The URL carries a one-time token: keep it out of indexes and referrers.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({ searchParams }: PageProps<"/sifre-sifirla">) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={typeof token === "string" && token.length > 0 ? token : null} />;
}
