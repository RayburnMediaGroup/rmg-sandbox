"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

const GOLD = "#d4a843";
const GOLD_DIM = "#a07c28";
const GOLD_LINE = "rgba(212,168,67,0.55)";

const inputStyle: React.CSSProperties = {
  ...T,
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: `1px solid ${GOLD_LINE}`,
  color: "#d8d8d8",
  padding: "14px 0",
  fontSize: "0.95rem",
  outline: "none",
  letterSpacing: "0.01em",
  transition: "border-color 0.2s",
};

type Stage = "form" | "check-email";

export default function WaitlistPage() {
  const [stage, setStage] = useState<Stage>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = firstName.trim() && lastName.trim() && email.includes("@") && password.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");

    // Create auth user — Supabase sends verification email automatically
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { first_name: firstName.trim(), last_name: lastName.trim() },
        emailRedirectTo: `${window.location.origin}/verified`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Insert waitlist row — ignore duplicate email (already on list)
    const { error: insertError } = await supabase.from("waitlist").insert({
      user_id: data.user?.id ?? null,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      invited: false,
    });

    if (insertError && insertError.code !== "23505") {
      console.error("Waitlist insert failed:", insertError);
    }

    setLoading(false);
    setStage("check-email");
  }

  // ── Check email screen ────────────────────────────────────────────
  if (stage === "check-email") {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <style>{`@keyframes breathe { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.6);opacity:1} }`}</style>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d8d8d8", marginBottom: "2.5rem", animation: "breathe 2.8s ease-in-out infinite" }} />
        <p style={{ ...T, fontSize: "2.2rem", color: "#d8d8d8", fontWeight: 300, marginBottom: "0.75rem", letterSpacing: "0.01em" }}>
          you&apos;re on the list.
        </p>
        <p style={{ ...T, fontSize: "1.1rem", color: "#888", fontWeight: 300, textAlign: "center", lineHeight: 1.9, maxWidth: 400 }}>
          your spot is reserved for<br />
          <span style={{ color: "#d8d8d8" }}>{email}</span>
          <br /><br />
          we&apos;ll be in touch when access opens.
        </p>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.4rem",
          color: "#666",
          marginTop: "3.5rem",
          letterSpacing: "0.04em",
        }}>
          bandwidth
        </p>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────
  return (
    <div style={{
      height: "100vh",
      minHeight: 600,
      backgroundColor: "#080808",
      backgroundImage: "linear-gradient(to bottom, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.80) 40%, rgba(8,8,8,0.85) 70%, rgba(8,8,8,0.96) 100%), url('/red-rocks-hero.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        input { font-family: Inter, system-ui, sans-serif; }
        input::placeholder { color: #666; }
        input:focus { border-bottom-color: #c8a55a !important; }
        .btn-request:hover:not(:disabled) { background: #d4a843 !important; color: #080808 !important; border-color: #d4a843 !important; }
        .btn-request { transition: all 0.2s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.2s ease both; }
      `}</style>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 2rem 2rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Wordmark */}
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(2rem, 6vw, 2.8rem)",
            letterSpacing: "0.04em",
            textTransform: "lowercase",
            color: "#d8d8d8",
            margin: "0 0 4rem",
            textAlign: "center",
            lineHeight: 1,
          }}>
            bandwidth
          </p>

          {/* Headline */}
          <div className="fade-up" style={{ marginBottom: "3.5rem" }}>
            <p style={{ ...T, fontSize: "clamp(1.15rem, 3vw, 1.85rem)", fontWeight: 300, color: "#d8d8d8", lineHeight: 1.4, letterSpacing: "-0.01em", margin: 0, textAlign: "center" }}>
              <span style={{ whiteSpace: "nowrap" }}>everything your career needs.</span><br />
              <span style={{ color: "#888", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>one place.</span>
            </p>
          </div>

          {/* Form */}
          <form className="fade-up-2" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
              <div style={{ marginBottom: "0.25rem" }}>
                <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block", marginBottom: "0" }}>First</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="first name"
                  autoComplete="given-name"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: "0.25rem" }}>
                <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block", marginBottom: "0" }}>Last</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="last name"
                  autoComplete="family-name"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: "1.75rem" }}>
              <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginTop: "1.75rem", position: "relative" }}>
              <label style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_DIM, display: "block" }}>Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="8+ characters"
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: "2.5rem" }}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: "absolute", right: 0, bottom: 14, background: "transparent", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.7rem", ...T, letterSpacing: "0.1em" }}
              >
                {showPass ? "hide" : "show"}
              </button>
            </div>

            {password.length > 0 && password.length < 8 && (
              <p style={{ ...T, fontSize: "0.7rem", color: GOLD_DIM, marginTop: "0.5rem" }}>
                {8 - password.length} more character{8 - password.length !== 1 ? "s" : ""}
              </p>
            )}

            {error && (
              <p style={{ ...T, fontSize: "0.78rem", color: "#d95c5c", marginTop: "1rem" }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-request"
              disabled={!canSubmit || loading}
              style={{
                ...T,
                marginTop: "2.5rem",
                width: "100%",
                background: canSubmit && !loading ? GOLD : "transparent",
                color: canSubmit && !loading ? "#080808" : GOLD_DIM,
                border: `1px solid ${canSubmit && !loading ? GOLD : GOLD_LINE}`,
                borderRadius: 4,
                padding: "14px 0",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: canSubmit && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {loading ? "creating account…" : "request access"}
            </button>

            <p style={{ ...T, fontSize: "0.68rem", color: "#888", textAlign: "center", marginTop: "1.25rem", lineHeight: 1.7 }}>
              early access. invite only.<br />we&apos;ll reach out when your spot is ready.
            </p>
            <p style={{ ...T, fontSize: "0.65rem", color: "#555", textAlign: "center", marginTop: "1rem" }}>
              already have access?{" "}
              <a href="/login" style={{ color: "#a07c28", textDecoration: "none" }}>sign in</a>
            </p>
          </form>

        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>
            © 2026 bandwidth
          </p>
          <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>
            by rayburn media
          </p>
        </div>
      </div>
    </div>
  );
}
