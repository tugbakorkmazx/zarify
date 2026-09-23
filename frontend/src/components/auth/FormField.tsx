import type { InputHTMLAttributes } from "react";

export function FormField({
  label,
  hint,
  className = "",
  ...inputProps
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-body text-xs tracking-[0.15em] uppercase text-ink-soft">
        {label}
      </span>
      <input
        {...inputProps}
        className="border-b border-gold/50 bg-transparent py-1.5 font-body text-ink outline-none focus:border-gold-deep"
      />
      {hint && (
        <span className="font-body text-xs text-ink-soft/80">{hint}</span>
      )}
    </label>
  );
}
