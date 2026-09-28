import type { Metadata } from "next";
import { DistanceSalesContract } from "@/components/legal/docs/SalesDocs";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi — Zarify",
  description: "Dijital davetiye hizmeti mesafeli satış sözleşmesi.",
};

export default function Page() {
  return <DistanceSalesContract />;
}
