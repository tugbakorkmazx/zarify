import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { coupleInitials } from "@/lib/coupleInitials";
import { Painting } from "@/components/art/Painting";
import { CoverCard } from "@/components/art/LaceCard";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { Countdown } from "./Countdown";
import { LanguageToggle } from "./LanguageToggle";

/** The cover: the swan-lake painting full-bleed, the lace card centred on
 * it with the names, invite line, date and venue in dark ink inside its
 * oval, and the ivory countdown centred under the card. */
export function Hero({
  eventDate,
  names,
  dateLine,
  venueLine,
}: {
  eventDate: Date;
  /** Overrides the placeholder couple names / date / venue line once an
   * owner has filled in their own details via the invitation-details form. */
  names?: string;
  dateLine?: string;
  venueLine?: string;
}) {
  const { t } = useI18n();
  const shownNames = names ?? t.hero.names;

  const rise = (index: number) => ({
    animation: `hero-rise 850ms var(--ease-out-strong) ${index * 110}ms both`,
  });

  return (
    <section className="on-painting relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-5 pb-12 sm:px-10 sm:pt-7">
      <Painting piece={art.swanLake} shade="soft" priority />

      <header className="relative z-10 grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center">
        <span />
        <p className="apparatus text-sm text-paper/85">
          {coupleInitials(shownNames)} · {t.hero.folio}
        </p>
        <div className="flex justify-end">
          <LanguageToggle tone="paper" />
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 pt-8 sm:gap-6">
        <div className="settle-in w-[min(78vw,21rem)] sm:w-[23rem]">
          <CoverCard
            as="h1"
            names={<CoupleNames names={shownNames} stacked />}
            invite={t.hero.invite}
            dateLine={dateLine ?? t.hero.dateLine}
            venueLine={venueLine ?? t.hero.venueLine}
            preload
            sizes="(min-width: 640px) 23rem, 78vw"
          />
        </div>
        <div style={rise(3)}>
          <Countdown target={eventDate} />
        </div>
      </div>
    </section>
  );
}
