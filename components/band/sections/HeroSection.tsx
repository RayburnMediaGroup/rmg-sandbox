"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

export default function HeroSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.6rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };

  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  function savePhoto() {
    if (photoUrl.trim()) onUpdate?.({ heroImage: photoUrl.trim() });
    setEditingPhoto(false);
    setPhotoUrl("");
  }

  return (
    <section id="hero" style={{
      padding: "80px 40px 64px",
      borderBottom: `1px solid ${tokens.border}`,
      background: isLt
        ? `linear-gradient(180deg, #e8e8e8 0%, ${tokens.bg} 100%)`
        : `linear-gradient(180deg, #141414 0%, ${tokens.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2rem", marginBottom: "2rem" }}>
          {/* Photo */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 120, height: 120, borderRadius: 8,
              background: isLt ? "#d8d8d8" : "#1a1a1a",
              border: `1px solid ${tokens.border}`, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {profile.heroImage
                ? <img src={profile.heroImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="1"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              }
            </div>
            {isArtist && (
              <button onClick={() => setEditingPhoto(true)} style={{
                position: "absolute", bottom: 4, right: 4,
                background: tokens.accent, border: "none", borderRadius: 4,
                color: isLt ? "#fff" : "#000", fontSize: "0.55rem", fontWeight: 700,
                padding: "3px 6px", cursor: "pointer", ...T, letterSpacing: "0.06em",
              }}>✎ Photo</button>
            )}
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

        {/* Photo URL input */}
        {editingPhoto && (
          <div style={{ marginBottom: "1.5rem", background: isLt ? "#f0f0f0" : "#111", border: `1px solid ${tokens.border}`, borderRadius: 8, padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              placeholder="Paste image URL…"
              autoFocus
              onKeyDown={e => { if (e.key === "Enter") savePhoto(); if (e.key === "Escape") setEditingPhoto(false); }}
              style={{ flex: 1, background: "transparent", border: "none", color: tokens.text, fontSize: "0.8rem", fontFamily: "Inter, system-ui, sans-serif", outline: "none" }}
            />
            <button onClick={savePhoto} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 12px", cursor: "pointer" }}>Save</button>
            <button onClick={() => setEditingPhoto(false)} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.border}`, borderRadius: 3, padding: "5px 10px", cursor: "pointer", color: tokens.muted }}>Cancel</button>
          </div>
        )}

        {profile.tagline && (
          <p style={{ ...T, fontSize: "1.05rem", fontWeight: 300, color: tokens.muted, lineHeight: 1.65, maxWidth: 560, marginBottom: "2rem" }}>
            {profile.tagline}
          </p>
        )}

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

        {profile.founded && (
          <p style={{ ...lbl, marginTop: "2rem", color: tokens.muted2 }}>est. {profile.founded}</p>
        )}
      </div>
    </section>
  );
}
