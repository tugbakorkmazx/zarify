import type { Metadata } from "next";
import { KvkkNotice } from "@/components/legal/docs/KvkkNotice";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Zarify",
  description: "Davetiye sahipleri ve misafirler için KVKK md. 10 kapsamındaki aydınlatma metni.",
};

export default function Page() {
  return <KvkkNotice />;
}
