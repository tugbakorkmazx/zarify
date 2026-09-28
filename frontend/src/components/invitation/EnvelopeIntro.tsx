"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  useAnimate,
  motion,
  type AnimationPlaybackControls,
  type AnimationSequence,
} from "motion/react";
import { coupleInitials } from "@/lib/coupleInitials";
import { useI18n } from "@/lib/i18n";
import { art } from "@/lib/art";
import { CoupleNames } from "@/components/herbarium/CoupleNames";
import { Painting } from "@/components/art/Painting";
import { LaceCard } from "@/components/art/LaceCard";

const STORAGE_PREFIX = "zarify.envelopeShown.";

function markSeen(id: string) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + id, "1");
  } catch {
    // storage unavailable (private browsing, etc.) — the intro will just
    // replay on the next open, which is a harmless fallback
  }
}

// Six shard directions radiating out from where the seal sat — same
// hand-placed headings as the ring segments below, so each piece flies
// roughly away from its own position rather than a shared direction.
const SHARD_TARGETS: Record<string, { x: number; y: number; rotate: number }> = {
  a: { x: -2, y: -22, rotate: -40 },
  b: { x: 19, y: -13, rotate: 35 },
  c: { x: 19, y: 13, rotate: -30 },
  d: { x: -1, y: 22, rotate: 28 },
  e: { x: -20, y: 12, rotate: 38 },
  f: { x: -20, y: -12, rotate: -32 },
};
// A little natural variation per shard — real fragments don't share one
// spring, they each carry their own weight and resistance.
const SHARD_SPRINGS: Record<string, { stiffness: number; damping: number; mass: number }> = {
  a: { stiffness: 190, damping: 14, mass: 0.6 },
  b: { stiffness: 170, damping: 13, mass: 0.75 },
  c: { stiffness: 210, damping: 15, mass: 0.55 },
  d: { stiffness: 180, damping: 14, mass: 0.7 },
  e: { stiffness: 160, damping: 12, mass: 0.8 },
  f: { stiffness: 200, damping: 15, mass: 0.6 },
};
const SHARD_START: Record<string, number> = { a: 0.05, b: 0.08, c: 0.11, d: 0.07, e: 0.1, f: 0.13 };

/** The guest's first beat on a published invitation, and the one they
 * trigger themselves: an ivory envelope, addressed with the couple's names,
 * centred on the swan-lake painting and closed with a wine wax seal. It
 * waits for a tap; only on tap does the seal crack into shards, the flap
 * lift on a spring (real overshoot and settle, not an eased keyframe), the
 * lace card slide up out of the envelope, and the page underneath
 * crossfade in. Tapping again
 * mid-sequence skips to the end. Plays once — gated per invitation per
 * browser tab via sessionStorage — and is skipped outright for
 * prefers-reduced-motion, since there's nothing to opt into watching
 * passively. Children mount immediately (hidden) so revealing them is
 * never blocked on anything but the ceremony itself. */
export function EnvelopeIntro({
  invitationId,
  names,
  remember = true,
  children,
}: {
  invitationId: string;
  names: string;
  /** false for the owner's preview: always plays, and isn't recorded as
   * seen (remount with a new key to replay it). */
  remember?: boolean;
  children: ReactNode;
}) {
  const [alreadySeen] = useState(() => {
    if (!remember) return false;
    try {
      return sessionStorage.getItem(STORAGE_PREFIX + invitationId) === "1";
    } catch {
      return false;
    }
  });
  // Read once, during render, rather than via Motion's SSR-safe
  // useReducedMotion hook — that hook resolves a render after mount (null
  // until an effect runs), which would let `visible`'s lazy initializer
  // below capture "not reduced" before the real value arrives. This
  // component only ever mounts client-side (after the page's own fetch
  // resolves), so a synchronous read here has no hydration downside.
  const [reducedMotion] = useState(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  const skipIntro = alreadySeen || reducedMotion;

  const [visible, setVisible] = useState(!skipIntro);
  const [idle, setIdle] = useState(true);
  // Gates the idle hover lift to devices that actually hover — touch fires
  // false hovers on tap otherwise.
  const [canHover] = useState(() => {
    try {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch {
      return false;
    }
  });
  const { t } = useI18n();
  const [scope, animate] = useAnimate();
  const playback = useRef<AnimationPlaybackControls | null>(null);

  function finish() {
    setVisible(false);
    if (remember) markSeen(invitationId);
  }

  async function handleTap() {
    if (!idle) {
      // Already playing — a second tap fast-forwards the same sequence
      // rather than cutting to a separate fade, so every piece (content
      // included) still lands on its real end state, just quickly.
      if (playback.current) playback.current.speed = 6;
      return;
    }

    setIdle(false);

    const shardSegments: AnimationSequence = (["a", "b", "c", "d", "e", "f"] as const).map((key) => [
      `.envelope-shard-${key}`,
      { ...SHARD_TARGETS[key], scale: 0.5, opacity: 0 },
      { type: "spring", ...SHARD_SPRINGS[key], at: SHARD_START[key] },
    ]);

    const sequence: AnimationSequence = [
      // The moment of picking it up: lifts and straightens toward the
      // viewer, a beat before the seal gives way.
      [
        ".envelope-card",
        { scale: 1.035, rotateX: 3, rotateY: -3 },
        { type: "spring", stiffness: 260, damping: 20, mass: 0.7 },
      ],
      // The seal cracks — a quick line flashing across it — right as the
      // card lifts.
      [
        ".envelope-crack",
        { pathLength: [0, 1], opacity: [0, 1, 1, 0] },
        { duration: 0.4, ease: "easeOut", at: "<" },
      ],
      [".seal-glyph", { opacity: 0 }, { duration: 0.25, at: 0.05 }],
      [".seal-inner-ring", { opacity: 0 }, { duration: 0.2, at: 0.05 }],
      [
        ".envelope-seal-rim",
        { opacity: 0, scale: 1.15 },
        { duration: 0.35, ease: "easeOut", at: 0.06 },
      ],
      ...shardSegments,
      // The flap's own spring — real overshoot and a settle, not a fixed
      // ease — is the one moment this whole intro exists to sell.
      [
        ".envelope-flap-shadow",
        { opacity: 0 },
        { duration: 0.5, ease: "easeOut", at: 0.3 },
      ],
      [
        ".envelope-flap",
        { rotateX: -165 },
        { type: "spring", duration: 0.9, bounce: 0.3, at: 0.32 },
      ],
      // Once the flap has swung past upright it sits behind the letter.
      [".envelope-flap", { zIndex: 0 }, { duration: 0.01, at: 0.52 }],
      [".envelope-glow", { opacity: 1 }, { duration: 0.7, ease: "easeOut", at: 0.4 }],
      // The lace card slides up out of the opened envelope — drawn out, not
      // popped: a long ease-out that decelerates as it clears the edge.
      // The address on the pocket fades as the card starts to move, so the
      // names are never on screen twice.
      [".envelope-address", { opacity: 0 }, { duration: 0.3, ease: "easeOut", at: 0.72 }],
      [
        ".envelope-letter",
        { y: "-62%" },
        { duration: 1, ease: [0.23, 1, 0.32, 1], at: 0.72 },
      ],
      // The envelope sinks as the card rises, so the pair stays centred
      // and the card stays on screen.
      [
        ".envelope-card",
        { y: "27%" },
        { duration: 1, ease: [0.23, 1, 0.32, 1], at: 0.72 },
      ],
      // A held beat with the card out, then the cover takes over.
      [
        ".envelope-content",
        { opacity: 1, y: 0 },
        { duration: 0.6, ease: "easeOut", at: 2.35 },
      ],
      [".envelope-overlay", { opacity: 0 }, { duration: 0.6, ease: "easeOut", at: 2.45 }],
    ];

    playback.current = animate(sequence);
    await playback.current;
    playback.current = null;
    finish();
  }

  const sealGlyph = coupleInitials(names).replace(/\./g, "");

  return (
    // useAnimate's imperative animate() only finds elements within this
    // ref's subtree, and the sequence targets both the overlay pieces and
    // .envelope-content below — so the scope has to wrap both, not just
    // the button.
    <div ref={scope}>
      {visible && (
        <button
          type="button"
          onClick={handleTap}
          aria-label={idle ? t.envelope.openLabel : t.envelope.viewLabel}
          data-idle={idle}
          className="envelope-overlay on-painting fixed inset-0 isolate z-50 flex cursor-pointer flex-col items-center justify-center gap-10 overflow-hidden"
        >
          <Painting piece={art.swanLake} shade="centre" priority />

          <div className="envelope-scene relative">
            <motion.div
              className="envelope-card relative w-72 sm:w-[26rem] lg:w-[35rem]"
              initial={{ opacity: 0, scale: 0.92, rotateX: 8, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 8, rotateY: -10 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              whileHover={
                idle && canHover ? { scale: 1.015, rotateX: 7, rotateY: -9 } : undefined
              }
            >
              {/* The envelope's inside back — the paper you see through the
                  V of the pocket once the card has risen. */}
              <div aria-hidden="true" className="relative aspect-[3/2] bg-paper-shade" />

              {/* The lace card waits inside, between the back and the front
                  pocket, and rises out of it on open. Stacking is by
                  z-index, not 3D depth: the card's drop-shadow filter
                  flattens the 3D context, so back < letter < pocket < flap
                  until the flap swings back (see the sequence). */}
              <motion.div
                aria-hidden="true"
                className="envelope-letter absolute left-1/2 top-[4%] z-[1] w-[46%] -translate-x-1/2"
              >
                <LaceCard sizes="(min-width: 1024px) 16rem, (min-width: 640px) 12rem, 8.5rem">
                  <p className="font-display text-[12cqw] leading-[0.95]">
                    <CoupleNames names={names} stacked />
                  </p>
                </LaceCard>
              </motion.div>

              {/* The front pocket: ivory stock whose top edge is cut in a V,
                  like a real envelope, with its fold lines drawn along the
                  cut. The address sits low on it and fades as the card
                  rises. */}
              <div className="envelope-pocket absolute inset-0 z-[2]">
                <div className="paper-ground absolute inset-0 [clip-path:polygon(0_0,50%_46%,100%_0,100%_100%,0_100%)]">
                  <div aria-hidden="true" className="envelope-flap-shadow" />
                </div>
                <svg
                  viewBox="0 0 120 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                >
                  <polyline
                    points="0,0 60,36.8 120,0"
                    fill="none"
                    stroke="rgba(31,28,23,0.28)"
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points="0,80 48,46 72,46 120,80"
                    fill="none"
                    stroke="rgba(31,28,23,0.12)"
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="envelope-address absolute inset-x-0 bottom-[6%] text-center text-soot">
                  <p className="font-display text-xl leading-none sm:text-2xl lg:text-3xl">
                    <CoupleNames names={names} />
                  </p>
                  <p className="apparatus mt-1.5 text-[0.65rem] text-soot-soft sm:text-xs lg:text-sm">
                    {t.hero.folio}
                  </p>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="envelope-glow pointer-events-none absolute left-1/2 top-[20%] z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(239,232,214,0.45)_0%,transparent_68%)] opacity-0"
              />

              <div className="envelope-flap absolute inset-x-0 top-0 z-[3] h-[52%]">
                <svg
                  viewBox="0 0 120 70"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="h-full w-full"
                >
                  <polygon
                    points="0,0 120,0 60,70"
                    fill="var(--color-paper-deep)"
                    stroke="rgba(31,28,23,0.22)"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div
                aria-hidden="true"
                className="envelope-seal-wrap absolute left-1/2 top-[52%] z-[4] -translate-x-1/2 -translate-y-1/2"
              >
                <svg viewBox="0 0 100 100" className="seal-svg h-14 w-14 overflow-visible sm:h-[4.5rem] sm:w-[4.5rem] lg:h-24 lg:w-24">
                  {/* Where the wax spread before it set — fades as the
                      seal breaks. */}
                  <path
                    d="M50,9 C63,8 74,15 82,24 C91,33 93,45 91,57 C89,70 81,81 69,87 C58,93 43,93 32,88 C19,82 10,71 8,58 C6,45 10,32 19,23 C27,14 38,9 50,9 Z"
                    className="seal-rim envelope-seal-rim"
                  />
                  {(
                    [
                      ["a", "M50,50 L50,16 A34,34 0 0,1 79.4,33 Z"],
                      ["b", "M50,50 L79.4,33 A34,34 0 0,1 79.4,67 Z"],
                      ["c", "M50,50 L79.4,67 A34,34 0 0,1 50,84 Z"],
                      ["d", "M50,50 L50,84 A34,34 0 0,1 20.6,67 Z"],
                      ["e", "M50,50 L20.6,67 A34,34 0 0,1 20.6,33 Z"],
                      ["f", "M50,50 L20.6,33 A34,34 0 0,1 50,16 Z"],
                    ] as const
                  ).map(([key, d]) => (
                    <path key={key} d={d} className={`seal-shard envelope-shard envelope-shard-${key}`} />
                  ))}
                  <circle cx="50" cy="50" r="27" className="seal-inner-ring" />
                  <motion.path
                    style={{ pathLength: 0, opacity: 0 }}
                    initial={false}
                    d="M 30,38 L 43,46 L 39,54 L 58,48 L 50,62 L 70,56"
                    fill="none"
                    stroke="var(--color-paper)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    className="envelope-crack"
                  />
                  <text x="50" y="57" textAnchor="middle" className="seal-glyph" fontSize="20">
                    {sealGlyph}
                  </text>
                </svg>
              </div>
            </motion.div>
          </div>

          <p className="envelope-hint apparatus text-sm">{t.envelope.hint}</p>
        </button>
      )}

      <motion.div
        className="envelope-content"
        initial={skipIntro ? false : { opacity: 0, y: 10 }}
        animate={skipIntro ? { opacity: 1, y: 0 } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
