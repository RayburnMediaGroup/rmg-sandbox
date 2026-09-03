"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";
import { uploadBandImage } from "@/lib/storage";

interface ProfilePhoto { url: string; label: string; }
interface ProfilePoster { url: string; label: string; showDate?: string; venue?: string; }
interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; supabaseSlug?: string; }

type Tab = "photos" | "posters";

export default function PhotoSection({ profile, tokens, isArtist, onUpdate, supabaseSlug }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", width: "100%", outline: "none" };

  const [tab, setTab] = useState<Tab>("photos");
  const [uploading, setUploading] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState("");

  const photos: ProfilePhoto[] = profile.photos ?? [];
  const posters: ProfilePoster[] = profile.posters ?? [];

  function resetForm() {
    setNewLabel(""); setNewDate(""); setNewVenue("");
    setPendingFile(null); setPendingPreview("");
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  async function handleAddPhoto() {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const folder = tab === "photos" ? "photos" : "posters";
      const slug = supabaseSlug ?? "template";
      const url = await uploadBandImage(slug, pendingFile, folder as "photos" | "posters");
      if (tab === "photos") {
        onUpdate?.({ photos: [...photos, { url, label: newLabel.trim() || "Press Photo" }] });
      } else {
        onUpdate?.({ posters: [...posters, { url, label: newLabel.trim() || "Show Poster", showDate: newDate.trim() || undefined, venue: newVenue.trim() || undefined }] });
      }
      resetForm();
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
    }
  }

  function handleDeletePhoto(idx: number) { onUpdate?.({ photos: photos.filter((_, i) => i !== idx) }); }
  function handleDeletePoster(idx: number) { onUpdate?.({ posters: posters.filter((_, i) => i !== idx) }); }

  const tabBtn = (id: Tab, label: string) => (
    <button onClick={() => { setTab(id); resetForm(); }} style={{
      ...lbl, background: tab === id ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)") : "transparent",
      color: tab === id ? (isLt ? "#000" : "#fff") : tokens.muted,
      border: "none", borderRadius: 4, padding: "5px 14px", cursor: "pointer",
    }}>{label}</button>
  );

  const isPoster = tab === "posters";

  return (
    <section id="photos" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        {/* Header with tabs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {tabBtn("photos", "Press Photos")}
            {tabBtn("posters", "Show Posters")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {tab === "photos" && <p style={{ ...lbl, color: tokens.muted2 }}>Hi-res available on request</p>}
            {isArtist && !pendingFile && (
              <label style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "4px 10px", cursor: "pointer", ...T }}>
                + {isPoster ? "Poster" : "Photo"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        {/* Upload form — shown after file is chosen */}
        {isArtist && pendingFile && (
          <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>
              {isPoster ? "New Show Poster" : "New Press Photo"}
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div style={{ borderRadius: 6, overflow: "hidden", border: border2, flexShrink: 0, width: isPoster ? 72 : 100, height: isPoster ? 102 : 75 }}>
                <img src={pendingPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={isPoster ? "Label (e.g. Red Rocks 2025)" : "Label (e.g. Live at Gruene Hall)"} style={inp} />
                {isPoster && <>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inp} />
                  <input value={newVenue} onChange={e => setNewVenue(e.target.value)} placeholder="Venue name" style={inp} />
                </>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleAddPhoto} disabled={uploading} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 14px", cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                {uploading ? "Uploading…" : "Save"}
              </button>
              <button onClick={resetForm} disabled={uploading} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "5px 14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Press Photos grid */}
        {tab === "photos" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {photos.map((photo, i) => (
                <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: border1, position: "relative" }}>
                  {isArtist && (
                    <button onClick={() => handleDeletePhoto(i)} style={{ position: "absolute", top: 6, right: 6, zIndex: 10, background: "rgba(0,0,0,0.6)", color: "#d95c5c", border: "none", borderRadius: 3, padding: "2px 7px", fontSize: "0.65rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>✕</button>
                  )}
                  <div style={{ aspectRatio: "1 / 1", background: isLt ? "#e8e8e8" : "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {photo.url
                      ? <img src={photo.url} alt={photo.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="0.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    }
                  </div>
                  <div style={{ padding: "8px 10px 10px", background: isLt ? "#f4f4f4" : "#0e0e0e" }}>
                    <p style={{ ...lbl, fontSize: "0.54rem" }}>{photo.label}</p>
                    {photo.url && <a href={photo.url} download style={{ ...lbl, color: tokens.accent, textDecoration: "none", display: "block", marginTop: "0.25rem" }}>Download ↓</a>}
                  </div>
                </div>
              ))}
              {photos.length === 0 && <p style={{ ...lbl, color: tokens.muted2 }}>No press photos yet.{isArtist ? " Upload one above." : ""}</p>}
            </div>
            <p style={{ ...lbl, color: tokens.muted2, marginTop: "2rem" }}>
              For hi-res press photos contact{" "}
              <a href={`mailto:${profile.bookingEmail}`} style={{ color: tokens.accent, textDecoration: "none" }}>{profile.bookingEmail}</a>
            </p>
          </>
        )}

        {/* Show Posters grid */}
        {tab === "posters" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
            {posters.map((poster, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: border1, position: "relative" }}>
                {isArtist && (
                  <button onClick={() => handleDeletePoster(i)} style={{ position: "absolute", top: 6, right: 6, zIndex: 10, background: "rgba(0,0,0,0.6)", color: "#d95c5c", border: "none", borderRadius: 3, padding: "2px 7px", fontSize: "0.65rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>✕</button>
                )}
                <div style={{ aspectRatio: "2 / 3", background: isLt ? "#e8e8e8" : "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {poster.url
                    ? <img src={poster.url} alt={poster.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="0.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  }
                </div>
                <div style={{ padding: "8px 10px 10px", background: isLt ? "#f4f4f4" : "#0e0e0e" }}>
                  <p style={{ ...lbl, fontSize: "0.54rem" }}>{poster.label}</p>
                  {poster.venue && <p style={{ ...lbl, fontSize: "0.5rem", color: tokens.muted2, marginTop: "0.15rem" }}>{poster.venue}</p>}
                  {poster.showDate && <p style={{ ...lbl, fontSize: "0.5rem", color: tokens.muted2 }}>{poster.showDate}</p>}
                  {poster.url && <a href={poster.url} download style={{ ...lbl, color: tokens.accent, textDecoration: "none", display: "block", marginTop: "0.25rem" }}>Download ↓</a>}
                </div>
              </div>
            ))}
            {posters.length === 0 && <p style={{ ...lbl, color: tokens.muted2 }}>No show posters yet.{isArtist ? " Upload one above." : ""}</p>}
          </div>
        )}

      </div>
    </section>
  );
}
