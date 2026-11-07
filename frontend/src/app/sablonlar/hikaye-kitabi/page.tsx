import type { Metadata } from "next";
import Link from "next/link";
import { StorybookPreview } from "@/components/templates/StorybookPreview";

export const metadata: Metadata = {
  title: "Hikâye Kitabı · Zarify",
  description: "Sayfaları çevrilen interaktif hikâye kitabı davetiye şablonu önizlemesi.",
};

export default function StorybookPage() {
  return (
    <main>
      <nav className="flex items-center justify-between bg-[#ede6d8] px-5 py-4 text-sm text-[#53443c]">
        <Link href="/sablonlar/kategori/dugun">← Düğün şablonları</Link>
        <Link href="/">ZARIFY</Link>
      </nav>
      <StorybookPreview />
    </main>
  );
}
