"use client";

import { useEffect, useRef, useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

interface LastFmData { listeners: number; playcount: number; similar: { name: string }[]; tags: string[]; }
interface YouTubeData { subscribers: number; totalViews: number; videoCount: number; }
interface SetlistData { total: number; setlists: { date: string; venue: string; city: string; songs: { name: string }[] }[]; }

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function VerifiedBadge({ tokens, lbl }: { tokens: TokenSet; lbl: React.CSSProperties }) {
  return <span style={{ ...lbl, fontSize: "0.48rem", color: "#5aab72", border: "1px solid #5aab72", borderRadius: 3, padding: "1px 5px", marginLeft: "0.4rem" }}>✓ API</span>;
}
function UnverifiedBadge({ tokens, lbl }: { tokens: TokenSet; lbl: React.CSSProperties }) {
  return <span style={{ ...lbl, fontSize: "0.48rem", color: "#d4893a", border: "1px solid #d4893a", borderRadius: 3, padding: "1px 5px", marginLeft: "0.4rem" }}>⚠ Self-Reported</span>;
}

export default function StatsSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  // Edit state for booking intel
  const [addingMarket, setAddingMarket] = useState(false);
  const [mktCity, setMktCity] = useState("");
  const [mktState, setMktState] = useState("");
  const [mktDraw, setMktDraw] = useState("");
  const [mktSizes, setMktSizes] = useState("");
  const [editRadius, setEditRadius] = useState(false);
  const [radiusVal, setRadiusVal] = useState((profile as any).touringRadius ?? "");
  const [editRider, setEditRider] = useState(false);
  const [riderVal, setRiderVal] = useState((profile as any).riderNotes ?? "");

  const [lastfm, setLastfm] = useState<LastFmData | null>(null);
  const [youtube, setYoutube] = useState<YouTubeData | null>(null);
  const [setlistData, setSetlistData] = useState<SetlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileViews, setProfileViews] = useState<number | null>(null);

  useEffect(() => {
    const artistName = profile.name || "";

    Promise.allSettled([
      fetch(`/api/lastfm?artist=${encodeURIComponent(artistName)}`).then(r => r.json()),
      fetch(`/api/youtube`).then(r => r.json()),
      fetch(`/api/setlistfm?artist=${encodeURIComponent(artistName)}`).then(r => r.json()),
    ]).then(([lfm, yt, sl]) => {
      if (lfm.status === "fulfilled" && !lfm.value.error) setLastfm(lfm.value);
      else setErrors(e => ({ ...e, lastfm: lfm.status === "fulfilled" ? lfm.value.error : "Failed" }));

      if (yt.status === "fulfilled" && !yt.value.error) setYoutube(yt.value);
      else setErrors(e => ({ ...e, youtube: yt.status === "fulfilled" ? yt.value.error : "Failed" }));

      if (sl.status === "fulfilled" && !sl.value.error) setSetlistData(sl.value);
      else setErrors(e => ({ ...e, setlist: sl.status === "fulfilled" ? sl.value.error : "Failed" }));

      setLoading(false);
    });
  }, [profile.name]);

  // Profile view counter — localStorage for dev; swap to Supabase increment at launch
  useEffect(() => {
    try {
      const key = `bsViews_${profile.name ?? "band"}`;
      const current = parseInt(localStorage.getItem(key) ?? "0", 10);
      const next = current + 1;
      localStorage.setItem(key, String(next));
      setProfileViews(next);
    } catch { setProfileViews(null); }
  }, [profile.name]);

  const statCard = (label: string, value: string | number | null, sub?: string, verified?: boolean) => (
    <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
        <p style={lbl}>{label}</p>
        {verified === true && <VerifiedBadge tokens={tokens} lbl={lbl} />}
        {verified === false && <UnverifiedBadge tokens={tokens} lbl={lbl} />}
      </div>
      <p style={{ ...T, fontSize: "1.6rem", fontWeight: 700, color: tokens.text, lineHeight: 1 }}>
        {loading && verified === true ? "—" : value ?? "—"}
      </p>
      {sub && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.3rem", textTransform: "none", letterSpacing: 0, fontSize: "0.65rem" }}>{sub}</p>}
    </div>
  );

  return (
    <section id="stats" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Stats & Analytics</p>
          <p style={{ ...lbl, color: tokens.muted2 }}>
            <span style={{ color: "#5aab72" }}>✓ API</span> = live verified · <span style={{ color: "#d4893a" }}>⚠</span> = self-reported
          </p>
        </div>

        {/* Live metrics grid */}
        <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Live Metrics</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {statCard("Profile Views", profileViews !== null ? fmt(profileViews) : null, "Page loads tracked")}
          {statCard("Last.fm Listeners", lastfm ? fmt(lastfm.listeners) : null, "Monthly unique listeners", !!lastfm)}
          {statCard("Last.fm Plays", lastfm ? fmt(lastfm.playcount) : null, "Total all-time scrobbles", !!lastfm)}
          {statCard("YouTube Subscribers", youtube ? fmt(youtube.subscribers) : null, "Channel subscribers", !!youtube)}
          {statCard("YouTube Views", youtube ? fmt(youtube.totalViews) : null, "Total channel views", !!youtube)}
          {statCard("YouTube Videos", youtube ? youtube.videoCount : null, "Published videos", !!youtube)}
          {statCard("Setlists Archived", setlistData ? setlistData.total : null, "Shows on Setlist.fm", !!setlistData)}
        </div>

        {/* API errors / not configured notice */}
        {Object.keys(errors).length > 0 && (
          <div style={{ background: isLt ? "#f9f0e0" : "#1a1400", border: "1px solid #d4893a", borderRadius: 6, padding: "12px 16px", marginBottom: "2rem" }}>
            <p style={{ ...lbl, color: "#d4893a", marginBottom: "0.4rem" }}>API Keys Needed</p>
            {errors.lastfm && <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.7rem" }}>Last.fm: {errors.lastfm}</p>}
            {errors.youtube && <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.7rem" }}>YouTube: {errors.youtube}</p>}
            {errors.setlist && <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.7rem" }}>Setlist.fm: {errors.setlist}</p>}
            <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.5rem", textTransform: "none", letterSpacing: 0, fontSize: "0.65rem" }}>Add keys to .env.local — see BANDSTACK README for setup instructions.</p>
          </div>
        )}

        {/* Recent setlists from Setlist.fm */}
        {setlistData && setlistData.setlists.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
              <p style={{ ...lbl, color: tokens.accent }}>Recent Setlists from Setlist.fm</p>
              <VerifiedBadge tokens={tokens} lbl={lbl} />
            </div>
            {setlistData.setlists.slice(0, 3).map((s, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: border2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <p style={{ ...T, fontSize: "0.82rem", fontWeight: 500, color: tokens.text }}>{s.venue}</p>
                  <p style={{ ...lbl, color: tokens.muted2 }}>{(() => { const [d,m,y] = s.date.split("-"); return `${m}-${d}-${y}`; })()}</p>
                </div>
                <p style={{ ...lbl, color: tokens.muted2, marginBottom: "0.4rem" }}>{s.city}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {s.songs.slice(0, 8).map((song, si) => (
                    <span key={si} style={{ ...T, fontSize: "0.7rem", color: tokens.muted, background: isLt ? "#e8e8e8" : "#161616", border: border2, borderRadius: 3, padding: "2px 7px" }}>{song.name}</span>
                  ))}
                  {s.songs.length > 8 && <span style={{ ...lbl, color: tokens.muted2 }}>+{s.songs.length - 8} more</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Similar artists from Last.fm */}
        {lastfm && lastfm.similar.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
              <p style={{ ...lbl, color: tokens.accent }}>Similar Artists</p>
              <VerifiedBadge tokens={tokens} lbl={lbl} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {lastfm.similar.map((a, i) => (
                <span key={i} style={{ ...lbl, color: tokens.muted, border: border2, borderRadius: 3, padding: "3px 9px" }}>{a.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Self-reported booking intel */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
            <p style={{ ...lbl, color: tokens.accent }}>Booking Intelligence</p>
            <UnverifiedBadge tokens={tokens} lbl={lbl} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>

            {/* Draw by market — editable */}
            <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.6rem", gap: "0.4rem" }}>
                <p style={lbl}>Draw by Market</p>
                <UnverifiedBadge tokens={tokens} lbl={lbl} />
              </div>
              {((profile as any).drawByMarket ?? []).map((m: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "6px 0", borderBottom: border2, alignItems: "center", gap: "0.5rem" }}>
                  <div>
                    <p style={{ ...T, fontSize: "0.78rem", fontWeight: 500, color: tokens.text }}>{m.city}, {m.state}</p>
                    <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.62rem" }}>{m.venueSizes}</p>
                  </div>
                  <p style={{ ...T, fontSize: "0.78rem", fontWeight: 600, color: tokens.accent }}>{m.typicalDraw}</p>
                  {isArtist && <button onClick={() => { const next = ((profile as any).drawByMarket ?? []).filter((_: any, idx: number) => idx !== i); onUpdate?.({ drawByMarket: next } as any); }} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", padding: "2px 4px", ...T }}>✕</button>}
                </div>
              ))}
              {((profile as any).drawByMarket ?? []).length === 0 && (
                <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.72rem" }}>No market draw data yet.</p>
              )}
              {isArtist && (
                addingMarket ? (
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "0.4rem" }}>
                      <input value={mktCity} onChange={e => setMktCity(e.target.value)} placeholder="City" style={{ background: "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "4px 8px", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", outline: "none" }} autoFocus />
                      <input value={mktState} onChange={e => setMktState(e.target.value)} placeholder="State" style={{ background: "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "4px 8px", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", outline: "none" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                      <input value={mktDraw} onChange={e => setMktDraw(e.target.value)} placeholder="Typical draw (e.g. 200–350)" style={{ background: "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "4px 8px", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", outline: "none" }} />
                      <input value={mktSizes} onChange={e => setMktSizes(e.target.value)} placeholder="Venue sizes (e.g. 300–500 cap)" style={{ background: "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "4px 8px", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", outline: "none" }} onKeyDown={e => { if (e.key === "Enter") { if (!mktCity.trim()) return; const next = [...((profile as any).drawByMarket ?? []), { city: mktCity.trim(), state: mktState.trim(), typicalDraw: mktDraw.trim(), venueSizes: mktSizes.trim() }]; onUpdate?.({ drawByMarket: next } as any); setMktCity(""); setMktState(""); setMktDraw(""); setMktSizes(""); setAddingMarket(false); } if (e.key === "Escape") setAddingMarket(false); }} />
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => { if (!mktCity.trim()) return; const next = [...((profile as any).drawByMarket ?? []), { city: mktCity.trim(), state: mktState.trim(), typicalDraw: mktDraw.trim(), venueSizes: mktSizes.trim() }]; onUpdate?.({ drawByMarket: next } as any); setMktCity(""); setMktState(""); setMktDraw(""); setMktSizes(""); setAddingMarket(false); }} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>Add</button>
                      <button onClick={() => setAddingMarket(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingMarket(true)} style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.65rem", padding: "4px 10px", cursor: "pointer", ...T, marginTop: "0.5rem" }}>+ Add Market</button>
                )
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Touring Radius — editable */}
              <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <p style={lbl}>Touring Radius</p>
                    <UnverifiedBadge tokens={tokens} lbl={lbl} />
                  </div>
                  {isArtist && !editRadius && <button onClick={() => { setRadiusVal((profile as any).touringRadius ?? ""); setEditRadius(true); }} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.border2}`, borderRadius: 3, color: tokens.muted, padding: "2px 8px", cursor: "pointer" }}>Edit</button>}
                </div>
                {editRadius ? (
                  <div>
                    <input value={radiusVal} onChange={e => setRadiusVal(e.target.value)} placeholder="e.g. Regional — within 300 miles" style={{ background: "#0e0e0e", border: `1px solid ${tokens.accent}`, borderRadius: 4, color: tokens.text, padding: "5px 8px", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", outline: "none", width: "100%", marginBottom: "0.4rem" }} autoFocus onKeyDown={e => { if (e.key === "Escape") setEditRadius(false); }} />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => { onUpdate?.({ touringRadius: radiusVal } as any); setEditRadius(false); }} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>Save</button>
                      <button onClick={() => setEditRadius(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  (profile as any).touringRadius
                    ? <p style={{ ...T, fontSize: "0.82rem", color: tokens.muted, fontWeight: 300 }}>{(profile as any).touringRadius}</p>
                    : <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.72rem" }}>Not set yet.{isArtist ? " Click Edit to add." : ""}</p>
                )}
              </div>
              {/* Rider Notes — editable */}
              <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <p style={lbl}>Rider Notes</p>
                    <UnverifiedBadge tokens={tokens} lbl={lbl} />
                  </div>
                  {isArtist && !editRider && <button onClick={() => { setRiderVal((profile as any).riderNotes ?? ""); setEditRider(true); }} style={{ ...lbl, background: "transparent", border: `1px solid ${tokens.border2}`, borderRadius: 3, color: tokens.muted, padding: "2px 8px", cursor: "pointer" }}>Edit</button>}
                </div>
                {editRider ? (
                  <div>
                    <textarea value={riderVal} onChange={e => setRiderVal(e.target.value)} placeholder="e.g. Standard hospitality rider. No nuts. Prefer quiet green room." rows={4} style={{ background: "#0e0e0e", border: `1px solid ${tokens.accent}`, borderRadius: 4, color: tokens.text, padding: "5px 8px", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", outline: "none", width: "100%", resize: "vertical", marginBottom: "0.4rem" }} autoFocus />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => { onUpdate?.({ riderNotes: riderVal } as any); setEditRider(false); }} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>Save</button>
                      <button onClick={() => setEditRider(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  (profile as any).riderNotes
                    ? <p style={{ ...T, fontSize: "0.82rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.6 }}>{(profile as any).riderNotes}</p>
                    : <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", letterSpacing: 0, fontSize: "0.72rem" }}>No rider notes yet.{isArtist ? " Click Edit to add." : ""}</p>
                )}
              </div>
              {(profile.bookingContact || profile.bookingEmail) && (
                <div style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
                  <p style={{ ...lbl, marginBottom: "0.4rem" }}>Booking</p>
                  {profile.bookingContact && <p style={{ ...T, fontSize: "0.82rem", color: tokens.text, fontWeight: 500 }}>{profile.bookingContact}</p>}
                  {profile.bookingEmail && <a href={`mailto:${profile.bookingEmail}`} style={{ ...lbl, color: tokens.accent, textDecoration: "none", display: "block", marginTop: "0.25rem" }}>{profile.bookingEmail}</a>}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
