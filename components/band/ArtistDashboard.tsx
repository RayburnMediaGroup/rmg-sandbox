"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import type { ProfileData } from "@/lib/bandProfile";

interface Props {
  onClose: () => void;
  onLock: () => void;
  onToggleEditMode: () => void;
  accentColor: string;
  bandName: string;
  editMode: boolean;
  profileKey: string;
  profile: ProfileData;
}

const PLATFORM_LINKS = [
  // Streaming & Music
  { category: "Streaming & Music", label: "Spotify for Artists", url: "https://artists.spotify.com/", icon: "🎵", desc: "Streams, listeners, demographics, pitching" },
  { category: "Streaming & Music", label: "Apple Music for Artists", url: "https://artists.apple.com/", icon: "🍎", desc: "Plays, Shazams, audience data" },
  { category: "Streaming & Music", label: "YouTube Studio", url: "https://studio.youtube.com/", icon: "▶️", desc: "Views, revenue, audience analytics" },
  { category: "Streaming & Music", label: "Amazon Music for Artists", url: "https://artists.amazonmusic.com/", icon: "📦", desc: "Streams, stations, editorial" },
  { category: "Streaming & Music", label: "Pandora AMP", url: "https://amp.pandora.com/", icon: "📻", desc: "Station spins, listener data" },
  // Distribution & Royalties
  { category: "Distribution & Royalties", label: "DistroKid", url: "https://distrokid.com/", icon: "💿", desc: "Royalty statements, distribution" },
  { category: "Distribution & Royalties", label: "ASCAP", url: "https://www.ascap.com/members", icon: "📄", desc: "Performance royalties" },
  { category: "Distribution & Royalties", label: "BMI", url: "https://www.bmi.com/", icon: "📄", desc: "Performance royalties" },
  { category: "Distribution & Royalties", label: "SoundExchange", url: "https://www.soundexchange.com/", icon: "💰", desc: "Digital performance royalties" },
  // Touring & Shows
  { category: "Touring & Shows", label: "Bandsintown for Artists", url: "https://artists.bandsintown.com/", icon: "🎟", desc: "Show tracking, fan following" },
  { category: "Touring & Shows", label: "Songkick for Artists", url: "https://www.songkick.com/account", icon: "🎤", desc: "Concert calendar, ticket links" },
  { category: "Touring & Shows", label: "Setlist.fm", url: "https://www.setlist.fm/", icon: "📋", desc: "Setlist history, fan community" },
  // Social & Analytics
  { category: "Social & Analytics", label: "Instagram Insights", url: "https://www.instagram.com/", icon: "📸", desc: "Reach, impressions, follower growth" },
  { category: "Social & Analytics", label: "Facebook Creator Studio", url: "https://business.facebook.com/", icon: "👥", desc: "Page analytics, ad manager" },
  { category: "Social & Analytics", label: "TikTok Creator Studio", url: "https://www.tiktok.com/", icon: "🎬", desc: "Video views, follower analytics" },
  { category: "Social & Analytics", label: "Last.fm", url: "https://www.last.fm/", icon: "🎧", desc: "Listener tracking, similar artists" },
  // Industry
  { category: "Industry", label: "Chartmetric", url: "https://app.chartmetric.com/", icon: "📊", desc: "Cross-platform analytics, industry data" },
  { category: "Industry", label: "Soundcharts", url: "https://app.soundcharts.com/", icon: "📈", desc: "Radio tracking, chart positions" },
  { category: "Industry", label: "Bandcamp", url: "https://bandcamp.com/", icon: "🏕", desc: "Direct sales, fan subscriptions" },
  { category: "Industry", label: "Music Gateway", url: "https://www.musicgateway.com/", icon: "🔗", desc: "Sync licensing, industry connections" },
];

const categories = [...new Set(PLATFORM_LINKS.map(l => l.category))];

export default function ArtistDashboard({ onClose, onLock, onToggleEditMode, accentColor, bandName, editMode, profileKey, profile }: Props) {
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "#555", fontWeight: 500 };
  const router = useRouter();

  const [refVisits, setRefVisits] = useState(0);
  const [copied, setCopied] = useState(false);

  const refCode = bandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const refUrl = `https://bandstack-template.vercel.app/?ref=${refCode}`;

  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem(`bs_ref_visits_${refCode}`) ?? "0", 10);
      setRefVisits(count);
    } catch {}
  }, [refCode]);

  function copyRefLink() {
    try { navigator.clipboard.writeText(refUrl); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, zIndex: 8000, background: "rgba(0,0,0,0.5)" }} onClick={onClose} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 8001,
        width: "min(480px, 92vw)", background: "#0e0e0e",
        borderLeft: "1px solid #1e1e1e", overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0e0e0e", zIndex: 1 }}>
          <div>
            <p style={{ ...lbl, color: accentColor, marginBottom: "0.2rem" }}>Artist Dashboard</p>
            <p style={{ ...T, fontWeight: 700, fontSize: "0.9rem", color: "#d8d8d8" }}>{bandName}</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button onClick={handleSignOut} style={{ ...T, background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#666", fontSize: "0.68rem", padding: "6px 10px", cursor: "pointer", letterSpacing: "0.05em" }}>Sign Out</button>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Edit Mode Banner */}
        <div
          onClick={onToggleEditMode}
          style={{ margin: "1rem 1.5rem 0", padding: "12px 14px", borderRadius: 8, background: editMode ? accentColor + "18" : "#111", border: `1px solid ${editMode ? accentColor + "66" : accentColor + "33"}`, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <div>
            <p style={{ ...T, fontSize: "0.82rem", color: editMode ? accentColor : "#d8d8d8", fontWeight: 600 }}>✏ Edit Mode</p>
            <p style={{ ...lbl, marginTop: "0.1rem" }}>{editMode ? "Active — click any field on the page to edit" : "Click to enable — edit any field on your page"}</p>
          </div>
          <div style={{ width: 36, height: 20, borderRadius: 10, background: editMode ? accentColor : "#222", border: `1px solid ${editMode ? accentColor : "#333"}`, display: "flex", alignItems: "center", padding: "0 3px", justifyContent: editMode ? "flex-end" : "flex-start", transition: "all 0.2s" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: editMode ? "#000" : "#444" }} />
          </div>
        </div>

        {/* Downloads */}
        <div style={{ margin: "1rem 1.5rem 0", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => { onClose(); setTimeout(() => window.print(), 100); }}
            style={{ ...T, flex: 1, background: accentColor, border: "none", borderRadius: 6, color: "#000", fontSize: "0.72rem", fontWeight: 700, padding: "9px 12px", cursor: "pointer", letterSpacing: "0.04em" }}
          >⬇ Download EPK (PDF)</button>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `${(profile.name ?? "band").toLowerCase().replace(/\s+/g, "-")}-bandstack.json`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}
            style={{ ...T, background: "transparent", border: `1px solid ${accentColor}44`, borderRadius: 6, color: accentColor, fontSize: "0.68rem", fontWeight: 600, padding: "9px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
          >{ } Export JSON</button>
        </div>

        {/* QR Code */}
        <div style={{ margin: "1rem 1.5rem 0", padding: "16px 18px", borderRadius: 8, background: "#111", border: `1px solid #1e1e1e`, display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ background: "#fff", padding: 8, borderRadius: 4, flexShrink: 0 }}>
            <QRCode
              value={typeof window !== "undefined" ? window.location.href : ""}
              size={80}
              fgColor="#080808"
              bgColor="#ffffff"
            />
          </div>
          <div>
            <p style={{ ...T, fontSize: "0.82rem", fontWeight: 600, color: "#d8d8d8", marginBottom: "0.25rem" }}>Your QR Code</p>
            <p style={{ ...lbl, color: "#666", textTransform: "none", letterSpacing: 0, fontSize: "0.68rem", lineHeight: 1.6 }}>Scan to open this page. Share it, print it, put it on a business card.</p>
          </div>
        </div>

        {/* Affiliate / Referral */}
        <div style={{ margin: "1rem 1.5rem 0", padding: "14px 16px", borderRadius: 8, background: "#0e0e0e", border: `1px solid ${accentColor}33` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <p style={{ ...T, fontSize: "0.82rem", fontWeight: 600, color: "#d8d8d8" }}>⭐ Founding Partner</p>
            <span style={{ ...lbl, color: accentColor, border: `1px solid ${accentColor}55`, borderRadius: 3, padding: "2px 7px" }}>
              {refVisits} / 10 referrals
            </span>
          </div>
          <p style={{ ...lbl, color: "#666", marginBottom: "0.75rem", textTransform: "none", letterSpacing: 0, fontSize: "0.65rem", lineHeight: 1.6 }}>
            Refer 10 clients → your first year free + gold badge on your profile.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <code style={{ ...T, fontSize: "0.62rem", color: "#666", background: "#111", border: "1px solid #222", borderRadius: 4, padding: "5px 8px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {refUrl}
            </code>
            <button onClick={copyRefLink} style={{ ...T, background: copied ? accentColor : "transparent", border: `1px solid ${accentColor}55`, borderRadius: 4, color: copied ? "#000" : accentColor, fontSize: "0.62rem", fontWeight: 600, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Platform Links */}
        <div style={{ padding: "1.25rem 1.5rem", flex: 1 }}>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: "1.5rem" }}>
              <p style={{ ...lbl, color: accentColor, marginBottom: "0.6rem" }}>{cat}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {PLATFORM_LINKS.filter(l => l.category === cat).map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer" style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "10px 12px", borderRadius: 8,
                    background: "#111", border: "1px solid #1e1e1e",
                    textDecoration: "none", transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor + "66")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
                  >
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{link.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...T, fontSize: "0.8rem", color: "#d8d8d8", fontWeight: 500 }}>{link.label}</p>
                      <p style={{ ...lbl, marginTop: "0.05rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{link.desc}</p>
                    </div>
                    <span style={{ color: "#666", fontSize: "0.7rem", flexShrink: 0 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1e1e1e" }}>
          <p style={{ ...lbl, textAlign: "center" }}>bandwidth · artist portal · private</p>
        </div>
      </div>
    </>
  );
}
