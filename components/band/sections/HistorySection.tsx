"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; }

const fmtShort = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function HistorySection({ profile, tokens }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.83rem", color: tokens.muted, fontWeight: 300 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const sorted = [...((profile as any).showHistory ?? [])].sort((a: any, b: any) => b.date.localeCompare(a.date));
  const years = [...new Set(sorted.map((s: any) => s.date.slice(0, 4)))];
  const [activeYear, setActiveYear] = useState<string>("all");
  const [openShow, setOpenShow] = useState<number | null>(null);

  const filtered = activeYear === "all" ? sorted : sorted.filter((s: any) => s.date.startsWith(activeYear));

  return (
    <section id="history" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Show History</p>
          <p style={{ ...lbl, color: tokens.muted2 }}>{sorted.length} shows archived</p>
        </div>

        {/* Year filter */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {["all", ...years].map(y => (
            <button key={y} onClick={() => setActiveYear(y)} style={{
              ...lbl, color: activeYear === y ? (isLt ? "#000" : "#fff") : tokens.muted2,
              background: activeYear === y ? (isLt ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)") : "transparent",
              border: border2, borderRadius: 3, padding: "3px 10px", cursor: "pointer",
            }}>{y === "all" ? "All" : y}</button>
          ))}
        </div>

        {sorted.length === 0 && (
          <p style={{ ...lbl, color: tokens.muted2 }}>No show history yet. Past shows added in the Shows section will appear here automatically.</p>
        )}

        {/* Show rows */}
        {filtered.map((s, i) => {
          const isOpen = openShow === i;
          const hasDetail = (s.setlist?.length ?? 0) > 0 || (s.openers?.length ?? 0) > 0 || s.attendance;

          return (
            <div key={i} style={{ borderBottom: border2 }}>
              <button
                onClick={() => hasDetail && setOpenShow(isOpen ? null : i)}
                style={{ width: "100%", background: "transparent", border: "none", cursor: hasDetail ? "pointer" : "default", textAlign: "left", padding: "12px 0" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: "1.5rem", alignItems: "start" }}>
                  <p style={{ ...lbl, color: tokens.muted2, lineHeight: 1.6 }}>{fmtShort(s.date)}</p>
                  <div>
                    <p style={{ ...body, color: tokens.text, fontWeight: 400 }}>{s.venue}</p>
                    <p style={{ ...lbl, marginTop: "0.15rem" }}>{s.city}{s.state ? `, ${s.state}` : ""}</p>
                    {s.notes && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem", fontStyle: "italic" }}>{s.notes}</p>}
                    {s.openers && s.openers.length > 0 && (
                      <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.1rem" }}>w/ {s.openers.join(", ")}</p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {s.attendance && (
                      <p style={{ ...lbl, color: tokens.muted2 }}>{s.attendance.toLocaleString()} / {s.capacity?.toLocaleString()}</p>
                    )}
                    {hasDetail && (
                      <p style={{ ...lbl, color: tokens.accent, marginTop: "0.2rem" }}>{isOpen ? "▾" : "▸"}</p>
                    )}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div style={{ paddingBottom: "1rem", paddingLeft: "136px" }}>
                  {s.setlist && s.setlist.length > 0 && (
                    <div>
                      <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.4rem" }}>Setlist ({s.setlist.length} songs)</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                        {s.setlist.map((song: any, si: any) => (
                          <span key={si} style={{
                            ...T, fontSize: "0.72rem", color: tokens.muted, fontWeight: 300,
                            background: isLt ? "#f0f0f0" : "#161616",
                            border: border2, borderRadius: 3, padding: "3px 8px",
                          }}>
                            <span style={{ ...lbl, fontSize: "0.48rem", color: tokens.muted2, marginRight: "0.3rem" }}>{si + 1}</span>
                            {song}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {s.recordingAvailable && (
                    <p style={{ ...lbl, color: tokens.accent, marginTop: "0.6rem" }}>★ Recording available</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
