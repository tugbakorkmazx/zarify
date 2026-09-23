export function PhotoPlate({
  caption,
  placeholderNote,
  className = "",
}: {
  caption: string;
  placeholderNote: string;
  className?: string;
}) {
  return (
    <figure className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative aspect-[4/5] w-full max-w-xs">
        <div className="absolute inset-0 border border-gold/60" />
        <div className="absolute inset-[6px] border border-gold/30" />
        <div className="absolute inset-[6px] paper-ground-deep flex items-center justify-center px-6 py-6 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="absolute h-10 w-10 text-gold/25"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="24" cy="18" r="8" strokeWidth="1.2" />
            <path d="M8 40c2-9 8-14 16-14s14 5 16 14" strokeWidth="1.2" />
          </svg>
          <span className="relative mt-16 font-body text-xs tracking-wide text-ink-soft/80">
            {placeholderNote}
          </span>
        </div>
        {/* corner marks, echoing an album plate's mounting corners */}
        {(["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 left-0 -rotate-90", "bottom-0 right-0 rotate-180"] as const).map(
          (pos) => (
            <svg
              key={pos}
              aria-hidden="true"
              viewBox="0 0 16 16"
              className={`absolute h-4 w-4 text-gold ${pos}`}
            >
              <path d="M1 1 L1 8 M1 1 L8 1" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          ),
        )}
      </div>
      <figcaption className="font-body text-sm italic text-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}
