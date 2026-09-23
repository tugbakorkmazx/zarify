"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";

// A slightly hand-pressed circle rather than a perfect one — a true circle
// reads as digital/generated; this small wobble is what makes it read as
// stamped. Built once via quadratic curves through eight jittered points.
const OUTER_RING_PATH =
  "M 87.5,35.5 Q 95,51 88.5,65.5 Q 82,80 65.5,87.5 Q 49,95 33.5,88.5 Q 18,82 11.5,65.5 Q 5,49 12.5,33.5 Q 20,18 35.5,11.5 Q 51,5 65.5,12.5 Q 80,20 87.5,35.5 Z";

/** A hairline wax-seal monogram — gold line-art, not a filled seal, so it
 * stays inside the Hairline Gold Rule. Brand-level mark only (header,
 * auth pages); never used on the guest-facing invitation itself, which
 * belongs to the couple, not the platform. */
export function WaxSeal({
  glyph = "Z",
  size = 56,
  className = "",
}: {
  glyph?: string;
  size?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<SVGSVGElement>(0.3);

  const draw = (delay: number): CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: visible ? 0 : 1,
    transition: `stroke-dashoffset 900ms var(--ease-out-strong) ${delay}ms`,
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <path d={OUTER_RING_PATH} pathLength={1} className="seal-ring" style={draw(0)} />
      <circle cx="50" cy="50" r="34" pathLength={1} className="seal-ring-inner" style={draw(160)} />
      <text x="50" y="61" textAnchor="middle" className="seal-glyph" fontSize="30">
        {glyph}
      </text>
    </svg>
  );
}
