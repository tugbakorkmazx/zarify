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
        className="relative h-14 w-[3.75rem] border border-paper/40 bg-ink/[0.93] text-paper sm:h-[4.5rem] sm:w-20"
        style={{ perspective: "240px" }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 z-10 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-paper/25"
        />
        {outgoing !== null && (
          <span
            key={`out-${outgoing}`}
            aria-hidden
            className="flap-out absolute inset-0 flex items-center justify-center font-display numerals text-3xl sm:text-4xl"
          >
            {outgoing}
          </span>
        )}
        <span
          key={`in-${displayValue}`}
          aria-hidden
          className={
            outgoing !== null
              ? "flap-in absolute inset-0 flex items-center justify-center font-display numerals text-3xl sm:text-4xl"
              : "absolute inset-0 flex items-center justify-center font-display numerals text-3xl sm:text-4xl"
          }
        >
          {displayValue}
        </span>
      </div>
      <span className="apparatus text-xs text-paper/80">
        {label}
      </span>
    </div>
  );
}
