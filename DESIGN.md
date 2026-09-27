---
name: Herbaryum
description: Dark romantic oil paintings as full-bleed backdrops, paper objects (envelope, lace card) and gilded frames laid over them, flat wine / olive / ivory paper bands in between — every page on one centred axis.
colors:
  paper: "#efe8d6"
  paper-deep: "#e4d9bf"
  paper-shade: "#cfc09e"
  olive: "#4a5433"
  olive-deep: "#2e3520"
  olive-soft: "#7b8459"
  olive-pale: "#c9c9a3"
  wine: "#6d1d28"
  wine-deep: "#4b111a"
  wine-pale: "#d9a7a4"
  soot: "#1f1c17"
  soot-soft: "#4c463b"
  ink: "#120f0c"
typography:
  display:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  body:
    fontFamily: "EB Garamond, Garamond, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  apparatus:
    fontFamily: "EB Garamond, Garamond, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.14em"
    fontVariant: "all-small-caps"
  script:
    fontFamily: "Pinyon Script, cursive"
    fontSize: "clamp(3.5rem, 7vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.1
rounded:
  none: "0"
  full: "9999px"
spacing:
  section-y: "96px"
  section-y-lg: "128px"
  gutter: "20px"
  gutter-lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-primary-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.soot}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-secondary-light:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "13px 27px"
  button-seal:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "0"
---

# Design System: Herbaryum

## Overview

The reference is the classic "Save the Date" invitation site built on old paintings. A page is a sequence of **full-bleed dark romantic oil paintings** (a misty swan lake, a letters-and-lilies still life, a pastoral sunset, a dark floral still life) and **flat paper bands** (wine, dark olive, ivory) between them. On the paintings sit **paper objects** — the envelope, the Victorian lace card — and **gilded frames**.

The mood is candle-lit and quiet: near-black, deep wine, dark olive, and ivory paper glowing against them.

## The Centred Axis Rule (most important)

**Every page is centred, symmetric, and one column.** The classic two-column web layout (text on the left, image on the right, or the reverse) is not used anywhere.

- In every section the heading, text and buttons sit on the centre axis, `text-center`.
- Images and objects sit **above or below** the text, centred — never beside it.
- When several items share a row (three features, four steps, three info blocks), they are **equal columns in a centred block**, each with its text centred. On phones they stack into the same single centred column.
- Headers are centred too: the wordmark in the middle, short navs to either side.
- Because everything is already one column, **mobile uses the same layout** — only sizes change.

## Colors

- **Wine** (`#6d1d28`, deep `#4b111a`, pale `#d9a7a4`): the wine band, primary buttons, schedule times, step numerals, the wax seal.
- **Dark olive** (`#2e3520` over the embossed olive texture): the olive band.
- **Ivory** (`#efe8d6` and the paper texture): the paper band, paper cards, and **all type set on a painting or a dark band**.
- **Near-black / ink** (`#120f0c`, soot `#1f1c17`): the painting shades, the page behind the paintings, dark ink type on paper.
- **Antique gold appears only in the gilded frame images** — never as a UI colour, border, or text colour.

### Legibility rules
- Ivory type on a painting always has a dark gradient under it (`painting-shade-soft | centre | strong` in `Painting.tsx`) plus a faint text shadow (`.on-painting`). Use `centre` when the content sits in the middle of the painting, `strong` for owner pages.
- The wine and olive band textures are washed with their own colour (45% each) so the pattern is a whisper under the type.

## Typography

**Display & headings:** Gloock. **Body & apparatus:** EB Garamond (small caps for labels, nav, buttons, eyebrows). **Script:** Pinyon Script — for the couple's signature on the closing painting and one short line under the gilded frame on the landing. Never for names on the cover or for headings.

Self-hosted through `next/font/google` with `latin-ext` for Turkish.

- **Section heading** (`SectionHeading.tsx`): optional small-caps eyebrow in wine (wine-pale on dark), Gloock heading, a short double hairline under it — all centred.
- **Body:** EB Garamond 1.125rem, leading 1.7, measure ≤ 56ch, centred.
- **Numerals:** Gloock in wine for schedule times and step numerals.

## Grounds

Every section is exactly one of these:

| Ground | Where | How |
|---|---|---|
| **Painting** | landing hero, envelope, invitation cover, invitation closing, owner pages | `Painting.tsx`: `next/image` `fill` + `object-cover`, responsive `srcset`, a shade layer on top |
| **Ivory paper** | Nasıl Çalışır, template gallery, Günün Programı, Bilmeniz Gerekenler, cards | `.paper-ground` — seamless `paper-ivory.webp` |
| **Wine band** | Hikâyemiz, Katılım Bildirimi, landing final CTA | `.wine-band` — seamless `texture-wine.webp` under a wine wash |
| **Olive band** | Mekân, Neden Zarify | `.olive-band` — seamless embossed floral `texture-olive.webp` under a 45% olive wash |

### Mobile crops
The swan lake and the letters still life have **portrait versions** (`portrait` in `lib/art.ts`). `Painting` serves them to portrait screens through `<picture>` (`getImageProps`), so phones get a real portrait painting instead of a crop. The other landscape paintings carry `focusNarrow` / `focusWide` object-positions: the sunset keeps the sky and the willows.

## Imagery

All images are raster (WebP) in `frontend/public/images/art/`, registered in `frontend/src/lib/art.ts`. **Nothing outside that registry goes on a page.** The previous gravure/herbarium set (willow, swallow, bees, cherry branch, damask, toile, stamps, sepia roses, dried lily, anemone, hellebore…) is retired and archived in `public/images/_arsiv/`.

- **Paintings:** swan lake (landscape and portrait), pastoral sunset, still life with letters and lilies with an empty centre (landscape and portrait), dark floral still life, and a swan close-up (inside the gilded frame on the landing).
- **Paper objects:** Victorian lace card (its plain oval holds the cover text), the envelope (drawn in CSS/SVG as paper, with the wax seal).
- **Gilded frames:** oval and rectangular, with transparent openings. They hold either a crop of a painting (`Framed painting=…`) or a short line of script (`Framed children`).
- **Dried rose branch:** the one ornament on the Hikâyemiz band.

## Components

- **`Painting`** — full-bleed backdrop with a shade. Decorative (`alt=""`).
- **`LaceCard` / `CoverCard`** — the lace card with content in dark ink inside its oval, type in container units (`cqw`) so the same card works as the cover and as a thumbnail.
- **`CoverMiniature`** — swan lake + lace card with the names: the template card preview and the dashboard thumbnail.
- **`Framed`** — gilded frame with a painting crop or content in its opening. The painting inside keeps its real `alt`.
- **`SectionHeading`** — the centred eyebrow + heading + double hairline.
- **Buttons:** wine primary on paper; ivory primary and ivory outline on paintings/bands. Square corners. Press feedback `scale(0.97)`.
- **Countdown:** ivory digits in near-opaque ink tiles with a hairline border, set close under the cover card so the painting never shows through the numbers.
- **Paper card** (`.paper-card .paper-ground`): the RSVP form, the sign-in form, the owner pages — ivory paper with a soft shadow and an inner hairline border.

## Pages

**Invitation (guest), all centred:**
1. **Envelope** — swan lake; the envelope in the middle: an inner back, the lace card, and a front pocket whose top edge is cut in a V, like a real envelope. On tap the seal breaks and the flap opens. The address on the pocket fades as the lace card slides up until most of it has cleared the pocket, it holds for a beat, and then the cover fades in.
2. **Cover** — swan lake; the lace card with names, invite line, date and venue in dark ink; the ivory countdown under it.
3. **Hikâyemiz** — wine band; dried rose branch on top, heading and text under it.
4. **Günün Programı** — ivory paper; one vertical centred list, each time in wine above its title and note.
5. **Mekân** — olive band; the dark floral still life in the gilded rectangular frame, then name, address and "Haritada Aç".
6. **Bilmeniz Gerekenler** — ivory paper; dress code, gift and accommodation as equal centred blocks.
7. **Katılım Bildirimi** — wine band; heading and intro, then the form in an ivory paper card, ending in a plain wine "Gönder" / "Send" button.
8. **Closing** — pastoral sunset; "Sevgiyle bekliyoruz" and the Pinyon Script signature centred in the sky.

**Landing, all centred:** hero on the letters still life (ivory headline, body, two buttons) → Nasıl Çalışır on ivory paper (the swan close-up in the gilded frame, a script line under it, then four steps) → the template card (cover miniature) → Neden Zarify on the olive band (oval gilded frame with a crop of the dark florals, then three features) → the final CTA on the wine band.

**Owner pages** (sign-in, sign-up, Davetiyelerim, Yönetim, invitation details): no side panel. The dark floral still life full-bleed under a strong shade; the wordmark (and owner nav) centred in ivory; the form or content in a centred ivory paper card.

## Motion

- `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)` for entrances.
- The hero copy rises in on first paint (pure CSS, before hydration); the cover card settles in; sections reveal once on scroll.
- The envelope's flap opens on a spring; the lace card slides up on a long ease-out; the page crossfades in.
- `prefers-reduced-motion` skips the envelope entirely and collapses every animation and transition.

## Accessibility

- Decorative paintings and frames use `alt=""`; a painting that carries meaning inside a frame keeps its `alt` from the registry.
- Ivory on paintings always sits on a shade gradient; focus rings turn ivory on dark grounds.
- Tap targets ≥ 44px; the envelope is a single labelled button.

## Do's and Don'ts

### Do
- Keep every section on the centre axis; stack objects above/below the text.
- Put ivory type on paintings only over a shade.
- Use the gilded frames for gold; keep UI colours to wine, olive, ivory and ink.
- Register every new image in `lib/art.ts` as WebP.

### Don't
- Don't use a two-column text/image layout anywhere.
- Don't use the retired gravure/herbarium art.
- Don't use gold as a text, border or button colour.
- Don't use script for headings or cover names.
- Don't round card corners; pills only for the language toggle and the seal.
