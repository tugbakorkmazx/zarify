import type { ReactNode } from "react";
import { DoubleRule } from "@/components/herbarium/DoubleRule";

/** Every section opens the same way, on the centre axis: an optional
 * small-caps eyebrow, the Gloock heading, and a short double hairline.
 * `tone="light"` for ivory type on paintings and the wine/olive bands. */
export function SectionHeading({
  eyebrow,
  children,
  tone = "dark",
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {eyebrow && (
        <p className={`apparatus mb-4 text-sm ${light ? "text-wine-pale" : "text-wine"}`}>{eyebrow}</p>
      )}
      <Tag
        className={`max-w-[18ch] font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.015em] text-balance ${
          light ? "text-paper" : "text-soot"
        }`}
      >
        {children}
      </Tag>
      <DoubleRule className={`mt-6 w-40 ${light ? "text-paper/60" : "text-soot"}`} />
    </div>
  );
}
