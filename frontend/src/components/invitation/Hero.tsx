import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";
import { Countdown } from "./Countdown";
import { LanguageToggle } from "./LanguageToggle";
import { BotanicalSprig } from "@/components/ornament/BotanicalSprig";

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

  return (
    <section className="relative min-h-[100svh] paper-ground flex flex-col overflow-hidden">
      <div className="flex justify-end px-6 pt-6 sm:px-10 sm:pt-8">
        <LanguageToggle />
      </div>

      {/* Sits in the asymmetric negative space the hero already reserves to
          the right of the names — a single accent, not a wraparound border. */}
      <BotanicalSprig
        className="absolute right-8 top-1/3 w-24 h-36 opacity-80 pointer-events-none hidden lg:block"
        delay={900}
      />

      <div className="flex-1 flex flex-col items-start justify-center px-6 sm:px-16 lg:px-24 py-16 max-w-3xl">
        <p className="font-script text-xl sm:text-2xl text-ink-soft mb-3">
          {t.hero.invite}
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-ink">
          {names ?? t.hero.names}
        </h1>
        <IlluminatedRule className="mt-6 mb-6" />
        <p className="font-body text-lg sm:text-xl text-ink">
          {dateLine ?? t.hero.dateLine}
        </p>
        <p className="font-body text-base sm:text-lg text-ink-soft">
          {venueLine ?? t.hero.venueLine}
        </p>
      </div>

      <div className="px-6 sm:px-16 lg:px-24 pb-12 sm:pb-16 self-center sm:self-start">
        <Countdown target={eventDate} />
      </div>
    </section>
  );
}
