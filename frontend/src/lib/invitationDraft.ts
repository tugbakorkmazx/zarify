"use client";

import { useCallback, useSyncExternalStore } from "react";
import { withFormDefaults, type InvitationFormValues } from "@/lib/invitationForm";

const STORAGE_KEY = "zarify.invitationDraft";

/** The create flow's not-yet-published form values, kept in localStorage
 * between the details form and the template preview. */
export type InvitationDraft = InvitationFormValues;

// Same useSyncExternalStore-over-localStorage pattern as lib/auth.ts — SSR
// safe with no mount effect, and kept in sync across tabs.
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: InvitationDraft | null = null;

function readSnapshot(): InvitationDraft | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  if (!raw) {
    cachedValue = null;
    return null;
  }
  try {
    // drafts saved before the optional-content fields existed lack them
    cachedValue = withFormDefaults(JSON.parse(raw) as Partial<InvitationDraft>);
  } catch {
    cachedValue = null;
  }
  return cachedValue;
}

function getServerSnapshot(): InvitationDraft | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function writeDraft(value: InvitationDraft | null) {
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage unavailable — in-memory cache below still updates
  }
  cachedRaw = value ? JSON.stringify(value) : null;
  cachedValue = value;
  listeners.forEach((listener) => listener());
}

export function useInvitationDraft() {
  const draft = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const saveDraft = useCallback((value: InvitationDraft) => writeDraft(value), []);
  const clearDraft = useCallback(() => writeDraft(null), []);
  return { draft, saveDraft, clearDraft };
}
