import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Giriş Yap — Zarify",
};

/** ?sifre=degisti — arriving from a completed password reset. */
export default async function LoginPage({ searchParams }: PageProps<"/giris">) {
  const { sifre } = await searchParams;
  return <LoginForm passwordChanged={sifre === "degisti"} />;
}
