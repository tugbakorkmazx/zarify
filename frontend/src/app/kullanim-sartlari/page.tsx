import type { Metadata } from "next";
import { TermsOfUse } from "@/components/legal/docs/TermsOfUse";

export const metadata: Metadata = {
  title: "Kullanım Şartları — Zarify",
  description: "Zarify dijital davetiye platformunun kullanım şartları.",
};

export default function Page() {
  return <TermsOfUse />;
}
