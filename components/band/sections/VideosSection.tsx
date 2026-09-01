"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface ProfileVideo { title: string; youtubeId: string; date: string; }
interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

function parseYouTubeId(input: string): string {
  const v = input.match(/[?&]v=([^&]+)/)?.[1];
  const s = input.match(/youtu\.be\/([^?]+)/)?.[1];
  return v ?? s ?? input.trim();
}

function VideoCard({ v, tokens, isLt, onDelete }: { v: ProfileVideo; tokens: TokenSet; isLt: boolean; onDelete?: () => void }) {
  const [playing, setPlaying] = useState(false);
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const border1 = `1px solid ${tokens.border}`;
  const thumb = `https://i.ytimg.com/vi/${v.youtubeId}/maxresdefault.jpg`;

  return (
    <div style={{ background: isLt ? "#f0f0f0" : "#111", borderRadius: 8, overflow: "hidden", border: border1, position: "relative" }}>
      {onDelete && (
        <button onClick={onDelete} style={{
          position: "absolute", top: 6, right: 6, zIndex: 10,
          background: "rgba(0,0,0,0.6)", color: "#d95c5c", border: "none",
          borderRadius: 3, padding: "2px 7px", fontSize: "0.65rem", cursor: "pointer", fontFamily: "Inter, sans-serif",
        }}>✕</button>
      )}
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0&fs=0&playsinline=1`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <>
            <img
              src={thumb} alt={v.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`; }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play ${v.title}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "18px solid rgba(255,255,255,0.9)", marginLeft: 3 }} />
              </div>
            </button>
          </>
        )}
      </div>
      <div style={{ padding: "10px 14px 12px" }}>
        <p style={{ ...T, fontSize: "0.82rem", fontWeight: 400, color: tokens.muted, lineHeight: 1.4 }}>{v.title}</p>
      </div>
    </div>
  );
}

export default function VideosSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const [addId, setAddId] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", width: "100%", outline: "none" };

  const profileVideos: ProfileVideo[] = (profile.videos ?? []).filter(v => v.youtubeId.trim() !== "");

  function handleAdd() {
    const id = parseYouTubeId(addId);
    if (!id || !addTitle.trim()) return;
    const next: ProfileVideo[] = [...profileVideos, { title: addTitle.trim(), youtubeId: id, date: new Date().toISOString().slice(0, 10) }];
    onUpdate?.({ videos: next });
    setAddId(""); setAddTitle(""); setAdding(false);
  }

  function handleDelete(idx: number) {
    const next = profileVideos.filter((_, i) => i !== idx);
    onUpdate?.({ videos: next });
  }

  return (
    <section id="videos" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Videos</p>
          {isArtist && <button onClick={() => setAdding(a => !a)} style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T }}>+ Add Video</button>}
        </div>

        {isArtist && adding && (
          <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Add YouTube Video</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <input value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="Video title" style={inp} onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }} />
              <input value={addId} onChange={e => setAddId(e.target.value)} placeholder="YouTube URL or video ID" style={inp} onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleAdd} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 14px", cursor: "pointer" }}>Add</button>
              <button onClick={() => setAdding(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "5px 14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {profileVideos.length === 0 && (
          <p style={{ ...T, fontSize: "0.85rem", color: tokens.muted2 }}>No videos linked yet.</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {profileVideos.map((v, i) => (
            <VideoCard
              key={v.youtubeId + i}
              v={v}
              tokens={tokens}
              isLt={isLt}
              onDelete={isArtist ? () => handleDelete(i) : undefined}
            />
          ))}
        </div>

        {profile.youtube && (
          <div style={{ marginTop: "1.5rem" }}>
            <a href={profile.youtube} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.accent, textDecoration: "none" }}>
              All Videos on YouTube →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
