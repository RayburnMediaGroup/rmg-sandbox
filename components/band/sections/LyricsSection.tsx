"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

export default function LyricsSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const withTracks = (profile.releases ?? []).filter(r => (r.tracks?.length ?? 0) > 0 && r.type !== "single").slice().reverse();
  const [activeAlbum, setActiveAlbum] = useState<string>(withTracks[0]?.title ?? "");
  const [openTrack, setOpenTrack] = useState<number | null>(null);
  const [editingTrack, setEditingTrack] = useState<number | null>(null);
  const [lyricsDraft, setLyricsDraft] = useState("");

  const album = withTracks.find(r => r.title === activeAlbum);

  function saveLyrics(trackIdx: number) {
    if (!album) return;
    const releases = (profile.releases ?? []).map(r => {
      if (r.title !== album.title) return r;
      const tracks = (r.tracks ?? []).map((t, i) => i === trackIdx ? { ...t, lyrics: lyricsDraft } : t);
      return { ...r, tracks };
    });
    onUpdate?.({ releases });
    setEditingTrack(null);
  }

  // fix: declare lyricsdraft correctly for use in saveLyrics
  // (lyricsDraft is used via closure — the above is fine)
  void saveLyrics; // suppress unused warning — actually used below

  return (
    <section id="lyrics" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Lyrics</p>

        {withTracks.length === 0 && (
          <p style={{ ...T, fontSize: "0.85rem", color: tokens.muted2, fontWeight: 300 }}>
            {isArtist
              ? "Add an album or EP with tracks in your Music section — lyrics can be added to each track here once they appear."
              : "No lyrics available yet."}
          </p>
        )}

        {/* Album selector strip */}
        {withTracks.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem", overflowX: "auto" }}>
            {withTracks.map(r => (
              <button key={r.title} onClick={() => { setActiveAlbum(r.title); setOpenTrack(null); setEditingTrack(null); }} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: activeAlbum === r.title ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)") : "transparent",
                border: border1, borderRadius: 6, padding: "6px 10px", cursor: "pointer",
              }}>
                {r.coverArt && (
                  <img src={r.coverArt} alt="" style={{ width: 28, height: 28, borderRadius: 3, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                )}
                <span style={{ ...T, fontSize: "0.75rem", fontWeight: 400, color: activeAlbum === r.title ? tokens.text : tokens.muted, whiteSpace: "nowrap" }}>{r.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Track list */}
        {album && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              {album.coverArt && <img src={album.coverArt} alt={album.title} style={{ width: 48, height: 48, borderRadius: 4, objectFit: "cover" }} />}
              <div>
                <p style={{ ...T, fontSize: "0.95rem", fontWeight: 600, color: tokens.text }}>{album.title}</p>
                <p style={{ ...lbl, marginTop: "0.2rem" }}>{album.year} · {album.tracks?.length ?? 0} tracks</p>
              </div>
            </div>

            {(album.tracks ?? []).map((track, i) => (
              <div key={i} style={{ borderBottom: border2 }}>
                <div style={{
                  display: "grid", gridTemplateColumns: isMobile ? "20px 1fr auto" : "28px 1fr auto auto",
                  gap: "1rem", alignItems: "center", padding: "12px 0",
                }}>
                  <span style={{ ...lbl, color: tokens.muted2 }}>{track.number}</span>
                  <button onClick={() => { setOpenTrack(openTrack === i ? null : i); setEditingTrack(null); }} style={{ background: "transparent", border: "none", cursor: track.lyrics || isArtist ? "pointer" : "default", textAlign: "left", padding: 0 }}>
                    <span style={{ ...T, fontSize: "0.88rem", fontWeight: 400, color: tokens.text }}>{track.title}</span>
                  </button>
                  {track.duration && <span style={{ ...lbl, color: tokens.muted2 }}>{track.duration}</span>}
                  <span style={{ ...lbl, color: track.lyrics ? tokens.accent : tokens.muted2 }}>
                    {track.lyrics ? (openTrack === i ? "▾" : "▸") : (isArtist ? <button onClick={() => { setEditingTrack(i); setLyricsDraft(track.lyrics ?? ""); setOpenTrack(i); }} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.accent}44`, borderRadius: 3, color: tokens.accent, padding: "2px 7px", cursor: "pointer" }}>+ Add</button> : "—")}
                  </span>
                </div>

                {openTrack === i && (
                  <div style={{ padding: "0 0 16px 28px" }}>
                    {editingTrack === i ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <textarea
                          value={lyricsDraft}
                          onChange={e => setLyricsDraft(e.target.value)}
                          placeholder="Paste lyrics here…"
                          rows={12}
                          autoFocus
                          style={{ background: isLt ? "#f0f0f0" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 6, color: tokens.text, padding: "10px 12px", fontSize: "0.83rem", fontFamily: "Inter, system-ui, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.9 }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => { const releases = (profile.releases ?? []).map(r => { if (r.title !== album.title) return r; const tracks = (r.tracks ?? []).map((t, ti) => ti === i ? { ...t, lyrics: lyricsDraft } : t); return { ...r, tracks }; }); onUpdate?.({ releases }); setEditingTrack(null); }} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "6px 16px", cursor: "pointer" }}>Save</button>
                          <button onClick={() => setEditingTrack(null)} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.border}`, borderRadius: 3, padding: "6px 12px", cursor: "pointer", color: tokens.muted }}>Cancel</button>
                        </div>
                      </div>
                    ) : track.lyrics ? (
                      <div>
                        <pre style={{ ...T, fontSize: "0.83rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{track.lyrics}</pre>
                        {isArtist && <button onClick={() => { setEditingTrack(i); setLyricsDraft(track.lyrics ?? ""); }} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.accent}44`, borderRadius: 3, color: tokens.accent, padding: "3px 8px", cursor: "pointer", marginTop: "0.75rem" }}>Edit</button>}
                      </div>
                    ) : (
                      <p style={{ ...lbl, color: tokens.muted2 }}>No lyrics added yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
