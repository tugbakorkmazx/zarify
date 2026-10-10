import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabım — Zarify",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: LayoutProps<"/hesabim">) {
  return children;
}
