import type { InvitationFormValues } from "@/lib/invitationForm";

/** Unsaved edits to a published invitation, kept in this browser so they
 * survive a session that ends mid-edit (sign in again, come back via
 * ?next=, and they're restored), a closed tab, and feed the "Önizle" tab.
 * `basedOn` is the invitation's updatedAtUtc when editing began, so a
 * restore can say if it changed elsewhere since. Cleared on save or discard. */
export interface EditDraft {
  values: InvitationFormValues;
  basedOn: string | null;
  savedAt: string;
}

const key = (invitationId: string) => `zarify.edit.${invitationId}`;

export function readEditDraft(invitationId: string): EditDraft | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(key(invitationId)) ?? "null");
    return parsed && typeof parsed === "object" && parsed.values ? (parsed as EditDraft) : null;
  } catch {
    return null;
  }
}

export function writeEditDraft(invitationId: string, values: InvitationFormValues, basedOn: string | null) {
  try {
    localStorage.setItem(key(invitationId), JSON.stringify({ values, basedOn, savedAt: new Date().toISOString() }));
  } catch {
    // storage unavailable — editing still works, there's just no safety net
  }
}

export function clearEditDraft(invitationId: string) {
  try {
    localStorage.removeItem(key(invitationId));
  } catch {
    // nothing to clear
  }
}
