"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.includes("@") && password.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setError("incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/intake");
  }

  return (
    <div style={{
      height: "100vh",
      minHeight: 600,
      background: "#080808",
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
        .btn-signin:hover:not(:disabled) { background: #d4a843 !important; color: #080808 !important; border-color: #d4a843 !important; }
        .btn-signin { transition: all 0.2s; }
      `}</style>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 2rem 2rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(2rem, 6vw, 2.8rem)",
            letterSpacing: "0.04em",
            color: "#d8d8d8",
            margin: "0 0 3rem",
            textAlign: "center",
            lineHeight: 1,
          }}>
            bandwidth
          </p>

          <form onSubmit={handleSubmit}>
            <div>
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
                placeholder="password"
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight: "2.5rem" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position: "absolute", right: 0, bottom: 14, background: "transparent", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.7rem", ...T, letterSpacing: "0.1em" }}
              >
                {showPass ? "hide" : "show"}
              </button>
            </div>

            {error && (
              <p style={{ ...T, fontSize: "0.78rem", color: "#d95c5c", marginTop: "1rem" }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn-signin"
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
              {loading ? "signing in…" : "sign in"}
            </button>

            <p style={{ ...T, fontSize: "0.68rem", color: "#666", textAlign: "center", marginTop: "1.5rem" }}>
              don&apos;t have an account?{" "}
              <a href="/" style={{ color: GOLD_DIM, textDecoration: "none" }}>request access</a>
            </p>
          </form>

        </div>
      </div>

      <div style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>© 2026 bandwidth</p>
          <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>by rayburn media</p>
        </div>
      </div>
    </div>
  );
}
