import Image from "next/image";
import type { ReactNode } from "react";
import { art } from "@/lib/art";

/** The Victorian lace card with content set in dark ink inside its plain
 * paper oval (about 23–76% across, 20–78% down). Type inside should be
 * sized in container units (cqw) so it scales with the card — the same
 * card is the full-size cover and the thumbnail on template and dashboard
 * cards. */
export function LaceCard({
  children,
  sizes,
  preload = false,
  className = "",
}: {
  children: ReactNode;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div className={`@container relative ${className}`}>
      <Image
        src={art.laceCard.src}
        alt=""
        width={art.laceCard.width}
        height={art.laceCard.height}
        sizes={sizes}
        preload={preload}
        className="object-shadow h-auto w-full"
      />
      <div className="absolute inset-[22%_25%_23%_25%] flex flex-col items-center justify-center text-center text-soot">
        {children}
      </div>
    </div>
  );
}

/** The couple's cover card at any size: names, invite line, date and venue
 * inside the lace oval. `as="h1"` on the real cover. */
export function CoverCard({
  names,
  invite,
  dateLine,
  venueLine,
  as: Tag = "p",
  sizes,
  preload = false,
  className = "",
}: {
  names: ReactNode;
  invite: string;
  dateLine: string;
  venueLine: string;
  as?: "h1" | "p";
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <LaceCard sizes={sizes} preload={preload} className={className}>
      <Tag className="font-display text-[11cqw] leading-[0.95] tracking-[-0.01em]">{names}</Tag>
      <p className="mt-[3cqw] font-body text-[4.4cqw] italic leading-snug text-soot-soft">
        {invite}
      </p>
      <span aria-hidden="true" className="my-[3.5cqw] h-px w-[18cqw] bg-soot/40" />
      <p className="apparatus text-[3.1cqw] leading-relaxed text-soot">{dateLine}</p>
      <p className="apparatus text-[3.1cqw] leading-relaxed text-soot-soft">{venueLine}</p>
    </LaceCard>
  );
}
