import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { SectionHeading } from "@/components/art/SectionHeading";

/** Our story, on the wine band: the dried rose branch centred on top, the
 * heading and the couple's text centred under it. */
export function StorySection({ text }: { text: string }) {
  const { t } = useI18n();

  return (
    <section className="wine-band px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Image
          src={art.roseBranch.src}
          alt=""
          width={art.roseBranch.width}
          height={art.roseBranch.height}
          sizes="(min-width: 640px) 13rem, 10rem"
          className="object-shadow mb-8 h-auto w-40 sm:w-52"
        />
        <SectionHeading tone="light">{t.story.heading}</SectionHeading>
        <p className="mt-10 max-w-[56ch] whitespace-pre-line font-body text-lg leading-[1.75] text-paper/90 sm:text-xl">
          {text}
        </p>
      </div>
    </section>
  );
}
