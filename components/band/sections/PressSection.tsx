"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

const TYPE_LABEL: Record<string, string> = {
  review: "Review", interview: "Interview", feature: "Feature", news: "News",
};
const ARTICLE_TYPES = ["review", "interview", "feature", "news"];

export default function PressSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "5px 8px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", outline: "none" };
  const addBtn: React.CSSProperties = { background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T, letterSpacing: "0.05em", marginTop: "0.5rem" };
  const delBtn: React.CSSProperties = { background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", padding: "2px 6px", ...T, flexShrink: 0 };

  const articles: any[] = [...((profile as any).pressArchive ?? [])].sort((a, b) => b.year - a.year);
  const radioPlay: any[] = (profile as any).radioPlay ?? [];
  const syncPlacements: any[] = (profile as any).syncPlacements ?? [];
  const pressQuotes = profile.pressQuotes ?? [];

  const albumReviews = (profile.releases ?? []).flatMap((r: any) =>
    (r.reviews ?? []).map((rv: any) => ({ ...rv, album: r.title }))
  ).sort((a: any, b: any) => b.year - a.year);

  // Press archive add state
  const [addingArticle, setAddingArticle] = useState(false);
  const [artHeadline, setArtHeadline] = useState("");
  const [artSource, setArtSource] = useState("");
  const [artYear, setArtYear] = useState(String(new Date().getFullYear()));
  const [artType, setArtType] = useState("feature");
  const [artUrl, setArtUrl] = useState("");

  // Radio add state
  const [addingRadio, setAddingRadio] = useState(false);
  const [radioStation, setRadioStation] = useState("");
  const [radioMarket, setRadioMarket] = useState("");
  const [radioSong, setRadioSong] = useState("");
  const [radioPeak, setRadioPeak] = useState("");

  // Sync add state
  const [addingSync, setAddingSync] = useState(false);
  const [syncTitle, setSyncTitle] = useState("");
  const [syncNetwork, setSyncNetwork] = useState("");
  const [syncSong, setSyncSong] = useState("");
  const [syncYear, setSyncYear] = useState(String(new Date().getFullYear()));

  function saveArticle() {
    if (!artHeadline.trim() || !artSource.trim()) return;
    const next = [...((profile as any).pressArchive ?? []), { headline: artHeadline.trim(), source: artSource.trim(), year: parseInt(artYear), type: artType, url: artUrl.trim() || undefined }];
    onUpdate?.({ pressArchive: next } as any);
    setArtHeadline(""); setArtSource(""); setArtYear(String(new Date().getFullYear())); setArtType("feature"); setArtUrl(""); setAddingArticle(false);
  }

  function deleteArticle(i: number) {
    const raw: any[] = (profile as any).pressArchive ?? [];
    const sorted = [...raw].sort((a, b) => b.year - a.year);
    const target = sorted[i];
    onUpdate?.({ pressArchive: raw.filter(a => a !== target) } as any);
  }

  function saveRadio() {
    if (!radioStation.trim()) return;
    const next = [...radioPlay, { station: radioStation.trim(), market: radioMarket.trim(), song: radioSong.trim(), peak: radioPeak.trim() || undefined }];
    onUpdate?.({ radioPlay: next } as any);
    setRadioStation(""); setRadioMarket(""); setRadioSong(""); setRadioPeak(""); setAddingRadio(false);
  }

  function deleteRadio(i: number) {
    onUpdate?.({ radioPlay: radioPlay.filter((_, idx) => idx !== i) } as any);
  }

  function saveSync() {
    if (!syncTitle.trim()) return;
    const next = [...syncPlacements, { title: syncTitle.trim(), network: syncNetwork.trim() || undefined, song: syncSong.trim() || undefined, year: parseInt(syncYear) }];
    onUpdate?.({ syncPlacements: next } as any);
    setSyncTitle(""); setSyncNetwork(""); setSyncSong(""); setSyncYear(String(new Date().getFullYear())); setAddingSync(false);
  }

  function deleteSync(i: number) {
    onUpdate?.({ syncPlacements: syncPlacements.filter((_, idx) => idx !== i) } as any);
  }

  return (
    <section id="press" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Press</p>

        {/* Press quotes — always rendered */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {pressQuotes.map((q, i) => (
              <div key={i} style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderLeft: `3px solid ${tokens.accent}`, borderRadius: 6, padding: "16px 18px", position: "relative" }}>
                {isArtist && (
                  <button onClick={() => onUpdate?.({ pressQuotes: pressQuotes.filter((_, idx) => idx !== i) })} style={{ position: "absolute", top: 8, right: 8, background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.7rem" }}>✕</button>
                )}
                <p style={{ ...T, fontSize: "0.83rem", fontWeight: 300, color: tokens.muted, fontStyle: "italic", lineHeight: 1.7, marginBottom: "0.75rem" }}>"{q.quote}"</p>
                <p style={{ ...lbl, color: tokens.accent }}>{q.source}</p>
                {q.year && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem" }}>{q.year}</p>}
              </div>
            ))}
            {isArtist && (
              <button onClick={() => onUpdate?.({ pressQuotes: [...pressQuotes, { quote: "New press quote", source: "Publication", year: new Date().getFullYear() }] })} style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 6, color: tokens.accent, cursor: "pointer", padding: "16px", fontSize: "0.75rem", fontFamily: "Inter, sans-serif" }}>+ Add Quote</button>
            )}
            {pressQuotes.length === 0 && !isArtist && (
              <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.78rem" }}>No press quotes yet.</p>
            )}
          </div>
        </div>

        {/* Album reviews — always rendered, read-only (pulled from release data) */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Album Reviews</p>
          {albumReviews.map((rv, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "12px 0", borderBottom: border2, alignItems: "start" }}>
              <div>
                <p style={{ ...lbl, color: tokens.muted2, marginBottom: "0.2rem" }}>{rv.album} · {rv.year}</p>
                <p style={{ ...T, fontSize: "0.82rem", fontStyle: "italic", color: tokens.muted, fontWeight: 300, lineHeight: 1.6 }}>"{rv.quote}"</p>
                <p style={{ ...lbl, color: tokens.accent, marginTop: "0.3rem" }}>— {rv.source}</p>
              </div>
              {rv.score && (
                <div style={{ background: isLt ? "#e8e8e8" : "#1a1a1a", border: border2, borderRadius: 4, padding: "4px 10px", flexShrink: 0 }}>
                  <p style={{ ...T, fontSize: "0.78rem", fontWeight: 600, color: tokens.text }}>{rv.score}</p>
                </div>
              )}
            </div>
          ))}
          {albumReviews.length === 0 && (
            <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.78rem" }}>No album reviews yet.</p>
          )}
        </div>

        {/* Press archive — editable */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Press Archive</p>
          {articles.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1rem", padding: "10px 0", borderBottom: border2, alignItems: "center" }}>
              <span style={{ ...lbl, fontSize: "0.5rem", background: isLt ? "#e4e4e4" : "#1a1a1a", border: border2, borderRadius: 3, padding: "2px 7px", color: tokens.muted }}>{TYPE_LABEL[a.type] ?? a.type}</span>
              <div>
                {a.url
                  ? <a href={a.url} target="_blank" rel="noreferrer" style={{ ...T, fontSize: "0.83rem", color: tokens.text, fontWeight: 400, textDecoration: "none" }}>{a.headline}</a>
                  : <p style={{ ...T, fontSize: "0.83rem", color: tokens.text, fontWeight: 400 }}>{a.headline}</p>
                }
                <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem" }}>{a.source} · {a.year}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {a.url && <span style={{ ...lbl, color: tokens.accent }}>↗</span>}
                {isArtist && <button onClick={() => deleteArticle(i)} style={delBtn}>✕</button>}
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.78rem" }}>No press archive entries yet.</p>
          )}
          {isArtist && (
            addingArticle ? (
              <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "14px", marginTop: "0.75rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <input value={artHeadline} onChange={e => setArtHeadline(e.target.value)} placeholder="Headline / title" style={inp} autoFocus />
                  <input value={artSource} onChange={e => setArtSource(e.target.value)} placeholder="Publication" style={inp} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "80px 120px 1fr", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <input value={artYear} onChange={e => setArtYear(e.target.value)} placeholder="Year" style={inp} />
                  <select value={artType} onChange={e => setArtType(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                    {ARTICLE_TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                  </select>
                  <input value={artUrl} onChange={e => setArtUrl(e.target.value)} placeholder="URL (optional)" style={inp} onKeyDown={e => { if (e.key === "Enter") saveArticle(); if (e.key === "Escape") setAddingArticle(false); }} />
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={saveArticle} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Add</button>
                  <button onClick={() => setAddingArticle(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingArticle(true)} style={addBtn}>+ Add Article</button>
            )
          )}
        </div>

        {/* Radio + Sync — editable */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2rem" }}>

          {/* Radio Airplay */}
          <div>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Radio Airplay</p>
            {radioPlay.map((r, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: border2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ ...T, fontSize: "0.8rem", fontWeight: 500, color: tokens.text }}>{r.station}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {r.peak && <span style={{ ...lbl, color: tokens.accent, fontSize: "0.5rem" }}>{r.peak}</span>}
                    {isArtist && <button onClick={() => deleteRadio(i)} style={delBtn}>✕</button>}
                  </div>
                </div>
                <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem" }}>{r.market}{r.market && r.song ? " · " : ""}{r.song ? `"${r.song}"` : ""}</p>
              </div>
            ))}
            {radioPlay.length === 0 && (
              <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.78rem" }}>No radio airplay logged yet.</p>
            )}
            {isArtist && (
              addingRadio ? (
                <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "12px", marginTop: "0.5rem" }}>
                  <input value={radioStation} onChange={e => setRadioStation(e.target.value)} placeholder="Station (e.g. KFOG)" style={{ ...inp, width: "100%", marginBottom: "0.4rem" }} autoFocus />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <input value={radioMarket} onChange={e => setRadioMarket(e.target.value)} placeholder="Market / City" style={inp} />
                    <input value={radioSong} onChange={e => setRadioSong(e.target.value)} placeholder="Song title" style={inp} />
                  </div>
                  <input value={radioPeak} onChange={e => setRadioPeak(e.target.value)} placeholder="Peak position (optional, e.g. #12)" style={{ ...inp, width: "100%", marginBottom: "0.5rem" }} onKeyDown={e => { if (e.key === "Enter") saveRadio(); if (e.key === "Escape") setAddingRadio(false); }} />
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button onClick={saveRadio} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Add</button>
                    <button onClick={() => setAddingRadio(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingRadio(true)} style={addBtn}>+ Add Station</button>
              )
            )}
          </div>

          {/* Sync Placements */}
          <div>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Sync Placements</p>
            {syncPlacements.map((s, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: border2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ ...T, fontSize: "0.8rem", fontWeight: 500, color: tokens.text }}>{s.title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ ...lbl, color: tokens.muted2 }}>{s.year}</span>
                    {isArtist && <button onClick={() => deleteSync(i)} style={delBtn}>✕</button>}
                  </div>
                </div>
                {s.network && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem" }}>{s.network}</p>}
                {s.song && <p style={{ ...lbl, color: tokens.accent, marginTop: "0.1rem" }}>"{s.song}"</p>}
              </div>
            ))}
            {syncPlacements.length === 0 && (
              <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.78rem" }}>No sync placements yet.</p>
            )}
            {isArtist && (
              addingSync ? (
                <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "12px", marginTop: "0.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 70px", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <input value={syncTitle} onChange={e => setSyncTitle(e.target.value)} placeholder="Show / Film / Ad title" style={inp} autoFocus />
                    <input value={syncYear} onChange={e => setSyncYear(e.target.value)} placeholder="Year" style={inp} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.5rem" }}>
                    <input value={syncNetwork} onChange={e => setSyncNetwork(e.target.value)} placeholder="Network / Platform" style={inp} />
                    <input value={syncSong} onChange={e => setSyncSong(e.target.value)} placeholder="Song used" style={inp} onKeyDown={e => { if (e.key === "Enter") saveSync(); if (e.key === "Escape") setAddingSync(false); }} />
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button onClick={saveSync} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Add</button>
                    <button onClick={() => setAddingSync(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingSync(true)} style={addBtn}>+ Add Placement</button>
              )
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
