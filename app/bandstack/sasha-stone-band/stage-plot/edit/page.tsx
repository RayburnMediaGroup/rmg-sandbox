"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PLOT_KEY = "bandstack-sasha-stone-band-plot-v1";

interface InputRow { ch: number; instrument: string; mic: string; }
interface MonitorMix { mix: number; position: string; notes: string; }
interface StagePosition { id: string; label: string; name: string; role: string; side: "DSL" | "DSL-C" | "CS" | "DSR-C" | "DSR"; }
interface StagePlotData {
  performers: number;
  monitorType: "wedge" | "iem" | "both";
  positions: StagePosition[];
  inputs: InputRow[];
  monitors: MonitorMix[];
  stageWidth: string;
  stageDepth: string;
  loadIn: string;
  soundcheck: string;
  paRequired: string;
  pianoRequired: boolean;
  backlineNotes: string;
  houseEngineeer: boolean;
  tourMarkets: string;
}

const BLANK: StagePlotData = {
  performers: 4,
  monitorType: "wedge",
  positions: [
    { id: "1", label: "Position 1", name: "", role: "", side: "DSL" },
    { id: "2", label: "Position 2", name: "", role: "", side: "DSL-C" },
    { id: "3", label: "Position 3 (Drums)", name: "", role: "", side: "CS" },
    { id: "4", label: "Position 4", name: "", role: "", side: "DSR-C" },
    { id: "5", label: "Position 5", name: "", role: "", side: "DSR" },
  ],
  inputs: [
    { ch: 1, instrument: "", mic: "" },
    { ch: 2, instrument: "", mic: "" },
    { ch: 3, instrument: "", mic: "" },
    { ch: 4, instrument: "", mic: "" },
  ],
  monitors: [
    { mix: 1, position: "", notes: "" },
    { mix: 2, position: "", notes: "" },
  ],
  stageWidth: "",
  stageDepth: "",
  loadIn: "2 hours before doors",
  soundcheck: "1 hour",
  paRequired: "",
  pianoRequired: false,
  backlineNotes: "",
  houseEngineeer: true,
  tourMarkets: "",
};

const SIDES: StagePosition["side"][] = ["DSL", "DSL-C", "CS", "DSR-C", "DSR"];
const SIDE_LABELS: Record<string, string> = { DSL: "Far Left", "DSL-C": "Left-Center", CS: "Center (Drums)", "DSR-C": "Right-Center", DSR: "Far Right" };

export default function StagePlotEditPage() {
  const [data, setData] = useState<StagePlotData>(BLANK);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLOT_KEY);
      if (raw) setData(JSON.parse(raw) as StagePlotData);
    } catch {}
  }, []);

  const save = (next: StagePlotData) => {
    setData(next);
    localStorage.setItem(PLOT_KEY, JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const set = <K extends keyof StagePlotData>(k: K, v: StagePlotData[K]) => save({ ...data, [k]: v });

  const updatePos = (id: string, field: keyof StagePosition, val: string) =>
    save({ ...data, positions: data.positions.map(p => p.id === id ? { ...p, [field]: val } : p) });

  const addPos = () => save({
    ...data,
    positions: [...data.positions, { id: Date.now().toString(), label: `Position ${data.positions.length + 1}`, name: "", role: "", side: "DSL" }],
  });
  const removePos = (id: string) => save({ ...data, positions: data.positions.filter(p => p.id !== id) });

  const updateInput = (i: number, field: keyof InputRow, val: string) =>
    save({ ...data, inputs: data.inputs.map((r, idx) => idx === i ? { ...r, [field]: val } : r) });

  const addInput = () => save({ ...data, inputs: [...data.inputs, { ch: data.inputs.length + 1, instrument: "", mic: "" }] });
  const removeInput = (i: number) => save({ ...data, inputs: data.inputs.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, ch: idx + 1 })) });

  const updateMon = (i: number, field: keyof MonitorMix, val: string) =>
    save({ ...data, monitors: data.monitors.map((m, idx) => idx === i ? { ...m, [field]: val } : m) });

  const addMon = () => save({ ...data, monitors: [...data.monitors, { mix: data.monitors.length + 1, position: "", notes: "" }] });
  const removeMon = (i: number) => save({ ...data, monitors: data.monitors.filter((_, idx) => idx !== i).map((m, idx) => ({ ...m, mix: idx + 1 })) });

  // ── Styles ──
  const bg = "#0a0a0a";
  const surface = "#111";
  const border = "rgba(255,255,255,0.08)";
  const border2 = "rgba(255,255,255,0.14)";
  const text = "#e0e0e0";
  const muted = "rgba(224,224,224,0.45)";
  const muted2 = "rgba(224,224,224,0.25)";
  const acc = "#f59e0b";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: muted2, fontWeight: 500 };
  const sectionHead: React.CSSProperties = { ...lbl, color: muted2, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${border}` };
  const inputStyle: React.CSSProperties = {
    background: surface, border: `1px solid ${border}`, borderRadius: 4, padding: "7px 10px",
    color: text, ...T, fontSize: "0.82rem", fontWeight: 300, width: "100%", outline: "none",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "none" };

  return (
    <main style={{ background: bg, minHeight: "100vh", color: text, ...T }}>

      {/* Nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${border}`, padding: "0 32px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/band/studio" style={{ ...lbl, color: muted, textDecoration: "none" }}>← Studio</Link>
        <span style={{ ...lbl, color: acc }}>Stage Plot Builder</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {saved && <span style={{ ...lbl, color: acc }}>saved.</span>}
          <Link href="/bandstack/sasha-stone-band/stage-plot" style={{ ...lbl, color: muted, textDecoration: "none" }}>View →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* ── STAGE SETUP ── */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Live Setup</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Number of performers</p>
              <input type="number" min={1} max={20} value={data.performers} onChange={e => set("performers", parseInt(e.target.value) || 1)} style={{ ...inputStyle, width: 80 }} />
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Monitor type</p>
              <select value={data.monitorType} onChange={e => set("monitorType", e.target.value as StagePlotData["monitorType"])} style={{ ...selectStyle, width: "100%" }}>
                <option value="wedge">Wedge monitors</option>
                <option value="iem">IEM (in-ear)</option>
                <option value="both">Both (IEM + wedge)</option>
              </select>
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Touring markets</p>
              <input value={data.tourMarkets} onChange={e => set("tourMarkets", e.target.value)} placeholder="e.g. CO, WY, NM, TX" style={inputStyle} />
            </div>
          </div>
        </section>

        {/* ── STAGE POSITIONS ── */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Stage Positions</p>
          <p style={{ ...lbl, color: muted, marginBottom: "1rem", fontSize: "0.7rem" }}>Left = stage left (audience right) · Right = stage right (audience left)</p>

          {/* Stage diagram preview */}
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "20px 16px", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "0.75rem" }}>
              {SIDES.map(side => {
                const pos = data.positions.find(p => p.side === side);
                return (
                  <div key={side} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      background: "#1a1a1a", border: `1px solid ${pos?.name ? acc : border}`,
                      borderRadius: 6, padding: "8px 4px", minHeight: side === "CS" ? 56 : 44,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "0.4rem",
                    }}>
                      {pos?.name
                        ? <p style={{ ...T, fontSize: "0.62rem", color: text, fontWeight: 400, lineHeight: 1.3 }}>{pos.name.split(" ")[0]}</p>
                        : <p style={{ ...lbl, color: border2, fontSize: "0.48rem" }}>empty</p>
                      }
                    </div>
                    <p style={{ ...lbl, fontSize: "0.48rem" }}>{SIDE_LABELS[side]}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: "0.5rem", textAlign: "center" }}>
              <span style={{ ...lbl, fontSize: "0.5rem" }}>Stage Edge · Audience →</span>
            </div>
          </div>

          {/* Position rows */}
          {data.positions.map((pos) => (
            <div key={pos.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px 32px", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "center" }}>
              <input value={pos.name} onChange={e => updatePos(pos.id, "name", e.target.value)} placeholder="Name (e.g. Ryan Chrys)" style={inputStyle} />
              <input value={pos.role} onChange={e => updatePos(pos.id, "role", e.target.value)} placeholder="Instrument / Role" style={inputStyle} />
              <select value={pos.side} onChange={e => updatePos(pos.id, "side", e.target.value as StagePosition["side"])} style={selectStyle}>
                {SIDES.map(s => <option key={s} value={s}>{SIDE_LABELS[s]}</option>)}
              </select>
              <button onClick={() => removePos(pos.id)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.9rem", padding: "0 4px" }}>×</button>
            </div>
          ))}
          <button onClick={addPos} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: 4, color: muted, ...T, fontSize: "0.7rem", padding: "6px 14px", cursor: "pointer", marginTop: "0.25rem" }}>+ add position</button>
        </section>

        {/* ── INPUT LIST ── */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Input List</p>
          <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span style={lbl}>CH</span><span style={lbl}>Instrument / Source</span><span style={lbl}>Preferred Mic / DI</span><span />
          </div>
          {data.inputs.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.4rem", alignItems: "center" }}>
              <span style={{ ...lbl, color: acc, textAlign: "center" }}>{row.ch}</span>
              <input value={row.instrument} onChange={e => updateInput(i, "instrument", e.target.value)} placeholder="Kick drum, Lead vox…" style={inputStyle} />
              <input value={row.mic} onChange={e => updateInput(i, "mic", e.target.value)} placeholder="SM57, Beta 52A, DI box…" style={inputStyle} />
              <button onClick={() => removeInput(i)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
            </div>
          ))}
          <button onClick={addInput} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: 4, color: muted, ...T, fontSize: "0.7rem", padding: "6px 14px", cursor: "pointer", marginTop: "0.25rem" }}>+ add input</button>
        </section>

        {/* ── MONITOR MIXES ── */}
        {(data.monitorType === "wedge" || data.monitorType === "both") && (
          <section style={{ marginBottom: "3rem" }}>
            <p style={sectionHead}>Monitor Mixes</p>
            <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={lbl}>Mix</span><span style={lbl}>Position / Who</span><span style={lbl}>What they need</span><span />
            </div>
            {data.monitors.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 32px", gap: "0.6rem", marginBottom: "0.4rem", alignItems: "center" }}>
                <span style={{ ...lbl, color: acc, textAlign: "center" }}>{m.mix}</span>
                <input value={m.position} onChange={e => updateMon(i, "position", e.target.value)} placeholder="Ryan (wedge), Drums (front fill)…" style={inputStyle} />
                <input value={m.notes} onChange={e => updateMon(i, "notes", e.target.value)} placeholder="Lead vox loud, kick, guitar blend…" style={inputStyle} />
                <button onClick={() => removeMon(i)} style={{ background: "transparent", border: "none", color: muted2, cursor: "pointer", fontSize: "0.9rem" }}>×</button>
              </div>
            ))}
            <button onClick={addMon} style={{ background: "transparent", border: `1px dashed ${border2}`, borderRadius: 4, color: muted, ...T, fontSize: "0.7rem", padding: "6px 14px", cursor: "pointer", marginTop: "0.25rem" }}>+ add mix</button>
          </section>
        )}

        {/* ── TECH REQUIREMENTS ── */}
        <section style={{ marginBottom: "3rem" }}>
          <p style={sectionHead}>Technical Requirements</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Stage width (minimum)</p>
              <input value={data.stageWidth} onChange={e => set("stageWidth", e.target.value)} placeholder="e.g. 20 ft" style={inputStyle} />
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Stage depth (minimum)</p>
              <input value={data.stageDepth} onChange={e => set("stageDepth", e.target.value)} placeholder="e.g. 16 ft" style={inputStyle} />
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Load-in time needed</p>
              <input value={data.loadIn} onChange={e => set("loadIn", e.target.value)} placeholder="e.g. 2 hours before doors" style={inputStyle} />
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Soundcheck time needed</p>
              <input value={data.soundcheck} onChange={e => set("soundcheck", e.target.value)} placeholder="e.g. 1 hour" style={inputStyle} />
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>PA system required</p>
              <input value={data.paRequired} onChange={e => set("paRequired", e.target.value)} placeholder="e.g. Minimum 2kW per side" style={inputStyle} />
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {([
              { label: "Piano / keyboard required", key: "pianoRequired" },
              { label: "House engineer preferred", key: "houseEngineeer" },
            ] as { label: string; key: "pianoRequired" | "houseEngineeer" }[]).map(({ label, key }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <div onClick={() => set(key, !data[key])} style={{
                  width: 36, height: 20, borderRadius: 10, position: "relative",
                  background: data[key] ? acc : border2, transition: "background 0.2s", cursor: "pointer",
                }}>
                  <div style={{
                    position: "absolute", top: 2, left: data[key] ? 18 : 2,
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    transition: "left 0.2s",
                  }} />
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

        {/* ── VENUE TECH MATCH PREVIEW ── */}
        <section style={{ marginBottom: "2rem" }}>
          <p style={sectionHead}>Venue Tech Match — What venues will see</p>
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
                <span key={i} style={{
                  background: chip.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                  border: `1px solid ${chip.ok ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                  borderRadius: 20, padding: "4px 10px",
                  ...T, fontSize: "0.68rem", color: chip.ok ? "#4ade80" : "#f87171",
                }}>{chip.label}</span>
              ))}
            </div>
            <p style={{ ...T, fontSize: "0.7rem", color: muted2, marginTop: "1rem" }}>
              This summary chip bar is what venues see when their tech match runs against your plot. Fill in all fields for a complete match.
            </p>
          </div>
        </section>

        {/* Save + view */}
        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: `1px solid ${border}` }}>
          <Link href="/bandstack/sasha-stone-band/stage-plot" style={{ background: acc, color: "#000", ...T, fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", padding: "10px 20px", borderRadius: 4 }}>
            View Stage Plot →
          </Link>
          <Link href="/band/studio" style={{ border: `1px solid ${border2}`, color: muted, ...T, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "9px 18px", borderRadius: 4 }}>
            ← Back to Studio
          </Link>
        </div>

      </div>
    </main>
  );
}
