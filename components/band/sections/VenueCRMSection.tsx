"use client";

import { useState } from "react";
import type { ProfileData, VenueRecord, VenueRelationship, VenueShowEntry } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; onUpdate?: (u: Partial<ProfileData>) => void; }

const RELATIONSHIP_LABELS: Record<VenueRelationship, string> = {
  played: "Played", hold: "Hold", pitched: "Pitched", target: "Target", avoid: "Avoid",
};
const RELATIONSHIP_COLORS: Record<VenueRelationship, string> = {
  played: "#5aab72", hold: "#4a8ec2", pitched: "#d4893a", target: "#888", avoid: "#d95c5c",
};

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function VenueCRMSection({ profile, tokens, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.82rem", color: tokens.muted, fontWeight: 300 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const surface = isLt ? "#f4f4f4" : "#111";
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: border1, borderRadius: 4, color: tokens.text, padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", outline: "none", width: "100%" };
  const chip = (rel: VenueRelationship) => ({
    ...lbl, fontSize: "0.48rem", color: RELATIONSHIP_COLORS[rel],
    border: `1px solid ${RELATIONSHIP_COLORS[rel]}`,
    borderRadius: 3, padding: "1px 6px", display: "inline-block",
  });

  const venues = profile.venues ?? [];
  const [filter, setFilter] = useState<VenueRelationship | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<VenueRecord | null>(null);
  const [addingShow, setAddingShow] = useState<string | null>(null); // venue id
  const [newShow, setNewShow] = useState<VenueShowEntry>({ date: "", guarantee: "", draw: undefined, notes: "" });
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [newVenue, setNewVenue] = useState<Partial<VenueRecord>>({ relationship: "target", history: [] });

  const filtered = venues.filter(v => {
    if (filter !== "all" && v.relationship !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.state.toLowerCase().includes(q);
    }
    return true;
  });

  function save(next: VenueRecord[]) { onUpdate?.({ venues: next }); }

  function saveVenue(updated: VenueRecord) {
    const idx = venues.findIndex(v => v.id === updated.id);
    const next = idx >= 0 ? venues.map((v, i) => i === idx ? updated : v) : [...venues, updated];
    save(next);
    setEditing(null);
    setShowAddVenue(false);
    setNewVenue({ relationship: "target", history: [] });
  }

  function deleteVenue(id: string) { save(venues.filter(v => v.id !== id)); setExpandedId(null); }

  function addShow(venueId: string) {
    if (!newShow.date) return;
    const next = venues.map(v => v.id === venueId
      ? { ...v, history: [...v.history, { ...newShow, draw: newShow.draw || undefined }].sort((a, b) => b.date.localeCompare(a.date)) }
      : v
    );
    save(next);
    setAddingShow(null);
    setNewShow({ date: "", guarantee: "", draw: undefined, notes: "" });
  }

  function deleteShow(venueId: string, idx: number) {
    const next = venues.map(v => v.id === venueId ? { ...v, history: v.history.filter((_, i) => i !== idx) } : v);
    save(next);
  }

  // Summary stats
  const playedCount = venues.filter(v => v.relationship === "played").length;
  const states = new Set(venues.filter(v => v.relationship === "played").map(v => v.state)).size;
  const totalShows = venues.reduce((acc, v) => acc + v.history.length, 0);
  const holdCount = venues.filter(v => v.relationship === "hold").length;

  const VenueForm = ({ v, onSave, onCancel }: { v: Partial<VenueRecord>; onSave: (v: VenueRecord) => void; onCancel: () => void }) => {
    const [form, setForm] = useState<Partial<VenueRecord>>(v);
    const f = (k: keyof VenueRecord) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));
    return (
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.5rem" }}>
        {[
          ["name", "Venue Name *"], ["city", "City *"], ["state", "State *"],
          ["capacity", "Capacity"], ["venueType", "Type (bar / theater / festival)"],
          ["typicalGuarantee", "Typical Guarantee"],
          ["contactName", "Booking Contact"], ["contactEmail", "Contact Email"], ["contactPhone", "Phone"],
        ].map(([key, placeholder]) => (
          <input key={key} value={(form[key as keyof VenueRecord] as string) ?? ""} onChange={f(key as keyof VenueRecord)} placeholder={placeholder} style={{ ...inp, gridColumn: key === "name" ? "span 2" : undefined }} />
        ))}
        <div style={{ gridColumn: "span 2", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <p style={lbl}>Status</p>
          {(["played","hold","pitched","target","avoid"] as VenueRelationship[]).map(r => (
            <button key={r} onClick={() => setForm(p => ({ ...p, relationship: r }))} style={{ ...lbl, fontSize: "0.5rem", color: form.relationship === r ? RELATIONSHIP_COLORS[r] : tokens.muted2, border: `1px solid ${form.relationship === r ? RELATIONSHIP_COLORS[r] : tokens.border2}`, borderRadius: 3, padding: "3px 8px", background: "transparent", cursor: "pointer" }}>{RELATIONSHIP_LABELS[r]}</button>
          ))}
        </div>
        <textarea value={(form.notes as string) ?? ""} onChange={f("notes")} placeholder="Notes..." rows={2} style={{ ...inp, gridColumn: "span 2", resize: "vertical" }} />
        <div style={{ gridColumn: "span 2", display: "flex", gap: "0.5rem" }}>
          <button onClick={() => { if (!form.name || !form.city || !form.state) return; onSave({ ...form, id: form.id ?? uid(), history: form.history ?? [], relationship: form.relationship ?? "target" } as VenueRecord); }} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "6px 16px", cursor: "pointer" }}>Save</button>
          <button onClick={onCancel} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "6px 16px", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <section id="venue-crm" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <p className="section-label">Venue CRM</p>
            <span style={{ ...lbl, fontSize: "0.46rem", color: tokens.accent, border: `1px solid ${tokens.accent}`, borderRadius: 3, padding: "1px 5px" }}>Artist Only</span>
          </div>
          <button onClick={() => setShowAddVenue(v => !v)} style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "4px 10px", cursor: "pointer", ...T }}>+ Add Venue</button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            ["Venues Played", playedCount],
            ["Markets", states],
            ["Total Shows", totalShows],
            ["Active Holds", holdCount],
          ].map(([label, val]) => (
            <div key={label as string} style={{ background: surface, border: border1, borderRadius: 8, padding: "12px 14px" }}>
              <p style={lbl}>{label}</p>
              <p style={{ ...T, fontSize: "1.4rem", fontWeight: 700, color: tokens.text, lineHeight: 1.1, marginTop: "0.2rem" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Add venue form */}
        {showAddVenue && (
          <div style={{ background: surface, border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>New Venue</p>
            <VenueForm v={newVenue} onSave={saveVenue} onCancel={() => { setShowAddVenue(false); setNewVenue({ relationship: "target", history: [] }); }} />
          </div>
        )}

        {/* Search + filter */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search venues…" style={{ ...inp, width: 200 }} />
          {(["all", "played", "hold", "pitched", "target", "avoid"] as const).map(r => (
            <button key={r} onClick={() => setFilter(r)} style={{
              ...lbl, fontSize: "0.5rem", cursor: "pointer", background: "transparent", borderRadius: 3, padding: "3px 9px",
              color: filter === r ? (r === "all" ? tokens.accent : RELATIONSHIP_COLORS[r]) : tokens.muted2,
              border: `1px solid ${filter === r ? (r === "all" ? tokens.accent : RELATIONSHIP_COLORS[r]) : tokens.border2}`,
            }}>{r === "all" ? "All" : RELATIONSHIP_LABELS[r]}</button>
          ))}
          <p style={{ ...lbl, marginLeft: "auto" }}>{filtered.length} venues</p>
        </div>

        {/* Venue list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.length === 0 && <p style={body}>No venues match.</p>}
          {filtered.map(v => {
            const isOpen = expandedId === v.id;
            const isEditingThis = editing?.id === v.id;
            const lastShow = v.history[0];
            return (
              <div key={v.id} style={{ background: surface, border: border1, borderRadius: 8, overflow: "hidden" }}>

                {/* Row */}
                <button onClick={() => setExpandedId(isOpen ? null : v.id)} style={{
                  width: "100%", background: "transparent", border: "none", cursor: "pointer",
                  display: "grid", gridTemplateColumns: isMobile ? "1fr auto" : "1fr auto auto auto", gap: "1rem",
                  alignItems: "center", padding: "14px 18px", textAlign: "left",
                }}>
                  <div>
                    <p style={{ ...T, fontSize: "0.88rem", fontWeight: 500, color: tokens.text }}>{v.name}</p>
                    <p style={{ ...lbl, marginTop: "0.15rem", color: tokens.muted2 }}>{v.city}, {v.state}{v.capacity ? ` · cap ${v.capacity.toLocaleString()}` : ""}</p>
                  </div>
                  <span style={chip(v.relationship)}>{RELATIONSHIP_LABELS[v.relationship]}</span>
                  <p style={{ ...lbl, color: tokens.muted2 }}>{lastShow ? lastShow.date.slice(0,7) : "—"}</p>
                  <p style={{ ...lbl, color: tokens.muted2 }}>{isOpen ? "▾" : "▸"}</p>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ borderTop: border2, padding: "16px 18px" }}>

                    {isEditingThis ? (
                      <VenueForm v={editing!} onSave={saveVenue} onCancel={() => setEditing(null)} />
                    ) : (
                      <>
                        {/* Info grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                          {v.typicalGuarantee && (
                            <div><p style={lbl}>Typical Guarantee</p><p style={{ ...body, color: tokens.text, marginTop: "0.2rem" }}>{v.typicalGuarantee}</p></div>
                          )}
                          {v.venueType && (
                            <div><p style={lbl}>Type</p><p style={{ ...body, color: tokens.text, marginTop: "0.2rem" }}>{v.venueType}</p></div>
                          )}
                          {v.contactName && (
                            <div><p style={lbl}>Booking Contact</p><p style={{ ...body, color: tokens.text, marginTop: "0.2rem" }}>{v.contactName}</p></div>
                          )}
                          {v.contactEmail && (
                            <div><p style={lbl}>Email</p><a href={`mailto:${v.contactEmail}`} style={{ ...body, color: tokens.accent, textDecoration: "none", display: "block", marginTop: "0.2rem" }}>{v.contactEmail}</a></div>
                          )}
                          {v.contactPhone && (
                            <div><p style={lbl}>Phone</p><p style={{ ...body, color: tokens.text, marginTop: "0.2rem" }}>{v.contactPhone}</p></div>
                          )}
                          {v.notes && (
                            <div style={{ gridColumn: "span 2" }}><p style={lbl}>Notes</p><p style={{ ...body, marginTop: "0.2rem", lineHeight: 1.7 }}>{v.notes}</p></div>
                          )}
                        </div>

                        {/* Show history */}
                        <div style={{ marginBottom: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                            <p style={{ ...lbl, color: tokens.accent }}>Show History</p>
                            <button onClick={() => setAddingShow(v.id)} style={{ ...lbl, background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 3, color: tokens.accent, padding: "2px 8px", cursor: "pointer" }}>+ Add Show</button>
                          </div>

                          {addingShow === v.id && (
                            <div style={{ background: isLt ? "#e8e8e8" : "#0e0e0e", border: border2, borderRadius: 6, padding: "10px 12px", marginBottom: "0.6rem" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem", marginBottom: "0.5rem" }}>
                                <input type="date" value={newShow.date} onChange={e => setNewShow(p => ({ ...p, date: e.target.value }))} style={inp} />
                                <input value={newShow.guarantee ?? ""} onChange={e => setNewShow(p => ({ ...p, guarantee: e.target.value }))} placeholder="Guarantee (e.g. $800)" style={inp} />
                                <input type="number" value={newShow.draw ?? ""} onChange={e => setNewShow(p => ({ ...p, draw: parseInt(e.target.value) || undefined }))} placeholder="Draw / attendance" style={inp} />
                              </div>
                              <input value={newShow.notes ?? ""} onChange={e => setNewShow(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" style={{ ...inp, marginBottom: "0.5rem" }} />
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                <button onClick={() => addShow(v.id)} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Save</button>
                                <button onClick={() => setAddingShow(null)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
                              </div>
                            </div>
                          )}

                          {v.history.length === 0 && <p style={{ ...lbl, color: tokens.muted2 }}>No shows logged yet.</p>}
                          {v.history.map((s, si) => (
                            <div key={si} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr auto" : "90px 80px 80px 1fr auto", gap: "1rem", alignItems: "center", padding: "7px 0", borderBottom: border2 }}>
                              <p style={{ ...lbl, color: tokens.muted }}>{s.date}</p>
                              <p style={{ ...lbl, color: s.guarantee ? tokens.text : tokens.muted2 }}>{s.guarantee || "—"}</p>
                              <p style={{ ...lbl, color: s.draw ? tokens.text : tokens.muted2 }}>{s.draw ? s.draw.toLocaleString() : "—"} draw</p>
                              <p style={{ ...body, fontSize: "0.75rem" }}>{s.notes || ""}</p>
                              <button onClick={() => deleteShow(v.id, si)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", ...T }}>✕</button>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.5rem", borderTop: border2 }}>
                          <button onClick={() => setEditing(v)} style={{ ...lbl, background: "transparent", color: tokens.accent, border: `1px solid ${tokens.accent}44`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Edit</button>
                          <button onClick={() => deleteVenue(v.id)} style={{ ...lbl, background: "transparent", color: "#d95c5c", border: "1px solid #d95c5c44", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
