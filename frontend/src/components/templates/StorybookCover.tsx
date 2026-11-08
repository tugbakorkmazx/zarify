import Image from "next/image";
import { coupleInitials } from "@/lib/coupleInitials";
import cover from "../../../public/storybook/cover.png";

export const STORYBOOK_SAMPLE_NAMES = "Elif & Kerem";

export function StorybookCover({
  names = STORYBOOK_SAMPLE_NAMES,
  miniature = false,
}: {
  names?: string;
  miniature?: boolean;
}) {
  return (
    <span className="pointer-events-none absolute inset-0 @container">
      <Image
        src={cover}
        alt={miniature ? "" : "Yeşil, altın işlemeli kitap kapağı"}
        fill
        sizes={miniature ? "(min-width: 768px) 300px, 50vw" : "(min-width: 640px) 380px, 100vw"}
        loading={miniature ? "lazy" : "eager"}
        unoptimized
        className="object-contain drop-shadow-[5px_9px_14px_#2d302880]"
      />
      <span aria-hidden={!miniature} className="absolute inset-x-[19%] inset-y-[21%] flex flex-col items-center justify-center text-center text-[#f4dfab] [text-shadow:0_2px_4px_#232914]">
        <span aria-hidden="true" className="grid size-[19cqw] shrink-0 place-items-center whitespace-nowrap rounded-full border border-[#d7bd82]/75 font-body text-[5.5cqw] italic leading-none">
          {coupleInitials(names)}
        </span>
        <span className={`mt-[4cqw] text-balance wrap-anywhere font-body font-medium italic leading-tight ${names.length > 42 ? "line-clamp-4 text-[5.5cqw]" : "text-[9cqw]"}`}>
          {names}
        </span>
        <span className="mt-[3cqw] h-px w-[14cqw] shrink-0 bg-[#d7bd82]/75" />
      </span>
    </span>
  );
}
