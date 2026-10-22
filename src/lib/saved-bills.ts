"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "votevisible:saved-bill-ids";
const EMPTY: readonly string[] = [];
const SERVER_SNAPSHOT = { ids: EMPTY, storageAvailable: true };
let snapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStorage() {
  try {
    const raw: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    const ids = Array.isArray(raw)
      ? [
          ...new Set(
            raw.filter(
              (id): id is string => typeof id === "string" && id.length > 0,
            ),
          ),
        ]
      : [];
    if (
      JSON.stringify(ids) !== JSON.stringify(snapshot.ids) ||
      !snapshot.storageAvailable
    ) {
      snapshot = { ids, storageAvailable: true };
    }
  } catch {
    // Keep in-memory saves usable when storage is unavailable or malformed.
    if (snapshot.storageAvailable)
      snapshot = { ...snapshot, storageAvailable: false };
  }
}

function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) {
    readStorage();
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    readStorage();
  }
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
      initialized = false;
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function toggleSavedBill(id: string) {
  if (!initialized) {
    initialized = true;
    readStorage();
  } else if (snapshot.storageAvailable) {
    readStorage();
  }
  const ids = snapshot.ids.includes(id)
    ? snapshot.ids.filter((savedId) => savedId !== id)
    : [...snapshot.ids, id];
  let storageAvailable = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    storageAvailable = false;
  }
  snapshot = { ids, storageAvailable };
  emit();
}

export function useSavedBills() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
