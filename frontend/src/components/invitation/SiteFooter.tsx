import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { coupleInitials } from "@/lib/coupleInitials";
import { Painting } from "@/components/art/Painting";
import Link from "next/link";
import { legalTitle } from "@/lib/legal";

/** The closing: the pastoral sunset full-bleed, "with love, we'll be
 * waiting" and the couple's signature in Pinyon Script centred in its sky. */
export function SiteFooter({ names }: { names?: string }) {
  const { t, lang } = useI18n();
  const signature = names ? coupleInitials(names) : t.footer.signature;

  return (
    <footer className="on-painting relative isolate flex min-h-[80svh] items-start justify-center overflow-hidden px-5 pt-[16svh] pb-24 sm:px-10">
      <Painting piece={art.pastoralSunset} shade="soft" />
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-body text-2xl italic sm:text-3xl">{t.footer.closing}</p>
        <p className="font-script text-6xl leading-tight sm:text-7xl">{signature}</p>
      </div>
      {/* The notices that concern guests, kept quiet at the foot of the painting. */}
      <nav className="absolute inset-x-0 bottom-5 flex flex-wrap justify-center gap-x-5 gap-y-2 px-5">
        {["/kvkk-aydinlatma-metni", "/gizlilik", "/cerez-politikasi"].map((href) => (
          <Link key={href} href={href} className="apparatus text-xs text-paper/75 transition-colors hover:text-paper">
            {legalTitle(href, lang)}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
