"use client";

import { useState } from "react";
import type { ProfileData, ProfileLink } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import Link from "next/link";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

const CATS = ["Streaming", "Video", "Social", "Purchase", "Discovery", "Official"] as const;
type Cat = typeof CATS[number];

const CAT_ICONS: Record<Cat, string> = { Streaming: "♫", Video: "▶", Social: "◉", Purchase: "⬡", Discovery: "◎", Official: "★" };

export default function LinksSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;

  const [adding, setAdding] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftCat, setDraftCat] = useState<Cat>("Streaming");

  // Use profile.links if available (editable), fall back to data.ts
  const allLinks: ProfileLink[] = profile.links ?? [];

  const grouped = CATS.reduce((acc, cat) => {
    acc[cat] = allLinks.filter(l => l.category === cat);
    return acc;
  }, {} as Record<Cat, ProfileLink[]>);

  function deleteLink(label: string) {
    onUpdate?.({ links: allLinks.filter(l => l.label !== label) });
  }

  function addLink() {
    if (!draftLabel.trim() || !draftUrl.trim()) return;
    const url = draftUrl.startsWith("http") ? draftUrl : `https://${draftUrl}`;
    onUpdate?.({ links: [...allLinks, { label: draftLabel.trim(), url, category: draftCat }] });
    setDraftLabel(""); setDraftUrl(""); setAdding(false);
  }

  const inp: React.CSSProperties = { background: "#111", border: `1px solid ${tokens.border}`, borderRadius: 4, color: "#d8d8d8", padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", width: "100%" };
  const addBtn: React.CSSProperties = { background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T };

  return (
    <section id="links" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Links & Platforms</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {isArtist && <button onClick={() => setAdding(a => !a)} style={{ ...addBtn }}>+ Add Link</button>}
            <Link href="/band/stage-plot" style={{ ...lbl, color: tokens.accent, textDecoration: "none" }}>Stage Plot →</Link>
          </div>
        </div>

        {/* Add link form */}
        {isArtist && adding && (
          <div style={{ background: "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>New Link</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input value={draftLabel} onChange={e => setDraftLabel(e.target.value)} placeholder="Label (e.g. Spotify)" style={inp} />
              <input value={draftUrl} onChange={e => setDraftUrl(e.target.value)} placeholder="URL" style={inp} />
            </div>
            <select value={draftCat} onChange={e => setDraftCat(e.target.value as Cat)} style={{ ...inp, marginBottom: "0.75rem", cursor: "pointer" }}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={addLink} style={{ ...addBtn, background: tokens.accent + "22" }}>Save</button>
              <button onClick={() => setAdding(false)} style={{ ...addBtn, borderColor: tokens.border, color: tokens.muted }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem" }}>
          {CATS.map(cat => {
            const items = grouped[cat];
            if (!items.length && !isArtist) return null;
            return (
              <div key={cat}>
                <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>{CAT_ICONS[cat]}  {cat}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {items.map(link => (
                    <div key={link.label} style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${tokens.border2}` }}>
                      <a href={link.url} target="_blank" rel="noreferrer" style={{
                        ...T, fontSize: "0.83rem", fontWeight: 300, color: tokens.muted,
                        textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "6px 0", flex: 1,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = tokens.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = tokens.muted)}
                      >
                        {link.label}
                        <span style={{ ...lbl, color: tokens.muted2, marginLeft: "auto" }}>↗</span>
                      </a>
                      {isArtist && (
                        <button onClick={() => deleteLink(link.label)} style={{ background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", fontSize: "0.65rem", padding: "0 4px", ...T }}>✕</button>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && isArtist && (
                    <p style={{ ...lbl, fontStyle: "italic" }}>No {cat} links yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
