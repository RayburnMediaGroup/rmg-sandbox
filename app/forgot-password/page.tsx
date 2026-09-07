"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
const GOLD = "#d4a843";
const GOLD_DIM = "#a07c28";
const GOLD_LINE = "rgba(212,168,67,0.55)";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || loading) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    } else {
      setSent(true);
    }
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

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ ...T, fontSize: "1.1rem", color: GOLD, fontWeight: 500, marginBottom: "0.75rem" }}>Check your inbox.</p>
              <p style={{ ...T, fontSize: "0.85rem", color: "#888", fontWeight: 300, lineHeight: 1.7 }}>We sent a reset link to <strong style={{ color: "#d8d8d8" }}>{email}</strong>. Click it to set a new password.</p>
              <a href="/login" style={{ ...T, display: "block", marginTop: "2rem", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD_DIM, textDecoration: "none" }}>← back to sign in</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ ...T, fontSize: "0.85rem", color: "#888", fontWeight: 300, marginBottom: "2rem", lineHeight: 1.7 }}>Enter your email and we'll send you a link to reset your password.</p>
              <div>
                <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block" }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" required style={{ ...T, width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${GOLD_LINE}`, color: "#d8d8d8", padding: "14px 0", fontSize: "0.95rem", outline: "none" }} />
              </div>
              {error && <p style={{ ...T, fontSize: "0.78rem", color: "#d95c5c", marginTop: "1rem" }}>{error}</p>}
              <button type="submit" disabled={!email.includes("@") || loading} style={{ ...T, marginTop: "2.5rem", width: "100%", background: email.includes("@") && !loading ? GOLD : "transparent", color: email.includes("@") && !loading ? "#080808" : GOLD_DIM, border: `1px solid ${email.includes("@") && !loading ? GOLD : GOLD_LINE}`, borderRadius: 4, padding: "14px 0", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", cursor: email.includes("@") && !loading ? "pointer" : "not-allowed" }}>
                {loading ? "sending…" : "send reset link"}
              </button>
              <p style={{ ...T, fontSize: "0.68rem", color: "#666", textAlign: "center", marginTop: "1.5rem" }}>
                <a href="/login" style={{ color: GOLD_DIM, textDecoration: "none" }}>← back to sign in</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
