"use client";

import Link from "next/link";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";

interface BandNavProps {
  profile: ProfileData;
  tokens: TokenSet;
  activeSection?: string;
}

const NAV_LINKS = [
  { id: "music",     label: "Music" },
  { id: "shows",     label: "Shows" },
  { id: "about",     label: "About" },
  { id: "stage-plot", label: "Stage Plot", href: "/band/stage-plot" },
  { id: "contact",   label: "Contact" },
];

export default function BandNav({ profile, tokens, activeSection }: BandNavProps) {
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: isLt ? "rgba(245,245,245,0.94)" : "rgba(10,10,10,0.92)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${tokens.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 52, gap: "1rem",
    }}>
      {/* Brand */}
      <span
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ ...T, fontWeight: 700, fontSize: "0.9rem", color: tokens.text, cursor: "pointer", letterSpacing: "-0.01em", flexShrink: 0 }}
      >
        {profile.name || "BandStack"}
      </span>

      {/* Section links */}
      <div style={{ display: "flex", gap: "0.15rem", alignItems: "center" }}>
        {NAV_LINKS.map(link => {
          const isActive = activeSection === link.id;
          const style: React.CSSProperties = {
            ...lbl,
            color: isActive ? (isLt ? "#000" : "#fff") : tokens.muted,
            background: isActive ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)") : "transparent",
            padding: "5px 12px", borderRadius: 4, cursor: "pointer",
            textDecoration: "none", display: "inline-block",
            transition: "color 0.15s, background 0.15s",
          };
          if (link.href) {
            return <Link key={link.id} href={link.href} style={style}>{link.label}</Link>;
          }
          return (
            <button key={link.id} onClick={() => scrollTo(link.id)} style={{ ...style, border: "none" }}>
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Right — streaming + social */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
        {profile.spotify && (
          <a href={profile.spotify} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.accent, textDecoration: "none" }}>Spotify</a>
        )}
        {profile.instagram && (
          <a href={profile.instagram} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Instagram</a>
        )}
      </div>
    </nav>
  );
}
