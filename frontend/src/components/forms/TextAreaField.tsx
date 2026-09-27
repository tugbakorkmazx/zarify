import type { TextareaHTMLAttributes } from "react";
import { BOX_INPUT, FIELD_LABEL } from "@/lib/ui";

export function TextAreaField({
  label,
  hint,
  className = "",
  ...textareaProps
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={FIELD_LABEL}>
        {label}
      </span>
      <textarea
        rows={3}
        {...textareaProps}
        className={`${BOX_INPUT} resize-y`}
      />
      {hint && <span className="font-body text-sm text-soot-soft">{hint}</span>}
    </label>
  );
}
