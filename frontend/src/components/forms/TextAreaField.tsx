import type { TextareaHTMLAttributes } from "react";

export function TextAreaField({
  label,
  hint,
  className = "",
  ...textareaProps
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="font-body text-xs tracking-[0.15em] uppercase text-ink-soft">
        {label}
      </span>
      <textarea
        rows={3}
        {...textareaProps}
        className="border border-gold/50 bg-transparent rounded-sm p-2.5 font-body text-ink placeholder:text-ink-soft/50 outline-none focus:border-gold-deep resize-y"
      />
      {hint && <span className="font-body text-xs text-ink-soft/80">{hint}</span>}
    </label>
  );
}
