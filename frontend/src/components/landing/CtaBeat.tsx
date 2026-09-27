"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { BUTTON_PRIMARY_LIGHT } from "@/lib/ui";
import { Reveal } from "./Reveal";

/** The closing call to action, centred on the wine band. */
export function CtaBeat() {
  const { user } = useAuth();
  const { t } = useI18n();
  const l = t.landing.cta;

  return (
    <section className="wine-band px-5 py-24 sm:px-10 sm:py-32">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="max-w-[16ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.02em] text-balance">
          {l.heading}
        </h2>
        <p className="mt-6 max-w-[48ch] font-body text-xl leading-relaxed text-paper/85">{l.body}</p>
        <Link href={user ? "/davetiye-bilgileri" : "/kayit"} className={`mt-10 ${BUTTON_PRIMARY_LIGHT}`}>
          {l.button}
        </Link>
      </Reveal>
    </section>
  );
}
