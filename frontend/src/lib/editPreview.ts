import type { InvitationFormValues } from "@/lib/invitationForm";

/** "Önizle" on the edit page: the form's current, unsaved values, handed to
 * the preview tab through localStorage (a new tab doesn't share
 * sessionStorage). Overwritten on every click. */
const key = (invitationId: string) => `zarify.preview.${invitationId}`;

export function writePreview(invitationId: string, values: InvitationFormValues) {
  try {
    localStorage.setItem(key(invitationId), JSON.stringify(values));
  } catch {
    // storage unavailable — the preview tab says so
  }
}

export function readPreview(invitationId: string): string | null {
  try {
    return localStorage.getItem(key(invitationId));
  } catch {
    return null;
  }
}
