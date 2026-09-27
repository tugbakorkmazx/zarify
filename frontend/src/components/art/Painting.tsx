import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { ArtPiece } from "@/lib/art";

/** A full-bleed oil painting behind a section, with a dark gradient over it
 * so ivory type set on it always reads. Decorative: the painting sets the
 * mood, the text carries the content, so it renders with alt="".
 * `shade` picks how much the gradient darkens — "strong" for pages whose
 * content sits in the middle of the painting (hero, owner pages). The
 * parent must be `relative` and `isolate` (or otherwise stack above it).
 *
 * A piece with a `portrait` version is art-directed: portrait screens get
 * that painting through a <picture> source instead of a hard crop of the
 * landscape one. */
export function Painting({
  piece,
  shade = "soft",
  priority = false,
}: {
  piece: ArtPiece;
  shade?: "soft" | "centre" | "strong";
  priority?: boolean;
}) {
  const style = {
    "--focus-narrow": piece.focusNarrow ?? "50% 50%",
    "--focus-wide": piece.focusWide ?? "50% 50%",
  } as CSSProperties;
  const cover = "absolute inset-0 h-full w-full object-cover";

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      {piece.portrait ? (
        <ArtDirected piece={piece} portraitPiece={piece.portrait} priority={priority} className={cover} />
      ) : (
        <Image
          src={piece.src}
          alt=""
          fill
          sizes="100vw"
          preload={priority}
          className="object-cover object-[var(--focus-narrow)] lg:object-[var(--focus-wide)]"
          style={style}
        />
      )}
      <div className={`absolute inset-0 painting-shade-${shade}`} />
    </div>
  );
}

function ArtDirected({
  piece,
  portraitPiece,
  priority,
  className,
}: {
  piece: ArtPiece;
  portraitPiece: NonNullable<ArtPiece["portrait"]>;
  priority: boolean;
  className: string;
}) {
  const common = { alt: "", sizes: "100vw", preload: priority };
  const {
    props: { srcSet: portrait },
  } = getImageProps({ ...common, ...portraitPiece });
  const {
    props: { srcSet: landscape, ...rest },
  } = getImageProps({ ...common, src: piece.src, width: piece.width, height: piece.height });

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portrait} />
      <source media="(orientation: landscape)" srcSet={landscape} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes from getImageProps */}
      <img
        {...rest}
        className={`${className} portrait:object-[var(--focus-portrait)] landscape:object-[var(--focus-wide)]`}
        style={
          {
            "--focus-portrait": portraitPiece.focus ?? "50% 50%",
            "--focus-wide": piece.focusWide ?? "50% 50%",
          } as CSSProperties
        }
      />
    </picture>
  );
}
