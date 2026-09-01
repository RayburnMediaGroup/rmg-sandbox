"use client";

import { useState, useEffect } from "react";
import { useMobile } from "@/lib/useMobile";
import { resolveTokens, applyMode } from "@/lib/genreTokens";
import { type ProfileData } from "@/lib/bandProfile";
import Link from "next/link";

import MusicSection      from "@/components/band/sections/MusicSection";
import ShowsSection      from "@/components/band/sections/ShowsSection";
import AboutSection      from "@/components/band/sections/AboutSection";
import MerchSection      from "@/components/band/sections/MerchSection";
import ContactSection    from "@/components/band/sections/ContactSection";
import VideosSection     from "@/components/band/sections/VideosSection";
import LinksSection      from "@/components/band/sections/LinksSection";
import EPKSection        from "@/components/band/sections/EPKSection";
import PhotoSection      from "@/components/band/sections/PhotoSection";
import LyricsSection     from "@/components/band/sections/LyricsSection";
import HistorySection    from "@/components/band/sections/HistorySection";
import GearSection       from "@/components/band/sections/GearSection";
import TimelineSection   from "@/components/band/sections/TimelineSection";
import PressSection      from "@/components/band/sections/PressSection";
import StatsSection      from "@/components/band/sections/StatsSection";
import VenueCRMSection   from "@/components/band/sections/VenueCRMSection";
import SyncSection       from "@/components/band/sections/SyncSection";
import ResourcesSection  from "@/components/band/sections/ResourcesSection";
import TicketsSection    from "@/components/band/sections/TicketsSection";
import MailingListSection from "@/components/band/sections/MailingListSection";
import { isUnlocked }    from "@/lib/artistAuth";
import PinUnlock         from "@/components/band/PinUnlock";
import ArtistDashboard   from "@/components/band/ArtistDashboard";

const NAV_PRIMARY = [
  { id: "about",    label: "About" },
  { id: "music",    label: "Music" },
  { id: "lyrics",   label: "Lyrics" },
  { id: "shows",    label: "Shows" },
  { id: "history",  label: "History" },
  { id: "videos",   label: "Videos" },
  { id: "photos",   label: "Photos" },
  { id: "gear",     label: "Gear" },
  { id: "timeline", label: "Timeline" },
  { id: "press",    label: "Press" },
  { id: "merch",    label: "Merch" },
  { id: "links",    label: "Links" },
  { id: "tickets",  label: "Tickets" },
  { id: "contact",  label: "Contact" },
];

interface Props {
  profileKey: string;
  defaultProfile: ProfileData;
  stagePlotHref: string;
}

export default function BandPage({ profileKey, defaultProfile, stagePlotHref }: Props) {
  const isMobile = useMobile();
  const [profile, setProfile]               = useState<ProfileData | null>(null);
  const [active, setActive]                 = useState("about");
  const [artistUnlocked, setArtistUnlocked] = useState(false);
  const EDIT_KEY = `bandstack-editmode-${profileKey}`;
  const [editMode, setEditMode]             = useState(false);
  const [showPinModal, setShowPinModal]     = useState(false);
  const [showDashboard, setShowDashboard]   = useState(false);

  function loadProfile(): ProfileData {
    try {
      const raw = localStorage.getItem(profileKey);
      if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
    } catch {}
    return defaultProfile;
  }

  function saveProfile(p: ProfileData) {
    try { localStorage.setItem(profileKey, JSON.stringify(p)); } catch {}
  }

  function onUpdate(updates: Partial<ProfileData>) {
    setProfile(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
  }

  useEffect(() => {
    setProfile(loadProfile());
    setArtistUnlocked(isUnlocked(profileKey));
    try { const em = sessionStorage.getItem(EDIT_KEY); if (em === "1") setEditMode(true); } catch {}
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && !localStorage.getItem("bs_ref")) {
        localStorage.setItem("bs_ref", ref);
        const countKey = `bs_ref_visits_${ref}`;
        localStorage.setItem(countKey, String(parseInt(localStorage.getItem(countKey) ?? "0", 10) + 1));
      }
    } catch {}
  }, [profileKey]);

  if (!profile) return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(232,232,232,0.15)" }}>loading…</p>
    </main>
  );

  const tokens = applyMode(resolveTokens(profile.genre ? [profile.genre] : []), profile.colorMode ?? "dark");
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties   = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", fontWeight: 500 };

  const NAV_PRO = [
    { id: "stats",        label: "Stats" },
    { id: "epk",          label: "EPK" },
    { id: "sync",         label: "Sync" },
    { id: "mailing-list", label: "Mailing List" },
    { id: "resources",    label: "Resources" },
    { id: "stage-plot",   label: "Stage Plot", href: stagePlotHref },
  ];

  return (
    <main style={{ background: tokens.bg, minHeight: "100vh", color: tokens.text, ...T }}>
      <style>{`
        .platform-chip { transition: background 0.15s, box-shadow 0.15s; }
        .platform-chip:hover { filter: brightness(1.15); box-shadow: 0 0 8px var(--chip-color); }
      `}</style>

      {/* ── SAMPLE USER watermark ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <p style={{
          ...T, fontSize: "clamp(2rem, 8vw, 5rem)", fontWeight: 800,
          color: "rgba(255,255,255,0.045)", letterSpacing: "0.15em",
          transform: "rotate(-35deg)", whiteSpace: "nowrap", userSelect: "none",
          textTransform: "uppercase",
        }}>SAMPLE USER</p>
      </div>

      {/* ── Hero ── */}
      <div style={{ borderBottom: `1px solid ${tokens.border}` }}>
        <div style={{ position: "relative", width: "100%", height: isMobile ? 200 : 320, overflow: "hidden", background: "#0a0a0a" }}>
          {profile.coverImage && (
            <img src={profile.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)" }} />
          {editMode && (
            <button onClick={() => { const url = prompt("Cover image URL:"); if (url?.trim()) onUpdate({ coverImage: url.trim() }); }} style={{ position: "absolute", top: 10, right: 10, background: tokens.accent, border: "none", borderRadius: 4, color: "#000", fontSize: "0.6rem", fontWeight: 700, padding: "4px 8px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.06em" }}>✎ Cover</button>
          )}
        </div>

        <div style={{ padding: isMobile ? "0 16px 24px" : "0 40px 32px", marginTop: isMobile ? -60 : -80, position: "relative" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", gap: isMobile ? "0.75rem" : "1.75rem" }}>

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: isMobile ? 90 : 140, height: isMobile ? 90 : 140,
                borderRadius: 8,
                background: isLt ? "#d8d8d8" : "#1a1a1a",
                border: `3px solid ${tokens.bg}`, overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
              }}>
                {profile.heroImage
                  ? <img src={profile.heroImage} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="0.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                }
              </div>
              {editMode && (
                <button onClick={() => { const url = prompt("Profile photo URL:"); if (url?.trim()) onUpdate({ heroImage: url.trim() }); }} style={{ position: "absolute", bottom: 4, right: 4, background: tokens.accent, border: "none", borderRadius: 4, color: "#000", fontSize: "0.55rem", fontWeight: 700, padding: "3px 6px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.06em" }}>✎ Photo</button>
              )}
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.4rem" }}>
                {[profile.genre, profile.origin].filter(Boolean).join(" · ")}
              </p>
              <h1 className="editorial-h1" style={{ fontSize: isMobile ? "clamp(1.6rem, 7vw, 2.4rem)" : "clamp(2rem, 5vw, 3.8rem)", color: tokens.text, margin: "0 0 0.4rem" }}>
                {profile.name || "Artist Name"}
              </h1>
              {profile.tagline && (
                <p style={{ ...T, fontSize: isMobile ? "0.8rem" : "0.88rem", fontWeight: 300, color: tokens.muted, lineHeight: 1.6, marginBottom: "1rem", maxWidth: 480 }}>
                  {profile.tagline}
                </p>
              )}

              {/* CTA row */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                {profile.spotify && (
                  <a href={profile.spotify} target="_blank" rel="noreferrer" style={{ background: tokens.accent, color: isLt ? "#fff" : "#000", ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "8px 16px", borderRadius: 4 }}>Listen</a>
                )}
                {profile.bookingEmail && (
                  <a href={`mailto:${profile.bookingEmail}`} style={{ border: `1px solid ${tokens.border2}`, color: tokens.muted, ...T, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "7px 14px", borderRadius: 4 }}>Book</a>
                )}
                {!isMobile && <Link href={stagePlotHref} style={{ border: `1px solid ${tokens.border2}`, color: tokens.muted, ...T, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "7px 14px", borderRadius: 4 }}>Stage Plot</Link>}
              </div>

              {/* Platform chips — from profile.links only */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {(profile.links ?? []).filter(l => l.url && ["Spotify","Apple Music","YouTube","Amazon Music"].includes(l.label)).map(l => {
                  const platformColor: Record<string, string> = {
                    "Spotify": "#1DB954", "Apple Music": "#FC3C44",
                    "YouTube": "#FF0000", "Amazon Music": "#00A8E1",
                  };
                  const color = platformColor[l.label] ?? tokens.muted2;
                  return (
                    <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="platform-chip" style={{
                      ...lbl, color, textDecoration: "none",
                      border: `1px solid ${color}44`, background: `${color}12`,
                      borderRadius: 3, padding: "3px 8px", fontSize: "0.55rem",
                      ["--chip-color" as string]: color,
                    }}>{l.label}</a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky nav ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: isLt ? "rgba(245,245,245,0.94)" : "rgba(10,10,10,0.92)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${tokens.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", height: 40 }}>
          <div style={{ display: "flex", gap: "0.15rem", padding: isMobile ? "0 12px" : "0 32px", height: "100%", alignItems: "center", overflowX: "auto", scrollbarWidth: "none", flex: 1 }}>
            {NAV_PRIMARY.map(n => {
              const isActive = active === n.id;
              return (
                <button key={n.id} onClick={() => setActive(n.id)} style={{
                  ...lbl, color: isActive ? (isLt ? "#000" : "#fff") : tokens.muted,
                  background: isActive ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)") : "transparent",
                  padding: isMobile ? "5px 9px" : "5px 12px", borderRadius: 4, cursor: "pointer",
                  border: "none", whiteSpace: "nowrap",
                }}>{n.label}</button>
              );
            })}
          </div>
          <button
            onClick={() => artistUnlocked ? setShowDashboard(true) : setShowPinModal(true)}
            title={artistUnlocked ? "Artist Dashboard" : "Artist Login"}
            style={{
              background: artistUnlocked ? tokens.accent + "22" : "transparent",
              border: `1px solid ${artistUnlocked ? tokens.accent + "55" : tokens.border2}`,
              borderRadius: 6, padding: "5px 8px", marginRight: isMobile ? 8 : 16, flexShrink: 0,
              cursor: "pointer", color: artistUnlocked ? tokens.accent : tokens.muted2,
              fontSize: isMobile ? "0.65rem" : "0.75rem", lineHeight: 1,
            }}
          >{artistUnlocked ? (isMobile ? "⚡" : "⚡ Dashboard") : "🔒"}</button>
        </div>

        <div style={{
          borderTop: `1px solid ${tokens.border2}`,
          display: "flex", alignItems: "center", height: 40,
          padding: isMobile ? "0 12px" : "0 32px", gap: "0.15rem", overflowX: "auto", scrollbarWidth: "none",
        }}>
          {!isMobile && <span style={{ ...lbl, fontSize: "0.5rem", color: tokens.muted2, marginRight: "0.5rem", flexShrink: 0 }}>Industry</span>}
          {NAV_PRO.map(n => {
            const isActive = active === n.id;
            const tabStyle: React.CSSProperties = {
              ...lbl,
              color: isActive ? (isLt ? "#000" : "#fff") : tokens.muted,
              background: isActive ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)") : "transparent",
              padding: isMobile ? "5px 9px" : "5px 12px", borderRadius: 4, cursor: "pointer",
              textDecoration: "none", display: "inline-block", border: "none", whiteSpace: "nowrap",
            };
            if (n.href) return <Link key={n.id} href={n.href} style={tabStyle}>{n.label}</Link>;
            return <button key={n.id} onClick={() => setActive(n.id)} style={tabStyle}>{n.label}</button>;
          })}
          {artistUnlocked && (
            <button onClick={() => setActive("venue-crm")} style={{
              ...lbl,
              color: active === "venue-crm" ? tokens.accent : tokens.muted,
              background: active === "venue-crm" ? `${tokens.accent}15` : "transparent",
              border: `1px solid ${active === "venue-crm" ? tokens.accent + "44" : "transparent"}`,
              padding: isMobile ? "5px 9px" : "5px 12px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap",
            }}>Venue CRM</button>
          )}
        </div>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div style={{ background: tokens.accent + "18", borderBottom: `1px solid ${tokens.accent}44`, padding: "7px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ ...lbl, color: tokens.accent }}>✏ Edit Mode — click any field to edit · changes save automatically</p>
          <button onClick={() => { setEditMode(false); try { sessionStorage.removeItem(EDIT_KEY); } catch {}; }} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, padding: "3px 10px", cursor: "pointer" }}>Done</button>
        </div>
      )}

      {/* ── Sections ── */}
      {active === "about"      && <AboutSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} stagePlotHref={stagePlotHref} />}
      {active === "music"      && <MusicSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "lyrics"     && <LyricsSection     profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "shows"      && <ShowsSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "history"    && <HistorySection    profile={profile} tokens={tokens} />}
      {active === "videos"     && <VideosSection     profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "photos"     && <PhotoSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "gear"       && <GearSection       profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "timeline"   && <TimelineSection   profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "press"      && <PressSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "stats"      && <StatsSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "merch"      && <MerchSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "epk"        && <EPKSection        profile={profile} tokens={tokens} />}
      {active === "links"      && <LinksSection      profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "tickets"    && <TicketsSection    profile={profile} tokens={tokens} />}
      {active === "mailing-list" && <MailingListSection profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}
      {active === "resources"  && <ResourcesSection  tokens={tokens} />}
      {active === "contact"    && <ContactSection    profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} stagePlotHref={stagePlotHref} />}
      {active === "venue-crm"  && artistUnlocked && <VenueCRMSection profile={profile} tokens={tokens} onUpdate={onUpdate} />}
      {active === "sync"       && <SyncSection       profile={profile} tokens={tokens} isArtist={editMode} onUpdate={onUpdate} />}

      {/* PIN modal */}
      {showPinModal && (
        <PinUnlock
          accentColor={tokens.accent}
          profileKey={profileKey}
          onUnlock={() => { setArtistUnlocked(true); setShowPinModal(false); setShowDashboard(true); }}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {/* Dashboard */}
      {showDashboard && artistUnlocked && (
        <ArtistDashboard
          accentColor={tokens.accent}
          bandName={profile.name}
          editMode={editMode}
          profileKey={profileKey}
          onToggleEditMode={() => { setEditMode(e => { const next = !e; try { if (next) sessionStorage.setItem(EDIT_KEY, "1"); else sessionStorage.removeItem(EDIT_KEY); } catch {} return next; }); setShowDashboard(false); }}
          onClose={() => setShowDashboard(false)}
          onLock={() => { setArtistUnlocked(false); setEditMode(false); try { sessionStorage.removeItem(EDIT_KEY); } catch {} }}
        />
      )}

      {/* Footer */}
      <footer style={{ padding: "20px 40px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between" }}>
        <p style={{ ...lbl, color: tokens.muted2 }}>{profile.name}{profile.founded ? ` · Est. ${profile.founded}` : ""}</p>
        <p style={{ ...lbl, color: tokens.muted2 }}>BandStack · Powered by Rayburn Media Group</p>
      </footer>
    </main>
  );
}
