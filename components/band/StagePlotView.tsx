"use client";

import Link from "next/link";
import { resolveTokens, applyMode } from "@/lib/genreTokens";
import { useState, useEffect } from "react";
import { useMobile } from "@/lib/useMobile";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InstrumentAssignment {
  id: string;
  instrumentType: string;
  mic: string;
  diBox: boolean;
  amp: string;
}

interface StagePosition {
  id: string;
  label: string;
  name: string;
  role: string;
  side: string;
  row: string;
  instruments: InstrumentAssignment[];
}

interface StagePlotData {
  positions: StagePosition[];
  inputs: { ch: number; instrument: string; mic: string }[];
  monitors: { mix: number; position: string; notes: string }[];
  stageWidth?: string;
  stageDepth?: string;
  loadIn?: string;
  soundcheck?: string;
  paRequired?: string;
  pianoRequired?: boolean;
  backlineNotes?: string;
  houseEngineeer?: boolean;
  monitorType?: string;
}

interface ArtistProfile {
  name?: string;
  genre?: string;
  origin?: string;
  members?: unknown[];
  bookingEmail?: string;
  colorMode?: "dark" | "light";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLOT_KEY_PREFIX    = "bandstack-stage-plot-v5-";
const PROFILE_KEY_PREFIX = "bandstack-profile-v1";

const INST_ICONS: Record<string, string> = {
  Drums: "🥁", Bass: "🎸", "Guitar (Electric)": "🎸", "Guitar (Acoustic)": "🎸",
  "Keys / Piano": "🎹", "Lead Vocals": "🎤", "Backup Vocals": "🎙️",
  Trumpet: "🎺", Saxophone: "🎷", "Violin / Strings": "🎻",
  "DJ / Laptop": "💻", "Pedal Steel": "🎸", Mandolin: "🎸", Other: "🎵",
};

const INST_FILTERS: Record<string, string> = {
  Bass: "hue-rotate(210deg) saturate(1.8) brightness(1.1)",
  "Guitar (Acoustic)": "sepia(0.8) saturate(2) hue-rotate(5deg) brightness(1.1)",
  "Pedal Steel": "sepia(0.6) saturate(1.8) hue-rotate(15deg)",
  "Backup Vocals": "hue-rotate(160deg) saturate(1.3)",
};

const BACK_INSTRUMENTS = new Set(["Drums", "Keys / Piano", "DJ / Laptop"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function migratePosition(p: any): StagePosition {
  const instruments: InstrumentAssignment[] = Array.isArray(p.instruments)
    ? p.instruments
    : p.instrumentType
      ? [{ id: `${p.id}-0`, instrumentType: p.instrumentType, mic: "", diBox: false, amp: "" }]
      : [];
  const row = p.row ?? (instruments.some(i => BACK_INSTRUMENTS.has(i.instrumentType)) ? "back" : "front");
  return {
    id: String(p.id ?? ""),
    label: p.label ?? "",
    name: p.name ?? "",
    role: p.role ?? "",
    side: p.side ?? "",
    row,
    instruments,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  artistKey: string;
  editHref: string;
  backHref?: string;
  showEditButton?: boolean;
}

export default function StagePlotView({ artistKey, editHref, backHref, showEditButton }: Props) {
  const isMobile = useMobile();

  // All state starts empty — nothing pre-populated
  const [profile, setProfile]     = useState<ArtistProfile>({});
  const [plot, setPlot]           = useState<StagePlotData | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    try {
      // Profile: scoped key first, then legacy unscoped key for ryan-chrys compatibility
      const profileKey = artistKey === "ryan-chrys"
        ? PROFILE_KEY_PREFIX            // ryan-chrys uses legacy unscoped key
        : `${PROFILE_KEY_PREFIX}-${artistKey}`;
      const rawProfile = localStorage.getItem(profileKey);
      if (rawProfile) setProfile(JSON.parse(rawProfile) as ArtistProfile);

      // One-time migration: copy legacy unscoped key into scoped key on first load
      const LEGACY_KEY = "bandstack-stage-plot-v5";
      const plotKey = PLOT_KEY_PREFIX + artistKey;
      if (!localStorage.getItem(plotKey) && localStorage.getItem(LEGACY_KEY)) {
        localStorage.setItem(plotKey, localStorage.getItem(LEGACY_KEY)!);
      }
      const rawPlot = localStorage.getItem(plotKey);
      if (rawPlot) {
        const parsed = JSON.parse(rawPlot) as any;
        const positions = (parsed.positions ?? []).map(migratePosition);
        const next: StagePlotData = { ...parsed, positions };
        setPlot(next);
        if (positions.length) setSelectedId(positions[0].id);
      }
    } catch {}
  }, [artistKey]);

  // Derive accent from genre (from what the band actually entered, not a fallback)
  const genre      = profile.genre ?? "";
  const colorMode  = profile.colorMode ?? "dark";
  const tokens     = applyMode(resolveTokens(genre ? [genre] : []), colorMode);
  const acc        = tokens.accent;

  // Style tokens — identical to editor
  const bg      = "#050505";
  const surface = "#111";
  const border  = "rgba(255,255,255,0.15)";
  const muted2  = "#888888";
  const sqBg    = "#252525";
  const zoneUp  = "#141414";
  const zoneDn  = "#1a1a1a";
  const glow    = `0 0 14px ${acc}88, 0 0 4px ${acc}55`;
  const hcText  = "#ffffff";
  const hcMuted = "#c0c0c0";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.62rem", letterSpacing: "0.13em", textTransform: "uppercase", color: muted2, fontWeight: 600 };
  const sectionHead: React.CSSProperties = { ...lbl, color: hcMuted, fontSize: "0.65rem", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${border}` };

  // Derived data — only from what was entered
  const positions  = plot?.positions ?? [];
  const inputs     = (plot?.inputs ?? []).filter(r => r.instrument);
  const monitors   = (plot?.monitors ?? []).filter(m => m.position);
  const backRow    = positions.filter(p => p.row === "back");
  const frontRow   = positions.filter(p => p.row !== "back");

  const selPos = positions.find(p => p.id === selectedId) ?? null;

  const selInputs = selPos
    ? inputs.filter(r => {
        const txt = r.instrument.toLowerCase();
        const firstName = selPos.name.split(" ")[0].toLowerCase();
        const role = selPos.role.toLowerCase().split("+")[0].trim();
        return firstName && (txt.includes(firstName) || (role && txt.includes(role)));
      })
    : [];

  const selMonitors = selPos
    ? monitors.filter(m => {
        const firstName = selPos.name.split(" ")[0].toLowerCase();
        return firstName && m.position.toLowerCase().includes(firstName);
      })
    : [];

  const requirements = [
    ...(plot?.paRequired    ? [{ label: "PA System",     value: plot.paRequired }]  : []),
    ...(monitors.length     ? [{ label: "Monitor Sends", value: `${monitors.length} independent monitor mixes` }] : []),
    ...(plot?.stageWidth    ? [{ label: "Stage Size",    value: `${plot.stageWidth} wide × ${plot.stageDepth || "—"} deep` }] : []),
    ...(plot?.loadIn        ? [{ label: "Load-in Time",  value: plot.loadIn }]       : []),
    ...(plot?.soundcheck    ? [{ label: "Soundcheck",    value: plot.soundcheck }]   : []),
    ...(plot?.backlineNotes ? [{ label: "Backline",      value: plot.backlineNotes }]: []),
    ...(plot?.houseEngineeer !== undefined ? [{ label: "House Engineer", value: plot.houseEngineeer ? "Preferred" : "Not required" }] : []),
    ...(plot?.pianoRequired ? [{ label: "Piano",         value: "Required — stage piano or grand" }] : []),
  ];

  // ── Square renderer ────────────────────────────────────────────────────────────

  const renderSquare = (pos: StagePosition) => {
    const isSel = pos.id === selectedId;
    const primaryType = pos.instruments[0]?.instrumentType ?? "";
    const hasVocal = pos.instruments.some(
      i => i.instrumentType === "Lead Vocals" || i.instrumentType === "Backup Vocals"
    );

    return (
      <div key={pos.id} style={{ flex: "0 0 auto", width: 90, textAlign: "center" }}
        onClick={() => setSelectedId(pos.id)}>
        <div style={{
          background: isSel ? "#2a2000" : sqBg,
          border: `${isSel ? "2px" : "1px"} solid ${isSel ? acc : "rgba(255,255,255,0.2)"}`,
          boxShadow: isSel ? glow : "none",
          borderRadius: 6, padding: "8px 4px", minHeight: 72,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          marginBottom: "0.3rem", cursor: "pointer", position: "relative",
          transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
        }}>
          {primaryType ? (
            <>
              <span style={{ fontSize: "1.5rem", lineHeight: 1, filter: INST_FILTERS[primaryType] }}>
                {INST_ICONS[primaryType] ?? "🎵"}
              </span>
              {hasVocal && primaryType !== "Lead Vocals" && primaryType !== "Backup Vocals" && (
                <span style={{ position: "absolute", top: 3, right: 5, fontSize: "0.7rem" }}>🎤</span>
              )}
              {pos.instruments.length > 1 && (
                <span style={{ fontSize: "0.44rem", color: acc, fontWeight: 600, marginTop: "0.15rem" }}>{pos.instruments.length} inst</span>
              )}
            </>
          ) : (
            <span style={{ fontSize: "1.1rem", color: muted2 }}>·</span>
          )}
          {pos.name && (
            <p style={{ ...T, fontSize: "0.44rem", color: isSel ? acc : hcText, fontWeight: 400, marginTop: "0.25rem", maxWidth: "90%", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word" }}>
              {pos.name}
            </p>
          )}
        </div>
        {pos.label && (
          <p style={{ ...lbl, fontSize: "0.42rem", color: isSel ? acc : muted2, marginTop: "0.2rem" }}>{pos.label}</p>
        )}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <main style={{ background: bg, minHeight: "100vh", color: hcText, ...T }}>

      {/* Nav — only shown on standalone page (backHref provided) */}
      {backHref && (
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#050505", borderBottom: `2px solid ${acc}`, padding: "0 32px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href={backHref} style={{ ...lbl, color: hcMuted, textDecoration: "none" }}>← Back to Profile</Link>
          <span style={{ ...lbl, color: acc }}>Stage Plot & Tech Rider</span>
          <Link href={editHref} style={{ ...lbl, color: "#000", background: acc, borderRadius: 4, padding: "4px 12px", textDecoration: "none" }}>Edit →</Link>
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "24px 16px 48px" : "40px 32px 80px" }}>

        {showEditButton && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
            <Link href={editHref} style={{ ...lbl, fontSize: "0.72rem", color: "#000", background: acc, borderRadius: 4, padding: "6px 16px", textDecoration: "none" }}>Edit Stage Plot →</Link>
          </div>
        )}

        {/* Header — only shows what the band entered */}
        {(profile.name || profile.genre || profile.origin || profile.bookingEmail) && (
          <div style={{ marginBottom: "2.5rem" }}>
            {profile.name && (
              <h1 style={{ ...T, fontWeight: 700, fontSize: "1.8rem", color: hcText, margin: "0 0 0.3rem" }}>{profile.name}</h1>
            )}
            {(profile.genre || profile.origin || profile.members?.length) && (
              <p style={{ ...T, fontSize: "0.8rem", color: hcMuted }}>
                {[
                  profile.genre,
                  profile.origin,
                  profile.members?.length ? `${profile.members.length}-piece` : null,
                ].filter(Boolean).join(" · ")}
              </p>
            )}
            {profile.bookingEmail && (
              <div style={{ marginTop: "0.75rem" }}>
                <a href={`mailto:${profile.bookingEmail}`} style={{ ...lbl, color: acc, textDecoration: "none" }}>
                  Booking: {profile.bookingEmail}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Stage Diagram */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={sectionHead}>Stage Layout</p>
          <div style={{ background: "#1e1e1e", border: `1px solid ${border}`, borderRadius: 8, padding: "20px 16px", overflowX: "auto" }}>

            {/* UPSTAGE */}
            <div style={{ background: zoneUp, border: `1px solid rgba(255,255,255,0.2)`, borderTop: `2px solid rgba(255,255,255,0.4)`, borderRadius: 6, padding: "10px 8px 8px", marginBottom: "0.5rem", minHeight: 90 }}>
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <span style={{ ...lbl, fontSize: "0.52rem", color: "#fff", letterSpacing: "0.2em" }}>↑ UPSTAGE — BACK OF STAGE</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", minHeight: 40 }}>
                {backRow.map(renderSquare)}
              </div>
            </div>

            {/* DOWNSTAGE */}
            <div style={{ background: zoneDn, border: `1px solid rgba(255,255,255,0.2)`, borderBottom: `2px solid ${acc}`, borderRadius: 6, padding: "10px 8px 8px", marginBottom: "0.5rem", minHeight: 90 }}>
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <span style={{ ...lbl, fontSize: "0.52rem", color: "#fff", letterSpacing: "0.2em" }}>↓ DOWNSTAGE — FRONT OF STAGE</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", minHeight: 40 }}>
                {frontRow.map(renderSquare)}
              </div>
            </div>

            {/* Stage edge */}
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.25)`, margin: "0.25rem 0 0.6rem", paddingTop: "0.5rem", textAlign: "center" }}>
              <span style={{ ...lbl, fontSize: "0.52rem", color: muted2, letterSpacing: "0.22em" }}>— STAGE EDGE —</span>
            </div>

            {/* Monitor wedges */}
            {monitors.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-end" }}>
                {monitors.map(m => (
                  <div key={m.mix} style={{ background: surface, border: `1px solid rgba(255,255,255,0.2)`, borderTop: `3px solid ${acc}`, boxShadow: `0 0 10px ${acc}44`, borderRadius: "0 0 10px 10px", padding: "6px 10px 8px", minWidth: 100, textAlign: "center" }}>
                    <p style={{ ...lbl, color: acc, fontSize: "0.46rem", marginBottom: "0.25rem" }}>MON {m.mix}</p>
                    <p style={{ ...T, fontSize: "0.6rem", color: hcText, fontWeight: 500, lineHeight: 1.4 }}>{m.position}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <span style={{ ...lbl, fontSize: "0.48rem", color: muted2 }}>↓ AUDIENCE</span>
            </div>

            {/* Selected position detail */}
            {selPos && (
              <div style={{ background: `${acc}0a`, border: `1px solid ${acc}33`, borderRadius: 8, padding: "1rem 1.25rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {selPos.instruments[0]?.instrumentType && (
                      <span style={{ fontSize: "2rem", filter: INST_FILTERS[selPos.instruments[0].instrumentType] }}>
                        {INST_ICONS[selPos.instruments[0].instrumentType] ?? "🎵"}
                      </span>
                    )}
                    <div>
                      {selPos.name && <p style={{ ...T, fontSize: "1rem", fontWeight: 700, color: hcText, lineHeight: 1.2 }}>{selPos.name}</p>}
                      {(selPos.role || selPos.instruments[0]?.instrumentType) && (
                        <p style={{ ...T, fontSize: "0.72rem", color: acc, fontWeight: 500, marginTop: "0.1rem" }}>
                          {selPos.role || selPos.instruments[0].instrumentType}
                        </p>
                      )}
                    </div>
                  </div>
                  {selPos.label && <span style={{ ...lbl, color: hcMuted }}>{selPos.label}</span>}
                </div>

                {selPos.instruments.length > 0 && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ ...lbl, color: hcMuted, marginBottom: "0.4rem" }}>Instruments</p>
                    {selPos.instruments.map((inst, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "1rem", filter: INST_FILTERS[inst.instrumentType] }}>{INST_ICONS[inst.instrumentType] ?? "🎵"}</span>
                        <span style={{ ...T, fontSize: "0.82rem", color: hcText, fontWeight: 500 }}>{inst.instrumentType}</span>
                        {inst.diBox && <span style={{ ...lbl, background: `${acc}22`, color: acc, borderRadius: 3, padding: "1px 6px", fontSize: "0.5rem" }}>DI</span>}
                        {inst.amp && <span style={{ ...T, fontSize: "0.72rem", color: hcMuted }}>{inst.amp}</span>}
                        {inst.mic && <span style={{ ...T, fontSize: "0.72rem", color: hcMuted }}>· {inst.mic}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {(selInputs.length > 0 || selMonitors.length > 0) && (
                  <div style={{ display: "grid", gridTemplateColumns: selInputs.length && selMonitors.length ? "1fr 1fr" : "1fr", gap: "0.75rem" }}>
                    {selInputs.length > 0 && (
                      <div>
                        <p style={{ ...lbl, color: hcMuted, marginBottom: "0.4rem" }}>Inputs</p>
                        {selInputs.map((r, i) => (
                          <p key={i} style={{ ...T, fontSize: "0.78rem", color: hcText, lineHeight: 1.7 }}>
                            <span style={{ color: acc, marginRight: "0.4rem" }}>Ch {r.ch}</span>{r.instrument}
                            {r.mic && <span style={{ color: hcMuted, marginLeft: "0.4rem" }}>· {r.mic}</span>}
                          </p>
                        ))}
                      </div>
                    )}
                    {selMonitors.length > 0 && (
                      <div>
                        <p style={{ ...lbl, color: hcMuted, marginBottom: "0.4rem" }}>Monitor Mix</p>
                        {selMonitors.map((m, i) => (
                          <p key={i} style={{ ...T, fontSize: "0.78rem", color: hcText, lineHeight: 1.7 }}>
                            <span style={{ color: acc, marginRight: "0.4rem" }}>Mix {m.mix}</span>{m.notes || m.position}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input List + Monitors + Requirements */}
        {(inputs.length > 0 || monitors.length > 0 || requirements.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2.5rem" }}>

            {inputs.length > 0 && (
              <div>
                <p style={sectionHead}>Input List</p>
                {inputs.map(inp => (
                  <div key={inp.ch} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "0.75rem", padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.12)`, alignItems: "start" }}>
                    <span style={{ ...lbl, color: acc, fontSize: "0.65rem" }}>{inp.ch}</span>
                    <div>
                      <p style={{ ...T, fontSize: "0.82rem", color: hcText, fontWeight: 500 }}>{inp.instrument}</p>
                      {inp.mic && <p style={{ ...lbl, color: hcMuted, marginTop: "0.1rem", fontSize: "0.58rem" }}>{inp.mic}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {monitors.length > 0 && (
                <div>
                  <p style={sectionHead}>Monitor Mixes</p>
                  {monitors.map(m => (
                    <div key={m.mix} style={{ padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.12)` }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
                        <span style={{ ...lbl, color: acc, flexShrink: 0, fontSize: "0.65rem" }}>Mix {m.mix}</span>
                        <p style={{ ...T, fontSize: "0.82rem", color: hcText, fontWeight: 500 }}>{m.position}</p>
                      </div>
                      {m.notes && <p style={{ ...lbl, color: hcMuted, marginTop: "0.2rem", lineHeight: 1.5, fontSize: "0.58rem" }}>{m.notes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {requirements.length > 0 && (
                <div>
                  <p style={sectionHead}>Technical Requirements</p>
                  {requirements.map(r => (
                    <div key={r.label} style={{ padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.12)` }}>
                      <p style={{ ...lbl, color: hcMuted, marginBottom: "0.2rem", fontSize: "0.58rem" }}>{r.label}</p>
                      <p style={{ ...T, fontSize: "0.82rem", color: hcText, fontWeight: 400 }}>{r.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {profile.bookingEmail && (
                <div>
                  <p style={sectionHead}>Contact</p>
                  <a href={`mailto:${profile.bookingEmail}`} style={{ ...T, fontSize: "0.78rem", color: acc, textDecoration: "none" }}>{profile.bookingEmail}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state — nothing entered yet */}
        {!plot && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ ...lbl, color: muted2, marginBottom: "0.75rem" }}>No stage plot built yet</p>
            <Link href={editHref} style={{ background: acc, color: "#000", ...T, fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", padding: "10px 20px", borderRadius: 4, display: "inline-block" }}>
              Build Stage Plot →
            </Link>
          </div>
        )}

      </div>

      {/* Mobile bottom sheet */}
      {isMobile && selPos && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#111", borderTop: `2px solid ${acc}`, padding: "20px 24px 36px", boxShadow: "0 -8px 32px rgba(0,0,0,0.7)" }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            {selPos.instruments[0]?.instrumentType && (
              <span style={{ fontSize: "2.4rem", filter: INST_FILTERS[selPos.instruments[0].instrumentType] }}>
                {INST_ICONS[selPos.instruments[0].instrumentType] ?? "🎵"}
              </span>
            )}
            <div>
              {selPos.name && <p style={{ ...T, fontSize: "1.1rem", fontWeight: 700, color: hcText, lineHeight: 1.1 }}>{selPos.name}</p>}
              {(selPos.role || selPos.instruments[0]?.instrumentType) && (
                <p style={{ ...T, fontSize: "0.8rem", color: acc, marginTop: "0.2rem" }}>
                  {selPos.role || selPos.instruments[0].instrumentType}
                </p>
              )}
            </div>
          </div>
          {selPos.instruments.map((inst, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
              <span style={{ fontSize: "0.95rem", filter: INST_FILTERS[inst.instrumentType] }}>{INST_ICONS[inst.instrumentType] ?? "🎵"}</span>
              <span style={{ ...T, fontSize: "0.85rem", color: hcText }}>{inst.instrumentType}</span>
              {inst.diBox && <span style={{ ...lbl, background: `${acc}22`, color: acc, borderRadius: 3, padding: "1px 6px", fontSize: "0.5rem" }}>DI</span>}
              {inst.mic && <span style={{ ...T, fontSize: "0.75rem", color: hcMuted }}>· {inst.mic}</span>}
              {inst.amp && <span style={{ ...T, fontSize: "0.75rem", color: hcMuted }}>{inst.amp}</span>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
