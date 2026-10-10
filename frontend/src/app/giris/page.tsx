import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/nextPath";

export const metadata: Metadata = {
  title: "Giriş Yap — Zarify",
};

/** ?sifre=degisti — arriving from a completed password reset.
 * ?next=/davetiyelerim/… — where to go back to after signing in (same-site
 * paths only; anything else is ignored). */
export default async function LoginPage({ searchParams }: PageProps<"/giris">) {
  const { sifre, next } = await searchParams;
  return (
    <LoginForm passwordChanged={sifre === "degisti"} next={safeNextPath(typeof next === "string" ? next : null)} />
  );
}
