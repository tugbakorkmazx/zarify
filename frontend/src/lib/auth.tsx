"use client";

import { apiErrorFrom, pageLanguage } from "@/lib/apiErrors";
import { useCallback, useEffect, useSyncExternalStore } from "react";

import { API_URL } from "@/lib/apiUrl";
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
  // A few seconds early, so a token doesn't run out mid-request.
  return new Date(expiresAtUtc).getTime() - 10_000 <= Date.now();
}

// ---------------------------------------------------------------------------
// The session store.
//
// The short-lived access token (15 min) and the user live in localStorage;
// the long-lived refresh token is an httpOnly cookie the page can't read,
// sent only to /api/auth (see backend RefreshTokenService). When the access
// token has run out — on load, or when a request comes back 401 — the store
// asks /api/auth/refresh for a new one, once, shared by every caller in the
// tab. Only when that fails is the user signed out.
//
// A minimal external store over localStorage, read via useSyncExternalStore:
// SSR-safe (the server snapshot is always "logged out", so there's no
// hydration mismatch) and in sync across browser tabs via the "storage" event.
// ---------------------------------------------------------------------------
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: StoredAuth | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** The stored session — also when its access token has expired (the user
 * is still shown while it's being renewed). */
function readSnapshot(): StoredAuth | null {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    cachedValue = null;
  }
  return cachedValue;
}

function getServerSnapshot(): StoredAuth | null {
  return null;
}

function notify() {
  listeners.forEach((listener) => listener());
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
  if (value) refreshGaveUp = false;
  notify();
}

/** The access token if it's still good, otherwise null. */
export function currentToken(): string | null {
  const stored = readSnapshot();
  return stored && !isExpired(stored.expiresAtUtc) ? stored.token : null;
}

// 0 idle · 1 renewing · 2 gave up (network down) — a primitive, so it's a
// stable useSyncExternalStore snapshot.
let refreshInFlight: Promise<string | null> | null = null;
let refreshGaveUp = false;
function getRefreshState(): number {
  return refreshInFlight ? 1 : refreshGaveUp ? 2 : 0;
}

/** Asks the API for a new access token with the refresh cookie. One request
 * at a time per tab: concurrent callers share it. Resolves to the new token,
 * or null when there's no sign-in to renew (the stored session is then
 * cleared) or the API couldn't be reached. If another tab renewed in the
 * meantime, its token is used. */
export function refreshSession(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  const startedWith = readRaw();
  refreshInFlight = fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Accept-Language": pageLanguage() },
  })
    .then(async (res) => {
      if (res.ok) {
        const auth = (await res.json()) as StoredAuth;
        writeAuth(auth);
        return auth.token;
      }
      // Two tabs racing: the other one's rotation made ours stale, but it
      // stored a fresh session we can use.
      if (readRaw() !== startedWith) {
        const token = currentToken();
        if (token) return token;
      }
      writeAuth(null);
      return null;
    })
    .catch(() => {
      refreshGaveUp = true;
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
      notify();
    });
  notify();
  return refreshInFlight;
}

/** Revokes this browser's refresh cookie (best effort) and forgets the
 * session. */
function signOut() {
  writeAuth(null);
  fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
}

/** Where to send someone whose session ended: the sign-in page, coming back
 * to the current page afterwards. */
export function loginHref(): string {
  if (typeof window === "undefined") return "/giris";
  const here = `${window.location.pathname}${window.location.search}`;
  return here === "/" || here.startsWith("/giris") ? "/giris" : `/giris?next=${encodeURIComponent(here)}`;
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

/** Re-evaluated on every render: whether the stored access token has run
 * out by now. */
function getExpiredSnapshot(): boolean {
  const stored = readSnapshot();
  return stored ? isExpired(stored.expiresAtUtc) : false;
}

export function useAuth() {
  const stored = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const expired = useSyncExternalStore(subscribe, getExpiredSnapshot, () => false);
  const refreshState = useSyncExternalStore(subscribe, getRefreshState, () => 0);

  // A stored session whose access token ran out (the tab sat idle, or the
  // page was reopened): renew it before anyone decides the user is signed out.
  const needsRefresh = hydrated && stored !== null && expired;
  useEffect(() => {
    if (needsRefresh && refreshState === 0) void refreshSession();
  }, [needsRefresh, refreshState]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
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
        credentials: "include",
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

  const logout = useCallback(() => signOut(), []);

  return {
    // Not ready while a renewal is pending (or about to start).
    ready: hydrated && !(needsRefresh && refreshState !== 2),
    user: stored?.user ?? null,
    token: stored && !expired ? stored.token : null,
    login,
    register,
    logout,
  };
}

/** fetch() for the API with the page language and, given a token, the
 * Authorization header. A 401 triggers one silent renewal and a retry with
 * the new token; if renewal fails the 401 is returned and the caller sends
 * the user to sign in (loginHref). */
export async function apiFetch(url: string, init: RequestInit = {}, token?: string | null): Promise<Response> {
  const send = (bearer: string | null | undefined) => {
    const headers = new Headers(init.headers);
    headers.set("Accept-Language", pageLanguage());
    if (bearer) headers.set("Authorization", `Bearer ${bearer}`);
    return fetch(url, { ...init, headers });
  };
  const res = await send(token === undefined ? null : (currentToken() ?? token));
  if (res.status !== 401 || token === undefined) return res;
  const fresh = await refreshSession();
  return fresh ? send(fresh) : res;
}

// ---------------------------------------------------------------------------
// Account recovery and deletion — plain functions: none of them changes the
// stored session except through the caller (deleteAccount's caller logs out).
// ---------------------------------------------------------------------------

/** Asks for a reset link. Resolves the same way whether or not the address
 * has an account — the API never says. */
export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
}

/** Sets a new password with the token from the emailed link. Every existing
 * session (this browser's included) stops working afterwards. */
export async function resetPassword(token: string, password: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
}

/** Deletes the signed-in account after re-checking its password. */
export async function deleteAccount(token: string, password: string): Promise<void> {
  const res = await apiFetch(
    `${API_URL}/api/auth/delete-account`,
    { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) },
    token,
  );
  if (!res.ok) {
    throw await apiErrorFrom(res);
  }
}
