"use client";

const SESSION_KEY = "bandstack-unlocked";

// SHA-256 of "1234" — pre-computed so default PIN works without setup
const DEFAULT_PIN_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";

function pinKey(profileKey: string) { return `bandstack-pin-${profileKey}`; }
function sessionKey(profileKey: string) { return `${SESSION_KEY}-${profileKey}`; }

async function hashPin(pin: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function setPin(pin: string, profileKey: string): Promise<void> {
  const hash = await hashPin(pin);
  localStorage.setItem(pinKey(profileKey), hash);
}

export function hasPin(): boolean {
  return true;
}

export function isDefaultPin(profileKey: string): boolean {
  try {
    const stored = localStorage.getItem(pinKey(profileKey));
    return !stored || stored === DEFAULT_PIN_HASH;
  } catch { return true; }
}

export async function verifyPin(pin: string, profileKey: string): Promise<boolean> {
  try {
    const stored = localStorage.getItem(pinKey(profileKey)) ?? DEFAULT_PIN_HASH;
    const hash = await hashPin(pin);
    return hash === stored;
  } catch { return false; }
}

export function resetPin(profileKey: string): void {
  try { localStorage.removeItem(pinKey(profileKey)); } catch {}
}

export function isUnlocked(profileKey: string): boolean {
  try { return sessionStorage.getItem(sessionKey(profileKey)) === "1"; } catch { return false; }
}

export function unlockSession(profileKey: string): void {
  try { sessionStorage.setItem(sessionKey(profileKey), "1"); } catch {}
}

export function lockSession(profileKey: string): void {
  try { sessionStorage.removeItem(sessionKey(profileKey)); } catch {}
}
