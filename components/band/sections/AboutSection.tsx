"use client";

import { useState } from "react";
import { useMobile } from "@/lib/useMobile";
import Link from "next/link";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import EditField from "@/components/band/EditField";
import HelperNote from "@/components/band/HelperNote";

interface Props {
  profile: ProfileData;
  tokens: TokenSet;
  isArtist?: boolean;
  onUpdate?: (u: Partial<ProfileData>) => void;
  stagePlotHref?: string;
}

export default function AboutSection({ profile, tokens, isArtist, onUpdate, stagePlotHref = "/band/stage-plot" }: Props) {
  const isMobile = useMobile();
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [newAward, setNewAward] = useState("");
  const [addingAward, setAddingAward] = useState(false);

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.85 };
  const editorial: React.CSSProperties = { ...T, fontSize: "0.88rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.75 };
  const border1 = `1px solid ${tokens.border}`;
  const sHead: React.CSSProperties = { ...lbl, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: border1 };
  const members = (profile.members ?? []).filter(m => m.name.trim());

  function updateMember(i: number, field: "name" | "role", val: string) {
    const next = members.map((m, idx) => idx === i ? { ...m, [field]: val } : m);
    onUpdate?.({ members: next });
  }

  function deleteMember(i: number) {
    onUpdate?.({ members: members.filter((_, idx) => idx !== i) });
  }

  function addMember() {
    if (!newMemberName.trim()) return;
    onUpdate?.({ members: [...members, { name: newMemberName.trim(), role: newMemberRole.trim() }] });
    setNewMemberName(""); setNewMemberRole(""); setAddingMember(false);
  }

  function deleteAward(i: number) {
    onUpdate?.({ awards: (profile.awards ?? []).filter((_, idx) => idx !== i) });
  }

  function addAward() {
    if (!newAward.trim()) return;
    onUpdate?.({ awards: [...(profile.awards ?? []), newAward.trim()] });
    setNewAward(""); setAddingAward(false);
  }

  const editBtn: React.CSSProperties = {
    background: "transparent", border: "none", cursor: "pointer",
    color: "#d95c5c", fontSize: "0.7rem", padding: "2px 6px",
    ...T, flexShrink: 0,
  };
  const addBtn: React.CSSProperties = {
    background: "transparent", border: `1px dashed ${tokens.accent}55`,
    borderRadius: 4, color: tokens.accent, fontSize: "0.68rem",
    padding: "5px 12px", cursor: "pointer", ...T, letterSpacing: "0.05em",
    marginTop: "0.5rem",
  };

  return (
    <section id="about" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        {isArtist
          ? <EditField value={(profile as any).sectionLabelAbout ?? "About"} onSave={v => onUpdate?.({ sectionLabelAbout: v } as any)} accentColor={tokens.accent} style={{ display: "block", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: tokens.accent, fontWeight: 600, fontFamily: "Inter, system-ui, sans-serif" }} />
          : <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>About</p>
        }

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: isMobile ? "2rem" : "3.5rem", alignItems: "start" }}>

          {/* Left — bio + press + awards */}
          <div>
            <div style={{ marginBottom: "2.5rem" }}>
              {profile.origin && (
                <p style={{ ...T, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: tokens.muted2, marginBottom: "0.75rem" }}>
                  {profile.origin}{profile.founded ? ` · Est. ${profile.founded}` : ""}
                </p>
              )}
              {isArtist && !profile.bio && (
                <HelperNote tokens={tokens} text="Write your artist story — origin, sound, what drives you. 2–4 paragraphs is ideal. Starts with your name? It'll highlight in accent color on the fan view." style={{ marginBottom: "0.75rem" }} />
              )}
              {isArtist
                ? <EditField value={profile.bio} onSave={v => onUpdate?.({ bio: v })} multiline placeholder="Band bio…" accentColor={tokens.accent} style={{ ...editorial, width: "100%" }} />
                : profile.bio && (() => {
                    const bio = profile.bio;
                    const name = profile.name ?? "";
                    const startsWithName = name && bio.startsWith(name);
                    const rest = startsWithName ? bio.slice(name.length) : bio;
                    return (
                      <p style={{ ...T, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.7, color: tokens.muted, margin: 0 }}>
                        {startsWithName && <span style={{ color: tokens.accent }}>{name}</span>}
                        {rest}
                      </p>
                    );
                  })()
              }
            </div>

            {/* Press — heading ALWAYS renders */}
            <div style={{ marginBottom: "2.5rem" }}>
              {isArtist
                ? <EditField value={(profile as any).sectionLabelPress ?? "Press"} onSave={v => onUpdate?.({ sectionLabelPress: v } as any)} accentColor={tokens.accent} style={{ ...sHead, display: "block" }} />
                : <p className="section-label" style={{ marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: border1 }}>Press</p>
              }
              {(profile.pressQuotes ?? []).map((q, i) => (
                <div key={i} style={{ marginBottom: "1.5rem", position: "relative" }}>
                  {isArtist
                    ? <>
                        <EditField value={q.quote} onSave={v => { const next = [...(profile.pressQuotes ?? [])]; next[i] = { ...next[i], quote: v }; onUpdate?.({ pressQuotes: next }); }} multiline accentColor={tokens.accent} style={{ ...body, fontStyle: "italic", width: "100%" }} />
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem", alignItems: "center" }}>
                          <EditField value={q.source} onSave={v => { const next = [...(profile.pressQuotes ?? [])]; next[i] = { ...next[i], source: v }; onUpdate?.({ pressQuotes: next }); }} accentColor={tokens.accent} style={lbl} />
                          <button onClick={() => onUpdate?.({ pressQuotes: (profile.pressQuotes ?? []).filter((_, idx) => idx !== i) })} style={editBtn}>✕</button>
                        </div>
                      </>
                    : <>
                        <div style={{ borderLeft: `2px solid ${tokens.accent}55`, paddingLeft: "1.25rem", margin: "0 0 0.5rem" }}>
                          <p style={{ ...T, fontSize: "0.88rem", color: tokens.muted, lineHeight: 1.7, fontWeight: 300, fontStyle: "italic" }}>"{q.quote}"</p>
                        </div>
                        <p style={{ ...lbl, paddingLeft: "1.25rem", marginTop: "0.4rem", color: tokens.accent }}>— {q.source}{q.year ? `, ${q.year}` : ""}</p>
                      </>
                  }
                </div>
              ))}
              {(profile.pressQuotes ?? []).length === 0 && !isArtist && (
                <p style={{ ...body, fontSize: "0.78rem", color: tokens.muted2 }}>No press quotes yet.</p>
              )}
              {(profile.pressQuotes ?? []).length === 0 && isArtist && (
                <HelperNote tokens={tokens} text="Add quotes from reviews, interviews, or press features. Include the publication name and year — they show as your credibility trail." />
              )}
              {isArtist && (
                <button onClick={() => onUpdate?.({ pressQuotes: [...(profile.pressQuotes ?? []), { quote: "New press quote", source: "Publication Name", year: new Date().getFullYear() }] })} style={addBtn}>+ Add Quote</button>
              )}
            </div>

            {/* Awards — heading ALWAYS renders */}
            <div>
              <p className="section-label" style={{ marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: border1 }}>Awards</p>
              {(profile.awards ?? []).map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span style={{ color: tokens.accent, marginRight: "0.25rem" }}>·</span>
                  {isArtist
                    ? <><EditField value={a} onSave={v => { const next = [...(profile.awards ?? [])]; next[i] = v; onUpdate?.({ awards: next }); }} accentColor={tokens.accent} style={{ ...body, fontSize: "0.8rem", flex: 1 }} /><button onClick={() => deleteAward(i)} style={editBtn}>✕</button></>
                    : <p style={{ ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.6 }}>{a}</p>
                  }
                </div>
              ))}
              {(profile.awards ?? []).length === 0 && !isArtist && (
                <p style={{ ...body, fontSize: "0.78rem", color: tokens.muted2 }}>No awards yet.</p>
              )}
              {(profile.awards ?? []).length === 0 && isArtist && (
                <HelperNote tokens={tokens} text="Any award, nomination, chart position, or notable recognition — regional or national. One line each." />
              )}
              {isArtist && (
                addingAward
                  ? <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <input value={newAward} onChange={e => setNewAward(e.target.value)} placeholder="Award or accolade" onKeyDown={e => { if (e.key === "Enter") addAward(); if (e.key === "Escape") setAddingAward(false); }} style={{ flex: 1, background: "#111", border: `1px solid ${tokens.accent}`, borderRadius: 4, color: "#d8d8d8", padding: "4px 8px", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }} autoFocus />
                      <button onClick={addAward} style={{ ...addBtn, marginTop: 0 }}>Add</button>
                    </div>
                  : <button onClick={() => setAddingAward(true)} style={addBtn}>+ Add Award</button>
              )}
            </div>
          </div>

          {/* Right — members + venue links */}
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <p className="section-label" style={{ marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: border1 }}>Members</p>
              {members.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: border1, gap: "0.5rem" }}>
                  {isArtist
                    ? <>
                        <EditField value={m.name} onSave={v => updateMember(i, "name", v)} accentColor={tokens.accent} style={{ ...T, fontSize: "0.82rem", color: tokens.text, fontWeight: 300 }} />
                        <EditField value={m.role} onSave={v => updateMember(i, "role", v)} accentColor={tokens.accent} style={{ ...lbl, textAlign: "right" }} />
                        <button onClick={() => deleteMember(i)} style={editBtn}>✕</button>
                      </>
                    : <>
                        <span style={{ ...T, fontSize: "0.85rem", color: tokens.text, fontWeight: 400 }}>{m.name}</span>
                        {m.role && <span style={{ ...lbl, textAlign: "right", maxWidth: "55%", lineHeight: 1.5 }}>{m.role}</span>}
                      </>
                  }
                </div>
              ))}
              {members.length === 0 && isArtist && (
                <HelperNote tokens={tokens} text="List every current band member with their role or instrument. Shown on your EPK and About page." style={{ marginBottom: "0.5rem" }} />
              )}
              {isArtist && (
                addingMember
                  ? <div style={{ padding: "8px 0", borderBottom: border1 }}>
                      <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Name" style={{ width: "100%", background: "#111", border: `1px solid ${tokens.accent}`, borderRadius: 4, color: "#d8d8d8", padding: "4px 8px", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginBottom: "0.35rem" }} autoFocus />
                      <input value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} placeholder="Role / Instrument" onKeyDown={e => { if (e.key === "Enter") addMember(); if (e.key === "Escape") setAddingMember(false); }} style={{ width: "100%", background: "#111", border: `1px solid ${tokens.border}`, borderRadius: 4, color: "#d8d8d8", padding: "4px 8px", fontSize: "0.82rem", fontFamily: "Inter, sans-serif", marginBottom: "0.35rem" }} />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={addMember} style={{ ...addBtn, marginTop: 0 }}>Add</button>
                        <button onClick={() => setAddingMember(false)} style={{ ...addBtn, marginTop: 0, borderColor: tokens.border, color: tokens.muted }}>Cancel</button>
                      </div>
                    </div>
                  : <button onClick={() => setAddingMember(true)} style={addBtn}>+ Add Member</button>
              )}
            </div>

            {/* For Venues */}
            <div>
              <p className="section-label" style={{ marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: border1 }}>For Venues</p>
              <Link href={stagePlotHref} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: border1, textDecoration: "none", alignItems: "center" }}>
                <span style={{ ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300 }}>Stage Plot &amp; Tech Rider</span>
                <span style={{ ...lbl, color: tokens.accent }}>View →</span>
              </Link>
              {profile.bookingEmail && (
                isArtist
                  ? <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: border1, alignItems: "center" }}>
                      <span style={{ ...T, fontSize: "0.82rem", color: tokens.text, fontWeight: 300 }}>Booking Email</span>
                      <EditField value={profile.bookingEmail} onSave={v => onUpdate?.({ bookingEmail: v })} accentColor={tokens.accent} style={{ ...lbl, color: tokens.muted2 }} />
                    </div>
                  : <a href="#epk" style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: border1, textDecoration: "none", alignItems: "center" }}>
                      <span style={{ ...T, fontSize: "0.82rem", color: tokens.text, fontWeight: 300 }}>Press Kit / EPK</span>
                      <span style={{ ...lbl, color: tokens.muted2 }}>View →</span>
                    </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
