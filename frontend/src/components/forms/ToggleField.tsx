import { FIELD_LABEL } from "@/lib/ui";
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
      <legend className={`${FIELD_LABEL} mb-2`}>
        {legend}
      </legend>
      <div className="flex items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2 font-body text-lg text-soot">
          <input
            type="radio"
            className="h-4 w-4 accent-wine"
            name={name}
            checked={value}
            onChange={() => onChange(true)}
          />
          {yesLabel}
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-body text-lg text-soot">
          <input
            type="radio"
            className="h-4 w-4 accent-wine"
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
