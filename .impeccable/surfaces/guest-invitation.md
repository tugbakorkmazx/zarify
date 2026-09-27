---
version: 1
slug: "guest-invitation"
primary_target: "guest-invitation"
related_targets: ["frontend/src/components/templates/HerbaryumTemplate.tsx"]
---

## Scope & Mode

Persuade. Public, guest-facing wedding invitation page — the platform's live template (slug `nikah-tezhibi`, kept for existing invitations; display name "Herbaryum"). No login. This brief covers only this surface.

## Audience, Job, Action, Proof, Constraints

- **Audience:** a wedding guest opening a link shared over WhatsApp/SMS, often mid-day on a phone, briefly.
- **Job:** understand who is getting married, when, where, and what the day involves; feel the couple's story; decide whether/how to attend.
- **Action:** RSVP (owner can disable it — must degrade to an informational page), note date/venue, read info blocks.
- **Proof/content:** event details (venue as plain text; map link optional), countdown, story text, schedule, free-text info blocks. Couple photo upload does not exist yet — photo plates appear only in the gallery showcase.
- **Constraints:** bilingual TR/EN; every optional section renders only when filled; template art (botanical plates, frame, still life) is template ornament and may appear on real invitations; interim art in `public/images/botanical/` is unlicensed placeholder and must be replaced with licensed assets before launch.

## Chosen Direction & Memorable Moment

**Herbaryum — vintage editorial botanical**, pinned by the user's brief (2026-09-26), replacing Nikâh Tezhibi. Memorable moment: the couple's names set as a magazine-cover masthead, enormous, with a collaged herbarium plate (antique frame, specimen, a swallow) tipped in beside them on an olive field.

## Unresolved Decisions

- Licensed asset pack choice (Creative Market / Envato) — interim placeholders until then.
- Paper texture and torn-edge assets not yet bought; CSS slots are wired and no-op until files exist.

## Direction contract

THESIS: The invitation is an issue of a botanical periodical dedicated to one couple — a cover, a feature spread, a contents page — refusing the pastel photo-hero with script names every wedding site ships.

OWN-WORLD: Aged ivory paper, olive fields carrying a third or more of the page, wine as the single hot accent (numerals, drop cap, the seal button), soot near-black for type and rules. Gloock masthead display, EB Garamond body with small-caps apparatus, Pinyon Script once (signature). Collage: tipped-in paper cards at slight rotation with real paper shadow, antique frames, herbarium plates with small-caps captions.

STORY: Cover tells who/when/where in one glance; the feature spread tells their story with a wine drop cap; a contents-page schedule; a venue plate; notes in columns; RSVP on an olive damask field; a script signature closes.

FIRST VIEWPORT: Folio strip on top (issue line in small caps, language toggle). Names in Gloock at up to 6rem spanning the left seven columns; date and venue in small caps under a double hairline. Right: olive field with the oval frame, a flower plate inside, a swallow crossing its edge. Countdown sits along the cover's bottom as a folio row.

FORM: brief-pinned vintage editorial botanical (user-pinned; roll assignment index 5 overridden per "brief-pinned direction beats the roll"); seed key `8123077a`. Raise from declined challenger rw-centre-rail-reference-setting: the margin apparatus — every plate carries a small-caps caption and plate number, set like annotation. Raise from declined raygun-layout-desk: the grid is allowed to break at the cover only — names overlap the collage edge.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

> **Superseded (2026-09-27):** the visual language and layout are now defined in DESIGN.md — full-bleed oil paintings, paper objects, gilded frames, wine/olive/ivory bands, every section centred on one axis. Where this file disagrees, DESIGN.md wins.
