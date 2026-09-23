/** A wavy hairline standing in for a deckle (torn-paper) edge — still just
 * a gold rule per the Hairline Gold Rule, only organic instead of straight.
 * Stretches to its container via preserveAspectRatio="none", same
 * technique as IlluminatedRule. */
export function DeckleEdge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`w-full h-2.5 ${className}`}
    >
      <path
        d="M0,5 C20,2 35,8 55,5 C75,2 90,7 110,4 C130,2 145,8 165,5 C185,3 200,7 220,5 C240,3 255,8 275,4 C295,2 310,7 330,5 C350,3 365,7 385,5 C393,4 397,5 400,5"
        fill="none"
        stroke="var(--color-gold)"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
    </svg>
  );
}
