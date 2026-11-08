import type { Metadata } from "next";
import Link from "next/link";
import { StorybookPreview } from "@/components/templates/StorybookPreview";

export const metadata: Metadata = {
  title: "Hikâye Kitabı · Zarify",
  description: "Sayfaları çevrilen interaktif hikâye kitabı davetiye şablonu önizlemesi.",
};

export default function StorybookPage() {
  return (
    <main
      className="flex min-h-svh flex-col"
      style={{ background: "linear-gradient(#4d4a3c3d,#4d4a3c3d), url(/storybook/background.png) center / cover, #a5a28b" }}
    >
      <nav className="flex items-center justify-between gap-4 bg-transparent px-5 py-4 text-sm text-[#fff8e8] [text-shadow:0_1px_4px_#242b25,0_1px_2px_#242b25]">
        <Link href="/sablonlar/kategori/dugun">← Düğün şablonları</Link>
        <Link href="/">ZARIFY</Link>
      </nav>
      <StorybookPreview />
    </main>
  );
}
