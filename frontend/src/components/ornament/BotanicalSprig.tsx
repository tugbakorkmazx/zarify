"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";

/** A hand-drawn, monoline sprig — stem + a few lanceolate leaves, never
 * filled. Draws itself on with a pencil-line stroke animation the first
 * time it enters the viewport, using pathLength=1 so every path (whatever
 * its real length) can share the same 0→1 dash-offset transition. Always
 * placed as a single corner accent, never a repeating border — the
 * botanical counterpart to the Hairline Gold Rule. */
export function BotanicalSprig({
  className = "",
  flip = false,
  delay = 0,
}: {
  className?: string;
  flip?: boolean;
  delay?: number;
}) {
  const { ref, visible } = useReveal<SVGSVGElement>(0.3);

  const draw = (extraDelay: number): CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: visible ? 0 : 1,
    transition: `stroke-dashoffset 1000ms var(--ease-out-strong) ${delay + extraDelay}ms`,
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 170"
      aria-hidden="true"
      className={`sprig ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <path
        pathLength={1}
        d="M14,160 C24,128 18,96 34,64 C44,44 58,28 72,12"
        className="sprig-stem"
        style={draw(0)}
      />
      <path
        pathLength={1}
        d="M30,120 C20,110 20,98 30,92 C40,98 40,110 30,120 Z"
        className="sprig-leaf"
        style={draw(150)}
      />
      <path
        pathLength={1}
        d="M40,95 C52,90 60,80 58,68 C46,70 38,80 40,95 Z"
        className="sprig-leaf"
        style={draw(260)}
      />
      <path
        pathLength={1}
        d="M28,80 C16,76 10,66 14,55 C25,58 32,68 28,80 Z"
        className="sprig-leaf"
        style={draw(370)}
      />
      <path
        pathLength={1}
        d="M56,45 C66,40 72,30 68,20 C58,24 52,34 56,45 Z"
        className="sprig-leaf"
        style={draw(480)}
      />
      <circle pathLength={1} cx="72" cy="12" r="2.4" className="sprig-bud" style={draw(600)} />
    </svg>
  );
}
