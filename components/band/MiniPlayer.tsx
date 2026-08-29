"use client";

import { useAudioPlayer, formatTime } from "@/lib/audioContext";

// ─── SVG icons — inlined, no icon library ────────────────────────

function IconPlay()  {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <polygon points="2,1 13,7 2,13" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="2" y="1" width="4" height="12" rx="1" />
      <rect x="8" y="1" width="4" height="12" rx="1" />
    </svg>
  );
}
function IconPrev()  {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <rect x="1" y="1" width="2.5" height="11" rx="1" />
      <polygon points="12,1 4,6.5 12,12" />
    </svg>
  );
}
function IconNext()  {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <polygon points="1,1 9,6.5 1,12" />
      <rect x="9.5" y="1" width="2.5" height="11" rx="1" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
      <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── MiniPlayer ───────────────────────────────────────────────────

export default function MiniPlayer() {
  const { nowPlaying, isPlaying, progress, duration, togglePlay, nextTrack, prevTrack, seek, close } = useAudioPlayer();

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const hasNext = nowPlaying ? nowPlaying.trackIndex < nowPlaying.release.tracks.length - 1 : false;
  const hasPrev = nowPlaying ? nowPlaying.trackIndex > 0 : false;

  return (
    <div
      aria-label="Now playing"
      role="region"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        background: "rgba(12,11,9,0.92)",
        borderTop: "1px solid var(--border2)",
        // Slide in/out
        transform: nowPlaying ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: nowPlaying ? "auto" : "none",
      }}
    >
      {/* Progress bar — sits at the very top of the player */}
      <div
        style={{ height: 2, background: "var(--border)", position: "relative", cursor: "pointer" }}
        onClick={(e) => {
          if (!duration) return;
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          seek(((e.clientX - rect.left) / rect.width) * duration);
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "var(--accent)", transition: "width 0.25s linear" }} />
      </div>

      {/* Controls row */}
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>

        {/* Track info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--display-font)",
            fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
            lineHeight: 1,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "0.03em",
          }}>
            {nowPlaying?.track.title ?? ""}
          </p>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted2)",
            marginTop: "3px",
          }}>
            {nowPlaying?.release.title ?? ""} · Track {(nowPlaying?.trackIndex ?? 0) + 1}
          </p>
        </div>

        {/* Time */}
        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "var(--muted2)", minWidth: 36, textAlign: "right" }}>
          {formatTime(progress)}
        </span>

        {/* Seek scrub */}
        <div style={{ flex: "0 0 160px", position: "relative", height: 3, background: "var(--border)", borderRadius: 9999, cursor: "pointer" }}
          onClick={(e) => {
            if (!duration) return;
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * duration);
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 9999, transition: "width 0.25s linear" }} />
        </div>

        <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "var(--muted2)", minWidth: 36 }}>
          {formatTime(duration)}
        </span>

        {/* Prev */}
        <button
          onClick={prevTrack}
          disabled={!hasPrev}
          aria-label="Previous track"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: "transparent", cursor: hasPrev ? "pointer" : "default",
            color: hasPrev ? "var(--muted)" : "var(--muted2)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { if (hasPrev) (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = hasPrev ? "var(--muted)" : "var(--muted2)"; }}
        >
          <IconPrev />
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: "50%", border: "none",
            background: "var(--accent)", color: "#000",
            cursor: "pointer",
            transition: "background 0.15s, transform 0.1s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-warm)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; }}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>

        {/* Next */}
        <button
          onClick={nextTrack}
          disabled={!hasNext}
          aria-label="Next track"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: "transparent", cursor: hasNext ? "pointer" : "default",
            color: hasNext ? "var(--muted)" : "var(--muted2)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { if (hasNext) (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = hasNext ? "var(--muted)" : "var(--muted2)"; }}
        >
          <IconNext />
        </button>

        {/* Close */}
        <button
          onClick={close}
          aria-label="Close player"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)",
            background: "transparent", cursor: "pointer",
            color: "var(--muted2)",
            transition: "color 0.15s, border-color 0.15s",
            marginLeft: "0.25rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = "var(--text)";
            el.style.borderColor = "var(--border2)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = "var(--muted2)";
            el.style.borderColor = "var(--border)";
          }}
        >
          <IconClose />
        </button>

      </div>
    </div>
  );
}
