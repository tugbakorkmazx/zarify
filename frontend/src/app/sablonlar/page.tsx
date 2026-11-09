import type { Metadata } from "next";
import { TemplateGalleryBody } from "@/components/templates/TemplateGalleryBody";

export const metadata: Metadata = {
  title: "Davetiyeler ve Şablonlar — Zarify",
  description:
    "Düğün, nişan, söz, kına, doğum günü ve diğer özel günleriniz için Zarify davetiye kategorilerini keşfedin.",
};

export default function TemplateGalleryPage() {
  return <TemplateGalleryBody />;
}
