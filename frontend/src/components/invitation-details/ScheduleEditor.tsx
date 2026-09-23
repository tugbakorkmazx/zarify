import type { ScheduleRow } from "@/lib/invitationForm";

// Mirrors InvitationFieldsRequest.MaxScheduleItems on the API.
const MAX_ROWS = 12;

const INPUT =
  "border-b border-gold/50 bg-transparent py-1.5 font-body text-ink outline-none focus:border-gold-deep placeholder:text-ink-soft/50";

/** The day's programme as editable rows. Zero rows is valid (and the
 * default) — the programme section then simply doesn't appear. */
export function ScheduleEditor({
  rows,
  onChange,
}: {
  rows: ScheduleRow[];
  onChange: (rows: ScheduleRow[]) => void;
}) {
  function update(index: number, patch: Partial<ScheduleRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="font-body text-xs tracking-[0.15em] uppercase text-ink-soft mb-1">
        Günün Programı
      </legend>

      {rows.length === 0 && (
        <p className="font-body text-sm text-ink-soft/80">
          Program eklemezseniz bu bölüm davetiyede görünmez.
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="flex flex-col gap-2 border-l border-gold/40 pl-3">
          <div className="flex items-end gap-3">
            <input
              type="time"
              aria-label={`${index + 1}. satır saati`}
              required
              value={row.time}
              onChange={(e) => update(index, { time: e.target.value })}
              className={`${INPUT} w-24 shrink-0`}
            />
            <input
              type="text"
              aria-label={`${index + 1}. satır başlığı`}
              placeholder="Örn. Nikâh Töreni"
              required
              maxLength={100}
              value={row.title}
              onChange={(e) => update(index, { title: e.target.value })}
              className={`${INPUT} flex-1 min-w-0`}
            />
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              aria-label={`${index + 1}. satırı kaldır`}
              className="shrink-0 font-body text-xs text-ink-soft hover:text-ink underline decoration-gold/50 underline-offset-4"
            >
              Kaldır
            </button>
          </div>
          <input
            type="text"
            aria-label={`${index + 1}. satır açıklaması`}
            placeholder="Açıklama (isteğe bağlı)"
            maxLength={300}
            value={row.description}
            onChange={(e) => update(index, { description: e.target.value })}
            className={`${INPUT} text-sm`}
          />
        </div>
      ))}

      {rows.length < MAX_ROWS && (
        <button
          type="button"
          onClick={() => onChange([...rows, { time: "", title: "", description: "" }])}
          className="self-start font-body text-sm text-ink-soft border border-gold/50 rounded-full px-4 py-1.5 transition-[color,border-color,transform] duration-150 hover:border-gold hover:text-ink active:scale-[0.97]"
        >
          + Program satırı ekle
        </button>
      )}
    </fieldset>
  );
}
