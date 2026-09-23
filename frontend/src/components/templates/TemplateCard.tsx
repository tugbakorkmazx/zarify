"use client";

import Link from "next/link";
import type { TemplateSummary } from "@/lib/templates";
import { useI18n } from "@/lib/i18n";
import { BotanicalSprig } from "@/components/ornament/BotanicalSprig";
import { DeckleEdge } from "@/components/ornament/DeckleEdge";

/** A template's card doubles as its own preview: no screenshot asset, just
 * the template's real palette and display face rendered small, so the card
 * is honest about what the template actually looks like. */
export function TemplateCard({ template }: { template: TemplateSummary }) {
  const { t } = useI18n();
  const l = t.landing.templateTeaser;
  const [ground, accentColor, ink] = template.palette;
  const isLive = template.status === "live";

  const inner = (
    <div className="group relative flex flex-col overflow-hidden border border-gold/30 transition-[border-color,transform] duration-300 hover:border-gold active:scale-[0.98]">
      <div
        className="relative flex h-56 items-center justify-center overflow-hidden"
        style={{ backgroundColor: ground }}
      >
        {isLive && (
          <BotanicalSprig
            className="absolute top-2 right-4 w-10 h-16 opacity-80 pointer-events-none"
          />
        )}
        {isLive ? (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <span
              className="font-body text-[0.65rem] tracking-[0.2em] uppercase"
              style={{ color: accentColor }}
            >
              {l.liveName}
            </span>
            <span
              className="font-display text-3xl"
              style={{ color: ink }}
            >
              {l.livePreview}
            </span>
            <span
              aria-hidden="true"
              className="h-px w-16 origin-center scale-x-50 transition-transform duration-500 ease-out group-hover:scale-x-100"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <span
              className="h-8 w-8 rounded-full border"
              style={{ borderColor: accentColor }}
              aria-hidden="true"
            />
            <span
              className="font-body text-xs tracking-[0.15em] uppercase"
              style={{ color: accentColor }}
            >
              {l.soonLabel}
            </span>
          </div>
        )}
      </div>

      <DeckleEdge className="relative -mt-1" />
      <div className="paper-ground flex flex-1 flex-col gap-2 px-6 py-6">
        <h3 className="font-display text-xl text-ink">{template.name}</h3>
        <p className="font-body text-sm leading-relaxed text-ink-soft">
          {template.description}
        </p>
        {isLive && (
          <span className="mt-2 inline-flex items-center gap-2 font-body text-sm text-gold-deep">
            {l.liveLabel}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        )}
      </div>
    </div>
  );

  if (!isLive) {
    return (
      <div aria-disabled="true" className="pointer-events-none cursor-not-allowed opacity-70">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/sablonlar/${template.slug}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {inner}
    </Link>
  );
}
