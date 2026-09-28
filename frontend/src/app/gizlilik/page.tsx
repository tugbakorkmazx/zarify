import type { Metadata } from "next";
import { PrivacyPolicy } from "@/components/legal/docs/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Zarify",
  description: "Zarify gizlilik taahhütlerinin özeti.",
};

export default function Page() {
  return <PrivacyPolicy />;
}
