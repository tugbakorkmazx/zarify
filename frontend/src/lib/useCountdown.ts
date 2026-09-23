"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function partsUntil(targetTime: number): TimeParts {
  const diff = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function toSnapshot(p: TimeParts): string {
  return `${p.days}:${p.hours}:${p.minutes}:${p.seconds}`;
}

function fromSnapshot(snapshot: string): TimeParts {
  const [days, hours, minutes, seconds] = snapshot.split(":").map(Number);
  return { days, hours, minutes, seconds };
}

const SERVER_SNAPSHOT = toSnapshot({ days: 0, hours: 0, minutes: 0, seconds: 0 });

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

/** Ticks once a second via useSyncExternalStore, which is what keeps the
 * server-rendered "00" and the first client paint matching (no manual
 * effect + setState dance, so React's own hydration handshake covers it). */
export function useCountdown(target: Date): TimeParts {
  const targetTime = target.getTime();

  const subscribe = useCallback((onStoreChange: () => void) => {
    const id = window.setInterval(onStoreChange, 1000);
    return () => window.clearInterval(id);
  }, []);

  const getSnapshot = useCallback(
    () => toSnapshot(partsUntil(targetTime)),
    [targetTime],
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return fromSnapshot(snapshot);
}
