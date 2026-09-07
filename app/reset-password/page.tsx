"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
const GOLD = "#d4a843";
const GOLD_DIM = "#a07c28";
const GOLD_LINE = "rgba(212,168,67,0.55)";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sends tokens in the URL hash — wait for it to be parsed
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    }
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ ...T, color: "#666", fontSize: "0.85rem" }}>Verifying reset link…</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      backgroundImage: "linear-gradient(to bottom, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.85) 100%), url('/red-rocks-hero.jpg')",
      backgroundSize: "cover", backgroundPosition: "center 30%",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`* { box-sizing: border-box; } input::placeholder { color: #666; } input:focus { border-bottom-color: #c8a55a !important; }`}</style>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 2rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "clamp(2rem, 6vw, 2.8rem)", color: "#d8d8d8", margin: "0 0 3rem", textAlign: "center", lineHeight: 1 }}>bandwidth</p>

          {done ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ ...T, fontSize: "1.1rem", color: GOLD, fontWeight: 500, marginBottom: "0.5rem" }}>Password updated.</p>
              <p style={{ ...T, fontSize: "0.85rem", color: "#888", fontWeight: 300 }}>Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ ...T, fontSize: "0.85rem", color: "#888", fontWeight: 300, marginBottom: "2rem" }}>Choose a new password for your account.</p>
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block" }}>New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8+ characters" required style={{ ...T, width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${GOLD_LINE}`, color: "#d8d8d8", padding: "14px 0", fontSize: "0.95rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block" }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="repeat password" required style={{ ...T, width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${GOLD_LINE}`, color: "#d8d8d8", padding: "14px 0", fontSize: "0.95rem", outline: "none" }} />
              </div>
              {error && <p style={{ ...T, fontSize: "0.78rem", color: "#d95c5c", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ ...T, marginTop: "2.5rem", width: "100%", background: !loading ? GOLD : "transparent", color: !loading ? "#080808" : GOLD_DIM, border: `1px solid ${!loading ? GOLD : GOLD_LINE}`, borderRadius: 4, padding: "14px 0", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", cursor: !loading ? "pointer" : "wait" }}>
                {loading ? "updating…" : "set new password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
