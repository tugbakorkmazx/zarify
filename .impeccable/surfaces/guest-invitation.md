---
version: 1
slug: "guest-invitation"
primary_target: "guest-invitation"
related_targets: []
---

## Scope & Mode

Persuade. Public, guest-facing wedding invitation page — the first of what will become a family of purchasable templates on the platform. No login. This brief covers only this surface; it does not set the platform-wide DESIGN.md (dashboard/admin are separate worlds).

## Audience, Job, Action, Proof, Constraints

- **Audience:** a wedding guest opening a link shared over WhatsApp/SMS, often mid-day on a phone, briefly.
- **Job:** understand who is getting married, when, where, and what the day involves; feel the couple's story; decide whether/how to attend.
- **Action:** RSVP (owner can disable this per invitation — must degrade gracefully to an informational-only page), optionally note the venue/date, optionally read custom info blocks.
- **Proof/content:** event details (date, time, venue as plain text — map link/embed is an optional add-on, never required), couple/story photos (placeholder imagery for now), countdown to the event, free-text info blocks (dress code, gift list, directions, accommodation).
- **Constraints:** bilingual TR/EN (both first-class); guest never authenticates; content is placeholder until the real couple supplies details — nothing fabricated must read as a real claim; must remain legible and usable as a template across different couples' content (not hand-tuned prose, since this ships as a reusable template).

## Chosen Direction & Memorable Moment

**Nikâh Tezhibi** (Marriage-Certificate Illumination) — selected by the user from the direction round (seed `c940406c`, assigned index 5 of 7 grounded candidates). Memorable moment: the couple's names set in illuminated capitals inside a single disciplined gold rule (not a decorative border), and the countdown rendered as small mechanical flip-cards in gold-on-parchment.

## Unresolved Decisions

- Exact hex values for parchment ground, ink (burgundy), and gold accent — set during build against real contrast/legibility checks.
- Whether an envelope/seal-opening entrance motion is included, or the illuminated rule reveal alone carries the entrance.
- Final RSVP field set (attendee count, meal choice, message) — deferred to the owner-dashboard/RSVP-builder work, this surface renders whatever fields the invitation is configured with.
- Turkish-glyph completeness of the chosen display face at production weight — verify before shipping.

## Direction contract

THESIS: The page behaves like an illuminated Ottoman nikâh record made luminous for the screen — a legal-ceremonial document, not a greeting card — refusing the pastel-photo-hero-plus-script-font default every wedding site ships.

OWN-WORLD: Parchment/ivory ground; one disciplined thin gold-leaf rule (never a filled decorative border) framing the page edge and marking section divisions; deep burgundy ink for body and structural text; illuminated capitals for the couple's names; asymmetric negative space held deliberately on one side of the opening view rather than centered symmetry; a display serif (Bodoni Moda) for ceremonial headlines/names, a quiet old-style serif (EB Garamond) for body copy and info blocks.

STORY: A guest opens the link and within one glance knows whose wedding this is, when, and where; scrolling reveals the couple's story through placeholder photographs framed like keepsake album plates, then practical information (schedule, venue, dress code, gift list, directions, accommodation) each introduced by the same thin gold rule, ending at an RSVP affordance styled as a wax-seal tap target (or, when RSVP is disabled by the owner, the same section renders as a quiet closing note instead).

FIRST VIEWPORT: Couple's names set large in illuminated capitals, off-center within generous parchment negative space (not centered card-on-photo); event date and venue in quiet Garamond beneath; a slender gold rule beneath the names rather than a full ornamental frame; the flip-card countdown sits low in the viewport, ticking in gold-on-parchment; no full-bleed photo in the hero.

FORM: Nikâh Tezhibi — 5th of 7 grounded directions ordered by resonance (engraved letterpress davetiye ranked 1st, offered and declined as IMPECCABLE'S PICK); seed key `c940406c`. Raised with donated discipline from two declined catalog challengers: asymmetric restraint in negative space (from an ikebana/tokonoma form) and confinement of all accent color to hairline rules rather than filled washes (from an iridescent-cloud-edge form); the countdown's flip-card motion is donated from a split-flap concourse-board challenger.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
