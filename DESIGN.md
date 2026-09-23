---
name: Nikâh Tezhibi
description: An illuminated-manuscript wedding invitation world — thin gold rules on parchment, never a filled ornamental border.
colors:
  parchment: "#f6efdd"
  parchment-deep: "#ecdfba"
  parchment-shadow: "#d9c894"
  ink: "#3a1420"
  ink-soft: "#6b3242"
  gold: "#a97a2f"
  gold-light: "#d9bb78"
  gold-deep: "#7c5720"
  sage: "#6f7a52"
  sage-deep: "#545e3c"
typography:
  display:
    fontFamily: "Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "normal"
  body:
    fontFamily: "EB Garamond, Garamond, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "EB Garamond, Garamond, Georgia, serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.15em"
  script:
    fontFamily: "Petit Formal Script, cursive"
    fontSize: "clamp(1.125rem, 2vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "2px"
  full: "9999px"
spacing:
  section-y: "80px"
  section-y-lg: "112px"
  gutter: "24px"
  gutter-lg: "96px"
components:
  button-seal:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "6px 0"
---

# Design System: Nikâh Tezhibi

## Overview

**Creative North Star: "The Nikâh Illumination"**

The page behaves like an Ottoman nikâh (marriage-certificate) record made luminous for a screen, and — since the platform chrome around it grew — like the stationery of a small letterpress atelier that makes them: a legal-ceremonial document and a hand-finished paper good, not a greeting card. Every wedding-invitation site defaults to the same move — a full-bleed couple photo under a cursive script overlay, on a pastel wash, corners crowded with dense, filled floral ornament. This world still refuses that default, but it no longer refuses botanical or script marks outright — it refuses them *undisciplined*. Ground stays pale, grained parchment; ornament (gold rule, botanical sprig, wax seal) is thin, hand-drawn, and always a single asymmetric accent, never a filled shape or a wraparound border; negative space is held deliberately rather than centering everything card-on-photo.

The world commits to two donated disciplines from outside the wedding-invitation category: restraint in negative space (nothing fills every corner just because the space is there) and confinement of *every* accent — metal or botanical — to hairline marks rather than washes or fills. One deliberate contrast beat — a deep-ink, gold-on-parchment section — breaks the otherwise all-parchment scroll at the page's single most important action (RSVP, or the platform's own primary CTA), rather than the identity ever going fully dark or fully saturated.

**Key Characteristics:**
- Pale, grained parchment ground (a generated cotton-paper texture, not flat digital white), disciplined thin gold rule as the primary recurring ornament
- A hairline botanical sprig (sage ink, monoline, never filled) as a sparing corner accent, and a hairline wax-seal monogram as the platform's brand mark — both pencil-draw themselves on with a path animation the first time they're seen, never present as a repeating border
- One deep-ink "action" beat per page, reserved for the primary call to action — botanical/seal ornament is deliberately withheld from this section so it stays the single loudest moment
- Ceremonial display serif (Bodoni Moda) for names/headlines, warm old-style body serif (EB Garamond) for reading text, and a restrained script face (Petit Formal Script) for the occasional signature-style line — never a display or body face
- Signature interaction: a mechanical flip-card countdown, gold-on-parchment, ticking like an antique clock

## Colors

A two-metal palette: warm parchment paper and antique gold ink, with a deep burgundy-black serving as both text ink and the one dark section ground.

### Primary
- **Old Gold** (`#a97a2f`): the single accent. Confined to hairline rules, dividers, borders, and small structural marks (schedule times, link underlines). Never fills a region.

### Secondary
- **Pale Gold** (`#d9bb78`): lighter accent for use against dark ink grounds (labels, focus rings, the RSVP seal button, flip-card digits) and for gradient highlights.
- **Deep Antique Gold** (`#7c5720`): the same accent darkened, for borders and hover states that need to read against parchment.

### Neutral
- **Aged Parchment** (`#f6efdd`): the default page ground, and body text color when reversed on ink.
- **Deeper Parchment** (`#ecdfba`): alternate section ground, used to separate adjacent sections without a hard rule line; also the photo-plate mat color.
- **Burgundy Ink** (`#3a1420`): primary text color on parchment, and the ground color for the page's one dark beat.
- **Soft Burgundy** (`#6b3242`): secondary/label text on parchment. Tinted from the ink hue, never gray.

### Botanical (third ink, ornament-only)
- **Sage** (`#6f7a52`) / **Sage Deep** (`#545e3c`): the only color botanical sprig line-art is drawn in. Never used for text, backgrounds, or UI chrome — it exists solely so the botanical marks read as a different material (garden ink) from the gold metal accent, not as a competing brand color.

### Named Rules
**The Hairline Rule** (formerly the Hairline Gold Rule, now covers every accent ink). Gold and sage never fill a region or form a closed decorative border. They appear only as a 1px rule, a divider, a single monoline sprig, small structural marks, or text — the moment any accent becomes a filled shape or a corner flourish, the world has collapsed into the category default it was built to refuse.

**The Single Sprig Rule.** A botanical sprig (see Components) may appear at most once per section, always tucked into existing asymmetric negative space (a hero's empty two-thirds, a card corner), never mirrored into a matching pair and never wrapped around an edge. One sprig reads as hand-drawn detail; two facing sprigs read as a border, which this world still refuses.

**The One Dark Beat Rule.** Exactly one section per page (the primary call to action — currently RSVP, or the platform's own CTA beat) reverses to the ink ground. It is not a dark-mode toggle and not decoration; it exists to mark the single moment on the page where the reader is asked to act. Botanical and seal ornament are withheld from this section specifically so it isn't diluted.

## Typography

**Display Font:** Bodoni Moda (with Didot, Georgia, serif fallback)
**Body Font:** EB Garamond (with Garamond, Georgia, serif fallback)
**Script Accent Font:** Petit Formal Script (cursive fallback)

**Character:** A high-contrast ceremonial didone (Bodoni Moda) paired with a warm, old-style humanist book serif (EB Garamond) — the pairing of an engraved certificate's display lettering with the body text of a printed letter. Petit Formal Script sits alongside them as a third, sparing voice: a single signature-style line here and there, the way a printed invitation still carries one handwritten touch (a place card, a signature) — never the couple's names, never a heading, never more than a phrase at a time.

### Hierarchy
- **Display** (600, `clamp(2.5rem, 6vw, 6rem)`, line-height 0.95): couple's names and section headings (`h1`/`h2`).
- **Title** (600, 1.125–1.25rem): schedule item titles, venue name, footer signature.
- **Body** (400, 1rem, line-height 1.6, measure capped at ~60–65ch via `max-w-xl`/`max-w-2xl`): paragraphs, form fields, info-block copy.
- **Label** (500, 0.75rem, letter-spacing 0.15em, uppercase): form field labels and the language toggle only — the sole place wide tracking is allowed.
- **Script** (400, `clamp(1.125rem, 2vw, 1.75rem)`): the hero's italic invite line, a footer signature, a brand subtitle. Always short — a line or a few words, never a paragraph.

### Named Rules
**The Short-Label-Only Tracking Rule.** Wide letter-spacing (≥0.1em) is reserved for short uppercase labels. Any sentence-length or italic line uses normal tracking instead.

**The Script Restraint Rule.** Script replaces italic EB Garamond only at moments that are already brief and already secondary (an invite line, a signature, a brand subtitle) — it never becomes the display face, never sets a couple's names, and never appears twice in the same viewport. This is the one deliberate reversal of the world's original didone-only stance; the restraint that made that stance work (short, sparing, never the loudest element on the page) is what's preserved.

## Layout

Single-column, centered content within section-specific max-widths (`max-w-xl` for Venue/RSVP, `max-w-2xl` for Story/Schedule, `max-w-4xl` for Story's photo grid). Horizontal gutters grow with viewport: 24px mobile → 64px tablet → 96px desktop. Vertical rhythm between sections is generous and consistent: 80px mobile, 112px desktop (`py-20`/`py-28`), always more space above a heading than below it. The hero is the one full-viewport section (`min-h-[100svh]`) and breaks the centered convention deliberately, holding the couple's names off-center in the left two-thirds with asymmetric parchment negative space to the right.

## Elevation & Depth

Flat by default — parchment is matte paper, not a surface that lifts. The two exceptions are physical objects, not UI chrome: the RSVP seal button (a real drop shadow, offset + soft blur, because it reads as a raised wax seal) and the flip-card countdown units (a 1px inset highlight line simulating a beveled metal edge, not an elevation shadow).

### Shadow Vocabulary
- **seal-raised** (`box-shadow: 0 2px 6px rgba(0,0,0,0.35)`): the RSVP submit button only.
- **flap-bevel** (`box-shadow: 0 1px 0 rgba(217,187,120,0.5) inset`): flip-card countdown units only.

### Named Rules
**The Flat Paper Rule.** Nothing gets a card shadow for being a container. Depth is reserved for the two objects on the page that are meant to feel physical (the seal, the flip cards).

## Texture

Every ground carries a faint, generated cotton-paper grain (a `feTurbulence` noise pattern, `multiply`-blended at ~5% opacity, fixed to the viewport) so no surface reads as flat digital white or cream. This is a fixed, whole-site texture, not a per-panel effect — it never gets stronger or weaker to "decorate" a specific section.

Where a panel wants to feel like a torn or deckled paper edge (an invitation-mockup card, a form card, a template card's photo/text seam), it uses the **Deckle Edge** component — a wavy hairline gold rule standing in for a torn edge — rather than an actual `clip-path` cutout. It is still a hairline rule under the hood; the waviness is the only difference from the Illuminated Rule's straight gradient line.

## Shapes

Rectangular sections throughout; the only curvature is `rounded-full` (pills), reserved for small controls (the language toggle, the circular RSVP seal button) — never for content containers. Bordered elements (flip-card units, photo-plate frames) use a minimal `rounded-sm` (2px) or no radius at all. Borders are hairline (1px) gold at partial opacity; there is no double-border or ghost-card combination anywhere.

## Components

### Buttons
- **Shape:** `rounded-full` in both variants.
- **Seal (primary, RSVP submit):** solid pale gold (`#d9bb78`) background, burgundy-ink text, 1px deep-gold border, raised drop shadow. Circular, sized to content (64px).
- **Ghost (language toggle):** transparent background, soft-burgundy text, 1px gold border at 50% opacity; hover solidifies the border and darkens the text to ink.

### Inputs / Fields
- **Text/number:** underline-only — transparent background, bottom border in gold at 50% opacity, no side or top border. Focus deepens the border to gold-deep (or gold-light on the ink ground).
- **Textarea:** full box border (same gold-at-50%), 2px radius, transparent background.
- **Error / Disabled:** not yet implemented — native browser validation only. Follow-up work before this ships to real users.

### Navigation
No persistent nav; the only wayfinding control is the language toggle (ghost pill, top-right of the hero).

### Illuminated Rule (signature component)
A thin SVG divider: two gold gradient hairlines fading in from the edges toward a small diamond-and-dot mark at center. Used under every section heading and the couple's names. Never rendered as a full-width unbroken line or a filled border — the fade-to-transparent ends are load-bearing, not decorative.

### Flip-Card Countdown (signature component)
Each time unit (days/hours/minutes/seconds) renders as a dark ink tile with a center seam line; on change, the old value flaps out (rotateX, top-hinged) while the new value flaps in (rotateX, bottom-hinged) as two independently mounted, animated elements — no manual rotation-reset logic. Respects `prefers-reduced-motion` globally (animations collapse to nearly instant).

### Botanical Sprig (signature component)
A monoline stem with a handful of lanceolate leaves, sage ink, stroked only — never filled. Drawn once per view via `pathLength="1"` on every path so any path can share one 0→1 `stroke-dashoffset` transition regardless of its real geometric length; plays once the first time it scrolls into view (`IntersectionObserver`, `once: true`), never replays. On pointer devices, sways a few degrees from its own root (`transform-origin` near the base of the stem, not center) on hover of its nearest container — a small, single, non-looping motion, gated behind `(hover: hover) and (pointer: fine)`. Governed by the Single Sprig Rule: one per section, tucked into existing negative space, never mirrored.

### Wax Seal / Monogram (signature component)
A circular hairline emblem — an outer ring built from a deliberately hand-jittered path (not a perfect circle; a true circle reads as digital) plus a precise inner ring and a centered display-serif glyph, all gold line-art, no fill. This is a brand-level mark (header wordmark, auth pages) and is deliberately never used on the guest-facing invitation itself, which belongs to the couple, not the platform.

### Deckle Edge (signature component)
A wavy hairline gold rule, full-width, standing in for a torn/deckled paper edge — see Texture. Used sparingly at panel seams, never as a full border around a container.

## Motion

Two custom easing curves back every transition in this world — the built-in CSS easings (`ease`, `ease-out`) read as flat for a site this tactile:
- `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)` — entrances, reveals, anything appearing.
- `--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1)` — on-screen movement (the sprig hover-sway).

### Named Rules
**The Press-Feedback Rule.** Every pressable element (pill buttons, cards, the RSVP seal) scales to ~0.97 on `:active` in addition to whatever its hover state does. This is the one animation applied uniformly, everywhere, with no exceptions — its absence is what made earlier passes feel unresponsive.

**The One-Shot Draw Rule.** Botanical sprigs and the wax seal draw themselves on once, the first time they enter view, and never replay — including on hover. Replaying a "hand-drawn" animation on every hover would read as a UI trick, not a drawing.

All motion respects `prefers-reduced-motion` globally (see `globals.css`); reduced-motion strips movement and drawing animations but keeps opacity/color transitions.

## Do's and Don'ts

### Do:
- **Do** keep gold confined to rules, borders, and small marks (The Hairline Rule).
- **Do** reserve the ink-dark ground for exactly one action beat per page (The One Dark Beat Rule), and withhold botanical/seal ornament from that section specifically.
- **Do** self-host display, body, and script faces via `next/font/google` with `latin-ext` for full Turkish glyph coverage — never fall back to a system sans for headings, and never drop `latin-ext` even for the script accent.
- **Do** theme browser-native surfaces (selection, focus ring, caret, scrollbar) from this palette rather than leaving browser defaults.
- **Do** keep botanical sprigs sage, never gold or ink, and keep them to one per section (The Single Sprig Rule).
- **Do** give pressable elements a `:active` scale (The Press-Feedback Rule).

### Don't:
- **Don't** add a *filled* floral illustration, a pastel wash, or a full decorative border — dense/filled botanical ornament is still the category default this world refuses. A single hairline sprig is not that; a filled bouquet or a repeating vine border is.
- **Don't** set a couple's names, a heading, or more than a short phrase in the script face — see the Script Restraint Rule.
- **Don't** apply wide letter-spacing (≥0.1em) to anything longer than a short uppercase label.
- **Don't** give a content container its own drop shadow; only the seal button and flip-card bevel carry depth. Texture (paper grain, deckle edge) is not depth and doesn't need a shadow to read.
- **Don't** use the Wax Seal monogram on guest-facing invitation content — it's a platform mark, not the couple's.
- **Don't** mirror a sprig into a matching pair or wrap it around an edge — one accent, not a border.
