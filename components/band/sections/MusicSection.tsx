"use client";

import { useState, useEffect } from "react";
import type { ProfileData, ProfileRelease } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface ApiTrack { number: number; title?: string; name?: string; duration: string; previewUrl: string | null; }
interface ApiAlbum { id?: string; itunesId?: number; title?: string; name?: string; type: string; releaseDate: string; coverArt: string | null; spotifyUrl?: string | null; itunesUrl?: string | null; tracks: ApiTrack[]; }
type ApiSource = "itunes" | "spotify" | null;

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

const BLANK: ProfileRelease = { title: "", type: "single", year: String(new Date().getFullYear()), description: "", spotifyUrl: "", coverArt: "", tracks: [] };

export default function MusicSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const [activeIdx, setActiveIdx] = useState(0);
  const [liveAlbums, setLiveAlbums] = useState<ApiAlbum[] | null>(null);
  const [apiSource, setApiSource] = useState<ApiSource>(null);
  const isLt = profile.colorMode === "light";

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<ProfileRelease>(BLANK);
  const [addingTrack, setAddingTrack] = useState<string | null>(null); // release title
  const [trackDraft, setTrackDraft] = useState({ title: "", duration: "" });

  useEffect(() => {
    const id = (profile as any).appleMusicArtistId;
    if (!id) return;
    fetch(`/api/itunes?artistId=${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { if (d.albums?.length) { setLiveAlbums(d.albums); setApiSource("itunes"); } })
      .catch(() => {});
  }, [profile]);

  const releases = (() => {
    const profileReleases = profile.releases ?? [];
    if (!liveAlbums) return profileReleases.map(r => ({ ...r, itunesUrl: "" }));

    // Build merged list: iTunes albums enriched with profile metadata
    const merged = liveAlbums.map(a => {
      const apiTitle = (a.title ?? a.name ?? "").toLowerCase().trim();
      const profileMatch = profileReleases.find(r => {
        const pt = r.title.toLowerCase().trim();
        return pt === apiTitle || pt.includes(apiTitle) || apiTitle.includes(pt);
      });
      return {
        title: a.title ?? a.name ?? "",
        type: (profileMatch?.type ?? a.type ?? "album") as ProfileRelease["type"],
        year: a.releaseDate?.slice(0, 4) ?? "",
        description: profileMatch?.description ?? "",
        spotifyUrl: a.spotifyUrl ?? profileMatch?.spotifyUrl ?? "",
        coverArt: a.coverArt ?? profileMatch?.coverArt ?? "",
        itunesUrl: a.itunesUrl ?? "",
        tracks: a.tracks.map(t => ({ number: t.number, title: t.title ?? t.name ?? "", duration: t.duration })),
      };
    });

    // Append any profile releases not matched by iTunes (manually added)
    const matchedTitles = new Set(merged.map(r => r.title.toLowerCase().trim()));
    const manualOnly = profileReleases.filter(r => {
      const pt = r.title.toLowerCase().trim();
      return !merged.some(m => m.title.toLowerCase().trim() === pt || pt.includes(m.title.toLowerCase().trim()) || m.title.toLowerCase().trim().includes(pt));
    });

    return [...merged, ...manualOnly.map(r => ({ ...r, itunesUrl: "" }))];
  })();

  const isVerified = !!liveAlbums;

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.text, fontWeight: 300, lineHeight: 1.75 };
  const border1 = `1px solid ${tokens.border}`;
  const inp: React.CSSProperties = { background: isLt ? "#f0f0f0" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, system-ui, sans-serif", outline: "none", width: "100%" };

  const albums = releases.filter(r => r.type === "album" || r.type === "ep" || r.type === "live").slice().reverse();
  const singles = releases.filter(r => r.type === "single").slice().reverse();
  const displayReleases = albums.length > 0 ? albums : releases.slice().reverse();
  const release = displayReleases[activeIdx] ?? displayReleases[0];

  function handleAdd() {
    if (!draft.title.trim()) return;
    const next = [...(profile.releases ?? []), { ...draft, title: draft.title.trim() }];
    onUpdate?.({ releases: next });
    setDraft(BLANK);
    setAdding(false);
  }

  function handleAddTrack(releaseTitle: string) {
    if (!trackDraft.title.trim()) return;
    const releases = (profile.releases ?? []).map(r => {
      if (r.title !== releaseTitle) return r;
      const tracks = r.tracks ?? [];
      return { ...r, tracks: [...tracks, { number: tracks.length + 1, title: trackDraft.title.trim(), duration: trackDraft.duration.trim() || undefined }] };
    });
    onUpdate?.({ releases });
    setTrackDraft({ title: "", duration: "" });
    setAddingTrack(null);
  }

  function handleDeleteTrack(releaseTitle: string, trackNumber: number) {
    const releases = (profile.releases ?? []).map(r => {
      if (r.title !== releaseTitle) return r;
      const tracks = (r.tracks ?? []).filter(t => t.number !== trackNumber).map((t, i) => ({ ...t, number: i + 1 }));
      return { ...r, tracks };
    });
    onUpdate?.({ releases });
  }

  function handleDelete(title: string) {
    const next = (profile.releases ?? []).filter(r => r.title !== title);
    onUpdate?.({ releases: next });
    if (activeIdx >= displayReleases.length - 1) setActiveIdx(0);
  }

  const addForm = adding && (
    <div style={{ background: isLt ? "#f5f5f5" : "#111", border: `1px solid ${tokens.border}`, borderRadius: 8, padding: "1rem", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.25rem" }}>Add Release</p>
      <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" style={inp} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as ProfileRelease["type"] }))} style={{ ...inp, width: "auto", flex: 1 }}>
          <option value="single">Single</option>
          <option value="ep">EP</option>
          <option value="album">Album</option>
          <option value="live">Live</option>
        </select>
        <input value={draft.year} onChange={e => setDraft(d => ({ ...d, year: e.target.value }))} placeholder="Year" style={{ ...inp, width: 80 }} maxLength={4} />
      </div>
      <input value={draft.spotifyUrl} onChange={e => setDraft(d => ({ ...d, spotifyUrl: e.target.value }))} placeholder="Spotify URL (optional)" style={inp} />
      <input value={draft.coverArt} onChange={e => setDraft(d => ({ ...d, coverArt: e.target.value }))} placeholder="Cover art URL (optional)" style={inp} />
      <input value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description (optional)" style={inp} />
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
        <button onClick={handleAdd} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "6px 16px", cursor: "pointer" }}>Add</button>
        <button onClick={() => { setAdding(false); setDraft(BLANK); }} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.border}`, borderRadius: 3, padding: "6px 12px", cursor: "pointer", color: tokens.muted }}>Cancel</button>
      </div>
    </div>
  );

  if (releases.length === 0) return (
    <section id="music" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Music</p>
          {isArtist && !adding && <button onClick={() => setAdding(true)} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.accent}55`, borderRadius: 3, color: tokens.accent, padding: "4px 10px", cursor: "pointer" }}>+ Add Release</button>}
        </div>
        {!adding && <p style={{ ...body, color: tokens.muted2 }}>{isArtist ? "No releases added yet — click + Add Release to get started." : "No releases listed yet."}</p>}
        {addForm}
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
          {isArtist && !adding && (
            <button onClick={() => setAdding(true)} style={{ ...lbl, marginLeft: "auto", background: "transparent", border: `1px solid ${tokens.accent}55`, borderRadius: 3, color: tokens.accent, padding: "4px 10px", cursor: "pointer" }}>+ Add Release</button>
          )}
        </div>

        {addForm}

        {/* Album scroll strip */}
        <div style={{ overflowX: "auto", marginLeft: isMobile ? -16 : -40, marginRight: isMobile ? -16 : -40, paddingLeft: isMobile ? 16 : 40, paddingRight: isMobile ? 16 : 40, marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", paddingBottom: "0.5rem", width: "max-content" }}>
            {displayReleases.map((r, i) => (
              <div key={i} style={{ position: "relative" }}>
                <button onClick={() => setActiveIdx(i)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
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
                {isArtist && !isVerified && (
                  <button onClick={() => handleDelete(r.title)} title="Remove" style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", color: "#d95c5c", fontSize: "0.65rem", width: 18, height: 18, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                )}
              </div>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                {release.spotifyUrl && (
                  <a href={release.spotifyUrl} target="_blank" rel="noreferrer" style={{
                    background: tokens.accent, color: isLt ? "#fff" : "#000",
                    ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em",
                    textTransform: "uppercase", textDecoration: "none",
                    padding: "8px 16px", borderRadius: 4, textAlign: "center",
                  }}>Spotify →</a>
                )}
                {((release as any).itunesUrl || profile.appleMusic) && (
                  <a href={(release as any).itunesUrl || profile.appleMusic} target="_blank" rel="noreferrer" style={{
                    border: `1px solid ${tokens.border2}`, color: tokens.muted,
                    ...T, fontSize: "0.68rem", letterSpacing: "0.06em",
                    textTransform: "uppercase", textDecoration: "none",
                    padding: "7px 16px", borderRadius: 4, textAlign: "center",
                  }}>Apple Music →</a>
                )}
              </div>
            </div>

            {(() => {
              const isManual = (profile.releases ?? []).some(r => r.title === release.title);
              const canEditTracks = isArtist && isManual;
              const hasTracks = release.tracks && release.tracks.length > 0;
              return (hasTracks || canEditTracks) ? (
                <div style={{ borderTop: border1 }}>
                  {hasTracks && <>
                    <div style={{ display: "grid", gridTemplateColumns: canEditTracks ? (isMobile ? "24px 1fr 56px 24px" : "32px 1fr 72px 24px") : (isMobile ? "24px 1fr 56px" : "32px 1fr 72px"), padding: "7px 8px 5px", borderBottom: border1 }}>
                      <span style={lbl}>#</span><span style={lbl}>Title</span><span style={{ ...lbl, textAlign: "right" }}>Time</span>
                      {canEditTracks && <span />}
                    </div>
                    {release.tracks!.map(t => (
                      <div key={t.number} style={{ display: "grid", gridTemplateColumns: canEditTracks ? (isMobile ? "24px 1fr 56px 24px" : "32px 1fr 72px 24px") : (isMobile ? "24px 1fr 56px" : "32px 1fr 72px"), padding: "10px 8px", borderBottom: border1, alignItems: "center" }}>
                        <span style={{ ...lbl, color: tokens.muted2 }}>{t.number}</span>
                        <span style={{ ...body, fontSize: "0.82rem" }}>{t.title}</span>
                        <span style={{ ...lbl, textAlign: "right" }}>{(t as any).duration || "—"}</span>
                        {canEditTracks && <button onClick={() => handleDeleteTrack(release.title, t.number)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", padding: 0 }}>✕</button>}
                      </div>
                    ))}
                  </>}
                  {canEditTracks && (
                    addingTrack === release.title ? (
                      <div style={{ display: "flex", gap: "0.5rem", padding: "8px", alignItems: "center" }}>
                        <input value={trackDraft.title} onChange={e => setTrackDraft(d => ({ ...d, title: e.target.value }))} placeholder="Track title" autoFocus onKeyDown={e => { if (e.key === "Enter") handleAddTrack(release.title); if (e.key === "Escape") setAddingTrack(null); }} style={{ ...inp, flex: 1 }} />
                        <input value={trackDraft.duration} onChange={e => setTrackDraft(d => ({ ...d, duration: e.target.value }))} placeholder="3:42" style={{ ...inp, width: 64 }} />
                        <button onClick={() => handleAddTrack(release.title)} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 10px", cursor: "pointer" }}>Add</button>
                        <button onClick={() => setAddingTrack(null)} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.border}`, borderRadius: 3, padding: "5px 8px", cursor: "pointer", color: tokens.muted }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setAddingTrack(release.title); setTrackDraft({ title: "", duration: "" }); }} style={{ ...lbl, background: "transparent", border: "none", color: tokens.accent, padding: "8px 8px", cursor: "pointer" }}>+ Add Track</button>
                    )
                  )}
                </div>
              ) : null;
            })()}
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
                  {isArtist && !isVerified && (
                    <button onClick={() => handleDelete(s.title)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.72rem", padding: "2px 4px" }}>✕</button>
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
