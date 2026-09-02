"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onSave: (val: string) => void;
  multiline?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  accentColor?: string;
}

export default function EditField({ value, onSave, multiline, placeholder, style, accentColor = "#c4581e" }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed !== value) onSave(trimmed);
    setEditing(false);
  }

  const baseInput: React.CSSProperties = {
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#111",
    border: `1px solid ${accentColor}`,
    borderRadius: 4,
    color: "#d8d8d8",
    padding: "4px 8px",
    outline: "none",
    width: "100%",
    resize: "vertical",
    ...style,
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
          placeholder={placeholder}
          rows={4}
          style={{ ...baseInput, minHeight: 80 }}
        />
      );
    }
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
        placeholder={placeholder}
        style={baseInput}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: "text",
        borderBottom: `1px dashed ${accentColor}55`,
        paddingBottom: 1,
        display: "inline",
        ...style,
      }}
    >
      {value || <span style={{ color: accentColor, opacity: 0.55, fontStyle: "italic" }}>{placeholder ?? "Click to edit"}</span>}
    </span>
  );
}
