"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

interface AddState { category: string; name: string; detail: string; }

export default function GearSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const gearData = profile.gear ?? [];
  const [activeMember, setActiveMember] = useState(gearData[0]?.member ?? "");
  const [adding, setAdding] = useState<AddState | null>(null);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const memberData = gearData.find(g => g.member === activeMember);
  const categories = memberData ? [...new Set(memberData.gear.map(g => g.category))] : [];

  const inputStyle: React.CSSProperties = {
    ...T, fontSize: "0.78rem", color: tokens.text,
    background: isLt ? "#fff" : "#0e0e0e",
    border: border1, borderRadius: 4, padding: "5px 8px",
    outline: "none", width: "100%",
  };

  function commitAddMember() {
    if (!newMemberName.trim()) { setAddingMember(false); return; }
    const newEntry = { member: newMemberName.trim(), role: newMemberRole.trim() || "", gear: [] };
    const nextGear = [...gearData, newEntry];
    onUpdate?.({ gear: nextGear });
    setActiveMember(newMemberName.trim());
    setNewMemberName(""); setNewMemberRole(""); setAddingMember(false);
  }

  function commitAddCategory() {
    if (!newCategory.trim() || !activeMember) { setAddingCategory(false); return; }
    const nextGear = [...gearData];
    const mIdx = nextGear.findIndex(g => g.member === activeMember);
    if (mIdx < 0) { setAddingCategory(false); return; }
    nextGear[mIdx] = { ...nextGear[mIdx], gear: [...nextGear[mIdx].gear, { category: newCategory.trim(), name: "", detail: undefined }] };
    onUpdate?.({ gear: nextGear });
    setNewCategory(""); setAddingCategory(false);
    setAdding({ category: newCategory.trim(), name: "", detail: "" });
  }

  function deleteMember(memberName: string) {
    const nextGear = gearData.filter(g => g.member !== memberName);
    onUpdate?.({ gear: nextGear });
    setActiveMember(nextGear[0]?.member ?? "");
  }

  function commitAdd() {
    if (!adding?.name.trim()) { setAdding(null); return; }
    const nextGear = [...gearData];
    const mIdx = nextGear.findIndex(g => g.member === activeMember);
    if (mIdx < 0) { setAdding(null); return; }
    nextGear[mIdx] = {
      ...nextGear[mIdx],
      gear: [...nextGear[mIdx].gear, { category: adding.category, name: adding.name.trim(), detail: adding.detail.trim() || undefined }],
    };
    onUpdate?.({ gear: nextGear });
    setAdding(null);
  }

  return (
    <section id="gear" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Gear List</p>

        {/* Member tabs */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2rem", alignItems: "center" }}>
          {gearData.map(g => (
            <div key={g.member} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <button onClick={() => setActiveMember(g.member)} style={{
                ...T, fontSize: "0.75rem", fontWeight: 400,
                color: activeMember === g.member ? (isLt ? "#000" : "#fff") : tokens.muted,
                background: activeMember === g.member ? (isLt ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)") : "transparent",
                border: border1, borderRadius: 4, padding: "6px 14px", cursor: "pointer",
              }}>
                {g.member}
                <span style={{ ...lbl, marginLeft: "0.4rem", fontSize: "0.5rem" }}>{g.role}</span>
              </button>
              {isArtist && activeMember === g.member && (
                <button onClick={() => deleteMember(g.member)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.6rem", padding: "2px 4px", ...T }}>✕</button>
              )}
            </div>
          ))}
          {isArtist && (() => {
            const existing = (profile.members ?? []).filter(m => m.name.trim() && !gearData.find(g => g.member === m.name));
            return !addingMember ? (
              <button onClick={() => setAddingMember(true)} style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T }}>
                + Member
              </button>
            ) : (
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                {existing.length > 0 ? (
                  <select autoFocus value={newMemberName} onChange={e => { const m = (profile.members ?? []).find(x => x.name === e.target.value); setNewMemberName(e.target.value); setNewMemberRole(m?.role ?? ""); }} style={{ ...T, fontSize: "0.78rem", color: tokens.text, background: isLt ? "#fff" : "#0e0e0e", border: border1, borderRadius: 4, padding: "5px 8px", outline: "none" }}>
                    <option value="">Select member…</option>
                    {existing.map(m => <option key={m.name} value={m.name}>{m.name}{m.role ? ` — ${m.role}` : ""}</option>)}
                  </select>
                ) : (
                  <input autoFocus value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Name" onKeyDown={e => { if (e.key === "Enter") commitAddMember(); if (e.key === "Escape") setAddingMember(false); }} style={{ ...T, fontSize: "0.78rem", color: tokens.text, background: isLt ? "#fff" : "#0e0e0e", border: border1, borderRadius: 4, padding: "5px 8px", outline: "none", width: 120 }} />
                )}
                <button onClick={commitAddMember} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 12px", cursor: "pointer" }}>Add</button>
                <button onClick={() => { setAddingMember(false); setNewMemberName(""); setNewMemberRole(""); }} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "5px 10px", cursor: "pointer" }}>Cancel</button>
              </div>
            );
          })()}
        </div>

        {gearData.length === 0 && (
          <p style={{ ...T, fontSize: "0.85rem", color: tokens.muted2, fontWeight: 300 }}>
            {isArtist
              ? "No gear list yet — click + Member above to get started."
              : "No gear list available."}
          </p>
        )}

        {memberData && (
          <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {categories.map(cat => {
              const items = memberData.gear.filter(g => g.category === cat);
              const isAddingHere = adding?.category === cat;
              return (
                <div key={cat} style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, padding: "16px 18px" }}>
                  <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>{cat}</p>
                  {items.map((item, itemIdx) => {
                    const globalGearIdx = memberData.gear.indexOf(item);
                    return (
                      <div key={itemIdx} style={{ padding: "7px 0", borderBottom: border2, display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                        <div style={{ flex: 1 }}>
                          {isArtist ? (
                            <>
                              <input
                                defaultValue={item.name}
                                placeholder="Gear name"
                                onBlur={e => {
                                  const v = e.target.value.trim();
                                  if (!v || v === item.name) return;
                                  const nextGear = [...gearData];
                                  const mIdx = nextGear.findIndex(g => g.member === activeMember);
                                  if (mIdx < 0) return;
                                  const newItems = [...nextGear[mIdx].gear];
                                  newItems[globalGearIdx] = { ...newItems[globalGearIdx], name: v };
                                  nextGear[mIdx] = { ...nextGear[mIdx], gear: newItems };
                                  onUpdate?.({ gear: nextGear });
                                }}
                                style={{ ...inputStyle, fontWeight: 500, marginBottom: "0.2rem" }}
                              />
                              <input
                                defaultValue={item.detail ?? ""}
                                placeholder="Detail (optional)"
                                onBlur={e => {
                                  const v = e.target.value.trim();
                                  if (v === (item.detail ?? "")) return;
                                  const nextGear = [...gearData];
                                  const mIdx = nextGear.findIndex(g => g.member === activeMember);
                                  if (mIdx < 0) return;
                                  const newItems = [...nextGear[mIdx].gear];
                                  newItems[globalGearIdx] = { ...newItems[globalGearIdx], detail: v || undefined };
                                  nextGear[mIdx] = { ...nextGear[mIdx], gear: newItems };
                                  onUpdate?.({ gear: nextGear });
                                }}
                                style={{ ...inputStyle, fontSize: "0.7rem" }}
                              />
                            </>
                          ) : (
                            <>
                              <p style={{ ...T, fontSize: "0.82rem", fontWeight: 500, color: tokens.text }}>{item.name}</p>
                              {item.detail && <p style={{ ...lbl, marginTop: "0.1rem", color: tokens.muted2 }}>{item.detail}</p>}
                            </>
                          )}
                        </div>
                        {isArtist && (
                          <button onClick={() => {
                            const nextGear = [...gearData];
                            const mIdx = nextGear.findIndex(g => g.member === activeMember);
                            if (mIdx < 0) return;
                            nextGear[mIdx] = { ...nextGear[mIdx], gear: nextGear[mIdx].gear.filter((_, gi) => gi !== globalGearIdx) };
                            onUpdate?.({ gear: nextGear });
                          }} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", padding: "2px 4px", ...T, flexShrink: 0 }}>✕</button>
                        )}
                      </div>
                    );
                  })}

                  {isArtist && (
                    isAddingHere ? (
                      <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <input
                          autoFocus
                          value={adding.name}
                          onChange={e => setAdding({ ...adding, name: e.target.value })}
                          placeholder="Gear name"
                          style={inputStyle}
                          onKeyDown={e => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") setAdding(null); }}
                        />
                        <input
                          value={adding.detail}
                          onChange={e => setAdding({ ...adding, detail: e.target.value })}
                          placeholder="Detail (optional)"
                          style={inputStyle}
                          onKeyDown={e => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") setAdding(null); }}
                        />
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={commitAdd} style={{ ...lbl, flex: 1, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 0", cursor: "pointer" }}>Add</button>
                          <button onClick={() => setAdding(null)} style={{ ...lbl, flex: 1, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "5px 0", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAdding({ category: cat, name: "", detail: "" })} style={{ marginTop: "0.5rem", background: "transparent", border: "none", color: tokens.accent, cursor: "pointer", fontSize: "0.68rem", ...T, padding: "4px 0" }}>+ Add item</button>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* Add category */}
          {isArtist && (
            <div style={{ marginTop: "1.5rem" }}>
              {addingCategory ? (
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <input autoFocus value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category (e.g. Guitars, Amps, Pedals)" onKeyDown={e => { if (e.key === "Enter") commitAddCategory(); if (e.key === "Escape") setAddingCategory(false); }} style={{ ...T, fontSize: "0.78rem", color: tokens.text, background: isLt ? "#fff" : "#0e0e0e", border: border1, borderRadius: 4, padding: "5px 8px", outline: "none", width: 220 }} />
                  <button onClick={commitAddCategory} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 12px", cursor: "pointer" }}>Add</button>
                  <button onClick={() => setAddingCategory(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "5px 10px", cursor: "pointer" }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setAddingCategory(true)} style={{ background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T }}>
                  + Add Category
                </button>
              )}
            </div>
          )}
          </div>
        )}
      </div>
    </section>
  );
}
