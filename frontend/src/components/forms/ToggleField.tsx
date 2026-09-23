export function ToggleField({
  legend,
  name,
  value,
  onChange,
  yesLabel = "Evet",
  noLabel = "Hayır",
}: {
  legend: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-body text-xs tracking-[0.15em] uppercase text-ink-soft mb-1">
        {legend}
      </legend>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 font-body text-ink">
          <input
            type="radio"
            name={name}
            checked={value}
            onChange={() => onChange(true)}
          />
          {yesLabel}
        </label>
        <label className="flex items-center gap-2 font-body text-ink">
          <input
            type="radio"
            name={name}
            checked={!value}
            onChange={() => onChange(false)}
          />
          {noLabel}
        </label>
      </div>
    </fieldset>
  );
}
