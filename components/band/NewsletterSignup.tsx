"use client";

import { useState } from "react";
import { Artist } from "@/lib/data";

interface NewsletterSignupProps {
  artist: Artist;
}

export default function NewsletterSignup({ artist }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!artist.newsletterUrl) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Forward to artist's existing newsletter URL with email pre-filled
    window.open(`${artist.newsletterUrl}?email=${encodeURIComponent(email)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section style={{
      background: "var(--bg)",
      borderTop: "1px solid var(--border)",
      padding: "72px 40px",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "0.75rem",
        }}>
          Stay in the loop
        </p>

        <h2 style={{
          fontFamily: "var(--display-font)",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          lineHeight: 1.05,
          color: "#fff",
          marginBottom: "0.75rem",
        }}>
          Shows. New music. First access.
        </h2>

        <p style={{
          fontFamily: "var(--body-font)",
          fontSize: "0.88rem",
          fontWeight: 300,
          color: "var(--muted)",
          marginBottom: "2rem",
          lineHeight: 1.65,
        }}>
          No noise. Just the stuff that matters from {artist.name}.
        </p>

        {submitted ? (
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}>
            ✓ Check your inbox to confirm
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: "flex",
            gap: "0.5rem",
            maxWidth: 420,
            margin: "0 auto",
            flexWrap: "wrap" as const,
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                minWidth: 200,
                padding: "12px 18px",
                borderRadius: "9999px",
                border: "1px solid var(--border2)",
                background: "var(--bg3)",
                color: "var(--text)",
                fontFamily: "var(--body-font)",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                border: "none",
                background: "var(--accent)",
                color: "#000",
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 700,
                whiteSpace: "nowrap" as const,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-warm)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
              }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
