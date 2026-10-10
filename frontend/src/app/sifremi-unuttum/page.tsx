import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Şifremi Unuttum — Zarify",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
