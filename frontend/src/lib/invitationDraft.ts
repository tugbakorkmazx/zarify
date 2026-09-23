"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "zarify.invitationDraft";

export interface InvitationDraft {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  includePhotoAlbum: boolean;
  includeDressCode: boolean;
  rsvpEnabled: boolean;
}

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
    cachedValue = JSON.parse(raw) as InvitationDraft;
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
