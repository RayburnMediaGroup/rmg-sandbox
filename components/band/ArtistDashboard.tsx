"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import type { ProfileData } from "@/lib/bandProfile";

const THEME_OPTIONS: { label: string; genre: string; accent: string }[] = [
  { label: "Outlaw Country",    genre: "outlaw country", accent: "#c8922a" },
  { label: "Country",           genre: "country",        accent: "#d4b84a" },
  { label: "Americana",         genre: "americana",      accent: "#c87941" },
  { label: "Rock",              genre: "rock",           accent: "#e84040" },
  { label: "Indie",             genre: "indie",          accent: "#7b68ee" },
  { label: "Folk",              genre: "folk",           accent: "#8fbc8f" },
  { label: "Blues",             genre: "blues",          accent: "#4a90d9" },
  { label: "Jazz",              genre: "jazz",           accent: "#d4a843" },
  { label: "Soul",              genre: "soul",           accent: "#c85a9e" },
  { label: "Hip-Hop",           genre: "hip-hop",        accent: "#ff6b35" },
  { label: "Electronic",        genre: "electronic",     accent: "#00e5ff" },
  { label: "Ambient",           genre: "ambient",        accent: "#7ec8c8" },
  { label: "Metal",             genre: "metal",          accent: "#9b59b6" },
  { label: "Punk",              genre: "punk",           accent: "#ff2d55" },
  { label: "Alternative",       genre: "alternative",    accent: "#50fa7b" },
];

interface Props {
  onClose: () => void;
  onLock: () => void;
  onUpdate: (u: Partial<ProfileData>) => void;
  accentColor: string;
  bandName: string;
  profileKey: string;
  supabaseSlug?: string;
  profile: ProfileData;
}

const LINK_FIELDS: { key: string; label: string; color: string; placeholder: string }[] = [
  { key: "website",    label: "Website",        color: "#b0b0b0", placeholder: "https://yoursite.com" },
  { key: "facebook",   label: "Facebook",       color: "#1877F2", placeholder: "https://facebook.com/..." },
  { key: "instagram",  label: "Instagram",      color: "#E1306C", placeholder: "https://instagram.com/..." },
  { key: "tiktok",     label: "TikTok",         color: "#69C9D0", placeholder: "https://tiktok.com/@..." },
  { key: "twitter",    label: "X / Twitter",    color: "#e2e2e2", placeholder: "https://x.com/..." },
  { key: "youtube",    label: "YouTube",         color: "#FF0000", placeholder: "https://youtube.com/@..." },
  { key: "spotify",    label: "Spotify",         color: "#1DB954", placeholder: "https://open.spotify.com/artist/..." },
  { key: "appleMusic", label: "Apple Music",    color: "#FC3C44", placeholder: "https://music.apple.com/artist/..." },
  { key: "amazonMusic",label: "Amazon Music",   color: "#00A8E1", placeholder: "https://music.amazon.com/artists/..." },
  { key: "soundcloud", label: "SoundCloud",     color: "#FF5500", placeholder: "https://soundcloud.com/..." },
  { key: "bandcamp",   label: "Bandcamp",       color: "#1DA0C3", placeholder: "https://yourband.bandcamp.com" },
];

export default function ArtistDashboard({ onClose, onLock, onUpdate, accentColor, bandName, profileKey, supabaseSlug, profile }: Props) {
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "#555", fontWeight: 500 };
  const router = useRouter();

  const [refVisits, setRefVisits] = useState(0);
  const [copied, setCopied] = useState(false);
  const [slugInput, setSlugInput] = useState(supabaseSlug ?? "");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "taken" | "saved" | "error">("idle");
  const [showSlugEdit, setShowSlugEdit] = useState(false);
  const [linkDrafts, setLinkDrafts] = useState<Record<string, string>>(
    () => Object.fromEntries(LINK_FIELDS.map(f => [f.key, (profile[f.key as keyof ProfileData] as string) ?? ""]))
  );
  const [linkSaveStatus, setLinkSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [linkSaveError, setLinkSaveError] = useState<string>("");
  const pageUrl = `https://bandstack-template.vercel.app/bandstack/${supabaseSlug ?? profileKey}`;

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

  async function handleSlugSave() {
    if (!supabaseSlug) return;
    const newSlug = slugInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/(^-|-$)/g, "");
    if (!newSlug || newSlug === supabaseSlug) { setShowSlugEdit(false); return; }
    setSlugStatus("checking");
    const { data: existing } = await supabase.from("bands").select("slug").eq("slug", newSlug).maybeSingle();
    if (existing) { setSlugStatus("taken"); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSlugStatus("error"); return; }
    const { error } = await supabase.from("bands").update({ slug: newSlug }).eq("slug", supabaseSlug).eq("user_id", session.user.id);
    if (error) { setSlugStatus("error"); return; }
    setSlugStatus("saved");
    setTimeout(() => router.replace(`/bandstack/${newSlug}`), 800);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function isDirty() {
    return LINK_FIELDS.some(({ key }) => {
      const saved = (profile[key as keyof ProfileData] as string) ?? "";
      return (linkDrafts[key] ?? "") !== saved;
    });
  }

  function safeClose() {
    if (isDirty() && !window.confirm("You have unsaved link changes. Close anyway?")) return;
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, zIndex: 8000, background: "rgba(0,0,0,0.5)" }} onClick={safeClose} />

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
            <button onClick={safeClose} style={{ background: "transparent", border: "none", color: "#555", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
        </div>


        {/* Change URL */}
        {supabaseSlug && (
          <div style={{ margin: "0.75rem 1.5rem 0", padding: "12px 14px", borderRadius: 8, background: "#111", border: "1px solid #1e1e1e" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ ...T, fontSize: "0.78rem", fontWeight: 600, color: "#d8d8d8" }}>Page URL</p>
                <p style={{ ...lbl, color: "#555", marginTop: "0.1rem", textTransform: "none", letterSpacing: 0, fontSize: "0.65rem" }}>
                  /bandstack/<span style={{ color: "#888" }}>{supabaseSlug}</span>
                </p>
              </div>
              <button onClick={() => { setShowSlugEdit(v => !v); setSlugInput(supabaseSlug); setSlugStatus("idle"); }}
                style={{ ...T, background: "transparent", border: "1px solid #333", borderRadius: 5, color: "#666", fontSize: "0.62rem", padding: "4px 10px", cursor: "pointer" }}>
                {showSlugEdit ? "Cancel" : "Change"}
              </button>
            </div>
            {showSlugEdit && (
              <div style={{ marginTop: "0.65rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", flex: 1, background: "#0e0e0e", border: `1px solid ${slugStatus === "taken" || slugStatus === "error" ? "#d95c5c" : slugStatus === "saved" ? "#5aab72" : "#333"}`, borderRadius: 5, overflow: "hidden", padding: "0 8px" }}>
                  <span style={{ ...lbl, color: "#444", whiteSpace: "nowrap", fontSize: "0.6rem", textTransform: "none", letterSpacing: 0 }}>/bandstack/</span>
                  <input
                    value={slugInput}
                    onChange={e => { setSlugInput(e.target.value); setSlugStatus("idle"); }}
                    onKeyDown={e => { if (e.key === "Enter") handleSlugSave(); if (e.key === "Escape") setShowSlugEdit(false); }}
                    style={{ ...T, background: "transparent", border: "none", outline: "none", color: "#d8d8d8", fontSize: "0.72rem", padding: "6px 0", flex: 1, minWidth: 0 }}
                  />
                </div>
                <button onClick={handleSlugSave} disabled={slugStatus === "checking" || slugStatus === "saved"}
                  style={{ ...T, background: slugStatus === "saved" ? "#5aab72" : accentColor, border: "none", borderRadius: 5, color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "7px 12px", cursor: "pointer", whiteSpace: "nowrap", opacity: slugStatus === "checking" ? 0.6 : 1 }}>
                  {slugStatus === "checking" ? "…" : slugStatus === "saved" ? "✓ Saved" : "Save"}
                </button>
              </div>
            )}
            {(slugStatus === "taken") && <p style={{ ...lbl, color: "#d95c5c", marginTop: "0.4rem", textTransform: "none", letterSpacing: 0, fontSize: "0.62rem" }}>That URL is already taken — try another.</p>}
            {(slugStatus === "error") && <p style={{ ...lbl, color: "#d95c5c", marginTop: "0.4rem", textTransform: "none", letterSpacing: 0, fontSize: "0.62rem" }}>Something went wrong. Try again.</p>}
          </div>
        )}

        {/* Page Theme */}
        <div style={{ margin: "0.75rem 1.5rem 0", padding: "12px 14px", borderRadius: 8, background: "#111", border: "1px solid #1e1e1e" }}>
          <p style={{ ...T, fontSize: "0.78rem", fontWeight: 600, color: "#d8d8d8", marginBottom: "0.5rem" }}>Page Theme</p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <select
                value={profile.genre ?? ""}
                onChange={async (e) => {
                  const genre = e.target.value;
                  onUpdate({ genre });
                  if (supabaseSlug) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) return;
                    const { data: row } = await supabase.from("bands").select("profile").eq("slug", supabaseSlug).maybeSingle();
                    if (!row) return;
                    await supabase.from("bands").update({ profile: { ...(row.profile as object), genre } }).eq("slug", supabaseSlug).eq("user_id", session.user.id);
                  }
                }}
                style={{ ...T, width: "100%", background: "#0e0e0e", border: "1px solid #333", borderRadius: 5, color: "#d8d8d8", fontSize: "0.78rem", padding: "8px 10px", cursor: "pointer", appearance: "none", outline: "none" }}
              >
                <option value="">— Select a theme —</option>
                {THEME_OPTIONS.map(o => (
                  <option key={o.genre} value={o.genre}>{o.label}</option>
                ))}
              </select>
            </div>
            {profile.genre && (
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: THEME_OPTIONS.find(o => o.genre === profile.genre)?.accent ?? accentColor, border: "2px solid #333" }} />
            )}
          </div>
          <p style={{ ...lbl, color: "#555", marginTop: "0.4rem", textTransform: "none", letterSpacing: 0, fontSize: "0.62rem" }}>Changes colors and fonts across your entire page instantly.</p>
        </div>

        {/* Downloads */}
        <div style={{ margin: "1rem 1.5rem 0", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => { onClose(); setTimeout(() => window.print(), 100); }}
            style={{ ...T, flex: 1, background: accentColor, border: "none", borderRadius: 6, color: "#000", fontSize: "0.72rem", fontWeight: 700, padding: "9px 12px", cursor: "pointer", letterSpacing: "0.04em" }}
          >⬇ Print / Save EPK as PDF</button>
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
              value={pageUrl}
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

        {/* Links Editor */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <p style={{ ...lbl, color: accentColor }}>Links</p>
            <button
              onClick={async () => {
                setLinkSaveError("");
                const updates: Partial<ProfileData> = {};
                LINK_FIELDS.forEach(({ key }) => {
                  let v = (linkDrafts[key] ?? "").trim();
                  if (v && !v.startsWith("http")) v = "https://" + v;
                  (updates as Record<string, string>)[key] = v;
                });
                // Update React state via parent (also writes to localStorage)
                onUpdate(updates);
                // Write directly to Supabase immediately (bypasses debounce)
                if (supabaseSlug) {
                  const merged = { ...profile, ...updates };
                  const { error } = await supabase.from("bands").update({ profile: merged, updated_at: new Date().toISOString() }).eq("slug", supabaseSlug);
                  if (error) {
                    setLinkSaveStatus("error");
                    setLinkSaveError(error.message);
                    setTimeout(() => setLinkSaveStatus("idle"), 4000);
                    return;
                  }
                }
                setLinkSaveStatus("saved");
                setTimeout(() => setLinkSaveStatus("idle"), 2000);
              }}
              style={{ ...T, background: linkSaveStatus === "saved" ? "#5aab72" : linkSaveStatus === "error" ? "#d95c5c" : accentColor, border: "none", borderRadius: 5, color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "5px 14px", cursor: "pointer", transition: "background 0.2s" }}
            >
              {linkSaveStatus === "saved" ? "✓ Saved" : linkSaveStatus === "error" ? "✕ Error" : "Save Links"}
            </button>
            {linkSaveError && <p style={{ ...T, fontSize: "0.6rem", color: "#d95c5c", marginTop: "0.35rem" }}>{linkSaveError}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {LINK_FIELDS.map(({ key, label, color, placeholder }) => (
              <div key={key}>
                <p style={{ ...lbl, marginBottom: "0.25rem", color: color }}>{label}</p>
                <input
                  type="url"
                  value={linkDrafts[key] ?? ""}
                  placeholder={placeholder}
                  onChange={e => setLinkDrafts(d => ({ ...d, [key]: e.target.value }))}
                  style={{
                    ...T, width: "100%", boxSizing: "border-box",
                    background: "#111", border: "1px solid #222", borderRadius: 5,
                    color: "#d8d8d8", fontSize: "0.7rem", padding: "7px 10px",
                    outline: "none",
                  }}
                  onFocus={e => (e.target.style.borderColor = color + "88")}
                  onBlur={e => (e.target.style.borderColor = "#222")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1e1e1e" }}>
          <p style={{ ...lbl, textAlign: "center" }}>bandwidth · artist portal · private</p>
        </div>
      </div>
    </>
  );
}
