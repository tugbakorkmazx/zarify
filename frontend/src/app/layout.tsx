import type { Metadata } from "next";
import { Bodoni_Moda, EB_Garamond, Petit_Formal_Script } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// A sparing script accent — never a display or body face, only for the
// occasional signature-style flourish (see DESIGN.md's Script Restraint Rule).
const petitFormalScript = Petit_Formal_Script({
  variable: "--font-petit-formal-script",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Zarify — Dijital Düğün Davetiyesi",
  description:
    "Şablon seçin, bilgilerinizi girin, dakikalar içinde paylaşılabilir bir düğün davetiyesi sayfanız hazır olsun.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${bodoniModa.variable} ${ebGaramond.variable} ${petitFormalScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider initialLang="tr">{children}</I18nProvider>
      </body>
    </html>
  );
}
