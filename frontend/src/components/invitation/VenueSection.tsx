import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { Framed } from "@/components/art/Framed";
import { SectionHeading } from "@/components/art/SectionHeading";

/** The venue, on the dark olive band: the dark floral still life in the
 * gilded rectangular frame, centred, then the heading, the venue's name
 * and address and the map button under it. mapUrl is optional by design:
 * a venue only needs a name and an address to be usable. */
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
    <section className="olive-band px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Framed
          shape="rect"
          painting={art.darkFlorals}
          focus="50% 38%"
          sizes="(min-width: 640px) 18rem, 60vw"
          className="mb-12 w-[min(60vw,15rem)] sm:w-72"
        />
        <SectionHeading tone="light">{t.venue.heading}</SectionHeading>
        <p className="mt-10 font-display text-3xl leading-tight text-paper text-balance sm:text-4xl">
          {name ?? t.venue.name}
        </p>
        <p className="mt-4 max-w-[40ch] font-body text-lg leading-relaxed text-paper/80">
          {address ?? t.venue.address}
        </p>
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apparatus mt-9 inline-block border border-paper/70 px-7 py-3.5 text-sm text-paper transition-[background-color,color,transform] duration-200 hover:bg-paper hover:text-soot active:scale-[0.97]"
          >
            {t.venue.mapCta}
          </a>
        )}
      </div>
    </section>
  );
}
