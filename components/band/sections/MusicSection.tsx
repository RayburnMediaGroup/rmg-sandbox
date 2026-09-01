"use client";

import { useState, useEffect } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface ApiTrack { number: number; title?: string; name?: string; duration: string; previewUrl: string | null; }
interface ApiAlbum { id?: string; itunesId?: number; title?: string; name?: string; type: string; releaseDate: string; coverArt: string | null; spotifyUrl?: string | null; itunesUrl?: string | null; tracks: ApiTrack[]; }
type ApiSource = "itunes" | "spotify" | null;

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; }

export default function MusicSection({ profile, tokens, isArtist }: Props) {
  const isMobile = useMobile();
  const [activeIdx, setActiveIdx] = useState(0);
  const [liveAlbums, setLiveAlbums] = useState<ApiAlbum[] | null>(null);
  const [apiSource, setApiSource] = useState<ApiSource>(null);
  const isLt = profile.colorMode === "light";

  useEffect(() => {
    // Only hit iTunes if there's an artist ID — avoids Ryan's albums bleeding into other profiles
    const id = (profile as any).appleMusicArtistId;
    if (!id) return;
    fetch(`/api/itunes?artistId=${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { if (d.albums?.length) { setLiveAlbums(d.albums); setApiSource("itunes"); } })
      .catch(() => {});
  }, [profile]);

  // Merge live API data with profile releases (profile has richer metadata)
  const releases = liveAlbums
    ? liveAlbums.map(a => {
        const apiTitle = (a.title ?? a.name ?? "").toLowerCase().trim();
        const profileMatch = profile.releases?.find(r => {
          const pt = r.title.toLowerCase().trim();
          return pt === apiTitle || pt.includes(apiTitle) || apiTitle.includes(pt);
        });
        return {
          title: a.title ?? a.name ?? "",
          type: (profileMatch?.type ?? a.type ?? "album") as "album" | "ep" | "single" | "live",
          year: a.releaseDate?.slice(0, 4) ?? "",
          description: profileMatch?.description ?? "",
          spotifyUrl: a.spotifyUrl ?? profileMatch?.spotifyUrl ?? "",
          coverArt: a.coverArt ?? profileMatch?.coverArt ?? "",
          itunesUrl: a.itunesUrl ?? "",
          tracks: a.tracks.map(t => ({ number: t.number, title: t.title ?? t.name ?? "", duration: t.duration })),
        };
      })
    : (profile.releases ?? []).map(r => ({
        ...r,
        itunesUrl: "",
      }));

  const isVerified = !!liveAlbums;

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.text, fontWeight: 300, lineHeight: 1.75 };
  const border1 = `1px solid ${tokens.border}`;

  const albums = releases.filter(r => r.type === "album" || r.type === "ep" || r.type === "live").slice().reverse();
  const singles = releases.filter(r => r.type === "single").slice().reverse();
  const displayReleases = albums.length > 0 ? albums : releases.slice().reverse();
  const release = displayReleases[activeIdx] ?? displayReleases[0];

  if (releases.length === 0) return (
    <section id="music" style={{ borderBottom: `1px solid ${tokens.border}` }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>
        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: `1px solid ${tokens.border}` }}>Music</p>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: tokens.muted2, fontWeight: 300 }}>
          {isArtist
            ? "No releases added yet. Add your Spotify, Apple Music, or YouTube links in your profile — or add an Apple Music Artist ID to pull your catalog automatically."
            : "No releases listed yet."}
        </p>
      </div>
    </section>
  );

  return (
    <section id="music" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Music</p>
          {isVerified
            ? <span style={{ ...lbl, fontSize: "0.48rem", color: "#5aab72", border: "1px solid #5aab72", borderRadius: 3, padding: "1px 5px" }}>✓ {apiSource === "spotify" ? "Spotify" : "Apple Music"} · Live</span>
            : <span style={{ ...lbl, fontSize: "0.48rem", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "1px 5px" }}>Static data</span>
          }
        </div>

        {/* Album scroll strip */}
        <div style={{ overflowX: "auto", marginLeft: isMobile ? -16 : -40, marginRight: isMobile ? -16 : -40, paddingLeft: isMobile ? 16 : 40, paddingRight: isMobile ? 16 : 40, marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", paddingBottom: "0.5rem", width: "max-content" }}>
            {displayReleases.map((r, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
                <div style={{
                  width: 104, height: 104, borderRadius: 6, marginBottom: "0.5rem",
                  background: isLt ? "#e0e0e0" : "#161616",
                  border: `2px solid ${i === activeIdx ? tokens.accent : tokens.border}`,
                  overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {r.coverArt
                    ? <img src={r.coverArt} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={i === activeIdx ? tokens.accent : tokens.muted2} strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  }
                </div>
                <p style={{ ...T, fontSize: "0.72rem", fontWeight: i === activeIdx ? 500 : 300, color: i === activeIdx ? tokens.accent : tokens.muted, width: 104, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
                <p style={{ ...lbl, marginTop: "0.1rem" }}>{r.year}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected release detail */}
        {release && (
          <div style={{ borderTop: border1, paddingTop: "1.75rem" }}>
            <div style={{ display: "flex", flexWrap: isMobile ? "wrap" : "nowrap", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{
                width: 72, height: 72, borderRadius: 6, flexShrink: 0,
                background: isLt ? "#ddd" : "#1a1a1a", border: border1,
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {release.coverArt
                  ? <img src={release.coverArt} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                }
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ ...T, fontWeight: 700, fontSize: "1.3rem", color: tokens.text, margin: "0 0 0.25rem" }}>{release.title}</h2>
                <p style={lbl}>{release.type} · {release.year}</p>
                {release.description && <p style={{ ...body, color: tokens.muted, fontSize: "0.8rem", marginTop: "0.4rem" }}>{release.description}</p>}
              </div>
              {/* Stream on buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                {release.spotifyUrl && (
                  <a href={release.spotifyUrl} target="_blank" rel="noreferrer" style={{
                    background: tokens.accent, color: isLt ? "#fff" : "#000",
                    ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em",
                    textTransform: "uppercase", textDecoration: "none",
                    padding: "8px 16px", borderRadius: 4, textAlign: "center",
                  }}>Spotify →</a>
                )}
                {(release.itunesUrl || profile.appleMusic) && (
                  <a href={release.itunesUrl || profile.appleMusic} target="_blank" rel="noreferrer" style={{
                    border: `1px solid ${tokens.border2}`, color: tokens.muted,
                    ...T, fontSize: "0.68rem", letterSpacing: "0.06em",
                    textTransform: "uppercase", textDecoration: "none",
                    padding: "7px 16px", borderRadius: 4, textAlign: "center",
                  }}>Apple Music →</a>
                )}
              </div>
            </div>

            {/* Tracklist — only for albums that have tracks */}
            {release.tracks && release.tracks.length > 0 && (
              <div style={{ borderTop: border1 }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "24px 1fr 56px" : "32px 1fr 72px", padding: "7px 8px 5px", borderBottom: border1 }}>
                  <span style={lbl}>#</span><span style={lbl}>Title</span><span style={{ ...lbl, textAlign: "right" }}>Time</span>
                </div>
                {release.tracks.map(t => (
                  <div key={t.number} style={{ display: "grid", gridTemplateColumns: isMobile ? "24px 1fr 56px" : "32px 1fr 72px", padding: "10px 8px", borderBottom: border1, alignItems: "center" }}>
                    <span style={{ ...lbl, color: tokens.muted2 }}>{t.number}</span>
                    <span style={{ ...body, fontSize: "0.82rem" }}>{t.title}</span>
                    <span style={{ ...lbl, textAlign: "right" }}>{t.duration || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Singles row */}
        {singles.length > 0 && (
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: border1 }}>
            <p style={{ ...lbl, marginBottom: "1rem" }}>Singles</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {singles.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "8px 10px", borderRadius: 6, background: isLt ? "#f5f5f5" : "#111" }}>
                  {s.coverArt && (
                    <div style={{ width: 36, height: 36, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                      <img src={s.coverArt} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ ...T, fontSize: "0.82rem", color: tokens.text, fontWeight: 400 }}>{s.title}</p>
                    <p style={{ ...lbl, marginTop: "0.1rem" }}>{s.year}</p>
                  </div>
                  {s.spotifyUrl && (
                    <a href={s.spotifyUrl} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
