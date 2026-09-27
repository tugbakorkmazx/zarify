import Image from "next/image";
import { art } from "@/lib/art";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { LaceCard } from "./LaceCard";

/** The invitation cover in miniature — the swan-lake painting with the lace
 * card and the couple's names centred on it. The template card's preview
 * and the dashboard's thumbnail. */
export function CoverMiniature({
  names,
  sizes,
  className = "",
}: {
  names: string;
  /** Rendered width of the whole miniature, for next/image. */
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative isolate flex items-center justify-center overflow-hidden bg-ink ${className}`}>
      <Image
        src={art.swanLake.src}
        alt=""
        fill
        sizes={sizes}
        className="-z-10 object-cover"
        style={{ objectPosition: art.swanLake.focusWide }}
      />
      <div aria-hidden="true" className="painting-shade-soft absolute inset-0 -z-10" />
      <LaceCard sizes="12rem" className="w-[34%] min-w-[5.5rem] max-w-[12rem] transition-transform duration-500 group-hover:-translate-y-1">
        <p className="font-display text-[13cqw] leading-[0.95]">
          <CoupleNames names={names} stacked />
        </p>
      </LaceCard>
    </div>
  );
}
