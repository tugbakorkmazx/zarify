import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";

export function ScheduleSection() {
  const { t } = useI18n();

  return (
    <section className="paper-ground px-6 sm:px-16 lg:px-24 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          {t.schedule.heading}
        </h2>
        <IlluminatedRule className="my-6" />

        <ol className="w-full mt-8 flex flex-col divide-y divide-gold/25">
          {t.schedule.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-6 text-left"
            >
              <span className="font-display text-lg text-gold-deep sm:w-28 shrink-0">
                {item.time}
              </span>
              <div>
                <p className="font-body text-lg text-ink">{item.title}</p>
                <p className="font-body text-sm text-ink-soft mt-1">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
