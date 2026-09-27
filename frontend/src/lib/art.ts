import type { Lang } from "@/lib/i18n";

/** Every image the site uses, in one place — and the only ones it may use.
 * The language: dark romantic oil paintings as full-bleed backdrops, paper
 * objects (lace card, envelope) and gilded frames laid over them, and flat
 * wine / olive / ivory paper bands in between. Files live in
 * /images/art/ as WebP; next/image serves each at responsive widths.
 * Sizes are intrinsic pixels, for next/image's aspect ratio. */
export interface ArtPiece {
  src: string;
  width: number;
  height: number;
  /** Describes the image for screen readers where it carries content.
   * Backdrops are decorative and render with alt="" instead. */
  alt: Record<Lang, string>;
  /** object-position for narrow (portrait) viewports, where a landscape
   * painting is cropped hard — keeps the subject in frame. */
  focusNarrow?: string;
  /** object-position from the lg breakpoint up. */
  focusWide?: string;
  /** A separate portrait painting for portrait screens (phones), used
   * instead of cropping the landscape one. */
  portrait?: { src: string; width: number; height: number; focus?: string };
}

export const art = {
  // Full-bleed paintings
  swanLake: {
    src: "/images/art/swan-lake.webp",
    width: 1672,
    height: 940,
    alt: { tr: "Sisli bir gölde iki kuğu, yağlı boya", en: "Two swans on a misty lake, oil painting" },
    focusNarrow: "27% 58%",
    focusWide: "50% 55%",
    portrait: { src: "/images/art/swan-lake-portrait.webp", width: 941, height: 1672, focus: "50% 50%" },
  },
  pastoralSunset: {
    src: "/images/art/pastoral-sunset.webp",
    width: 1672,
    height: 940,
    alt: { tr: "Nehir kıyısında gün batımı, yağlı boya", en: "Sunset over a river, oil painting" },
    focusNarrow: "80% 40%",
    focusWide: "60% 40%",
  },
  /** Letters, lilies and a vase along the bottom, an empty dark centre
   * for the headline. */
  stillLifeLetters: {
    src: "/images/art/still-life-letters.webp",
    width: 1672,
    height: 941,
    alt: { tr: "Mektuplar ve zambaklarla natürmort", en: "Still life with letters and lilies" },
    focusNarrow: "20% 70%",
    focusWide: "50% 60%",
    portrait: { src: "/images/art/still-life-letters-portrait.webp", width: 940, height: 1672, focus: "50% 60%" },
  },
  /** A single swan, close; sits inside the gilded frame on the landing. */
  swanCloseup: {
    src: "/images/art/swan-closeup.webp",
    width: 1122,
    height: 1402,
    alt: { tr: "Karanlık suda tek bir kuğu, yağlı boya", en: "A single swan on dark water, oil painting" },
  },
  darkFlorals: {
    src: "/images/art/still-life-dark-florals.webp",
    width: 1122,
    height: 1402,
    alt: { tr: "Koyu zeminde güller ve zambaklar, natürmort", en: "Roses and lilies on a dark ground, still life" },
    focusNarrow: "50% 40%",
    focusWide: "50% 40%",
  },

  // Paper objects and gilded frames (true alpha)
  /** Victorian lace card; its plain paper oval runs about 23–76% across and
   * 20–78% down. */
  laceCard: {
    src: "/images/art/lace-card.webp",
    width: 433,
    height: 577,
    alt: { tr: "Dantel kenarlı fildişi kart", en: "Ivory lace-edged card" },
  },
  /** Transparent opening: about 21–79% across, 18–81% down. */
  frameRect: {
    src: "/images/art/gilded-frame-rect.webp",
    width: 433,
    height: 577,
    alt: { tr: "Yaldızlı dikdörtgen çerçeve", en: "Gilded rectangular frame" },
  },
  /** Transparent opening: about 19–81% across, 20–81% down. */
  frameOval: {
    src: "/images/art/gilded-frame-oval.webp",
    width: 433,
    height: 577,
    alt: { tr: "Yaldızlı oval çerçeve", en: "Gilded oval frame" },
  },
  roseBranch: {
    src: "/images/art/dried-rose-branch.webp",
    width: 500,
    height: 500,
    alt: { tr: "Kurutulmuş gül dalı", en: "Dried rose branch" },
  },
} satisfies Record<string, ArtPiece>;

// The three tiling papers — paper-ivory.webp, texture-wine.webp and
// texture-olive.webp — are CSS grounds (globals.css: .paper-ground,
// .wine-band, .olive-band), not placed images.
