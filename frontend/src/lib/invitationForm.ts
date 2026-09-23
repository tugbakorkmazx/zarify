import type { InvitationDto, InvitationFieldsInput } from "@/lib/invitations";

/** A programme row as edited in the form — plain strings, "" for blank. */
export interface ScheduleRow {
  time: string;
  title: string;
  description: string;
}

/** The invitation form's state, shared by the create flow (where it's also
 * the locally saved draft) and the edit page. Optional fields are "" when
 * blank; they become null only at the API boundary. */
export interface InvitationFormValues {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  storyText: string;
  schedule: ScheduleRow[];
  dressCode: string;
  giftNote: string;
  accommodationNote: string;
  rsvpDeadline: string;
  rsvpEnabled: boolean;
}

export const EMPTY_FORM: InvitationFormValues = {
  brideName: "",
  groomName: "",
  weddingDate: "",
  weddingTime: "16:00",
  venueName: "",
  venueAddress: "",
  storyText: "",
  schedule: [],
  dressCode: "",
  giftNote: "",
  accommodationNote: "",
  rsvpDeadline: "",
  rsvpEnabled: true,
};

/** Fills in fields a draft saved by an older version of the form lacks. */
export function withFormDefaults(raw: Partial<InvitationFormValues>): InvitationFormValues {
  return { ...EMPTY_FORM, ...raw, schedule: Array.isArray(raw.schedule) ? raw.schedule : [] };
}

const blankToNull = (value: string) => (value.trim() === "" ? null : value.trim());

/** Keeps only programme rows with a time and a title — a half-filled row
 * the owner added and abandoned shouldn't publish as an empty line. */
function filledRows(rows: ScheduleRow[]) {
  return rows.filter((row) => row.title.trim() !== "" && row.time !== "");
}

export function toApiFields(values: InvitationFormValues): InvitationFieldsInput {
  return {
    brideName: values.brideName.trim(),
    groomName: values.groomName.trim(),
    weddingDate: values.weddingDate,
    weddingTime: values.weddingTime,
    venueName: values.venueName.trim(),
    venueAddress: values.venueAddress.trim(),
    storyText: blankToNull(values.storyText),
    schedule: filledRows(values.schedule).map((row) => ({
      time: row.time,
      title: row.title.trim(),
      description: blankToNull(row.description),
    })),
    dressCode: blankToNull(values.dressCode),
    giftNote: blankToNull(values.giftNote),
    accommodationNote: blankToNull(values.accommodationNote),
    rsvpDeadline: values.rsvpDeadline || null,
    rsvpEnabled: values.rsvpEnabled,
  };
}

export function fromInvitation(inv: InvitationDto): InvitationFormValues {
  return {
    brideName: inv.brideName,
    groomName: inv.groomName,
    weddingDate: inv.weddingDate,
    // API sends "16:00:00"; <input type="time"> wants "16:00"
    weddingTime: inv.weddingTime.slice(0, 5),
    venueName: inv.venueName,
    venueAddress: inv.venueAddress,
    storyText: inv.storyText ?? "",
    schedule: inv.schedule.map((item) => ({
      time: item.time,
      title: item.title,
      description: item.description ?? "",
    })),
    dressCode: inv.dressCode ?? "",
    giftNote: inv.giftNote ?? "",
    accommodationNote: inv.accommodationNote ?? "",
    rsvpDeadline: inv.rsvpDeadline ?? "",
    rsvpEnabled: inv.rsvpEnabled,
  };
}

/** The optional sections as the template renders them: a field is present
 * only if the couple filled it in. */
export interface InvitationContent {
  storyText: string | null;
  schedule: { time: string; title: string; description: string | null }[];
  dressCode: string | null;
  giftNote: string | null;
  accommodationNote: string | null;
  rsvpDeadline: string | null;
}

export function contentFromValues(values: InvitationFormValues): InvitationContent {
  const fields = toApiFields(values);
  return {
    storyText: fields.storyText,
    // the API returns the programme sorted by time; match it in the preview
    schedule: [...fields.schedule].sort((a, b) => a.time.localeCompare(b.time)),
    dressCode: fields.dressCode,
    giftNote: fields.giftNote,
    accommodationNote: fields.accommodationNote,
    rsvpDeadline: fields.rsvpDeadline,
  };
}

export function contentFromInvitation(inv: InvitationDto): InvitationContent {
  return {
    storyText: inv.storyText,
    schedule: inv.schedule,
    dressCode: inv.dressCode,
    giftNote: inv.giftNote,
    accommodationNote: inv.accommodationNote,
    rsvpDeadline: inv.rsvpDeadline,
  };
}
