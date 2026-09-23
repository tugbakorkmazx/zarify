import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";

/** mapUrl is optional by design: a venue only needs a name and an address
 * to be usable. When the owner adds a map link, the CTA appears; otherwise
 * the section still stands on plain text alone. */
export function VenueSection({
  mapUrl,
  name,
  address,
}: {
  mapUrl?: string;
  name?: string;
  address?: string;
}) {
  const { t } = useI18n();

  return (
    <section className="paper-ground-deep px-6 sm:px-16 lg:px-24 py-20 sm:py-28">
      <div className="mx-auto max-w-xl flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          {t.venue.heading}
        </h2>
        <IlluminatedRule className="my-6" />
        <p className="font-body text-lg text-ink">{name ?? t.venue.name}</p>
        <p className="font-body text-base text-ink-soft mt-2 max-w-sm">
          {address ?? t.venue.address}
        </p>
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 font-body text-sm tracking-[0.15em] uppercase text-gold-deep border-b border-gold-deep/60 pb-0.5 hover:text-ink hover:border-ink transition-colors"
          >
            {t.venue.mapCta}
          </a>
        )}
      </div>
    </section>
  );
}
