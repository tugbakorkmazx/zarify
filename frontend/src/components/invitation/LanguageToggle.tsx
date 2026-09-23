"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      className="font-body text-xs tracking-[0.2em] uppercase text-ink-soft border border-gold/50 rounded-full px-3 py-1.5 hover:border-gold hover:text-ink transition-colors"
      aria-label={lang === "tr" ? "Switch to English" : "Türkçeye geç"}
    >
      {t.nav.toggleTo}
    </button>
  );
}
