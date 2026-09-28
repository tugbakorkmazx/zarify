"use client";

import { apiErrorFrom, pageLanguage } from "@/lib/apiErrors";
import { useCallback, useSyncExternalStore } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5097";
const STORAGE_KEY = "zarify.auth";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Only decides whether the admin link shows — the API enforces the role
   * on every admin endpoint. Absent on sessions stored before roles existed. */
  role?: "user" | "admin";
}

interface StoredAuth {
  token: string;
  expiresAtUtc: string;
  user: AuthUser;
}

// Errors are defined in lib/apiErrors (code → message in the page's
// language); re-exported here because most callers already import from
// this module.
export { ApiError, pageLanguage } from "@/lib/apiErrors";

export function jsonHeaders(extra?: Record<string, string>): Record<string, string> {
  return { "Content-Type": "application/json", "Accept-Language": pageLanguage(), ...extra };
}

function isExpired(expiresAtUtc: string): boolean {
  return new Date(expiresAtUtc).getTime() <= Date.now();
}

// A minimal external store over localStorage, read via useSyncExternalStore.
// This makes auth state SSR-safe (the server snapshot is always "logged
// out", so there's no hydration mismatch) without a mount effect, and keeps
// state in sync across browser tabs via the native "storage" event.
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: StoredAuth | null = null;

function readSnapshot(): StoredAuth | null {
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
    const parsed: StoredAuth = JSON.parse(raw);
    cachedValue = isExpired(parsed.expiresAtUtc) ? null : parsed;
  } catch {
    cachedValue = null;
  }
  return cachedValue;
}

function getServerSnapshot(): StoredAuth | null {
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

function writeAuth(value: StoredAuth | null) {
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage unavailable (private browsing, etc.) — the in-memory cache still updates below
  }
  cachedRaw = value ? JSON.stringify(value) : null;
  cachedValue = value;
  listeners.forEach((listener) => listener());
}

// False during SSR and the hydration render, true from the first client
// render after that. While hydrating, useSyncExternalStore hands back the
// server snapshot (logged out) even when a valid session is stored, and
// effects from that render do run — so a route guard that redirected on
// `!token` alone would bounce a signed-in owner to /giris on every direct
// load or refresh. Guards wait for `ready` before deciding.
function subscribeNever() {
  return () => {};
}

export function useAuth() {
  const stored = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw await apiErrorFrom(res);
    }
    writeAuth((await res.json()) as StoredAuth);
  }, []);

  const register = useCallback(
    async (input: { email: string; password: string; firstName: string; lastName: string }) => {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw await apiErrorFrom(res);
      }
      writeAuth((await res.json()) as StoredAuth);
    },
    [],
  );

  const logout = useCallback(() => writeAuth(null), []);

  return {
    ready,
    user: stored?.user ?? null,
    token: stored?.token ?? null,
    login,
    register,
    logout,
  };
}
