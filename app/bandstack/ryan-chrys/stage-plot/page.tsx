"use client";

import Link from "next/link";
import { resolveTokens, applyMode } from "@/lib/genreTokens";
import { DEMO_PROFILE } from "@/lib/bandProfile";
import { useState, useEffect } from "react";
import { useMobile } from "@/lib/useMobile";

const PROFILE_KEY = "bandstack-profile-v1";
const PLOT_KEY = "bandstack-stage-plot-v1";

interface PlotData {
  positions?: { name: string; role: string; side: string }[];
  inputs?: { ch: number; instrument: string; mic: string }[];
  monitors?: { mix: number; position: string; notes: string }[];
  stageWidth?: string; stageDepth?: string; loadIn?: string; soundcheck?: string;
  paRequired?: string; pianoRequired?: boolean; backlineNotes?: string;
  houseEngineeer?: boolean; monitorType?: string;
}

export default function StagePlotPage() {
  const isMobile = useMobile();
  const [colorMode, setColorMode] = useState<"dark"|"light">("dark");
  const [genre, setGenre] = useState(DEMO_PROFILE.genre ?? "");
  const [artistName, setArtistName] = useState(DEMO_PROFILE.name ?? "");
  const [artistOrigin, setArtistOrigin] = useState(DEMO_PROFILE.origin ?? "");
  const [memberCount, setMemberCount] = useState(DEMO_PROFILE.members?.length ?? 0);
  const [bookingEmail, setBookingEmail] = useState(DEMO_PROFILE.bookingEmail ?? "");
  const [plot, setPlot] = useState<PlotData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.colorMode) setColorMode(p.colorMode);
        if (p.genre)   setGenre(p.genre);
        if (p.name)    setArtistName(p.name);
        if (p.origin)  setArtistOrigin(p.origin);
        if (p.members) setMemberCount(p.members.length);
        if (p.bookingEmail) setBookingEmail(p.bookingEmail);
      }
      const rawPlot = localStorage.getItem(PLOT_KEY);
      if (rawPlot) setPlot(JSON.parse(rawPlot) as PlotData);
    } catch {}
  }, []);

  const tokens = applyMode(resolveTokens(genre ? [genre] : []), colorMode);
  const acc = tokens.accent;
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.82rem", color: tokens.text, fontWeight: 300, lineHeight: 1.7 };
  const divider = { borderBottom: `1px solid ${tokens.border}` } as React.CSSProperties;
  const sectionHead: React.CSSProperties = { ...lbl, color: tokens.muted2, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${tokens.border}` };

  const inputs = (plot?.inputs?.filter(r => r.instrument) ?? []).length > 0
    ? plot!.inputs!.filter(r => r.instrument)
    : [
      { ch: 1,  instrument: "Kick Drum",           mic: "AKG D112 / Shure Beta 52A" },
      { ch: 2,  instrument: "Snare (top)",          mic: "Shure SM57" },
      { ch: 3,  instrument: "Hi-Hat",               mic: "AKG C451 / SM81" },
      { ch: 4,  instrument: "Rack Tom",             mic: "Sennheiser e604" },
      { ch: 5,  instrument: "Floor Tom",            mic: "Sennheiser e604" },
      { ch: 6,  instrument: "Overhead L",           mic: "Condenser pair" },
      { ch: 7,  instrument: "Overhead R",           mic: "Condenser pair" },
      { ch: 8,  instrument: "Bass DI",              mic: "DI Box (passive)" },
      { ch: 9,  instrument: "Guitar 1 (Ryan)",      mic: "Shure SM57 on cab" },
      { ch: 10, instrument: "Guitar 2",             mic: "Shure SM57 on cab" },
      { ch: 11, instrument: "Keys / Acoustic DI L", mic: "DI Box (stereo)" },
      { ch: 12, instrument: "Keys / Acoustic DI R", mic: "DI Box (stereo)" },
      { ch: 13, instrument: "Lead Vox — Ryan",      mic: "Shure SM58 / Beta 58A" },
      { ch: 14, instrument: "Lead Vox — Susan",     mic: "Shure SM58 / Beta 58A" },
      { ch: 15, instrument: "BGV / Aux Vox",        mic: "Shure SM58" },
    ];

  const monitors = (plot?.monitors?.filter(m => m.position) ?? []).length > 0
    ? plot!.monitors!.filter(m => m.position)
    : [
      { mix: 1, position: "Drums (front fill)", notes: "Kick, snare, guitars, both vocals" },
      { mix: 2, position: "Bass (wedge)", notes: "Bass, kick, Ryan vox" },
      { mix: 3, position: "Guitar 1 / Ryan (wedge)", notes: "Ryan vox, Susan vox, guitar, kick" },
      { mix: 4, position: "Guitar 2 / Keys (wedge)", notes: "Both vocals, guitar blend" },
      { mix: 5, position: "Susan (wedge)", notes: "Susan vox, Ryan vox, piano/acoustic" },
    ];

  const requirements = [
    { label: "PA System", value: plot?.paRequired || "Minimum 2kW mains per side — 4-piece band, loud stage volume" },
    { label: "Monitor Sends", value: `${monitors.length} independent monitor mixes` },
    { label: "Stage Size", value: plot?.stageWidth ? `${plot.stageWidth} wide × ${plot.stageDepth || "—"} deep` : "Minimum 20' wide × 16' deep" },
    { label: "Load-in Time", value: plot?.loadIn || "2 hours before doors" },
    { label: "Soundcheck", value: plot?.soundcheck || "1 hour" },
    { label: "Backline", value: plot?.backlineNotes || "Band carries own amps and drum hardware — house kit not required" },
    { label: "House Engineer", value: plot?.houseEngineeer === false ? "Not required" : "Preferred" },
    ...(plot?.pianoRequired ? [{ label: "Piano", value: "Required — stage piano or grand" }] : []),
  ];

  return (
    <main style={{ background: tokens.bg, minHeight: "100vh", color: tokens.text, ...T }}>

      {/* Back nav */}
      <div style={{ padding: "16px 32px", borderBottom: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/bandstack/ryan-chrys" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>← {artistName}</Link>
        <span style={{ ...lbl, color: acc }}>Stage Plot & Tech Rider</span>
        <Link href="/bandstack/ryan-chrys/stage-plot/edit" style={{ ...lbl, color: "#000", background: acc, borderRadius: 4, padding: "4px 12px", textDecoration: "none" }}>Edit →</Link>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "24px 16px 48px" : "32px 32px 64px" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ ...T, fontWeight: 700, fontSize: "1.6rem", color: tokens.text, margin: "0 0 0.3rem" }}>{artistName}</h1>
          <p style={{ ...body, color: tokens.muted, fontSize: "0.75rem" }}>
            {genre} · {artistOrigin} · {memberCount}-piece band
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {bookingEmail && <a href={`mailto:${bookingEmail}`} style={{ ...lbl, color: acc, textDecoration: "none" }}>Booking: {bookingEmail}</a>}
          </div>
        </div>

        {/* Stage diagram */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={sectionHead}>Stage Layout</p>
          <div style={{
            background: isLight(colorMode) ? "#f0f0f0" : "#0f0f0f",
            border: `1px solid ${tokens.border}`,
            borderRadius: 8, padding: "32px 24px", position: "relative",
          }}>
            {/* Audience label */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span style={{ ...lbl, color: tokens.muted2 }}>← Audience →</span>
            </div>

            {/* Stage positions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", marginBottom: "1.5rem" }}>
              {(plot?.positions && plot.positions.length > 0
                ? plot.positions.map(p => ({ pos: p.side, label: `${p.name || "—"}\n${p.role || ""}`, icon: "🎤" }))
                : [
                  { pos: "DSL", label: "Guitar 2\nKeys", icon: "🎸" },
                  { pos: "DSL-C", label: "Bass", icon: "🎸" },
                  { pos: "CS", label: "Drums", icon: "🥁" },
                  { pos: "DSR-C", label: "Ryan Chrys\nLead Vox + Guitar", icon: "🎤" },
                  { pos: "DSR", label: "Susan Phelan\nLead Vox", icon: "🎤" },
                ]
              ).map((p, idx) => (
                <div key={idx} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    background: isLight(colorMode) ? "#e0e0e0" : "#1a1a1a",
                    border: `1px solid ${p.pos === "CS" ? acc : tokens.border}`,
                    borderRadius: 6, padding: "12px 6px", marginBottom: "0.5rem",
                    minHeight: p.pos === "CS" ? 72 : 52,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>{p.icon}</span>
                  </div>
                  <p style={{ ...lbl, lineHeight: 1.5, whiteSpace: "pre-line" }}>{p.label}</p>
                  <p style={{ ...lbl, color: tokens.muted2, fontSize: "0.5rem", marginTop: "0.15rem" }}>{p.pos}</p>
                </div>
              ))}
            </div>

            {/* Stage edge */}
            <div style={{ borderTop: `2px solid ${tokens.border}`, paddingTop: "0.75rem", textAlign: "center" }}>
              <span style={{ ...lbl, color: tokens.muted2 }}>Stage Edge</span>
            </div>

            {/* Monitor positions */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
              {["Mon 5", "Mon 4", "Mon 1", "Mon 3", "Mon 2"].map((m) => (
                <div key={m} style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ ...lbl, color: tokens.muted2, fontSize: "0.48rem" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

          {/* Input list */}
          <div>
            <p style={sectionHead}>Input List</p>
            {inputs.map((inp) => (
              <div key={inp.ch} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "0.75rem", padding: "7px 0", ...divider, alignItems: "start" }}>
                <span style={{ ...lbl, color: acc }}>{inp.ch}</span>
                <div>
                  <p style={{ ...body, fontSize: "0.78rem", fontWeight: 400 }}>{inp.instrument}</p>
                  <p style={{ ...lbl, marginTop: "0.1rem" }}>{inp.mic}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Monitors + Requirements */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            <div>
              <p style={sectionHead}>Monitor Mixes</p>
              {monitors.map((m) => (
                <div key={m.mix} style={{ padding: "7px 0", ...divider }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
                    <span style={{ ...lbl, color: acc, flexShrink: 0 }}>Mix {m.mix}</span>
                    <p style={{ ...body, fontSize: "0.78rem", fontWeight: 400 }}>{m.position}</p>
                  </div>
                  <p style={{ ...lbl, marginTop: "0.2rem", lineHeight: 1.5 }}>{m.notes}</p>
                </div>
              ))}
            </div>

            <div>
              <p style={sectionHead}>Technical Requirements</p>
              {requirements.map((r) => (
                <div key={r.label} style={{ padding: "7px 0", ...divider }}>
                  <p style={{ ...lbl, marginBottom: "0.2rem" }}>{r.label}</p>
                  <p style={{ ...body, fontSize: "0.76rem", color: tokens.muted }}>{r.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p style={sectionHead}>Contact</p>
              {bookingEmail && <a href={`mailto:${bookingEmail}`} style={{ ...body, fontSize: "0.78rem", color: acc, textDecoration: "none" }}>{bookingEmail}</a>}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function isLight(mode: "dark"|"light") { return mode === "light"; }
