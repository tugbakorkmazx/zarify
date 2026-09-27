/** Two hairlines 3px apart — the world's divider and frame edge. Takes its
 * color from `currentColor`, so set a text color on it. */
export function DoubleRule({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`double-rule ${className}`} />;
}
