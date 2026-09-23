"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

interface FlapState {
  displayValue: string;
  outgoing: string | null;
}

export function FlipUnit({ value, label }: { value: number; label: string }) {
  const formatted = pad(value);
  const [prevFormatted, setPrevFormatted] = useState(formatted);
  const [state, setState] = useState<FlapState>({
    displayValue: formatted,
    outgoing: null,
  });

  // Adjusting state in response to a prop change: done during render, per
  // React's guidance, rather than in an effect (which would double-render).
  if (formatted !== prevFormatted) {
    setPrevFormatted(formatted);
    setState((s) => ({ displayValue: formatted, outgoing: s.displayValue }));
  }

  useEffect(() => {
    if (state.outgoing === null) return;
    const id = window.setTimeout(() => {
      setState((s) => (s.outgoing === null ? s : { ...s, outgoing: null }));
    }, 460);
    return () => window.clearTimeout(id);
  }, [state.outgoing]);

  const { displayValue, outgoing } = state;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative h-12 w-14 sm:h-16 sm:w-20 rounded-sm border border-gold-deep/40 bg-ink text-parchment shadow-[0_1px_0_rgba(217,187,120,0.5)_inset]"
        style={{ perspective: "240px" }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gold/40"
        />
        {outgoing !== null && (
          <span
            key={`out-${outgoing}`}
            aria-hidden
            className="flap-out absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl tabular-nums"
          >
            {outgoing}
          </span>
        )}
        <span
          key={`in-${displayValue}`}
          aria-hidden
          className={
            outgoing !== null
              ? "flap-in absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl tabular-nums"
              : "absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl tabular-nums"
          }
        >
          {displayValue}
        </span>
      </div>
      <span className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-ink-soft font-body">
        {label}
      </span>
    </div>
  );
}
