import Image from "next/image";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { art, type ArtPiece } from "@/lib/art";

// Each frame's transparent opening, measured from the cutouts, pulled in a
// little so whatever sits behind tucks under the gilding.
const OPENING = {
  rect: "inset-[17%_20%_18.5%_19.5%]",
  oval: "inset-[19%_18%_18%_18%] rounded-[50%]",
} as const;

/** A gilded frame on the centre axis with something inside it: a painting
 * (`painting`, cropped to fill the opening) or any content (`children`,
 * e.g. a line of script). The only place antique gold appears. */
export function Framed({
  shape,
  painting,
  focus = "50% 50%",
  children,
  sizes,
  className = "",
}: {
  shape: "rect" | "oval";
  painting?: ArtPiece;
  /** object-position for the painting inside the opening. */
  focus?: string;
  children?: ReactNode;
  sizes: string;
  className?: string;
}) {
  const { lang } = useI18n();
  const frame = shape === "rect" ? art.frameRect : art.frameOval;

  return (
    <figure className={`@container relative ${className}`}>
      <div className={`absolute overflow-hidden ${OPENING[shape]}`}>
        {painting ? (
          <Image
            src={painting.src}
            alt={painting.alt[lang]}
            fill
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition: focus }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-ink/85 p-[6cqw] text-center">
            {children}
          </div>
        )}
      </div>
      <Image
        src={frame.src}
        alt=""
        width={frame.width}
        height={frame.height}
        sizes={sizes}
        className="object-shadow relative h-auto w-full"
      />
    </figure>
  );
}
