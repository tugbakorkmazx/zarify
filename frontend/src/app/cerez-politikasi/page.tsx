import type { Metadata } from "next";
import { CookiePolicy } from "@/components/legal/docs/CookiePolicy";

export const metadata: Metadata = {
  title: "Çerez Politikası — Zarify",
  description: "Zarify çerez kullanmaz; tarayıcıda tutulan zorunlu bilgiler ve süreleri.",
};

export default function Page() {
  return <CookiePolicy />;
}
