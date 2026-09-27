import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { coupleInitials } from "@/lib/coupleInitials";
import { Painting } from "@/components/art/Painting";

/** The closing: the pastoral sunset full-bleed, "with love, we'll be
 * waiting" and the couple's signature in Pinyon Script centred in its sky. */
export function SiteFooter({ names }: { names?: string }) {
  const { t } = useI18n();
  const signature = names ? coupleInitials(names) : t.footer.signature;

  return (
    <footer className="on-painting relative isolate flex min-h-[80svh] items-start justify-center overflow-hidden px-5 pt-[16svh] pb-24 sm:px-10">
      <Painting piece={art.pastoralSunset} shade="soft" />
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-body text-2xl italic sm:text-3xl">{t.footer.closing}</p>
        <p className="font-script text-6xl leading-tight sm:text-7xl">{signature}</p>
      </div>
    </footer>
  );
}
