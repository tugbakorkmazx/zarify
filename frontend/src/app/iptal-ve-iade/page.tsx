import type { Metadata } from "next";
import { RefundPolicy } from "@/components/legal/docs/SalesDocs";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası — Zarify",
  description: "Dijital davetiye hizmetinde cayma hakkı, iptal ve iade koşulları.",
};

export default function Page() {
  return <RefundPolicy />;
}
