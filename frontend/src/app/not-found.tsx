import type { Metadata } from "next";
import { StatusPage } from "@/components/status/StatusPage";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı — Zarify",
  robots: { index: false, follow: false },
};

/** Any URL that matches no page (and every notFound() call). */
export default function NotFound() {
  return (
    <StatusPage
      tr={{
        eyebrow: "404",
        title: "Bu sayfayı bulamadık.",
        body: "Bağlantı yanlış yazılmış ya da sayfa kaldırılmış olabilir. Bir davetiye arıyorsanız, size gönderilen linki kontrol edin.",
      }}
      en={{
        eyebrow: "404",
        title: "We couldn’t find this page.",
        body: "The link may be mistyped, or the page may have been removed. If you’re looking for an invitation, please check the link you were sent.",
      }}
    />
  );
}
