/** Sets "Elif & Kerem" with the ampersand as an italic Garamond wine
 * accent — the one editorial flourish inside the display type. Names
 * without an ampersand render as typed. `stacked` puts each name and the
 * ampersand on its own line, for narrow settings like the cover's oval.
 * `ampClassName` recolours the ampersand where wine would vanish (on a
 * burgundy ground). */
export function CoupleNames({
  names,
  stacked = false,
  ampClassName = "text-wine",
}: {
  names: string;
  stacked?: boolean;
  ampClassName?: string;
}) {
  const parts = names.split(/\s*&\s*/);
  if (parts.length !== 2) return <>{names}</>;

  const amp = <span className={`font-body italic font-normal ${ampClassName}`}>&amp;</span>;
  if (stacked) {
    return (
      <>
        <span className="block">{parts[0]}</span>
        <span className="block text-[0.7em] leading-[1.1]">{amp}</span>
        <span className="block">{parts[1]}</span>
      </>
    );
  }

  return (
    <>
      {parts[0]} {amp} {parts[1]}
    </>
  );
}
