"use client";

import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";

interface Props { profile: ProfileData; tokens: TokenSet; }

export default function HeroSection({ profile, tokens }: Props) {
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.6rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };

  return (
    <section id="hero" style={{
      padding: "80px 40px 64px",
      borderBottom: `1px solid ${tokens.border}`,
      background: isLt
        ? `linear-gradient(180deg, #e8e8e8 0%, ${tokens.bg} 100%)`
        : `linear-gradient(180deg, #141414 0%, ${tokens.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Artist photo + name side by side on wide screens */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2rem", marginBottom: "2rem" }}>
          {/* Photo */}
          <div style={{
            width: 120, height: 120, borderRadius: 8, flexShrink: 0,
            background: isLt ? "#d8d8d8" : "#1a1a1a",
            border: `1px solid ${tokens.border}`, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {profile.heroImage
              ? <img src={profile.heroImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="1"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            }
          </div>

          {/* Name + meta */}
          <div>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>
              {[profile.genre, profile.origin].filter(Boolean).join(" · ")}
            </p>
            <h1 style={{ ...T, fontWeight: 800, fontSize: "clamp(2.4rem, 6vw, 5rem)", color: tokens.text, lineHeight: 1.0, margin: 0, letterSpacing: "-0.025em" }}>
              {profile.name || "Artist Name"}
            </h1>
          </div>
        </div>

        {/* Tagline */}
        {profile.tagline && (
          <p style={{ ...T, fontSize: "1.05rem", fontWeight: 300, color: tokens.muted, lineHeight: 1.65, maxWidth: 560, marginBottom: "2rem" }}>
            {profile.tagline}
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {profile.spotify && (
            <a href={profile.spotify} target="_blank" rel="noreferrer" style={{
              background: tokens.accent, color: isLt ? "#fff" : "#000",
              ...T, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", textDecoration: "none",
              padding: "11px 24px", borderRadius: 4,
            }}>Listen on Spotify</a>
          )}
          {profile.bookingEmail && (
            <a href={`mailto:${profile.bookingEmail}`} style={{
              border: `1px solid ${tokens.border2}`, color: tokens.muted,
              ...T, fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase",
              textDecoration: "none", padding: "10px 22px", borderRadius: 4,
            }}>Book the Band</a>
          )}
        </div>

        {/* Founded */}
        {profile.founded && (
          <p style={{ ...lbl, marginTop: "2rem", color: tokens.muted2 }}>est. {profile.founded}</p>
        )}
      </div>
    </section>
  );
}
