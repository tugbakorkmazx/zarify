import type { Metadata } from "next";
import { TemplateGalleryPreview } from "@/components/templates/TemplateGalleryPreview";

export const metadata: Metadata = {
  title: "Hikâye Kitabı · Zarify",
  description: "Sayfaları çevrilen interaktif hikâye kitabı davetiye şablonu önizlemesi.",
};

export default function StorybookPage() {
  return <TemplateGalleryPreview templateSlug="hikaye-kitabi" />;
}
