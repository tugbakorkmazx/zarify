"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  useAnimate,
  motion,
  type AnimationPlaybackControls,
  type AnimationSequence,
} from "motion/react";
import { coupleInitials } from "@/lib/coupleInitials";

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
 * trigger themselves: the envelope sits closed with a quiet pulse inviting
 * a tap, and only on tap does the couple's own wax seal crack into shards,
 * the flap lift on a spring (real overshoot and settle, not an eased
 * keyframe), and the page underneath crossfade in. Tapping again
 * mid-sequence skips to the end. Plays once — gated per invitation per
 * browser tab via sessionStorage — and is skipped outright for
 * prefers-reduced-motion, since there's nothing to opt into watching
 * passively. Children mount immediately (hidden) so revealing them is
 * never blocked on anything but the ceremony itself. */
export function EnvelopeIntro({
  invitationId,
  names,
  children,
}: {
  invitationId: string;
  names: string;
  children: ReactNode;
}) {
  const [alreadySeen] = useState(() => {
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
  const [scope, animate] = useAnimate();
  const playback = useRef<AnimationPlaybackControls | null>(null);

  function finish() {
    setVisible(false);
    markSeen(invitationId);
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
      [".envelope-glow", { opacity: 1 }, { duration: 0.7, ease: "easeOut", at: 0.4 }],
      [
        ".envelope-content",
        { opacity: 1, y: 0 },
        { duration: 0.55, ease: "easeOut", at: 0.75 },
      ],
      [".envelope-overlay", { opacity: 0 }, { duration: 0.5, ease: "easeOut", at: 1.05 }],
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
          aria-label={idle ? "Davetiyeyi açmak için dokunun" : "Davetiyeyi görüntüle"}
          data-idle={idle}
          className="envelope-overlay fixed inset-0 z-50 paper-ground flex flex-col items-center justify-center gap-6 cursor-pointer"
        >
          <div className="envelope-scene">
            <motion.div
              className="envelope-card relative w-60 sm:w-72"
              initial={{ opacity: 0, scale: 0.92, rotateX: 8, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 8, rotateY: -10 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              whileHover={
                idle && canHover ? { scale: 1.015, rotateX: 7, rotateY: -9 } : undefined
              }
            >
              <div className="aspect-[3/2] paper-ground-deep border border-gold/50 relative overflow-hidden">
                <div aria-hidden="true" className="envelope-flap-shadow" />
              </div>

              <div
                aria-hidden="true"
                className="envelope-glow absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-light)_0%,transparent_70%)] opacity-0"
              />

              <div className="envelope-flap absolute inset-x-0 top-0 h-[58%]">
                <svg
                  viewBox="0 0 120 70"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="h-full w-full"
                >
                  <polygon
                    points="0,0 120,0 60,70"
                    fill="var(--color-parchment-deep)"
                    stroke="var(--color-gold)"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div
                aria-hidden="true"
                className="envelope-pulse absolute left-1/2 top-[58%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
              />

              <div
                aria-hidden="true"
                className="envelope-seal-wrap absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2"
              >
                <svg viewBox="0 0 100 100" width="52" height="52">
                  <path
                    d="M 50,16 A 34,34 0 0,1 79.4,33"
                    fill="none"
                    strokeWidth="1.2"
                    className="seal-ring envelope-shard envelope-shard-a"
                  />
                  <path
                    d="M 79.4,33 A 34,34 0 0,1 79.4,67"
                    fill="none"
                    strokeWidth="1.2"
                    className="seal-ring envelope-shard envelope-shard-b"
                  />
                  <path
                    d="M 79.4,67 A 34,34 0 0,1 50,84"
                    fill="none"
                    strokeWidth="1.2"
                    className="seal-ring envelope-shard envelope-shard-c"
                  />
                  <path
                    d="M 50,84 A 34,34 0 0,1 20.6,67"
                    fill="none"
                    strokeWidth="1.2"
                    className="seal-ring envelope-shard envelope-shard-d"
                  />
                  <path
                    d="M 20.6,67 A 34,34 0 0,1 20.6,33"
                    fill="none"
                    strokeWidth="1.2"
                    className="seal-ring envelope-shard envelope-shard-e"
                  />
                  <path
                    d="M 20.6,33 A 34,34 0 0,1 50,16"
                    fill="none"
                    strokeWidth="1.2"
                    className="seal-ring envelope-shard envelope-shard-f"
                  />
                  <motion.path
                    style={{ pathLength: 0, opacity: 0 }}
                    initial={false}
                    d="M 32,38 L 44,46 L 40,54 L 58,48 L 50,62 L 68,56"
                    fill="none"
                    stroke="var(--color-gold-deep)"
                    strokeWidth="1.1"
                    className="envelope-crack"
                  />
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    className="seal-glyph"
                    fontSize="22"
                  >
                    {sealGlyph}
                  </text>
                </svg>
              </div>

              <div aria-hidden="true" className="envelope-grain" />
            </motion.div>
          </div>

          <p className="envelope-hint font-body text-xs tracking-[0.2em] uppercase text-ink-soft">
            Açmak için dokunun
          </p>
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
