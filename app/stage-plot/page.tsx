"use client";

import { useState, useEffect } from "react";
import { artist } from "@/lib/data";
import { resolveTokens } from "@/lib/genreTokens";
import BandTheme from "@/components/band/BandTheme";

// ─── Types ────────────────────────────────────────────────────────

type Col = "l2" | "l1" | "c" | "r1" | "r2";
type Row = "up" | "mid" | "down";
type InputType = "Vocal Mic" | "Instrument Mic" | "DI" | "Line" | "None";

interface PlotItem {
  id: string;
  label: string;
  performer: string;
  row: Row;
  col: Col;
  inputType: InputType;
  micStand: boolean;
  monitor: boolean;
  notes: string;
}

// ─── Constants ────────────────────────────────────────────────────

const COLS: Col[] = ["l2", "l1", "c", "r1", "r2"];
const ROWS: Row[] = ["up", "mid", "down"];
const COL_LABELS: Record<Col, string> = { l2: "Far Left", l1: "Left", c: "Center", r1: "Right", r2: "Far Right" };
const ROW_LABELS: Record<Row, string> = { up: "Upstage", mid: "Mid", down: "Downstage" };
const INPUT_TYPES: InputType[] = ["Vocal Mic", "Instrument Mic", "DI", "Line", "None"];

const STORAGE_KEY = "bandstack-stage-plot";

function uid() { return Math.random().toString(36).slice(2, 9); }

// Seed from artist members
function seedItems(): PlotItem[] {
  const positions: { row: Row; col: Col }[] = [
    { row: "mid",  col: "l1" },
    { row: "mid",  col: "r1" },
    { row: "up",   col: "l2" },
    { row: "up",   col: "r2" },
    { row: "mid",  col: "c"  },
  ];
  return artist.members.slice(0, 5).map((m, i) => ({
    id: uid(),
    label: m.role.split(",")[0].trim(),
    performer: m.name,
    row: positions[i]?.row ?? "mid",
    col: positions[i]?.col ?? "c",
    inputType: m.role.toLowerCase().includes("vocal") ? "Vocal Mic" : "DI",
    micStand: m.role.toLowerCase().includes("vocal"),
    monitor: true,
    notes: "",
  }));
}

// ─── Stage diagram ────────────────────────────────────────────────

const ITEM_COLORS: Record<InputType, string> = {
  "Vocal Mic":       "#c8922a",
  "Instrument Mic":  "#5eada8",
  "DI":              "#8aaa5c",
  "Line":            "#7b68ee",
  "None":            "#555",
};

function StageGrid({
  items,
  selected,
  onSelect,
  onCellClick,
}: {
  items: PlotItem[];
  selected: string | null;
  onSelect: (id: string) => void;
  onCellClick: (row: Row, col: Col) => void;
}) {
  const itemAt = (row: Row, col: Col) => items.find((i) => i.row === row && i.col === col);

  return (
    <div style={{ userSelect: "none" }}>
      {/* Audience label */}
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--muted2)",
        textAlign: "center",
        marginBottom: "0.5rem",
      }}>
        ← Audience →
      </p>

      {/* Stage box */}
      <div style={{
        border: "2px solid var(--border2)",
        borderRadius: "0.75rem 0.75rem 0 0",
        borderBottom: "none",
        background: "var(--bg3)",
        padding: "1rem 0.5rem 0",
        position: "relative",
      }}>
        {/* Upstage label */}
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.45rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted2)",
          textAlign: "center",
          marginBottom: "0.75rem",
        }}>
          Upstage
        </p>

        {ROWS.map((row) => (
          <div key={row} style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}>
            {COLS.map((col) => {
              const item = itemAt(row, col);
              const isSelected = item?.id === selected;
              return (
                <div
                  key={col}
                  onClick={() => item ? onSelect(item.id) : onCellClick(row, col)}
                  style={{
                    height: 72,
                    borderRadius: "0.5rem",
                    border: isSelected
                      ? `2px solid var(--accent)`
                      : item
                      ? `2px solid ${ITEM_COLORS[item.inputType]}44`
                      : "1px dashed var(--border)",
                    background: item
                      ? `${ITEM_COLORS[item.inputType]}18`
                      : "rgba(255,255,255,0.02)",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    padding: "4px",
                    position: "relative",
                  }}
                >
                  {item ? (
                    <>
                      {/* Color dot */}
                      <div style={{
                        width: 8, height: 8,
                        borderRadius: "50%",
                        background: ITEM_COLORS[item.inputType],
                        marginBottom: "4px",
                        flexShrink: 0,
                      }} />
                      <p style={{
                        fontFamily: "monospace",
                        fontSize: "0.5rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: isSelected ? "var(--accent-warm)" : "var(--text)",
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}>
                        {item.label}
                      </p>
                      <p style={{
                        fontFamily: "monospace",
                        fontSize: "0.42rem",
                        color: "var(--muted2)",
                        textAlign: "center",
                        lineHeight: 1.2,
                        marginTop: "2px",
                      }}>
                        {item.performer.split(" ")[0]}
                      </p>
                    </>
                  ) : (
                    <span style={{ fontSize: "1rem", color: "var(--border2)" }}>+</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Downstage label */}
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.45rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted2)",
          textAlign: "center",
          marginTop: "0.25rem",
          marginBottom: "0.5rem",
        }}>
          Downstage
        </p>
      </div>

      {/* Stage lip */}
      <div style={{
        height: 12,
        background: "var(--bg2)",
        border: "2px solid var(--border2)",
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
      }} />

      {/* Legend */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const, marginTop: "1rem" }}>
        {Object.entries(ITEM_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)" }}>
              {type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Item form ────────────────────────────────────────────────────

function ItemForm({
  item,
  onChange,
  onDelete,
  onMoveToCell,
  pendingCell,
}: {
  item: PlotItem;
  onChange: (updated: PlotItem) => void;
  onDelete: () => void;
  onMoveToCell: (() => void) | null;
  pendingCell: { row: Row; col: Col } | null;
}) {
  const field = (label: string, content: React.ReactNode) => (
    <div style={{ marginBottom: "0.875rem" }}>
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--muted2)",
        marginBottom: "4px",
      }}>
        {label}
      </p>
      {content}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border2)",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "var(--body-font)",
    fontSize: "0.85rem",
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--border2)",
      borderRadius: "0.75rem",
      padding: "1.25rem",
    }}>
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--accent)",
        marginBottom: "1rem",
      }}>
        Edit — {item.performer}
      </p>

      {field("Label", (
        <input
          style={inputStyle}
          value={item.label}
          onChange={(e) => onChange({ ...item, label: e.target.value })}
        />
      ))}

      {field("Performer", (
        <input
          style={inputStyle}
          value={item.performer}
          onChange={(e) => onChange({ ...item, performer: e.target.value })}
        />
      ))}

      {field("Input Type", (
        <select
          style={{ ...inputStyle, cursor: "pointer" }}
          value={item.inputType}
          onChange={(e) => onChange({ ...item, inputType: e.target.value as InputType })}
        >
          {INPUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      ))}

      {field("Position", (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={item.row}
            onChange={(e) => onChange({ ...item, row: e.target.value as Row })}
          >
            {ROWS.map((r) => <option key={r} value={r}>{ROW_LABELS[r]}</option>)}
          </select>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={item.col}
            onChange={(e) => onChange({ ...item, col: e.target.value as Col })}
          >
            {COLS.map((c) => <option key={c} value={c}>{COL_LABELS[c]}</option>)}
          </select>
        </div>
      ))}

      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "0.875rem" }}>
        {[
          { label: "Mic Stand", key: "micStand" as const },
          { label: "Monitor Send", key: "monitor" as const },
        ].map(({ label, key }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={item[key]}
              onChange={(e) => onChange({ ...item, [key]: e.target.checked })}
              style={{ accentColor: "var(--accent)", width: 14, height: 14 }}
            />
            <span style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      {field("Notes", (
        <input
          style={inputStyle}
          placeholder="e.g. stereo DI, 57 on cab..."
          value={item.notes}
          onChange={(e) => onChange({ ...item, notes: e.target.value })}
        />
      ))}

      {/* Move to clicked cell */}
      {pendingCell && (
        <button
          onClick={onMoveToCell ?? undefined}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid var(--accent)",
            background: "var(--accent-dim)",
            color: "var(--accent)",
            fontFamily: "monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            marginBottom: "0.5rem",
          }}
        >
          Move to {ROW_LABELS[pendingCell.row]} {COL_LABELS[pendingCell.col]}
        </button>
      )}

      <button
        onClick={onDelete}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid rgba(217,92,92,0.3)",
          background: "rgba(217,92,92,0.08)",
          color: "#d95c5c",
          fontFamily: "monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          marginTop: "0.5rem",
        }}
      >
        Remove
      </button>
    </div>
  );
}

// ─── Input list ───────────────────────────────────────────────────

function InputList({ items }: { items: PlotItem[] }) {
  const withInput = items.filter((i) => i.inputType !== "None");

  if (withInput.length === 0) {
    return (
      <p style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "var(--muted2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        No inputs defined yet.
      </p>
    );
  }

  const thStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "0.5rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--muted2)",
    padding: "8px 12px",
    textAlign: "left",
    background: "var(--bg3)",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    fontFamily: "var(--body-font)",
    fontSize: "0.82rem",
    fontWeight: 300,
    color: "var(--text)",
    padding: "10px 12px",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--border)", borderRadius: "0.5rem", overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Performer</th>
            <th style={thStyle}>Label</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Stand</th>
            <th style={thStyle}>Monitor</th>
            <th style={thStyle}>Position</th>
            <th style={thStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {withInput.map((item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? "var(--bg2)" : "var(--bg3)" }}>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.62rem", color: "var(--accent)", width: 36 }}>
                {String(i + 1).padStart(2, "0")}
              </td>
              <td style={tdStyle}>{item.performer}</td>
              <td style={tdStyle}>{item.label}</td>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.62rem" }}>
                <span style={{
                  color: ITEM_COLORS[item.inputType],
                  background: `${ITEM_COLORS[item.inputType]}18`,
                  border: `1px solid ${ITEM_COLORS[item.inputType]}44`,
                  borderRadius: "9999px",
                  padding: "2px 8px",
                  whiteSpace: "nowrap" as const,
                }}>
                  {item.inputType}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>{item.micStand ? "✓" : "—"}</td>
              <td style={{ ...tdStyle, textAlign: "center" }}>{item.monitor ? "✓" : "—"}</td>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.6rem", color: "var(--muted2)" }}>
                {ROW_LABELS[item.row]} {COL_LABELS[item.col]}
              </td>
              <td style={{ ...tdStyle, color: "var(--muted)", fontStyle: item.notes ? "normal" : "italic" }}>
                {item.notes || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function StagePlotPage() {
  const tokens = resolveTokens(artist.genre);
  const [items, setItems] = useState<PlotItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingCell, setPendingCell] = useState<{ row: Row; col: Col } | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setItems(saved ? JSON.parse(saved) : seedItems());
    } catch {
      setItems(seedItems());
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, loaded]);

  const selectedItem = items.find((i) => i.id === selected) ?? null;

  const handleCellClick = (row: Row, col: Col) => {
    if (selected) {
      setPendingCell({ row, col });
    } else {
      // Add new item at this position if empty
      const occupied = items.some((i) => i.row === row && i.col === col);
      if (!occupied) {
        const newItem: PlotItem = {
          id: uid(),
          label: "Instrument",
          performer: "Performer",
          row, col,
          inputType: "DI",
          micStand: false,
          monitor: true,
          notes: "",
        };
        setItems([...items, newItem]);
        setSelected(newItem.id);
      }
    }
  };

  const handleMoveToCell = () => {
    if (!selected || !pendingCell) return;
    // Check if destination is occupied by another item
    const occupiedBy = items.find((i) => i.row === pendingCell.row && i.col === pendingCell.col && i.id !== selected);
    if (occupiedBy) return; // Don't allow moving to occupied cell
    setItems(items.map((i) => i.id === selected ? { ...i, ...pendingCell } : i));
    setPendingCell(null);
  };

  const handleChange = (updated: PlotItem) => {
    setItems(items.map((i) => i.id === updated.id ? updated : i));
  };

  const handleDelete = () => {
    setItems(items.filter((i) => i.id !== selected));
    setSelected(null);
    setPendingCell(null);
  };

  const handleReset = () => {
    if (confirm("Reset to default layout from artist data?")) {
      setItems(seedItems());
      setSelected(null);
      setPendingCell(null);
    }
  };

  if (!loaded) return null;

  return (
    <>
      <BandTheme tokens={tokens} />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "var(--body-font)" }}>

        {/* Top bar */}
        <div style={{
          background: "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: "0.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <a href="/band" style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted2)", textDecoration: "none" }}>
              ← {artist.name}
            </a>
            <span style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)" }}>
              Stage Plot
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={handleReset} style={{
              fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--muted2)", background: "transparent", border: "1px solid var(--border)",
              borderRadius: "9999px", padding: "6px 14px", cursor: "pointer",
            }}>
              Reset
            </button>
            <button onClick={() => window.print()} style={{
              fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#000", background: "var(--accent)", border: "none",
              borderRadius: "9999px", padding: "6px 14px", cursor: "pointer",
            }}>
              Print / PDF
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 80px" }}>

          {/* Instruction */}
          <p style={{
            fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1.5rem",
          }}>
            Click an item to select · Click an empty cell to add · Select + click empty cell to move
          </p>

          {/* Main layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}>

            {/* Stage diagram */}
            <div>
              <StageGrid
                items={items}
                selected={selected}
                onSelect={(id) => {
                  setSelected(id === selected ? null : id);
                  setPendingCell(null);
                }}
                onCellClick={handleCellClick}
              />
            </div>

            {/* Right panel — edit or empty state */}
            <div>
              {selectedItem ? (
                <ItemForm
                  item={selectedItem}
                  onChange={handleChange}
                  onDelete={handleDelete}
                  onMoveToCell={pendingCell ? handleMoveToCell : null}
                  pendingCell={pendingCell}
                />
              ) : (
                <div style={{
                  background: "var(--bg2)",
                  border: "1px dashed var(--border2)",
                  borderRadius: "0.75rem",
                  padding: "2rem",
                  textAlign: "center",
                }}>
                  <p style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted2)" }}>
                    Select an item to edit
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted2)", marginTop: "0.5rem" }}>
                    or click an empty cell to add one
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Input list */}
          <div style={{ marginTop: "3rem" }}>
            <p style={{
              fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--accent)",
              marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)",
            }}>
              Input List — {items.filter((i) => i.inputType !== "None").length} channels
            </p>
            <InputList items={items} />
          </div>

        </div>
      </div>
    </>
  );
}
