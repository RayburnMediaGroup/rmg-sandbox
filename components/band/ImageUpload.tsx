"use client";

import { useState, useRef } from "react";

interface UploadResult { url: string; size: number; originalSize: number; watermarked: boolean; }

interface Props {
  watermarkText?: string;
  onUploaded: (result: UploadResult) => void;
  tokens: { accent: string; border: string; border2: string; muted: string; muted2: string; text: string };
  label?: string;
}

const MAX_MB = 1;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export default function ImageUpload({ watermarkText = "Photographer", onUploaded, tokens, label = "Upload Photo" }: Props) {
  const [dragging, setDragging] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };

  async function handleFile(file: File) {
    setError(""); setStatus("idle"); setResult(null);

    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > MAX_BYTES) { setError(`File is ${(file.size / 1024 / 1024).toFixed(1)}MB — maximum is 1MB.`); return; }

    // Local preview
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStatus("uploading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("watermark", String(watermark));
      fd.append("watermarkText", watermarkText);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? "Upload failed"); setStatus("error"); return; }

      setResult(data);
      setStatus("done");
      onUploaded(data);
    } catch {
      setError("Network error — please try again.");
      setStatus("error");
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const fmt = (b: number) => b < 1024 * 1024 ? `${Math.round(b / 1024)}KB` : `${(b / 1024 / 1024).toFixed(1)}MB`;

  return (
    <div style={{ ...T }}>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? tokens.accent : tokens.border2}`,
          borderRadius: 8, padding: "28px 20px", textAlign: "center",
          cursor: "pointer", transition: "border-color 0.2s",
          background: dragging ? `${tokens.accent}08` : "transparent",
          marginBottom: "0.75rem",
        }}
      >
        {preview ? (
          <img src={preview} alt="" style={{ maxHeight: 120, maxWidth: "100%", borderRadius: 4, objectFit: "contain" }} />
        ) : (
          <>
            <p style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>📷</p>
            <p style={{ ...T, fontSize: "0.82rem", color: tokens.muted, fontWeight: 300 }}>{label}</p>
            <p style={{ ...lbl, marginTop: "0.3rem" }}>Drag & drop or click · Max 1MB · JPG, PNG, WebP</p>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />

      {/* Watermark option */}
      <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", marginBottom: "0.75rem" }}>
        <input
          type="checkbox"
          checked={watermark}
          onChange={e => setWatermark(e.target.checked)}
          style={{ accentColor: tokens.accent, width: 14, height: 14, cursor: "pointer" }}
        />
        <span style={{ ...T, fontSize: "0.78rem", color: tokens.muted, fontWeight: 300 }}>
          Add watermark — <em style={{ fontStyle: "normal", color: tokens.muted2 }}>{watermarkText}</em>
        </span>
      </label>

      {/* Status */}
      {status === "uploading" && (
        <p style={{ ...lbl, color: tokens.accent }}>Converting to WebP…</p>
      )}
      {status === "done" && result && (
        <p style={{ ...lbl, color: "#5aab72" }}>
          ✓ Uploaded · {fmt(result.originalSize)} → {fmt(result.size)} WebP{result.watermarked ? " · watermarked" : ""}
        </p>
      )}
      {(status === "error" || error) && (
        <p style={{ ...lbl, color: "#d95c5c" }}>{error}</p>
      )}
    </div>
  );
}
