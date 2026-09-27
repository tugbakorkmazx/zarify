/** Shared control styles for the Herbaryum world (see DESIGN.md
 * "Components"). Square, small-caps labels, press feedback on every one. */

export const BUTTON_PRIMARY =
  "apparatus inline-block bg-wine px-7 py-3.5 text-base text-paper transition-[background-color,transform] duration-150 hover:bg-wine-deep active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none";

export const BUTTON_SECONDARY =
  "apparatus inline-block border border-soot px-7 py-3.5 text-base text-soot transition-[background-color,border-color,color,transform] duration-150 hover:bg-olive hover:border-olive hover:text-paper active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none";

/** For ivory type on a painting or a wine/olive band. */
export const BUTTON_PRIMARY_LIGHT =
  "apparatus inline-block bg-paper px-7 py-3.5 text-base text-soot transition-[background-color,color,transform] duration-150 hover:bg-wine hover:text-paper active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none";

export const BUTTON_SECONDARY_LIGHT =
  "apparatus inline-block border border-paper/80 px-7 py-3.5 text-base text-paper transition-[background-color,color,transform] duration-150 hover:bg-paper hover:text-soot active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none";

/** Compact versions for toolbars, cards and table rows. */
export const BUTTON_PRIMARY_SM =
  "apparatus inline-block bg-wine px-4 py-2 text-sm text-paper transition-[background-color,transform] duration-150 hover:bg-wine-deep active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none";

export const BUTTON_SECONDARY_SM =
  "apparatus inline-block border border-soot/60 px-4 py-2 text-sm text-soot transition-[background-color,border-color,color,transform] duration-150 hover:bg-olive hover:border-olive hover:text-paper active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none";

export const TEXT_LINK =
  "text-soot underline decoration-olive-soft underline-offset-4 transition-colors hover:text-wine hover:decoration-wine";

export const FIELD_LABEL = "apparatus text-sm text-soot-soft";

export const LINE_INPUT =
  "border-b border-soot-soft/60 bg-transparent py-2 font-body text-lg text-soot outline-none transition-[border-color,box-shadow] placeholder:text-soot-soft/60 focus:border-wine focus:shadow-[0_1px_0_var(--color-wine)]";

export const BOX_INPUT =
  "border border-soot-soft/60 bg-transparent p-3 font-body text-lg text-soot outline-none transition-colors placeholder:text-soot-soft/60 focus:border-wine";

export const HEADING =
  "font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-[-0.015em] text-balance";
