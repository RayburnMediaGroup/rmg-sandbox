"use client";

import { useState, useEffect, useRef } from "react";
import { useMobile } from "@/lib/useMobile";
import { resolveTokens, applyMode } from "@/lib/genreTokens";
import { type ProfileData } from "@/lib/bandProfile";
import { supabase } from "@/lib/supabase";
import { uploadBandImage } from "@/lib/storage";
import Link from "next/link";

import MusicSection      from "@/components/band/sections/MusicSection";
import ShowsSection      from "@/components/band/sections/ShowsSection";
import AboutSection      from "@/components/band/sections/AboutSection";
import MerchSection      from "@/components/band/sections/MerchSection";
import ContactSection    from "@/components/band/sections/ContactSection";
import VideosSection     from "@/components/band/sections/VideosSection";
import LinksSection      from "@/components/band/sections/LinksSection";
import SocialChips       from "@/components/band/SocialChips";
import navStyles         from "@/components/band/NavTab.module.css";
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
import EditField         from "@/components/band/EditField";
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

const PLATFORM_DEFAULTS: Record<string, string> = {
  spotify:    "https://open.spotify.com",
  appleMusic: "https://music.apple.com",
  youtube:    "https://youtube.com",
  instagram:  "https://instagram.com",
  tiktok:     "https://tiktok.com",
  facebook:   "https://facebook.com",
  amazonMusic:"https://music.amazon.com",
  soundcloud: "https://soundcloud.com",
  bandcamp:   "https://bandcamp.com",
  twitter:    "https://x.com",
  website:    "",
};

const ALL_PLATFORM_META = [
  { key: "website",     label: "Website",       color: "#b0b0b0",  svg: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
  { key: "facebook",    label: "Facebook",      color: "#1877F2", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { key: "instagram",   label: "Instagram",     color: "#E1306C", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { key: "tiktok",      label: "TikTok",        color: "#69C9D0", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg> },
  { key: "twitter",     label: "X / Twitter",   color: "#e2e2e2",  svg: <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.726-8.83L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { key: "youtube",     label: "YouTube",       color: "#FF0000", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
  { key: "spotify",     label: "Spotify",       color: "#1DB954", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  { key: "appleMusic",  label: "Apple Music",   color: "#FC3C44", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z"/></svg> },
  { key: "amazonMusic", label: "Amazon Music",  color: "#00A8E1", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6zm-2 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg> },
  { key: "soundcloud",  label: "SoundCloud",    color: "#FF5500", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.334c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .105-.061.121-.12l.254-2.474-.254-2.548c-.016-.06-.061-.12-.121-.12m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.15l.24-2.532-.24-2.623c0-.075-.06-.135-.135-.135l-.031-.017zm1.155.36c-.005-.09-.075-.149-.159-.149-.09 0-.158.06-.164.149l-.217 2.43.2 2.563c0 .09.075.157.159.157.074 0 .148-.068.148-.158l.227-2.563-.227-2.444.033.015zm.809-1.709c-.101 0-.18.09-.18.181l-.21 3.957.187 2.563c0 .09.08.164.18.164.094 0 .174-.09.18-.18l.209-2.563-.209-3.972c-.008-.104-.088-.18-.18-.18m.959-.914c-.105 0-.195.09-.203.194l-.18 4.872.165 2.548c0 .12.09.209.195.209.104 0 .194-.089.21-.209l.193-2.548-.192-4.856c-.016-.12-.105-.21-.21-.21m.989-.449c-.121 0-.211.089-.225.209l-.165 5.275.165 2.52c.014.119.104.225.225.225.119 0 .225-.105.225-.225l.195-2.52-.196-5.275c0-.12-.105-.225-.225-.225m1.245.045c0-.135-.105-.24-.24-.24-.119 0-.24.105-.24.24l-.149 5.441.149 2.503c.016.135.121.24.256.24s.24-.105.24-.24l.164-2.503-.164-5.456-.016.015zm.749-.134c-.135 0-.255.119-.255.254l-.15 5.322.15 2.473c0 .15.12.255.255.255s.255-.12.255-.27l.15-2.474-.165-5.307c0-.148-.12-.27-.271-.27m1.005.166c-.164 0-.284.135-.284.285l-.103 5.143.135 2.474c0 .149.119.277.284.277.149 0 .271-.12.284-.285l.121-2.443-.135-5.112c-.012-.164-.135-.285-.285-.285m1.184-.945c-.045-.029-.105-.044-.165-.044s-.119.015-.165.044c-.09.054-.149.15-.149.255v.061l-.104 6.048.115 2.449v.008c.008.06.03.135.074.18.058.061.142.104.234.104.08 0 .158-.044.209-.09.058-.06.091-.135.091-.225l.015-.24.117-2.203-.135-6.086c0-.104-.061-.193-.135-.239l-.002-.022zm1.006-.547c-.045-.045-.09-.061-.15-.061-.074 0-.149.016-.209.061-.075.061-.119.15-.119.24v.029l-.137 6.609.076 1.215.061 1.185c0 .164.148.314.328.314.181 0 .33-.15.33-.329l.15-2.414-.15-6.637c0-.12-.074-.221-.165-.277m8.934 3.777c-.405 0-.795.086-1.139.232-.24-2.654-2.46-4.736-5.188-4.736-.659 0-1.305.135-1.889.359-.225.09-.27.18-.285.359v9.368c.016.18.15.33.33.345h8.185C22.681 17.218 24 15.914 24 14.28s-1.319-2.952-2.938-2.952"/></svg> },
  { key: "bandcamp",    label: "Bandcamp",      color: "#1DA0C3", svg: <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5z"/></svg> },
] as { key: keyof ProfileData; label: string; color: string; svg: React.ReactNode }[];


function MobileNav({ active, setActive, navPrimary, navPro, tokens, lbl, isLt, artistUnlocked, stagePlotHref, onShare, onDashboard, accentColor }: {
  active: string; setActive: (id: string) => void;
  navPrimary: { id: string; label: string }[];
  navPro: { id: string; label: string; href?: string }[];
  tokens: import("@/lib/genreTokens").TokenSet; lbl: React.CSSProperties; isLt: boolean;
  artistUnlocked: boolean; stagePlotHref: string;
  onShare: () => void; onDashboard: () => void; accentColor: string;
}) {
  const btnBase: React.CSSProperties = {
    ...lbl, background: "transparent", border: `1px solid ${tokens.border}`,
    borderRadius: 6, padding: "7px 10px", cursor: "pointer", fontSize: "0.6rem",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ padding: "10px 12px 6px", borderBottom: `1px solid ${tokens.border}` }}>
      {/* Utility row */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem", marginBottom: "8px" }}>
        <button onClick={onShare} style={{ ...btnBase, color: tokens.muted2 }}>↗ Share</button>
        {artistUnlocked && (
          <button onClick={onDashboard} style={{ ...btnBase, background: accentColor + "22", borderColor: accentColor + "55", color: accentColor }}>⚡ Dashboard</button>
        )}
      </div>
      {/* All tabs — one continuous wrapping row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {navPrimary.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)} style={{
            ...btnBase,
            background: active === n.id ? (isLt ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)") : "transparent",
            borderColor: active === n.id ? tokens.accent + "66" : tokens.border,
            color: active === n.id ? (isLt ? "#000" : "#fff") : tokens.muted,
          }}>{n.label}</button>
        ))}
        {navPro.map(n => (
          <button key={n.id} onClick={() => { if (n.href) { window.location.href = n.href; return; } setActive(n.id); }} style={{
            ...btnBase,
            background: active === n.id ? accentColor + "15" : "transparent",
            borderColor: active === n.id ? accentColor + "66" : tokens.border,
            color: active === n.id ? accentColor : tokens.muted,
          }}>{n.label}</button>
        ))}
        {artistUnlocked && (
          <button onClick={() => setActive("venue-crm")} style={{
            ...btnBase, background: active === "venue-crm" ? `${accentColor}15` : "transparent",
            borderColor: active === "venue-crm" ? accentColor + "66" : tokens.border,
            color: active === "venue-crm" ? accentColor : tokens.muted,
          }}>Venue CRM</button>
        )}
      </div>
    </div>
  );
}



interface Props {
  profileKey: string;
  defaultProfile: ProfileData;
  stagePlotHref: string;
  defaultEditMode?: boolean;
  supabaseSlug?: string; // when set, all edits write back to Supabase
}

export default function BandPage({ profileKey, defaultProfile, stagePlotHref, defaultEditMode = false, supabaseSlug }: Props) {
  const isMobile = useMobile();
  const [profile, setProfile]               = useState<ProfileData | null>(null);
  const [active, setActive]                 = useState("about");
  const [artistUnlocked, setArtistUnlocked] = useState(defaultEditMode);
  const EDIT_KEY = `bandstack-editmode-${profileKey}`;
  const [editMode, setEditMode]             = useState(defaultEditMode);
  const [showDashboard, setShowDashboard]   = useState(false);
  const [previewMode, setPreviewMode]       = useState(false);
  const [ctaHovered, setCtaHovered]         = useState<string | null>(null);
  const supabaseSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function loadProfile(): ProfileData {
    try {
      const raw = localStorage.getItem(profileKey);
      if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
    } catch {}
    return defaultProfile;
  }

  function saveProfile(p: ProfileData) {
    // Always save to localStorage
    try { localStorage.setItem(profileKey, JSON.stringify(p)); } catch {}
    // Debounce Supabase write (500ms) when a slug is present
    if (supabaseSlug) {
      if (supabaseSaveTimer.current) clearTimeout(supabaseSaveTimer.current);
      supabaseSaveTimer.current = setTimeout(() => {
        supabase.from("bands").update({ profile: p, updated_at: new Date().toISOString() }).eq("slug", supabaseSlug).then(({ error }) => {
          if (error) console.error("Supabase save error:", error.message);
        });
      }, 500);
    }
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
    if (defaultEditMode) {
      setArtistUnlocked(true);
      setEditMode(true);
    } else {
      try { const em = sessionStorage.getItem(EDIT_KEY); if (em === "1") setEditMode(true); } catch {}
    }
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

      {/* Artist login link — only shown when not the owner */}
      {!artistUnlocked && (
        <a href="/login" style={{
          position: "fixed", bottom: 12, right: 14, zIndex: 9000,
          fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.55rem",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)", textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
        >artist login</a>
      )}

      {/* ── SAMPLE USER watermark — only on demo/template pages ── */}
      {!supabaseSlug && (
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
      )}

      {/* ── Hero ── */}
      <div style={{ borderBottom: `1px solid ${tokens.border}` }}>
        <div style={{ position: "relative", width: "100%", height: isMobile ? 200 : 460, overflow: "hidden", background: "#0a0a0a" }}>
          {profile.coverImage && (
            <img src={profile.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
          )}
          {isMobile && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)" }} />}
          {editMode && !previewMode && (
            <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
              {profile.coverImage && (
                <button onClick={() => onUpdate({ coverImage: "" })} style={{ background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 4, color: "#d95c5c", fontSize: "0.6rem", fontWeight: 700, padding: "4px 8px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>✕</button>
              )}
              <label style={{ background: tokens.accent, borderRadius: 4, color: "#000", fontSize: "0.6rem", fontWeight: 700, padding: "4px 8px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.06em" }}>
                ✎ Cover
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                  const file = e.target.files?.[0]; if (!file || !supabaseSlug) return;
                  try { const url = await uploadBandImage(supabaseSlug, file, "cover"); onUpdate({ coverImage: url }); }
                  catch (err) { console.error("Cover upload failed:", err); }
                }} />
              </label>
            </div>
          )}
        </div>

        <div style={{ padding: isMobile ? "0 16px 24px" : "24px 40px 32px", marginTop: isMobile ? -60 : 0, position: "relative" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", gap: isMobile ? "0.75rem" : "1.75rem" }}>

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: isMobile ? 90 : 200, height: isMobile ? 90 : 200,
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
              {editMode && !previewMode && (
                <div style={{ position: "absolute", bottom: 4, right: 4, display: "flex", gap: 3 }}>
                  {profile.heroImage && (
                    <button onClick={() => onUpdate({ heroImage: "" })} style={{ background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 4, color: "#d95c5c", fontSize: "0.55rem", fontWeight: 700, padding: "3px 6px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>✕</button>
                  )}
                <label style={{ background: tokens.accent, borderRadius: 4, color: "#000", fontSize: "0.55rem", fontWeight: 700, padding: "3px 6px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.06em" }}>
                  ✎ Photo
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files?.[0]; if (!file || !supabaseSlug) return;
                    try { const url = await uploadBandImage(supabaseSlug, file, "profile"); onUpdate({ heroImage: url }); }
                    catch (err) { console.error("Profile upload failed:", err); }
                  }} />
                </label>
                </div>
              )}
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.4rem" }}>
                {(editMode || defaultEditMode) && !previewMode ? (
                  <>
                    <EditField value={profile.genre} placeholder="Genre" onSave={v => onUpdate({ genre: v })} accentColor={tokens.accent} style={{ color: tokens.accent, fontSize: "inherit", letterSpacing: "inherit", fontFamily: "inherit", fontWeight: "inherit", textTransform: "inherit" }} />
                    {" · "}
                    <EditField value={profile.origin} placeholder="City, ST" onSave={v => onUpdate({ origin: v })} accentColor={tokens.accent} style={{ color: tokens.accent, fontSize: "inherit", letterSpacing: "inherit", fontFamily: "inherit", fontWeight: "inherit", textTransform: "inherit" }} />
                  </>
                ) : (
                  [profile.genre, profile.origin].filter(Boolean).join(" · ")
                )}
              </p>
              <h1 className="editorial-h1" style={{ fontSize: isMobile ? "clamp(1.6rem, 7vw, 2.4rem)" : "clamp(2rem, 5vw, 3.8rem)", color: tokens.text, margin: "0 0 0.75rem" }}>
                {(editMode || defaultEditMode) && !previewMode ? (
                  <EditField value={profile.name} placeholder="Your Band Name" onSave={v => onUpdate({ name: v })} accentColor={tokens.accent} style={{ color: tokens.text, fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit", letterSpacing: "inherit" }} />
                ) : (
                  profile.name || "Artist Name"
                )}
              </h1>
              <p style={{ ...T, fontSize: isMobile ? "0.78rem" : "0.88rem", fontWeight: 300, color: tokens.muted, lineHeight: 1.5, marginBottom: isMobile ? "0.6rem" : "1rem", maxWidth: 480 }}>
                {(editMode || defaultEditMode) && !previewMode ? (
                  <EditField value={profile.tagline} placeholder="Your tagline here — one sentence that captures your sound." onSave={v => onUpdate({ tagline: v })} accentColor={tokens.accent} style={{ color: tokens.muted, fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit" }} />
                ) : (
                  profile.tagline
                )}
              </p>

              {/* CTA row */}
              {(() => {
                const ctaBase = (id: string): React.CSSProperties => ({
                  border: `1px solid ${ctaHovered === id ? tokens.muted2 : tokens.border2}`,
                  color: ctaHovered === id ? tokens.text : tokens.muted,
                  background: ctaHovered === id ? "rgba(255,255,255,0.06)" : "transparent",
                  ...T, fontSize: "0.68rem", letterSpacing: "0.06em",
                  textTransform: "uppercase", textDecoration: "none",
                  padding: "7px 14px", borderRadius: 4,
                  transition: "background 0.12s, border-color 0.12s, color 0.12s",
                });
                const hov = (id: string) => ({ onMouseEnter: () => setCtaHovered(id), onMouseLeave: () => setCtaHovered(null) });
                return (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                    <Link href={stagePlotHref} style={ctaBase("stage-plot")} {...hov("stage-plot")}>Stage Plot</Link>
                    {(profile.bookingEmail || (editMode || defaultEditMode)) && (
                      <a href={profile.bookingEmail ? `mailto:${profile.bookingEmail}` : undefined} style={ctaBase("book")} {...hov("book")}>Book</a>
                    )}
                    {profile.spotify && (
                      <a href={profile.spotify} target="_blank" rel="noreferrer" style={ctaBase("listen")} {...hov("listen")}>Listen</a>
                    )}
                  </div>
                );
              })()}

              {/* Platform chips — always full color; click to edit if no URL */}

              {/* Social links — SVG brand icons */}
              <SocialChips profile={profile} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky nav ── */}
      <div data-print-hide style={{
        position: "sticky", top: 0, zIndex: 100,
        background: isLt ? "rgba(245,245,245,0.94)" : "rgba(10,10,10,0.92)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${tokens.border}`,
      }}>
        {isMobile ? (
          /* ── Mobile nav: active label + grid toggle ── */
          <MobileNav
            active={active} setActive={setActive}
            navPrimary={NAV_PRIMARY} navPro={NAV_PRO}
            tokens={tokens} lbl={lbl} isLt={isLt}
            artistUnlocked={artistUnlocked}
            stagePlotHref={stagePlotHref}
            onShare={async () => {
              const url = window.location.href;
              const title = profile.name ?? "bandwidth";
              if (navigator.share) { try { await navigator.share({ title, url }); } catch {} }
              else { try { await navigator.clipboard.writeText(url); } catch {} alert("Link copied!"); }
            }}
            onDashboard={() => setShowDashboard(true)}
            accentColor={tokens.accent}
          />
        ) : (
          /* ── Desktop nav: two scroll rows ── */
          <>
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", padding: "6px 32px 0", gap: "0.15rem" }}>
          <div style={{ display: "flex", gap: "0.15rem", flexWrap: "wrap", flex: 1, alignItems: "center" }}>
            {NAV_PRIMARY.map(n => {
              const isActive = active === n.id;
              return (
                <button key={n.id} onClick={() => setActive(n.id)} className={navStyles.tab} style={{
                  ...lbl, color: isActive ? (isLt ? "#000" : "#fff") : tokens.muted,
                  background: isActive ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)") : "transparent",
                  padding: "5px 12px", borderRadius: 4, cursor: "pointer",
                  border: "none", whiteSpace: "nowrap", marginBottom: 6,
                }}>{n.label}</button>
              );
            })}
          </div>
          <button
            onClick={async () => {
              const url = window.location.href;
              const title = profile.name ?? "bandwidth";
              if (navigator.share) {
                try { await navigator.share({ title, url }); } catch {}
              } else {
                try { await navigator.clipboard.writeText(url); } catch {}
                alert("Link copied!");
              }
            }}
            title="Share this page"
            style={{
              background: "transparent", border: `1px solid ${tokens.border2}`,
              borderRadius: 6, padding: "5px 8px", marginRight: 4, flexShrink: 0,
              cursor: "pointer", color: tokens.muted2,
              fontSize: "0.8rem", lineHeight: 1,
            }}
          >↗</button>
          {artistUnlocked && (
            <button
              onClick={() => setShowDashboard(true)}
              title="Artist Dashboard"
              style={{
                background: tokens.accent + "22",
                border: `1px solid ${tokens.accent + "55"}`,
                borderRadius: 6, padding: "5px 8px", marginRight: 16, flexShrink: 0,
                cursor: "pointer", color: tokens.accent,
                fontSize: "0.75rem", lineHeight: 1,
              }}
            >⚡ Dashboard</button>
          )}
        </div>

        <div style={{
          borderTop: `1px solid ${tokens.border2}`,
          display: "flex", alignItems: "center", flexWrap: "wrap",
          padding: "6px 32px", gap: "0.15rem",
        }}>
          <span style={{ ...lbl, fontSize: "0.5rem", color: tokens.muted2, marginRight: "0.5rem", flexShrink: 0 }}>Industry</span>
          {NAV_PRO.map(n => {
            const isActive = active === n.id;
            const tabStyle: React.CSSProperties = {
              ...lbl,
              color: isActive ? (isLt ? "#000" : "#fff") : tokens.muted,
              background: isActive ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)") : "transparent",
              padding: "5px 12px", borderRadius: 4, cursor: "pointer",
              textDecoration: "none", display: "inline-block", border: "none", whiteSpace: "nowrap",
            };
            if (n.href) return <Link key={n.id} href={n.href} className={navStyles.tab} style={tabStyle}>{n.label}</Link>;
            return <button key={n.id} onClick={() => setActive(n.id)} className={navStyles.tab} style={tabStyle}>{n.label}</button>;
          })}
          {artistUnlocked && (
            <button onClick={() => setActive("venue-crm")} style={{
              ...lbl,
              color: active === "venue-crm" ? tokens.accent : tokens.muted,
              background: active === "venue-crm" ? `${tokens.accent}15` : "transparent",
              border: `1px solid ${active === "venue-crm" ? tokens.accent + "44" : "transparent"}`,
              padding: "5px 12px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap",
            }}>Venue CRM</button>
          )}
        </div>
          </>
        )}
      </div>

      {/* Edit mode banner */}
      {(editMode || defaultEditMode) && (
        <div style={{ background: "#111", borderBottom: "1px solid #1e1e1e", padding: "7px 16px 7px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <p style={{ ...lbl, color: "#555" }}>
            {previewMode ? "Audience view — this is what visitors see" : "Edit mode — click any field to edit · changes save automatically"}
          </p>
          <div style={{ display: "flex", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: 3, gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => setPreviewMode(false)}
              style={{ ...lbl, background: !previewMode ? tokens.accent : "transparent", color: !previewMode ? "#000" : "#666", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.08em" }}
            >✏ Edit</button>
            <button
              onClick={() => setPreviewMode(true)}
              style={{ ...lbl, background: previewMode ? "#444" : "transparent", color: previewMode ? "#d8d8d8" : "#666", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.08em" }}
            >👁 Preview</button>
          </div>
        </div>
      )}

      {/* ── Sections ── */}
      {active === "about"      && <AboutSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} stagePlotHref={stagePlotHref} onNavigate={setActive} />}
      {active === "music"      && <MusicSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "lyrics"     && <LyricsSection     profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "shows"      && <ShowsSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "history"    && <HistorySection    profile={profile} tokens={tokens} />}
      {active === "videos"     && <VideosSection     profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "photos"     && <PhotoSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} supabaseSlug={supabaseSlug} />}
      {active === "gear"       && <GearSection       profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "timeline"   && <TimelineSection   profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "press"      && <PressSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "stats"      && <StatsSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "merch"      && <MerchSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "epk"        && <EPKSection        profile={profile} tokens={tokens} />}
      {active === "links"      && <LinksSection      profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}
      {active === "tickets"    && <TicketsSection    profile={profile} tokens={tokens} />}
      {active === "mailing-list" && <MailingListSection profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} bandSlug={supabaseSlug} />}
      {active === "resources"  && <ResourcesSection  tokens={tokens} />}
      {active === "contact"    && <ContactSection    profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} stagePlotHref={stagePlotHref} />}
      {active === "venue-crm"  && artistUnlocked && <VenueCRMSection profile={profile} tokens={tokens} onUpdate={onUpdate} />}
      {active === "sync"       && <SyncSection       profile={profile} tokens={tokens} isArtist={(editMode || defaultEditMode) && !previewMode} onUpdate={onUpdate} />}

      {/* Dashboard */}
      {showDashboard && artistUnlocked && (
        <ArtistDashboard
          accentColor={tokens.accent}
          bandName={profile.name}
          profileKey={profileKey}
          supabaseSlug={supabaseSlug}
          profile={profile}
          onUpdate={onUpdate}
          onClose={() => setShowDashboard(false)}
          onLock={() => { setArtistUnlocked(false); setEditMode(false); try { sessionStorage.removeItem(EDIT_KEY); } catch {} }}
        />
      )}

      {/* Footer */}
      <footer style={{ padding: "20px 40px", borderTop: `1px solid ${tokens.border}`, display: "flex", justifyContent: "space-between" }}>
        <p style={{ ...lbl, color: tokens.muted2 }}>{profile.name}{profile.founded ? ` · Est. ${profile.founded}` : ""}</p>
        <p style={{ ...lbl, color: tokens.muted2 }}>bandwidth · powered by RMG</p>
      </footer>
    </main>
  );
}
