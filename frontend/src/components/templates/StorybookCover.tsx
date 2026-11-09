import Image from "next/image";
import { coupleInitials } from "@/lib/coupleInitials";
import cover from "../../../public/storybook/cover.png";

export const STORYBOOK_SAMPLE_NAMES = "Elif & Kerem";

const FOIL_TEXT = "bg-[linear-gradient(165deg,#d0b36a_10%,#a88545_52%,#c4a45c_95%)] bg-clip-text text-transparent";

export function StorybookCover({
  names = STORYBOOK_SAMPLE_NAMES,
  miniature = false,
}: {
  names?: string;
  miniature?: boolean;
}) {
  return (
    <span className="pointer-events-none absolute inset-0 isolate @container">
      <Image
        src={cover}
        alt={miniature ? "" : "Yeşil, altın işlemeli kitap kapağı"}
        fill
        sizes={miniature ? "(min-width: 768px) 300px, 50vw" : "(min-width: 640px) 380px, 100vw"}
        loading={miniature ? "lazy" : "eager"}
        unoptimized
        className="object-contain drop-shadow-[5px_9px_14px_#2d302880]"
      />
      {/* Blend the foil into the cover so its cloth grain stays visible. */}
      <span aria-hidden={!miniature} className="absolute inset-x-[19%] inset-y-[21%] flex flex-col items-center justify-center text-center mix-blend-screen">
        <span aria-hidden="true" className="grid size-[19cqw] shrink-0 place-items-center whitespace-nowrap rounded-full border border-[#a88a4a]/80 font-body text-[5.5cqw] italic leading-none">
          <span className={FOIL_TEXT}>{coupleInitials(names)}</span>
        </span>
        <span className={`${FOIL_TEXT} mt-[4cqw] text-balance wrap-anywhere font-body font-medium italic leading-tight ${names.length > 42 ? "line-clamp-4 text-[5.5cqw]" : "text-[9cqw]"}`}>
          {names}
        </span>
        <span className="mt-[3cqw] h-px w-[14cqw] shrink-0 bg-[#a88a4a]/80" />
      </span>
    </span>
  );
}
