import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";

// Static class names so Tailwind can see them — one column per filled block.
const COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1 max-w-md",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

/** "Good to know" notes. Each block appears only if its text is set; the
 * caller skips the whole section when none are. */
export function InfoBlocks({
  dressCode,
  giftNote,
  accommodationNote,
}: {
  dressCode?: string | null;
  giftNote?: string | null;
  accommodationNote?: string | null;
}) {
  const { t } = useI18n();
  const blocks = [
    { title: t.info.dressCode.title, body: dressCode },
    { title: t.info.giftList.title, body: giftNote },
    { title: t.info.accommodation.title, body: accommodationNote },
  ].filter((block): block is { title: string; body: string } => Boolean(block.body));

  if (blocks.length === 0) {
    return null;
  }

  return (
    <section className="paper-ground px-6 sm:px-16 lg:px-24 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          {t.info.heading}
        </h2>
        <IlluminatedRule className="my-6" />

        <div
          className={`mt-8 grid grid-cols-1 ${COLUMNS[blocks.length]} gap-10 sm:gap-8 w-full text-left`}
        >
          {blocks.map((block) => (
            <div key={block.title} className="flex flex-col gap-3">
              <h3 className="font-display text-xl text-ink">{block.title}</h3>
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="font-body text-sm leading-relaxed text-ink-soft whitespace-pre-line">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
