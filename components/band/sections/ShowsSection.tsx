"use client";

import { useState } from "react";
import type { ProfileData, ProfileShow } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import EditField from "@/components/band/EditField";
import { useMobile } from "@/lib/useMobile";

interface Props {
  profile: ProfileData;
  tokens: TokenSet;
  isArtist?: boolean;
  onUpdate?: (u: Partial<ProfileData>) => void;
}

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const fmtShort = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const BLANK_SHOW: ProfileShow = { date: new Date().toISOString().slice(0, 10), venue: "", city: "", state: "", ticketUrl: "", status: "upcoming", notes: "" };

function SetlistDrawer({ show, tokens }: { show: ProfileShow; tokens: TokenSet }) {
  const [open, setOpen] = useState(false);
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  if (!show.setlist || show.setlist.length === 0) return null;
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, ...lbl, color: tokens.accent }}>
        {open ? "▾" : "▸"} Setlist ({show.setlist.length} songs)
      </button>
      {open && (
        <div style={{ marginTop: "0.5rem", paddingLeft: "0.75rem", borderLeft: `2px solid ${tokens.border}` }}>
          {show.setlist.map((song, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr", padding: "5px 0", borderBottom: border1 }}>
              <span style={{ ...lbl, color: tokens.muted2 }}>{i + 1}</span>
              <span style={{ ...T, fontSize: "0.8rem", color: tokens.muted, fontWeight: 300 }}>{song}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShowsSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.text, fontWeight: 300 };
  const border1 = `1px solid ${tokens.border}`;

  const [addingShow, setAddingShow] = useState(false);
  const [draft, setDraft] = useState<ProfileShow>(BLANK_SHOW);

  const allShows = profile.shows ?? [];
  const upcoming = allShows.filter(s => s.status !== "past");
  const past = allShows.filter(s => s.status === "past");

  function updateShow(i: number, field: keyof ProfileShow, val: string) {
    const next = [...allShows];
    next[i] = { ...next[i], [field]: val };
    onUpdate?.({ shows: next });
  }

  function deleteShow(i: number) {
    onUpdate?.({ shows: allShows.filter((_, idx) => idx !== i) });
  }

  function saveNewShow() {
    if (!draft.venue.trim() || !draft.city.trim()) return;
    onUpdate?.({ shows: [...allShows, draft] });
    setDraft(BLANK_SHOW); setAddingShow(false);
  }

  const addBtn: React.CSSProperties = { background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "6px 14px", cursor: "pointer", ...T, letterSpacing: "0.05em", marginTop: "1rem" };
  const inp: React.CSSProperties = { background: "#111", border: `1px solid ${tokens.border}`, borderRadius: 4, color: "#d8d8d8", padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", width: "100%" };

  return (
    <section id="shows" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Shows</p>
          {isArtist && <button onClick={() => setAddingShow(true)} style={{ ...addBtn, marginTop: 0 }}>+ Add Show</button>}
        </div>

        {/* Add show form */}
        {isArtist && addingShow && (
          <div style={{ background: "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>New Show</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} type="date" style={inp} />
              <input value={draft.venue} onChange={e => setDraft(d => ({ ...d, venue: e.target.value }))} placeholder="Venue name" style={inp} />
              <input value={draft.city} onChange={e => setDraft(d => ({ ...d, city: e.target.value }))} placeholder="City" style={inp} />
              <input value={draft.state ?? ""} onChange={e => setDraft(d => ({ ...d, state: e.target.value }))} placeholder="State (optional)" style={inp} />
              <input value={draft.ticketUrl ?? ""} onChange={e => setDraft(d => ({ ...d, ticketUrl: e.target.value }))} placeholder="Ticket URL (optional)" style={inp} />
              <select value={draft.status ?? "upcoming"} onChange={e => setDraft(d => ({ ...d, status: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="sold-out">Sold Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <input value={draft.notes ?? ""} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} placeholder="Notes (optional)" style={{ ...inp, marginBottom: "0.75rem" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={saveNewShow} style={{ ...addBtn, marginTop: 0, background: tokens.accent + "22" }}>Save Show</button>
              <button onClick={() => { setAddingShow(false); setDraft(BLANK_SHOW); }} style={{ ...addBtn, marginTop: 0, borderColor: tokens.border, color: tokens.muted }}>Cancel</button>
            </div>
          </div>
        )}

        {upcoming.length === 0 && past.length === 0 && !addingShow && (
          <p style={{ ...body, color: tokens.muted2 }}>No shows listed yet.{isArtist ? " Click + Add Show to get started." : ""}</p>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Upcoming</p>
            {upcoming.map((s, i) => {
              const globalIdx = allShows.indexOf(s);
              return (
                <div key={i} style={{ padding: "16px 0", borderBottom: border1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "140px 1fr auto", gap: isMobile ? "0.75rem" : "1.5rem", alignItems: "start" }}>
                    <div>
                      {isArtist
                        ? <input type="date" value={s.date} onChange={e => updateShow(globalIdx, "date", e.target.value)} style={{ ...inp, fontSize: "0.75rem", padding: "3px 6px" }} />
                        : <p style={{ ...T, fontWeight: 500, fontSize: "0.82rem", color: tokens.text }}>{fmt(s.date)}</p>
                      }
                    </div>
                    <div>
                      {isArtist
                        ? <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                            <EditField value={s.venue} onSave={v => updateShow(globalIdx, "venue", v)} accentColor={tokens.accent} style={{ ...T, fontWeight: 500, fontSize: "0.95rem", color: tokens.text }} />
                            <EditField value={`${s.city}${s.state ? `, ${s.state}` : ""}`} onSave={v => { const parts = v.split(","); updateShow(globalIdx, "city", parts[0]?.trim() ?? ""); updateShow(globalIdx, "state", parts[1]?.trim() ?? ""); }} accentColor={tokens.accent} style={lbl} />
                            <EditField value={s.ticketUrl ?? ""} onSave={v => updateShow(globalIdx, "ticketUrl", v)} placeholder="Ticket URL" accentColor={tokens.accent} style={{ ...lbl, color: tokens.muted2 }} />
                            <EditField value={s.notes ?? ""} onSave={v => updateShow(globalIdx, "notes", v)} placeholder="Notes" accentColor={tokens.accent} style={{ ...lbl, color: tokens.muted2 }} />
                          </div>
                        : <>
                            <p style={{ ...T, fontWeight: 500, fontSize: "0.95rem", color: tokens.text }}>{s.venue}</p>
                            <p style={{ ...lbl, marginTop: "0.2rem" }}>{s.city}{s.state ? `, ${s.state}` : ""}</p>
                            {s.notes && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.15rem" }}>{s.notes}</p>}
                          </>
                      }
                    </div>
                    {isArtist
                      ? <button onClick={() => deleteShow(globalIdx)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.75rem", padding: "4px 8px", ...T }}>✕ Remove</button>
                      : s.ticketUrl
                        ? <a href={s.ticketUrl} target="_blank" rel="noreferrer" style={{ background: tokens.accent, color: isLt ? "#fff" : "#000", ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "8px 16px", borderRadius: 4 }}>Tickets</a>
                        : <span style={lbl}>Free</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <p style={{ ...lbl, color: tokens.muted2, marginBottom: "0.75rem" }}>Past Shows</p>
            {past.map((s, i) => {
              const globalIdx = allShows.indexOf(s);
              return (
                <div key={i} style={{ padding: "12px 0", borderBottom: border1 }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "140px 1fr auto", gap: isMobile ? "0.75rem" : "1.5rem", alignItems: "start" }}>
                    <p style={{ ...lbl, color: tokens.muted2, lineHeight: 1.6 }}>{fmtShort(s.date)}</p>
                    <div>
                      <p style={{ ...body, color: tokens.muted }}>{s.venue}</p>
                      <p style={{ ...lbl, marginTop: "0.15rem" }}>{s.city}{s.state ? `, ${s.state}` : ""}</p>
                      {s.notes && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.15rem", fontStyle: "italic" }}>{s.notes}</p>}
                      <SetlistDrawer show={s} tokens={tokens} />
                    </div>
                    {isArtist && (
                      <button onClick={() => deleteShow(globalIdx)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.75rem", padding: "4px 8px", ...T }}>✕</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
