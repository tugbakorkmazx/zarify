import type { ScheduleRow } from "@/lib/invitationForm";
import { BUTTON_SECONDARY_SM, FIELD_LABEL, LINE_INPUT, TEXT_LINK } from "@/lib/ui";

// Mirrors InvitationFieldsRequest.MaxScheduleItems on the API.
const MAX_ROWS = 12;

const INPUT = LINE_INPUT;

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
      <legend className={`${FIELD_LABEL} mb-2`}>
        Günün Programı
      </legend>

      {rows.length === 0 && (
        <p className="font-body text-base italic text-soot-soft">
          Program eklemezseniz bu bölüm davetiyede görünmez.
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="flex flex-col gap-2 border-t border-soot/20 pt-3">
          <div className="flex items-end gap-3">
            <input
              type="time"
              aria-label={`${index + 1}. satır saati`}
              required
              value={row.time}
              onChange={(e) => update(index, { time: e.target.value })}
              className={`${INPUT} numerals w-28 shrink-0 font-display text-wine`}
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
              className={`apparatus shrink-0 text-sm ${TEXT_LINK}`}
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
            className={`${INPUT} text-base`}
          />
        </div>
      ))}

      {rows.length < MAX_ROWS && (
        <button
          type="button"
          onClick={() => onChange([...rows, { time: "", title: "", description: "" }])}
          className={`self-start ${BUTTON_SECONDARY_SM}`}
        >
          + Program satırı ekle
        </button>
      )}
    </fieldset>
  );
}
