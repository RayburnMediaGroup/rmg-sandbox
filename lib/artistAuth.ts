"use client";

const PIN_KEY = "bandstack-pin-v1";
const SESSION_KEY = "bandstack-unlocked";

// SHA-256 of "1234" — pre-computed so default PIN works without setup
const DEFAULT_PIN_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

async function hashPin(pin: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function setPin(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  localStorage.setItem(PIN_KEY, hash);
}

// Always returns true — default PIN is always available even without localStorage entry
export function hasPin(): boolean {
  return true;
}

export function isDefaultPin(): boolean {
  try {
    const stored = localStorage.getItem(PIN_KEY);
    // No custom PIN stored → still on default
    return !stored || stored === DEFAULT_PIN_HASH;
  } catch { return true; }
}

export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const stored = localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN_HASH;
    const hash = await hashPin(pin);
    return hash === stored;
  } catch { return false; }
}

// RMG reset — clears custom PIN, restores default (1234)
export function resetPin(): void {
  try { localStorage.removeItem(PIN_KEY); } catch {}
}

export function isUnlocked(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
}

export function unlockSession(): void {
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
}

export function lockSession(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}
