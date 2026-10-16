"use client";

import { useRef } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

export default function EPKSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const pressPhotoRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.8 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  function handlePressPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdate?.({ pressPhoto: reader.result as string });
    reader.readAsDataURL(file);
  }

  const epkUrl = typeof window !== "undefined" ? window.location.href : "";
  const handlePrint = () => window.print();
  const handleCopy = () => navigator.clipboard.writeText(epkUrl);

  const bioRaw = profile.bio;
  const bio: string[] = bioRaw ? (Array.isArray(bioRaw) ? bioRaw : [bioRaw]) : [];
  const pressQuotes = profile.pressQuotes ?? [];
  const awards = profile.awards ?? [];
  const members = profile.members ?? [];
  const bookingContact = profile.bookingContact ?? "";
  const bookingEmail = profile.bookingEmail ?? "";
  const albumCount = (profile.releases ?? []).filter(r => r.type === "album").length;

  const streamingLinks = [
    { label: "Spotify", url: profile.spotify ?? "" },
    { label: "Apple Music", url: profile.appleMusic ?? "" },
    { label: "YouTube", url: profile.youtube ?? "" },
  ].filter(l => l.url);

  return (
    <section id="epk" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Electronic Press Kit</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={handleCopy} style={{
              ...lbl, color: tokens.muted, background: "transparent",
              border: border2, borderRadius: 3, padding: "4px 10px", cursor: "pointer",
            }}>Copy Link</button>
            <button onClick={handlePrint} style={{
              ...lbl, color: isLt ? "#fff" : "#000",
              background: tokens.accent, border: "none",
              borderRadius: 3, padding: "4px 10px", cursor: "pointer",
            }}>Print / Save PDF</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 260px", gap: isMobile ? "2rem" : "3rem" }}>

          {/* Left col */}
          <div>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Biography</p>
            {bio.map((p, i) => (
              <p key={i} style={{ ...body, marginBottom: "1rem" }}>{p}</p>
            ))}

            {/* Press — always rendered */}
            <div style={{ marginTop: "2rem" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Press</p>
              {pressQuotes.map((q, i) => (
                <div key={i} style={{ borderLeft: `2px solid ${tokens.border}`, paddingLeft: "1rem", marginBottom: "1rem" }}>
                  <p style={{ ...body, fontStyle: "italic" }}>"{q.quote}"</p>
                  <p style={{ ...lbl, marginTop: "0.3rem" }}>{q.source}{q.year ? ` · ${q.year}` : ""}</p>
                </div>
              ))}
              {pressQuotes.length === 0 && (
                <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.75rem" }}>No press quotes yet.</p>
              )}
            </div>

            {/* Awards — always rendered */}
            <div style={{ marginTop: "2rem" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Awards & Recognition</p>
              {awards.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", padding: "6px 0", borderBottom: border2 }}>
                  <span style={{ ...lbl, color: tokens.accent }}>★</span>
                  <p style={{ ...body, color: tokens.muted }}>{a}</p>
                </div>
              ))}
              {awards.length === 0 && (
                <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.75rem" }}>No awards yet.</p>
              )}

              {/* Influences */}
              {(profile.influences ?? []).length > 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.5rem" }}>Influences</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {(profile.influences ?? []).map((inf, i) => (
                      <span key={i} style={{ ...lbl, fontSize: "0.6rem", background: tokens.accent + "14", border: `1px solid ${tokens.accent}44`, borderRadius: 4, color: tokens.accent, padding: "3px 10px" }}>{inf}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Press Photo */}
            <div>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Press Photo</p>
              <input ref={pressPhotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePressPhotoUpload} />
              {profile.pressPhoto ? (
                <div style={{ position: "relative" }}>
                  <img src={profile.pressPhoto} alt="Press photo" style={{ width: "100%", borderRadius: 8, display: "block", objectFit: "cover", maxHeight: 220 }} />
                  {isArtist && (
                    <button onClick={() => pressPhotoRef.current?.click()} style={{ ...lbl, position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", border: border1, borderRadius: 4, color: tokens.muted, padding: "4px 10px", cursor: "pointer", textTransform: "none", letterSpacing: 0, fontSize: "0.68rem" }}>Replace</button>
                  )}
                </div>
              ) : isArtist ? (
                <button onClick={() => pressPhotoRef.current?.click()} style={{ width: "100%", background: isLt ? "#f4f4f4" : "#111", border: `1px dashed ${tokens.border2}`, borderRadius: 8, padding: "32px 16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>📷</span>
                  <span style={{ ...lbl, color: tokens.muted, textTransform: "none", letterSpacing: 0, fontSize: "0.72rem" }}>Upload press photo</span>
                  <span style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.62rem" }}>High-res band or artist shot</span>
                </button>
              ) : (
                <div style={{ width: "100%", background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "32px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0 }}>Photo coming soon</span>
                </div>
              )}
            </div>

            {/* Logo */}
            {profile.heroImage && (
              <div>
                <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Logo</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "14px" }}>
                  <img src={profile.heroImage} alt="Logo" style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    <p style={{ ...T, fontSize: "0.8rem", color: tokens.text, fontWeight: 500 }}>{profile.name}</p>
                    <p style={{ ...lbl, marginTop: "0.2rem" }}>Official logo</p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>At a Glance</p>
              {[
                ["Origin", profile.origin ?? ""],
                ["Genre", Array.isArray(profile.genre) ? profile.genre.join(", ") : (profile.genre ?? "")],
                ["Founded", profile.founded ? String(profile.founded) : ""],
                ["Members", String(members.length)],
                ["Albums", String(albumCount)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}>
                  <span style={lbl}>{k}</span>
                  <span style={{ ...T, fontSize: "0.78rem", color: tokens.muted, fontWeight: 400 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Booking</p>
              {bookingContact && <p style={{ ...body, fontSize: "0.8rem" }}>{bookingContact}</p>}
              {bookingEmail && (
                <a href={`mailto:${bookingEmail}`} style={{ ...lbl, color: tokens.accent, textDecoration: "none", display: "block", marginTop: "0.3rem" }}>{bookingEmail}</a>
              )}
            </div>

            <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Members</p>
              {members.map((m, i) => (
                <div key={i} style={{ padding: "5px 0", borderBottom: border2 }}>
                  <p style={{ ...T, fontSize: "0.8rem", color: tokens.text, fontWeight: 500 }}>{m.name}</p>
                  <p style={{ ...lbl, marginTop: "0.1rem" }}>{m.role}</p>
                </div>
              ))}
            </div>

            <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Streaming</p>
              {streamingLinks.map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, textDecoration: "none", display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}>
                  {l.label} <span style={{ color: tokens.accent }}>↗</span>
                </a>
              ))}
              {streamingLinks.length === 0 && (
                <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.75rem" }}>No streaming links yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
