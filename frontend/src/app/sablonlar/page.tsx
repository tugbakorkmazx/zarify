import type { Metadata } from "next";
import { TemplateGalleryBody } from "@/components/templates/TemplateGalleryBody";

export const metadata: Metadata = {
  title: "Şablonlar — Zarify",
  description: "Düğün davetiyeniz için bir şablon seçin.",
};

export default function TemplateGalleryPage() {
  return <TemplateGalleryBody />;
}
