import type { InputHTMLAttributes } from "react";
import { FIELD_LABEL, LINE_INPUT } from "@/lib/ui";

export function FormField({
  label,
  hint,
  className = "",
  ...inputProps
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className={FIELD_LABEL}>
        {label}
      </span>
      <input
        {...inputProps}
        className={`${LINE_INPUT} read-only:cursor-not-allowed read-only:border-dotted read-only:text-soot-soft read-only:focus:border-soot-soft/60 read-only:focus:shadow-none`}
      />
      {hint && (
        <span className="font-body text-sm text-soot-soft">{hint}</span>
      )}
    </label>
  );
}
