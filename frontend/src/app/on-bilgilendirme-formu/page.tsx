import type { Metadata } from "next";
import { PreContractInfo } from "@/components/legal/docs/SalesDocs";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu — Zarify",
  description: "Dijital davetiye hizmeti için ön bilgilendirme formu.",
};

export default function Page() {
  return <PreContractInfo />;
}
