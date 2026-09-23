import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";

export function InfoBlocks({ includeDressCode = true }: { includeDressCode?: boolean }) {
  const { t } = useI18n();
  const blocks = includeDressCode
    ? [t.info.dressCode, t.info.giftList, t.info.accommodation]
    : [t.info.giftList, t.info.accommodation];

  return (
    <section className="paper-ground px-6 sm:px-16 lg:px-24 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          {t.info.heading}
        </h2>
        <IlluminatedRule className="my-6" />

        <div
          className={`mt-8 grid grid-cols-1 ${includeDressCode ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-10 sm:gap-8 w-full text-left`}
        >
          {blocks.map((block) => (
            <div key={block.title} className="flex flex-col gap-3">
              <h3 className="font-display text-xl text-ink">{block.title}</h3>
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="font-body text-sm leading-relaxed text-ink-soft">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
