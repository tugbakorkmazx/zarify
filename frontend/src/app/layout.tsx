import type { Metadata } from "next";
import { EB_Garamond, Gloock, Pinyon_Script } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { SITE_URL } from "@/lib/apiUrl";
import "./globals.css";

// Magazine-cover display voice (see DESIGN.md). Single weight that reads
// as bold at size.
const gloock = Gloock({
  variable: "--font-gloock",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

// Body and small-caps apparatus.
const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Copperplate hand — once per page, as a signature (DESIGN.md's Single
// Script Rule).
const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  // Makes Open Graph image URLs absolute — share previews need that.
  metadataBase: new URL(SITE_URL),
  title: "Zarify — Dijital Düğün Davetiyesi",
  description:
    "Şablon seçin, bilgilerinizi girin; düğün davetiyesi sayfanız dakikalar içinde hazır olsun.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${gloock.variable} ${ebGaramond.variable} ${pinyonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider initialLang="tr">{children}</I18nProvider>
      </body>
    </html>
  );
}
