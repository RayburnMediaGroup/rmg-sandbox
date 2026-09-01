"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; }

export default function LyricsSection({ profile, tokens, isArtist }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const withTracks: any[] = ((profile.releases ?? []) as any[]).filter((r: any) => r.tracks?.length > 0 && r.type !== "single").slice().reverse();
  const [activeAlbum, setActiveAlbum] = useState<string>(withTracks[0]?.slug ?? "");
  const [openTrack, setOpenTrack] = useState<number | null>(null);

  const album: any = withTracks.find((r: any) => r.slug === activeAlbum);

  return (
    <section id="lyrics" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Lyrics</p>

        {withTracks.length === 0 && (
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: tokens.muted2, fontWeight: 300 }}>
            {isArtist
              ? "Lyrics are added per-track inside your Music section. Add an album or EP with tracks, then add lyrics to each track."
              : "No lyrics available yet."}
          </p>
        )}

        {/* Album selector strip */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem", overflowX: "auto" }}>
          {withTracks.map((r: any) => (
            <button key={r.slug} onClick={() => { setActiveAlbum(r.slug); setOpenTrack(null); }} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: activeAlbum === r.slug ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)") : "transparent",
              border: border1, borderRadius: 6, padding: "6px 10px", cursor: "pointer",
            }}>
              {r.coverArt && (
                <img src={r.coverArt} alt="" style={{ width: 28, height: 28, borderRadius: 3, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              )}
              <span style={{ ...T, fontSize: "0.75rem", fontWeight: 400, color: activeAlbum === r.slug ? tokens.text : tokens.muted, whiteSpace: "nowrap" }}>{r.title}</span>
            </button>
          ))}
        </div>

        {/* Track list */}
        {album && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              {album.coverArt && <img src={album.coverArt} alt={album.title} style={{ width: 48, height: 48, borderRadius: 4, objectFit: "cover" }} />}
              <div>
                <p style={{ ...T, fontSize: "0.95rem", fontWeight: 600, color: tokens.text }}>{album.title}</p>
                <p style={{ ...lbl, marginTop: "0.2rem" }}>{new Date(album.releaseDate).getFullYear()} · {album.tracks.length} tracks</p>
              </div>
            </div>

            {(album.tracks ?? []).map((track: any, i: number) => (
              <div key={i} style={{ borderBottom: border2 }}>
                <button onClick={() => setOpenTrack(openTrack === i ? null : i)} style={{
                  width: "100%", background: "transparent", border: "none", cursor: "pointer",
                  display: "grid", gridTemplateColumns: isMobile ? "20px 1fr auto" : "28px 1fr auto auto",
                  gap: "1rem", alignItems: "center", padding: "12px 0", textAlign: "left",
                }}>
                  <span style={{ ...lbl, color: tokens.muted2 }}>{track.number}</span>
                  <span style={{ ...T, fontSize: "0.88rem", fontWeight: 400, color: tokens.text }}>{track.title}</span>
                  {track.duration && <span style={{ ...lbl, color: tokens.muted2 }}>{track.duration}</span>}
                  <span style={{ ...lbl, color: track.lyrics ? tokens.accent : tokens.muted2 }}>
                    {track.lyrics ? (openTrack === i ? "▾" : "▸") : "—"}
                  </span>
                </button>

                {openTrack === i && track.lyrics && (
                  <div style={{ padding: "0 0 16px 28px" }}>
                    <pre style={{
                      ...T, fontSize: "0.83rem", color: tokens.muted, fontWeight: 300,
                      lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "inherit",
                    }}>{track.lyrics}</pre>
                  </div>
                )}

                {openTrack === i && !track.lyrics && (
                  <div style={{ padding: "0 0 12px 28px" }}>
                    <p style={{ ...lbl, color: tokens.muted2 }}>Lyrics not yet added.</p>
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
