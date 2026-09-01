"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props {
  profile: ProfileData;
  tokens: TokenSet;
  isArtist?: boolean;
  onUpdate?: (u: Partial<ProfileData>) => void;
}

export default function TimelineSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "5px 8px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", outline: "none" };
  const addBtn: React.CSSProperties = { background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T, letterSpacing: "0.05em", marginTop: "0.5rem" };
  const delBtn: React.CSSProperties = { background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", padding: "2px 6px", ...T, flexShrink: 0 };

  const milestones = [...((profile as any).milestones ?? [])].sort((a: any, b: any) => b.year - a.year);
  const influences: string[] = (profile as any).influences ?? [];
  const collaborators: { name: string; context: string }[] = (profile as any).collaborators ?? [];

  // Milestone add state
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [mYear, setMYear] = useState("");
  const [mTitle, setMTitle] = useState("");
  const [mDetail, setMDetail] = useState("");

  // Influence add state
  const [addingInfluence, setAddingInfluence] = useState(false);
  const [infValue, setInfValue] = useState("");

  // Collaborator add state
  const [addingCollab, setAddingCollab] = useState(false);
  const [collabName, setCollabName] = useState("");
  const [collabContext, setCollabContext] = useState("");

  function saveMilestone() {
    if (!mYear.trim() || !mTitle.trim()) return;
    const next = [...((profile as any).milestones ?? []), { year: parseInt(mYear), title: mTitle.trim(), detail: mDetail.trim() }];
    onUpdate?.({ milestones: next } as any);
    setMYear(""); setMTitle(""); setMDetail(""); setAddingMilestone(false);
  }

  function deleteMilestone(idx: number) {
    const raw: any[] = (profile as any).milestones ?? [];
    // match by index in sorted array — find in raw
    const sorted = [...raw].sort((a, b) => b.year - a.year);
    const target = sorted[idx];
    onUpdate?.({ milestones: raw.filter(m => m !== target) } as any);
  }

  function saveInfluence() {
    if (!infValue.trim()) return;
    onUpdate?.({ influences: [...influences, infValue.trim()] } as any);
    setInfValue(""); setAddingInfluence(false);
  }

  function deleteInfluence(i: number) {
    onUpdate?.({ influences: influences.filter((_, idx) => idx !== i) } as any);
  }

  function saveCollab() {
    if (!collabName.trim()) return;
    onUpdate?.({ collaborators: [...collaborators, { name: collabName.trim(), context: collabContext.trim() }] } as any);
    setCollabName(""); setCollabContext(""); setAddingCollab(false);
  }

  function deleteCollab(i: number) {
    onUpdate?.({ collaborators: collaborators.filter((_, idx) => idx !== i) } as any);
  }

  return (
    <section id="timeline" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Timeline</p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "3rem" }}>

          {/* Milestones */}
          <div>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "1rem" }}>Milestones</p>
            {milestones.length === 0 && (
              <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>No milestones added yet.</p>
            )}
            {milestones.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: "1rem", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: border2, alignItems: "start" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ ...T, fontSize: "1.1rem", fontWeight: 700, color: tokens.accent, lineHeight: 1 }}>{m.year}</span>
                </div>
                <div>
                  <p style={{ ...T, fontSize: "0.85rem", fontWeight: 500, color: tokens.text }}>{m.title}</p>
                  {m.detail && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.2rem", textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>{m.detail}</p>}
                </div>
                {isArtist && <button onClick={() => deleteMilestone(i)} style={delBtn}>✕</button>}
              </div>
            ))}

            {isArtist && (
              addingMilestone ? (
                <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "12px", marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <input value={mYear} onChange={e => setMYear(e.target.value)} placeholder="Year" style={{ ...inp, width: 70 }} autoFocus />
                    <input value={mTitle} onChange={e => setMTitle(e.target.value)} placeholder="Milestone title" style={{ ...inp, flex: 1 }} onKeyDown={e => { if (e.key === "Enter") saveMilestone(); if (e.key === "Escape") setAddingMilestone(false); }} />
                  </div>
                  <input value={mDetail} onChange={e => setMDetail(e.target.value)} placeholder="Detail (optional)" style={{ ...inp, width: "100%", marginBottom: "0.5rem" }} onKeyDown={e => { if (e.key === "Enter") saveMilestone(); if (e.key === "Escape") setAddingMilestone(false); }} />
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button onClick={saveMilestone} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Add</button>
                    <button onClick={() => setAddingMilestone(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingMilestone(true)} style={addBtn}>+ Add Milestone</button>
              )
            )}
          </div>

          {/* Influences + Collaborators */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            <div>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Influences</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {influences.length === 0 && !isArtist && (
                  <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>No influences listed yet.</p>
                )}
                {influences.map((inf, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", ...lbl, fontSize: "0.6rem", color: tokens.muted, border: border2, borderRadius: 3, padding: "3px 9px" }}>
                    {inf}
                    {isArtist && <button onClick={() => deleteInfluence(i)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.6rem", lineHeight: 1, padding: 0 }}>✕</button>}
                  </span>
                ))}
              </div>
              {isArtist && (
                addingInfluence ? (
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                    <input value={infValue} onChange={e => setInfValue(e.target.value)} placeholder="Artist or band name" style={{ ...inp, flex: 1 }} autoFocus onKeyDown={e => { if (e.key === "Enter") saveInfluence(); if (e.key === "Escape") setAddingInfluence(false); }} />
                    <button onClick={saveInfluence} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 10px", cursor: "pointer" }}>Add</button>
                    <button onClick={() => setAddingInfluence(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 10px", cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingInfluence(true)} style={addBtn}>+ Add Influence</button>
                )
              )}
            </div>

            <div>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Notable Collaborators</p>
              {collaborators.length === 0 && !isArtist && (
                <p style={{ ...lbl, color: tokens.muted2, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>No collaborators listed yet.</p>
              )}
              {collaborators.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "start", paddingBottom: "0.6rem", marginBottom: "0.6rem", borderBottom: border2 }}>
                  <div>
                    <p style={{ ...T, fontSize: "0.82rem", fontWeight: 500, color: tokens.text }}>{c.name}</p>
                    <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem", textTransform: "none", letterSpacing: 0, fontSize: "0.7rem" }}>{c.context}</p>
                  </div>
                  {isArtist && <button onClick={() => deleteCollab(i)} style={delBtn}>✕</button>}
                </div>
              ))}
              {isArtist && (
                addingCollab ? (
                  <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "12px", marginTop: "0.5rem" }}>
                    <input value={collabName} onChange={e => setCollabName(e.target.value)} placeholder="Name" style={{ ...inp, width: "100%", marginBottom: "0.4rem" }} autoFocus onKeyDown={e => { if (e.key === "Escape") setAddingCollab(false); }} />
                    <input value={collabContext} onChange={e => setCollabContext(e.target.value)} placeholder="Context (e.g. co-wrote 'Song Title')" style={{ ...inp, width: "100%", marginBottom: "0.5rem" }} onKeyDown={e => { if (e.key === "Enter") saveCollab(); if (e.key === "Escape") setAddingCollab(false); }} />
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={saveCollab} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Add</button>
                      <button onClick={() => setAddingCollab(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingCollab(true)} style={addBtn}>+ Add Collaborator</button>
                )
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
