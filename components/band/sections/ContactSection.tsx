"use client";

import Link from "next/link";
import EditField from "@/components/band/EditField";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; stagePlotHref?: string; }

export default function ContactSection({ profile, tokens, isArtist, onUpdate, stagePlotHref = "/band/stage-plot" }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.75 };
  const border1 = `1px solid ${tokens.border}`;
  const card: React.CSSProperties = {
    background: isLt ? "#f0f0f0" : "#111",
    border: border1, borderRadius: 8, padding: "24px",
  };

  const socials = [
    { label: "Spotify", href: profile.spotify, accent: true },
    { label: "Apple Music", href: profile.appleMusic, accent: true },
    { label: "YouTube", href: profile.youtube },
    { label: "Instagram", href: profile.instagram },
    { label: "Facebook", href: profile.facebook },
    { label: "TikTok", href: profile.tiktok },
  ].filter(s => s.href);

  return (
    <section id="contact" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Contact</p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>

          {/* Booking */}
          <div style={card}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "1rem" }}>Booking</p>
            {isArtist
              ? <>
                  <div style={{ marginBottom: "0.4rem" }}>
                    <p style={lbl}>Contact Name</p>
                    <EditField value={profile.bookingContact ?? ""} onSave={v => onUpdate?.({ bookingContact: v })} placeholder="Contact name" accentColor={tokens.accent} style={{ ...T, fontWeight: 500, fontSize: "0.9rem", color: tokens.text }} />
                  </div>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={lbl}>Booking Email</p>
                    <EditField value={profile.bookingEmail} onSave={v => onUpdate?.({ bookingEmail: v })} placeholder="booking@email.com" accentColor={tokens.accent} style={{ ...body, color: tokens.accent }} />
                  </div>
                </>
              : <>
                  {profile.bookingContact && <p style={{ ...T, fontWeight: 500, fontSize: "0.9rem", color: tokens.text, marginBottom: "0.25rem" }}>{profile.bookingContact}</p>}
                  {profile.bookingEmail && <a href={`mailto:${profile.bookingEmail}`} style={{ ...body, color: tokens.accent, textDecoration: "none", display: "block", marginBottom: "1.25rem" }}>{profile.bookingEmail}</a>}
                </>
            }
            <Link href={stagePlotHref} style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Stage Plot & Tech Rider →</Link>
          </div>

          {/* Streaming + Social */}
          <div style={card}>
            <p style={{ ...lbl, color: tokens.muted2, marginBottom: "1rem" }}>Streaming &amp; Social</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {socials.map(s => (
                <a key={s.label} href={s.href!} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: s.accent ? tokens.accent : tokens.muted, textDecoration: "none" }}>
                  {s.label} →
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
