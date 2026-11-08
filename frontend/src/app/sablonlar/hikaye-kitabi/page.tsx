import type { Metadata } from "next";
import { TemplateGalleryPreview } from "@/components/templates/TemplateGalleryPreview";
import { STORYBOOK_NAME } from "@/lib/templates";

export const metadata: Metadata = {
  title: `${STORYBOOK_NAME} · Zarify`,
  description: "Olivarya, sayfaları çevrilen etkileşimli düğün davetiyesi şablonu.",
};

export default function StorybookPage() {
  return <TemplateGalleryPreview templateSlug="hikaye-kitabi" />;
}
