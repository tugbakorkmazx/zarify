export function IlluminatedRule({
  className = "",
  wide = false,
}: {
  className?: string;
  wide?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`${wide ? "w-full max-w-md" : "w-40"} h-4 ${className}`}
    >
      <defs>
        <linearGradient id="goldRule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0" />
          <stop offset="18%" stopColor="var(--color-gold)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="var(--color-gold-light)" stopOpacity="1" />
          <stop offset="82%" stopColor="var(--color-gold)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="8" x2="102" y2="8" stroke="url(#goldRule)" strokeWidth="1" />
      <line x1="138" y1="8" x2="240" y2="8" stroke="url(#goldRule)" strokeWidth="1" />
      <path
        d="M120 2 L126 8 L120 14 L114 8 Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1"
      />
      <circle cx="120" cy="8" r="1.4" fill="var(--color-gold)" />
    </svg>
  );
}
