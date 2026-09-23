import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";
import { coupleInitials } from "@/lib/coupleInitials";

export function SiteFooter({ names }: { names?: string }) {
  const { t } = useI18n();
  const signature = names ? coupleInitials(names) : t.footer.signature;

  return (
    <footer className="paper-ground px-6 py-16 flex flex-col items-center gap-4 text-center">
      <IlluminatedRule />
      <p className="font-body text-base text-ink-soft">{t.footer.closing}</p>
      <p className="font-script text-3xl text-gold-deep">{signature}</p>
    </footer>
  );
}
