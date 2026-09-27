import { useI18n } from "@/lib/i18n";
import { SectionHeading } from "@/components/art/SectionHeading";

export interface ScheduleEntry {
  time: string;
  title: string;
  description?: string | null;
}

/** The day's programme on ivory paper: a single centred column, each entry
 * with its time large in wine on top and the event and its note under it,
 * separated by short hairlines. */
export function ScheduleSection({ items }: { items: ScheduleEntry[] }) {
  const { t } = useI18n();

  return (
    <section className="paper-ground px-5 py-24 sm:px-10 sm:py-32">
      <SectionHeading>{t.schedule.heading}</SectionHeading>
      <ol className="mx-auto mt-14 flex max-w-xl flex-col items-center">
        {items.map((item, index) => (
          <li key={`${item.time}-${index}`} className="flex flex-col items-center text-center">
            {index > 0 && <span aria-hidden="true" className="my-9 h-10 w-px bg-soot/30" />}
            <span className="font-display numerals text-4xl leading-none text-wine sm:text-5xl">
              {item.time}
            </span>
            <p className="mt-3 font-display text-2xl leading-tight text-soot">{item.title}</p>
            {item.description && (
              <p className="mt-2 max-w-[44ch] font-body text-lg leading-relaxed text-soot-soft">
                {item.description}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
