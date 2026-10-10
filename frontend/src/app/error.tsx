"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/status/StatusPage";
import { useI18n } from "@/lib/i18n";
import { BUTTON_SECONDARY } from "@/lib/ui";

/** An unexpected error while rendering a page. Offers a retry (re-renders
 * the segment) and a way home; the error itself is logged, never shown. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <StatusPage
      tr={{
        eyebrow: "Bir sorun oluştu",
        title: "Bu sayfa şu anda açılamadı.",
        body: "Beklenmedik bir hata oldu. Lütfen tekrar deneyin; sorun sürerse biraz sonra yeniden ziyaret edin.",
      }}
      en={{
        eyebrow: "Something went wrong",
        title: "This page couldn’t be opened.",
        body: "An unexpected error occurred. Please try again; if it keeps happening, come back a little later.",
      }}
      action={
        <button type="button" onClick={reset} className={BUTTON_SECONDARY}>
          {lang === "tr" ? "Tekrar Dene" : "Try Again"}
        </button>
      }
    />
  );
}
