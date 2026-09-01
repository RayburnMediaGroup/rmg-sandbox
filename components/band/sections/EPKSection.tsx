"use client";

import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; }

export default function EPKSection({ profile, tokens }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.8 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const epkUrl = typeof window !== "undefined" ? window.location.origin + "/band/epk" : "";
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
            }}>Download PDF</button>
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
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

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
