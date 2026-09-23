---
target: landing page (frontend/src/app/page.tsx)
total_score: 27
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\90551\\OneDrive\\Masaüstü\\davetiye\\frontend\\src\\app\\page.tsx"
target_fingerprint: "sha256:bc09af70d3ac05dbc49dcd2e4abe1f5e41e15e065499df49b47e953a1989cbc9"
target_path: "C:\\Users\\90551\\OneDrive\\Masaüstü\\davetiye\\frontend\\src\\app\\page.tsx"
timestamp: 2026-09-20T22-16-46Z
slug: frontend-src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Stagger/reveal transitions and logged-in state read clearly |
| 2 | Match System / Real World | 4 | Turkish, ceremonial register, accurate flow |
| 3 | User Control and Freedom | 3 | Easy exits, but only a small text back-link inside /sablonlar |
| 4 | Consistency and Standards | 4 | Shared button constants, hairline rule used uniformly |
| 5 | Error Prevention | 3 | No forms on this page, nothing to break |
| 6 | Recognition Rather Than Recall | 4 | Roman-numeral steps + titles, no hidden state |
| 7 | Flexibility and Efficiency | n/a | Marketing page, no shortcuts expected |
| 8 | Aesthetic and Minimalist Design | 3 | Dinged by script duplication and 2 inert placeholder cards |
| 9 | Error Recovery | 3 | Nothing to recover from on this page |
| 10 | Help and Documentation | n/a | Appropriate for a persuade surface |
| Total | | 27/32 | Good |

## Design Specificity Verdict

LLM assessment (A): Genuinely reads as authored for a Turkish boutique wedding-invitation studio, not a reskinned SaaS template. Hero mockup renders the platform's own live template rather than stock art; wax seal and sprig are bespoke animated SVGs; typography never falls back to a sans. Slip: HowItWorks/ValueProps/TemplateGalleryTeaser share one centered kicker+heading+grid skeleton.

Deterministic scan (B): Detector clean, exit 0, zero findings (not config-suppression). 0 purple/blue gradients (only 3 gold radial-gradients), 0 rounded-2xl/3xl, 0 Inter/Poppins, 0 scale-105, 0 real emoji, prefers-reduced-motion present.

Visual overlays: not available, no browser automation tool this session.

## Overall Impression

Cliché-avoidance brief hit cleanly per both assessments. Remaining gap: three landing sections share an interchangeable layout skeleton, and the Script Restraint Rule is already broken in the hero.

## What's Working

1. HeroInvitationMockup renders the actual product template instead of stock art.
2. Hover/press micro-interactions are varied, not scale-105: underline draw-in, arrow nudge, uniform active:scale-[0.97].
3. useReveal/Reveal.tsx fire once via IntersectionObserver and never replay, matching the One-Shot Draw Rule.

## Priority Issues

- [P1] Script Restraint Rule already broken — "davetiye stüdyosu" (header) and the hero mockup's invite line both render in Petit Formal Script, visible in one viewport. Fix: drop the header tagline's script, use italic font-body instead. Command: $impeccable quieter
- [P1] Dead interaction on disabled template cards — aria-disabled div has no pointer-events-none/cursor-not-allowed, hover CSS still fires. Fix: add pointer-events-none opacity-70 cursor-not-allowed. Command: $impeccable harden
- [P2] Zero pricing signal before the CTA — CtaBeat says only "free" with no premium pricing context, on a product defined as paid. Command: $impeccable clarify
- [P2] Category-interchangeable section layout — HowItWorks/ValueProps/TemplateGalleryTeaser share one skeleton. Command: $impeccable layout
- [P3] No language toggle on the marketing funnel, despite PRODUCT.md calling TR/EN both first-class. Command: $impeccable audit

## Persona Red Flags

- Jordan (first-timer): hits 2 "Yakında" placeholder cards right after a hero promising "dakikalar içinde hazır."
- Riley (stress tester): clicks a disabled card expecting something, gets a hover-only dead end; can't find pricing later.
- Casey (mobile): hero mockup's absolutely-positioned sprig/ghost-outline sit outside the card's own bounds — worth a real-device check.

## Minor Observations

- CtaBeat.tsx re-writes press/hover classes inline instead of reusing LandingHero's PILL_BUTTON constant.
- LandingFooter has no legal/KVKK/privacy link.

## Questions to Consider

- If 2 of 3 templates are placeholders, is "Şablon Galerisi" the right frame for launch?
- The one-script-per-viewport rule survives by convention, not enforcement — worth a guard comment?
- Why does the only commitment-moment copy mention "free" and nothing else, on a paid product?

## Run Notes

Target slug: frontend-src-app-page-tsx. Ignore list: none. Assessment independence: two isolated sub-agents. CLI detector: exit 0, zero findings. Browser visibility/overlay: skipped, no browser tool this session. Live server: not started.
