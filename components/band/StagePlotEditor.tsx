"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InstrumentAssignment {
  id: string;
  instrumentType: string;
  mic: string;
  diBox: boolean;
  amp: string;
}

export interface StagePosition {
  id: string;
  label: string;
  name: string;
  role: string;
  side: "DSL" | "DSL-C" | "CS" | "DSR-C" | "DSR";
  row: "back" | "front";
  instruments: InstrumentAssignment[];
}

export interface InputRow { ch: number; instrument: string; mic: string; }
export interface MonitorMix { mix: number; position: string; notes: string; }

export interface StagePlotData {
  positions: StagePosition[];
  inputs: InputRow[];
  monitors: MonitorMix[];
  monitorType: "wedge" | "iem" | "both";
  performers: number;
  stageWidth: string;
  stageDepth: string;
  loadIn: string;
  soundcheck: string;
  paRequired: string;
  pianoRequired: boolean;
  backlineNotes: string;
  houseEngineeer: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLOT_KEY_PREFIX = "bandstack-stage-plot-v5-";

const EMPTY_PLOT: StagePlotData = {
  positions: [],
  inputs: [],
  monitors: [],
  monitorType: "wedge",
  performers: 0,
  stageWidth: "",
  stageDepth: "",
  loadIn: "",
  soundcheck: "",
  paRequired: "",
  pianoRequired: false,
  backlineNotes: "",
  houseEngineeer: true,
};

const BACK_INSTRUMENTS = new Set(["Drums", "Keys / Piano", "DJ / Laptop"]);

const INST_ICONS: Record<string, string> = {
  Drums: "🥁", Bass: "🎸", "Guitar (Electric)": "🎸", "Guitar (Acoustic)": "🎸",
  "Keys / Piano": "🎹", "Lead Vocals": "🎤", "Backup Vocals": "🎙️",
  Trumpet: "🎺", Saxophone: "🎷", "Violin / Strings": "🎻",
  "DJ / Laptop": "💻", "Pedal Steel": "🎸", Mandolin: "🎸", Other: "🎵",
};

const INST_FILTERS: Record<string, string> = {
  Bass: "hue-rotate(210deg) saturate(1.8) brightness(1.1)",
  "Guitar (Acoustic)": "sepia(0.8) saturate(2) hue-rotate(5deg) brightness(1.1)",
  "Pedal Steel": "sepia(0.6) saturate(1.8) hue-rotate(15deg) brightness(1.05)",
  Mandolin: "hue-rotate(90deg) saturate(1.3)",
  "Backup Vocals": "hue-rotate(160deg) saturate(1.3)",
};

const INSTRUMENT_TYPES = [
  "Drums", "Bass", "Guitar (Electric)", "Guitar (Acoustic)", "Keys / Piano",
  "Lead Vocals", "Backup Vocals", "Trumpet", "Saxophone", "Violin / Strings",
  "Pedal Steel", "Mandolin", "DJ / Laptop", "Other",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultRow(instruments: InstrumentAssignment[]): "back" | "front" {
  return instruments.some(i => BACK_INSTRUMENTS.has(i.instrumentType)) ? "back" : "front";
}

function migratePosition(p: any): StagePosition {
  const instruments: InstrumentAssignment[] = Array.isArray(p.instruments)
    ? p.instruments
    : p.instrumentType
      ? [{ id: `${p.id}-0`, instrumentType: p.instrumentType, mic: "", diBox: false, amp: "" }]
      : [];
  return {
    id: String(p.id ?? Date.now()),
    label: p.label ?? "",
    name: p.name ?? "",
    role: p.role ?? "",
    side: p.side ?? "DSL",
    row: p.row ?? defaultRow(instruments),
    instruments,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  artistKey: string;
  backHref: string;
  viewHref: string;
}

export default function StagePlotEditor({ artistKey, backHref, viewHref }: Props) {
  const PLOT_KEY = PLOT_KEY_PREFIX + artistKey;

  const [data, setData] = useState<StagePlotData>(EMPTY_PLOT);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      // One-time migration: copy legacy unscoped key into scoped key on first load
      const LEGACY_KEY = "bandstack-stage-plot-v5";
      if (!localStorage.getItem(PLOT_KEY) && localStorage.getItem(LEGACY_KEY)) {
        localStorage.setItem(PLOT_KEY, localStorage.getItem(LEGACY_KEY)!);
      }
      const raw = localStorage.getItem(PLOT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as any;
        const positions = (parsed.positions ?? []).map(migratePosition);
        const next: StagePlotData = { ...EMPTY_PLOT, ...parsed, positions };
        setData(next);
        if (positions.length) setSelectedId(positions[0].id);
      }
    } catch {}
  }, [PLOT_KEY]);

  // ── Persistence ──────────────────────────────────────────────────────────────

  const save = (next: StagePlotData) => {
    setData(next);
    try { localStorage.setItem(PLOT_KEY, JSON.stringify(next)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const set = <K extends keyof StagePlotData>(k: K, v: StagePlotData[K]) =>
    save({ ...data, [k]: v });

  // ── Positions ─────────────────────────────────────────────────────────────────

  const addPos = (row: "front" | "back" = "front") => {
    const newPos: StagePosition = {
      id: Date.now().toString(),
      label: "", name: "", role: "",
      side: "DSL", row,
      instruments: [],
    };
    save({ ...data, positions: [...data.positions, newPos] });
    setSelectedId(newPos.id);
  };

  const removePos = (id: string) => {
    const next = { ...data, positions: data.positions.filter(p => p.id !== id) };
    save(next);
    if (selectedId === id) setSelectedId(next.positions[0]?.id ?? "");
  };

  const updatePos = (id: string, field: keyof StagePosition, val: any) =>
    save({ ...data, positions: data.positions.map(p => p.id === id ? { ...p, [field]: val } : p) });

  const swapPositions = (aId: string, bId: string) => {
    const positions = data.positions.map(p => ({ ...p }));
    const ai = positions.findIndex(p => p.id === aId);
    const bi = positions.findIndex(p => p.id === bId);
    if (ai === -1 || bi === -1) return;
    const tmpSide = positions[ai].side;
    const tmpRow = positions[ai].row;
    positions[ai].side = positions[bi].side;
    positions[ai].row = positions[bi].row;
    positions[bi].side = tmpSide;
    positions[bi].row = tmpRow;
    [positions[ai], positions[bi]] = [positions[bi], positions[ai]];
    save({ ...data, positions });
  };

  // ── Instruments ───────────────────────────────────────────────────────────────

  const addInst = (posId: string) => {
    const newInst: InstrumentAssignment = {
      id: `${posId}-${Date.now()}`, instrumentType: "", mic: "", diBox: false, amp: "",
    };
    save({
      ...data,
      positions: data.positions.map(p =>
        p.id !== posId ? p : { ...p, instruments: [...p.instruments, newInst] }
      ),
    });
  };

  const removeInst = (posId: string, instId: string) =>
    save({
      ...data,
      positions: data.positions.map(p =>
        p.id !== posId ? p : { ...p, instruments: p.instruments.filter(i => i.id !== instId) }
      ),
    });

  const updateInst = (posId: string, instId: string, field: keyof InstrumentAssignment, val: any) =>
    save({
      ...data,
      positions: data.positions.map(p => {
        if (p.id !== posId) return p;
        const instruments = p.instruments.map(i =>
          i.id !== instId ? i : { ...i, [field]: val }
        );
        const row = field === "instrumentType" ? defaultRow(instruments) : p.row;
        return { ...p, instruments, row };
      }),
    });

  // ── Inputs ────────────────────────────────────────────────────────────────────

  const addInput = () =>
    save({ ...data, inputs: [...data.inputs, { ch: data.inputs.length + 1, instrument: "", mic: "" }] });

  const removeInput = (i: number) =>
    save({
      ...data,
      inputs: data.inputs
        .filter((_, idx) => idx !== i)
        .map((r, idx) => ({ ...r, ch: idx + 1 })),
    });

  const updateInput = (i: number, field: keyof InputRow, val: string) =>
    save({ ...data, inputs: data.inputs.map((r, idx) => idx === i ? { ...r, [field]: val } : r) });

  // ── Monitors ──────────────────────────────────────────────────────────────────

  const addMon = () =>
    save({ ...data, monitors: [...data.monitors, { mix: data.monitors.length + 1, position: "", notes: "" }] });

  const removeMon = (i: number) =>
    save({
      ...data,
      monitors: data.monitors
        .filter((_, idx) => idx !== i)
        .map((m, idx) => ({ ...m, mix: idx + 1 })),
    });

  const updateMon = (i: number, field: keyof MonitorMix, val: string) =>
    save({ ...data, monitors: data.monitors.map((m, idx) => idx === i ? { ...m, [field]: val } : m) });

  // ── Style tokens ──────────────────────────────────────────────────────────────

  const bg      = "#050505";
  const surface = "#111";
  const border  = "rgba(255,255,255,0.15)";
  const border2 = "rgba(255,255,255,0.3)";
  const text    = "#ffffff";
  const muted   = "#cccccc";
  const muted2  = "#888888";
  const acc     = "#f59e0b";
  const zoneUp  = "#141414";
  const zoneDn  = "#1a1a1a";
  const sqBg    = "#252525";
  const glow    = `0 0 14px ${acc}88, 0 0 4px ${acc}55`;
  const T: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: muted, fontWeight: 700 };
  const sectionHead: React.CSSProperties = { ...lbl, color: "#fff", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${border}` };
  const inputStyle: React.CSSProperties = { background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "7px 10px", color: text, ...T, fontSize: "0.82rem", fontWeight: 300, width: "100%", outline: "none" };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "none" };

  const sel = data.positions.find(p => p.id === selectedId) ?? null;
  const backRow  = data.positions.filter(p => p.row === "back");
  const frontRow = data.positions.filter(p => p.row === "front");

  // ── Square renderer ────────────────────────────────────────────────────────────

  const renderSquare = (pos: StagePosition) => {
    const isSelected = pos.id === selectedId;
    const primaryInst = pos.instruments[0];
    const hasVocal = pos.instruments.some(
      i => i.instrumentType === "Lead Vocals" || i.instrumentType === "Backup Vocals"
    );
    const icon   = primaryInst?.instrumentType ? (INST_ICONS[primaryInst.instrumentType] ?? "🎵") : null;
    const filter = primaryInst?.instrumentType ? INST_FILTERS[primaryInst.instrumentType] : undefined;

    return (
      <div key={pos.id} style={{ flex: "0 0 auto", width: 90, textAlign: "center" }}>
        <div
          draggable
          onDragStart={() => { dragIdRef.current = pos.id; setDragId(pos.id); setDragOverId(null); }}
          onDragOver={e => { e.preventDefault(); setDragOverId(pos.id); }}
          onDragLeave={() => setDragOverId(null)}
          onDrop={e => {
            e.preventDefault();
            const from = dragIdRef.current;
            if (from && from !== pos.id) { swapPositions(from, pos.id); setSelectedId(from); }
            dragIdRef.current = null; setDragId(null); setDragOverId(null);
          }}
          onDragEnd={() => { dragIdRef.current = null; setDragId(null); setDragOverId(null); }}
          onClick={() => setSelectedId(pos.id)}
          style={{
            background: dragOverId === pos.id ? `${acc}33` : isSelected ? "#2a2000" : sqBg,
            border: `${isSelected || dragOverId === pos.id ? "2px" : "1px"} solid ${dragOverId === pos.id ? acc : isSelected ? acc : "rgba(255,255,255,0.2)"}`,
            boxShadow: isSelected ? glow : "none",
            borderRadius: 6, padding: "8px 4px", minHeight: 72,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            marginBottom: "0.3rem", cursor: "grab", position: "relative",
            opacity: dragId === pos.id ? 0.3 : 1,
            transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s, opacity 0.15s",
          }}
        >
          {icon ? (
            <>
              <span style={{ fontSize: "1.5rem", lineHeight: 1, filter, pointerEvents: "none" }}>{icon}</span>
              {hasVocal && primaryInst?.instrumentType !== "Lead Vocals" && primaryInst?.instrumentType !== "Backup Vocals" && (
                <span style={{ position: "absolute", top: 3, right: 5, fontSize: "0.7rem", pointerEvents: "none" }}>🎤</span>
              )}
              {pos.instruments.length > 1 && (
                <span style={{ fontSize: "0.44rem", color: acc, fontWeight: 600, marginTop: "0.15rem", pointerEvents: "none" }}>{pos.instruments.length} inst</span>
              )}
            </>
          ) : (
            <span style={{ fontSize: "1.4rem", color: acc, opacity: 0.4, fontWeight: 300, pointerEvents: "none" }}>+</span>
          )}
          {pos.name && (
            <p style={{ ...T, fontSize: "0.44rem", color: isSelected ? acc : text, fontWeight: 400, marginTop: "0.25rem", maxWidth: "90%", textAlign: "center", lineHeight: 1.3, wordBreak: "break-word", pointerEvents: "none" }}>
              {pos.name}
            </p>
          )}
          <button
            onClick={e => { e.stopPropagation(); removePos(pos.id); }}
            style={{ position: "absolute", top: 2, right: 3, background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.75rem", lineHeight: 1, padding: 0, pointerEvents: "auto" }}
          >×</button>
        </div>
        {pos.label && (
          <p style={{ ...lbl, fontSize: "0.42rem", color: isSelected ? acc : muted2, marginTop: "0.2rem" }}>{pos.label}</p>
        )}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <main style={{ background: bg, minHeight: "100vh", color: text, ...T }}>

      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#050505", borderBottom: `2px solid ${acc}`, padding: "0 32px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={backHref} style={{ ...lbl, color: muted, textDecoration: "none" }}>← Studio</Link>
        <span style={{ ...lbl, color: acc }}>Stage Plot Builder</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {saved && <span style={{ ...lbl, color: acc }}>saved.</span>}
          <Link href={viewHref} style={{ ...lbl, color: muted, textDecoration: "none" }}>View →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Live Setup */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Live Setup</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Total inputs needed</p>
              <input
                type="number" min={0} max={64}
                value={data.performers || ""}
                onChange={e => set("performers", parseInt(e.target.value) || 0)}
                placeholder="0"
                style={{ ...inputStyle, width: 80 }}
              />
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Monitor type</p>
              <select
                value={data.monitorType}
                onChange={e => set("monitorType", e.target.value as StagePlotData["monitorType"])}
                style={{ ...selectStyle, width: "100%" }}
              >
                <option value="wedge">Wedge monitors</option>
                <option value="iem">IEM (in-ear)</option>
                <option value="both">Both (IEM + wedge)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Stage Diagram */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${border}` }}>
            <span style={{ ...lbl, color: "#fff" }}>Stage Positions</span>
            {!confirmClear ? (
              <button onClick={() => setConfirmClear(true)} style={{ background: "transparent", border: "none", color: muted2, ...T, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}>Clear</button>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ ...lbl, color: "#f87171", fontSize: "0.56rem" }}>Clear everything?</span>
                <button onClick={() => { save(EMPTY_PLOT); setSelectedId(""); setConfirmClear(false); }} style={{ background: "transparent", border: `1px solid rgba(248,113,113,0.4)`, borderRadius: 3, color: "#f87171", ...T, fontSize: "0.56rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", padding: "2px 8px" }}>Yes, clear</button>
                <button onClick={() => setConfirmClear(false)} style={{ background: "transparent", border: "none", color: muted2, ...T, fontSize: "0.56rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}>Cancel</button>
              </span>
            )}
          </div>
          <p style={{ ...lbl, color: muted2, marginBottom: "1rem", fontSize: "0.58rem" }}>
            Drag squares to reorder · Click to edit · Stage Left = audience right · Stage Right = audience left
          </p>

          <div style={{ background: "#1e1e1e", border: `1px solid ${border}`, borderRadius: 8, padding: "20px 16px", marginBottom: "1.5rem", overflowX: "auto" }}>

            {/* UPSTAGE zone */}
            <div style={{ background: zoneUp, border: `1px solid rgba(255,255,255,0.2)`, borderTop: `2px solid rgba(255,255,255,0.4)`, borderRadius: 6, padding: "10px 8px 8px", marginBottom: "0.5rem", minHeight: 90 }}>
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <span style={{ ...lbl, fontSize: "0.52rem", color: "#fff", letterSpacing: "0.2em" }}>↑ UPSTAGE — BACK OF STAGE</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", minHeight: 40 }}>
                {backRow.map(renderSquare)}
                <div style={{ flex: "0 0 auto", width: 90 }}>
                  <button onClick={() => addPos("back")} style={{ width: "100%", minHeight: 72, background: "transparent", border: `1px dashed ${border2}`, borderRadius: 6, color: muted2, cursor: "pointer", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            </div>

            {/* DOWNSTAGE zone */}
            <div style={{ background: zoneDn, border: `1px solid rgba(255,255,255,0.2)`, borderBottom: `2px solid ${acc}`, borderRadius: 6, padding: "10px 8px 8px", marginBottom: "0.5rem", minHeight: 90 }}>
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <span style={{ ...lbl, fontSize: "0.52rem", color: "#fff", letterSpacing: "0.2em" }}>↓ DOWNSTAGE — FRONT OF STAGE</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-start", minHeight: 40 }}>
                {frontRow.map(renderSquare)}
                <div style={{ flex: "0 0 auto", width: 90 }}>
                  <button onClick={() => addPos("front")} style={{ width: "100%", minHeight: 72, background: "transparent", border: `1px dashed ${border2}`, borderRadius: 6, color: muted2, cursor: "pointer", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            </div>

            {/* Stage edge */}
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.25)`, margin: "0.25rem 0 0.6rem", paddingTop: "0.5rem", textAlign: "center" }}>
              <span style={{ ...lbl, fontSize: "0.52rem", color: muted2, letterSpacing: "0.22em" }}>— STAGE EDGE —</span>
            </div>

            {/* Monitor wedge strip */}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-end", marginTop: "0.5rem" }}>
              {data.monitors.map((m, i) => (
                <div key={m.mix} style={{ position: "relative", minWidth: 100 }}>
                  <div style={{ background: "#111", border: `1px solid rgba(255,255,255,0.2)`, borderTop: `3px solid ${acc}`, boxShadow: `0 0 10px ${acc}44`, borderRadius: "0 0 10px 10px", padding: "6px 10px 8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <p style={{ ...lbl, color: acc, fontSize: "0.46rem" }}>MON {m.mix}</p>
                      <button onClick={() => removeMon(i)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.75rem", lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                    <input
                      value={m.position}
                      onChange={e => updateMon(i, "position", e.target.value)}
                      placeholder="who's in this mix"
                      style={{ background: "transparent", border: "none", outline: "none", color: text, ...T, fontSize: "0.6rem", width: "100%", textAlign: "center" }}
                    />
                  </div>
                </div>
              ))}
              <button onClick={addMon} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: "0 0 10px 10px", color: muted, ...T, fontSize: "0.8rem", padding: "20px 12px", cursor: "pointer", alignSelf: "flex-end" }}>+</button>
            </div>

            <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <span style={{ ...lbl, fontSize: "0.48rem", color: muted2 }}>↓ AUDIENCE</span>
            </div>
          </div>

          {/* Position editor panel */}
          {sel ? (
            <div style={{ background: `${acc}0a`, border: `1px solid ${acc}33`, borderRadius: 8, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
              <p style={{ ...lbl, color: acc, marginBottom: "1rem" }}>
                Editing — {sel.name || sel.label || "New Position"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div>
                  <p style={{ ...lbl, marginBottom: "0.35rem" }}>Performer Name</p>
                  <input value={sel.name} onChange={e => updatePos(sel.id, "name", e.target.value)} placeholder="Performer name" style={inputStyle} />
                </div>
                <div>
                  <p style={{ ...lbl, marginBottom: "0.35rem" }}>Position Label</p>
                  <input value={sel.label} onChange={e => updatePos(sel.id, "label", e.target.value)} placeholder="e.g. Drum Riser, Stage Left…" style={inputStyle} />
                </div>
                <div>
                  <p style={{ ...lbl, marginBottom: "0.35rem" }}>Stage Depth</p>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {(["front", "back"] as const).map(r => (
                      <button key={r} onClick={() => updatePos(sel.id, "row", r)} style={{ flex: 1, background: sel.row === r ? `${acc}22` : "transparent", border: `1px solid ${sel.row === r ? acc : border}`, borderRadius: 4, color: sel.row === r ? acc : muted, ...T, fontSize: "0.65rem", padding: "7px 4px", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {r === "front" ? "↓ Dnstage" : "↑ Upstage"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ ...lbl, color: muted, marginBottom: "0.6rem" }}>Instruments &amp; Inputs</p>
              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 90px 40px", gap: "0.4rem", marginBottom: "0.35rem" }}>
                <span style={{ ...lbl, fontSize: "0.5rem" }}>Instrument</span>
                <span style={{ ...lbl, fontSize: "0.5rem" }}>Mic / Vocal Mic</span>
                <span style={{ ...lbl, fontSize: "0.5rem" }}>Amp / Notes</span>
                <span style={{ ...lbl, fontSize: "0.5rem" }}>DI Box</span>
                <span />
              </div>
              <datalist id={`inst-types-${artistKey}`}>
                {INSTRUMENT_TYPES.map(t => <option key={t} value={t} />)}
              </datalist>
              {sel.instruments.map(inst => (
                <div key={inst.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 90px 40px", gap: "0.4rem", marginBottom: "0.4rem", alignItems: "center" }}>
                  <input list={`inst-types-${artistKey}`} value={inst.instrumentType} onChange={e => updateInst(sel.id, inst.id, "instrumentType", e.target.value)} placeholder="e.g. Drums, Guitar…" style={{ ...inputStyle, fontSize: "0.72rem" }} />
                  <input value={inst.mic} onChange={e => updateInst(sel.id, inst.id, "mic", e.target.value)} placeholder="SM58, Beta 52A…" style={{ ...inputStyle, fontSize: "0.72rem" }} />
                  <input value={inst.amp} onChange={e => updateInst(sel.id, inst.id, "amp", e.target.value)} placeholder="Own amp, no amp…" style={{ ...inputStyle, fontSize: "0.72rem" }} />
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", justifyContent: "center" }}>
                    <div onClick={() => updateInst(sel.id, inst.id, "diBox", !inst.diBox)} style={{ width: 32, height: 18, borderRadius: 9, position: "relative", background: inst.diBox ? acc : border2, transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 1, left: inst.diBox ? 15 : 1, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                    </div>
                    <span style={{ ...lbl, fontSize: "0.5rem", color: inst.diBox ? acc : muted2 }}>DI</span>
                  </label>
                  <button onClick={() => removeInst(sel.id, inst.id)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "1rem" }}>×</button>
                </div>
              ))}
              <button onClick={() => addInst(sel.id)} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: 4, color: muted, ...T, fontSize: "0.65rem", padding: "4px 12px", cursor: "pointer", marginTop: "0.25rem", marginBottom: "1rem" }}>
                + add instrument
              </button>

              <div style={{ borderTop: `1px solid ${border}`, paddingTop: "0.75rem" }}>
                <button onClick={() => removePos(sel.id)} style={{ background: "transparent", border: `1px solid rgba(248,113,113,0.3)`, borderRadius: 4, color: "#f87171", ...T, fontSize: "0.65rem", padding: "4px 12px", cursor: "pointer" }}>
                  Remove Position
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: surface, border: `1px dashed ${border}`, borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <p style={{ ...lbl, color: muted2 }}>Add a position above to get started</p>
            </div>
          )}

          {data.positions.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {data.positions.map(pos => (
                <button key={pos.id} onClick={() => setSelectedId(pos.id)} style={{ background: pos.id === selectedId ? `${acc}22` : "transparent", border: `1px solid ${pos.id === selectedId ? acc : border}`, borderRadius: 4, color: pos.id === selectedId ? acc : muted, ...T, fontSize: "0.65rem", padding: "4px 10px", cursor: "pointer" }}>
                  {pos.name || pos.label || "Position"}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Input List */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Input List</p>
          {data.inputs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={lbl}>CH</span>
              <span style={lbl}>Instrument / Source</span>
              <span style={lbl}>Preferred Mic / DI</span>
              <span />
            </div>
          )}
          {data.inputs.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.4rem", alignItems: "center" }}>
              <span style={{ ...lbl, color: acc, textAlign: "center" }}>{row.ch}</span>
              <input value={row.instrument} onChange={e => updateInput(i, "instrument", e.target.value)} placeholder="Kick drum, Lead vox…" style={inputStyle} />
              <input value={row.mic} onChange={e => updateInput(i, "mic", e.target.value)} placeholder="SM57, Beta 52A, DI box…" style={inputStyle} />
              <button onClick={() => removeInput(i)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
            </div>
          ))}
          <button onClick={addInput} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: 4, color: muted, ...T, fontSize: "0.7rem", padding: "6px 14px", cursor: "pointer", marginTop: "0.25rem" }}>
            + add input
          </button>
        </section>

        {/* Monitor Mixes */}
        {(data.monitorType === "wedge" || data.monitorType === "both") && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={sectionHead}>Monitor Mixes</p>
            {data.monitors.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <span style={lbl}>Mix</span>
                <span style={lbl}>Position / Who</span>
                <span style={lbl}>What they need</span>
                <span />
              </div>
            )}
            {data.monitors.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.4rem", alignItems: "center" }}>
                <span style={{ ...lbl, color: acc, textAlign: "center" }}>{m.mix}</span>
                <input value={m.position} onChange={e => updateMon(i, "position", e.target.value)} placeholder="Who's in this mix…" style={inputStyle} />
                <input value={m.notes} onChange={e => updateMon(i, "notes", e.target.value)} placeholder="Lead vox loud, kick, guitar blend…" style={inputStyle} />
                <button onClick={() => removeMon(i)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
              </div>
            ))}
            <button onClick={addMon} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: 4, color: muted, ...T, fontSize: "0.7rem", padding: "6px 14px", cursor: "pointer", marginTop: "0.25rem" }}>
              + add mix
            </button>
          </section>
        )}

        {/* Technical Requirements */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Technical Requirements</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            {([
              { label: "Stage width (minimum)", key: "stageWidth" as const, placeholder: "e.g. 20 ft" },
              { label: "Stage depth (minimum)", key: "stageDepth" as const, placeholder: "e.g. 16 ft" },
              { label: "Load-in time needed", key: "loadIn" as const, placeholder: "e.g. 2 hours before doors" },
              { label: "Soundcheck time needed", key: "soundcheck" as const, placeholder: "e.g. 1 hour" },
              { label: "PA system required", key: "paRequired" as const, placeholder: "e.g. Minimum 2kW per side" },
            ]).map(({ label, key, placeholder }) => (
              <div key={key}>
                <p style={{ ...lbl, marginBottom: "0.4rem" }}>{label}</p>
                <input value={data[key] as string} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {([
              { label: "Piano / keyboard required", key: "pianoRequired" as const },
              { label: "House engineer preferred", key: "houseEngineeer" as const },
            ]).map(({ label, key }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <div onClick={() => set(key, !data[key])} style={{ width: 36, height: 20, borderRadius: 10, position: "relative", background: data[key] ? acc : border2, transition: "background 0.2s", cursor: "pointer" }}>
                  <div style={{ position: "absolute", top: 2, left: data[key] ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </div>
                <span style={{ ...T, fontSize: "0.78rem", color: muted }}>{label}</span>
              </label>
            ))}
          </div>
          <div>
            <p style={{ ...lbl, marginBottom: "0.4rem" }}>Backline notes</p>
            <textarea value={data.backlineNotes} onChange={e => set("backlineNotes", e.target.value)} placeholder="Band carries own amps and drum hardware. House kit not required…" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </section>

        {/* Venue Tech Match */}
        <section style={{ marginBottom: "2rem" }}>
          <p style={sectionHead}>Venue Tech Match</p>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "20px 24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[
                { label: `${data.inputs.filter(r => r.instrument).length} inputs`, ok: data.inputs.filter(r => r.instrument).length > 0 },
                { label: `${data.monitors.filter(m => m.position).length} monitor mixes`, ok: data.monitors.filter(m => m.position).length > 0 },
                { label: data.stageWidth ? `${data.stageWidth} wide` : "Stage width — not set", ok: !!data.stageWidth },
                { label: data.paRequired ? `PA: ${data.paRequired}` : "PA requirement — not set", ok: !!data.paRequired },
                { label: data.pianoRequired ? "Piano required ⚠" : "No piano needed ✓", ok: !data.pianoRequired },
                { label: data.monitorType === "iem" ? "IEM — carrier needed" : data.monitorType === "wedge" ? "Wedge monitors" : "IEM + wedge", ok: true },
              ].map((chip, i) => (
                <span key={i} style={{ background: chip.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${chip.ok ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius: 20, padding: "4px 10px", ...T, fontSize: "0.68rem", color: chip.ok ? "#4ade80" : "#f87171" }}>
                  {chip.label}
                </span>
              ))}
            </div>
            <p style={{ ...T, fontSize: "0.7rem", color: muted2, marginTop: "1rem" }}>Fill in all fields for a complete venue tech match.</p>
          </div>
        </section>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: `1px solid ${border}` }}>
          <Link href={viewHref} style={{ background: acc, color: "#000", ...T, fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", padding: "10px 20px", borderRadius: 4 }}>
            View Stage Plot →
          </Link>
          <Link href={backHref} style={{ border: `1px solid ${border2}`, color: muted, ...T, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "9px 18px", borderRadius: 4 }}>
            ← Back to Studio
          </Link>
        </div>

      </div>
    </main>
  );
}
