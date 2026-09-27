"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageToggle({ tone = "soot" }: { tone?: "soot" | "paper" }) {
  const { lang, setLang, t } = useI18n();
  const colors =
    tone === "paper"
      ? "text-paper border-paper/50 hover:border-paper hover:bg-paper hover:text-soot"
      : "text-soot border-soot/40 hover:border-soot hover:bg-soot hover:text-paper";

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      className={`apparatus rounded-full border px-3.5 py-1 text-sm transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] ${colors}`}
      aria-label={lang === "tr" ? "Switch to English" : "Türkçeye geç"}
    >
      {t.nav.toggleTo}
    </button>
  );
}
