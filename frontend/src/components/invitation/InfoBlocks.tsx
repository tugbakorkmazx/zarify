import { useI18n } from "@/lib/i18n";
import { SectionHeading } from "@/components/art/SectionHeading";

// Static class names so Tailwind can see them — one column per filled block.
const COLUMNS: Record<number, string> = {
  1: "max-w-md",
  2: "max-w-3xl md:grid-cols-2",
  3: "max-w-5xl md:grid-cols-3",
};

/** "Good to know", on ivory paper: the heading centred, then dress code,
 * gifts and accommodation as equal centred blocks. Each block appears only
 * if its text is set; the section disappears when none are. */
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
    <section className="paper-ground px-5 py-24 sm:px-10 sm:py-32">
      <SectionHeading>{t.info.heading}</SectionHeading>
      <div className={`mx-auto mt-14 grid grid-cols-1 gap-x-12 gap-y-12 ${COLUMNS[blocks.length]}`}>
        {blocks.map((block) => (
          <div key={block.title} className="flex flex-col items-center gap-3 text-center">
            <h3 className="font-display text-2xl leading-tight text-soot">{block.title}</h3>
            <span aria-hidden="true" className="h-px w-10 bg-wine/60" />
            <p className="max-w-[36ch] whitespace-pre-line font-body text-lg leading-relaxed text-soot-soft">
              {block.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
