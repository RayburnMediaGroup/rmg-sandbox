"use client";

import { useState, useRef, useEffect } from "react";
import { setPin, verifyPin, unlockSession, isDefaultPin } from "@/lib/artistAuth";

interface Props {
  onUnlock: () => void;
  onClose: () => void;
  accentColor: string;
  profileKey: string;
}

export default function PinUnlock({ onUnlock, onClose, accentColor, profileKey }: Props) {
  // "enter" → type PIN, "change" → set new PIN after default, "confirm" → confirm new PIN
  const [mode, setMode] = useState<"enter" | "change" | "confirm">("enter");
  const [pin, setPin_] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  async function handleSubmit() {
    setError("");

    if (mode === "enter") {
      const ok = await verifyPin(pin, profileKey);
      if (!ok) { setError("Incorrect PIN"); setPin_(""); triggerShake(); return; }
      unlockSession(profileKey);
      onUnlock();
    } else if (mode === "change") {
      if (newPin.length < 4) { setError("PIN must be at least 4 digits"); return; }
      setMode("confirm");
    } else {
      // confirm
      if (newPin !== confirm) { setError("PINs don't match"); setConfirm(""); triggerShake(); return; }
      await setPin(newPin, profileKey);
      onUnlock();
    }
  }

  function skipChange() {
    // Artist can skip and keep using default for now
    onUnlock();
  }

  const currentValue = mode === "enter" ? pin : mode === "change" ? newPin : confirm;
  const handleChange = (v: string) => {
    if (mode === "enter") setPin_(v);
    else if (mode === "change") setNewPin(v);
    else setConfirm(v);
  };

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#111", border: `1px solid #2e2e2e`, borderRadius: 12,
        padding: "2rem", width: 320, textAlign: "center",
        transform: shake ? "translateX(-6px)" : "none",
        transition: "transform 0.1s",
      }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          {mode === "enter" ? "🔐" : "🔑"}
        </div>

        <p style={{ ...T, fontWeight: 700, fontSize: "1rem", color: "#d8d8d8", marginBottom: "0.25rem" }}>
          {mode === "enter" ? "Artist Login"
            : mode === "change" ? "Set Your PIN"
            : "Confirm New PIN"}
        </p>

        <p style={{ ...T, fontSize: "0.75rem", color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          {mode === "enter"
            ? "Enter your artist PIN to access the dashboard"
            : mode === "change"
            ? "Your default PIN is still active. Set a personal PIN now to secure your page."
            : "Re-enter your new PIN to confirm"}
        </p>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={currentValue}
          onChange={e => handleChange(e.target.value.replace(/\D/g, ""))}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="••••"
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 8, textAlign: "center",
            fontSize: "1.4rem", letterSpacing: "0.4em",
            background: "#1a1a1a", border: `1px solid ${error ? "#d95c5c" : "#333"}`,
            color: "#d8d8d8", outline: "none", marginBottom: "0.75rem",
            fontFamily: "monospace",
          }}
        />

        {error && <p style={{ ...T, fontSize: "0.72rem", color: "#d95c5c", marginBottom: "0.75rem" }}>{error}</p>}

        <button onClick={handleSubmit} style={{
          width: "100%", padding: "11px", borderRadius: 8, border: "none",
          background: accentColor, color: "#000", fontWeight: 700,
          fontSize: "0.82rem", letterSpacing: "0.06em", textTransform: "uppercase",
          cursor: "pointer", ...T, marginBottom: "0.75rem",
        }}>
          {mode === "enter" ? "Unlock"
            : mode === "change" ? "Continue"
            : "Set PIN & Enter"}
        </button>

        {mode === "change" && (
          <button onClick={skipChange} style={{
            background: "transparent", border: "none", color: "#555",
            fontSize: "0.72rem", cursor: "pointer", ...T, display: "block",
            width: "100%", marginBottom: "0.5rem",
          }}>Skip for now</button>
        )}

        {mode === "enter" && (
          <button onClick={onClose} style={{
            background: "transparent", border: "none", color: "#555",
            fontSize: "0.72rem", cursor: "pointer", ...T,
          }}>Cancel</button>
        )}
      </div>
    </div>
  );
}
