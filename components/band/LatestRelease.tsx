"use client";

import { useState } from "react";
import { Release, Track } from "@/lib/data";
import { useAudioPlayer } from "@/lib/audioContext";

interface LatestReleaseProps {
  release: Release;
}

function CoverArt({ src, title }: { src?: string; title: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${title} album cover`}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "0.75rem" }}
      />
    );
  }

  return (
    <div style={{
      width: "100%", aspectRatio: "1/1",
      borderRadius: "0.75rem",
      background: `
        radial-gradient(ellipse 70% 70% at 30% 30%, rgba(140,80,20,0.4) 0%, transparent 60%),
        linear-gradient(145deg, #1e1508 0%, #0e0c09 100%)
      `,
      border: "1px solid rgba(200,146,42,0.15)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative" as const,
      overflow: "hidden",
    }}>
      {/* Vinyl ring detail */}
      <div style={{
        position: "absolute",
        width: "75%", height: "75%",
        borderRadius: "50%",
        border: "1px solid rgba(200,146,42,0.08)",
      }} />
      <div style={{
        position: "absolute",
        width: "30%", height: "30%",
        borderRadius: "50%",
        border: "1px solid rgba(200,146,42,0.12)",
      }} />
      <p style={{
        fontFamily: "var(--display-font)",
        fontSize: "clamp(1.2rem, 3vw, 2rem)",
        color: "rgba(237,232,223,0.7)",
        textAlign: "center",
        lineHeight: 1.1,
        position: "relative",
        zIndex: 1,
      }}>
        {title}
      </p>
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.52rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(200,146,42,0.35)",
        marginTop: "1rem",
        position: "relative",
        zIndex: 1,
      }}>
        ⚠ Cover art placeholder
      </p>
    </div>
  );
}

const STREAMING_ICONS: Record<string, { label: string; icon: string }> = {
  spotify:    { label: "Spotify",     icon: "♫" },
  appleMusic: { label: "Apple Music", icon: "♪" },
  bandcamp:   { label: "Bandcamp",    icon: "B" },
  youtube:    { label: "YouTube",     icon: "▶" },
  soundcloud: { label: "SoundCloud",  icon: "☁" },
};

// ─── TrackRow ─────────────────────────────────────────────────────

function PlayIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <polygon points="1,0.5 11.5,6 1,11.5" />
    </svg>
  );
}
function PauseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="0.5" width="3.5" height="11" rx="1" />
      <rect x="7.5" y="0.5" width="3.5" height="11" rx="1" />
    </svg>
  );
}

function TrackRow({ track, release, index }: { track: Track; release: Release; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { playTrack, nowPlaying, isPlaying, togglePlay } = useAudioPlayer();

  const isActive = nowPlaying?.track.number === track.number && nowPlaying?.release.slug === release.slug;
  const canPlay  = Boolean(track.audioSrc);

  const handleClick = () => {
    if (!canPlay) return;
    if (isActive) { togglePlay(); return; }
    playTrack(track, release, index);
  };

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        padding: "9px 8px",
        borderRadius: "6px",
        borderBottom: "1px solid var(--border)",
        cursor: canPlay ? "pointer" : "default",
        background: hovered && canPlay ? "var(--accent-dim)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      {/* Play button / track number */}
      <div style={{
        width: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {canPlay && (hovered || isActive) ? (
          <span style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}>
            {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
          </span>
        ) : (
          <span style={{
            fontFamily: "monospace",
            fontSize: "0.6rem",
            color: isActive ? "var(--accent)" : "var(--muted2)",
          }}>
            {String(track.number).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Title */}
      <span style={{
        flex: 1,
        fontSize: "0.88rem",
        color: isActive ? "var(--accent-warm)" : hovered ? "var(--text)" : "var(--text)",
        fontWeight: isActive ? 500 : 300,
        transition: "color 0.15s",
      }}>
        {track.title}
      </span>

      {/* Duration */}
      {track.duration && (
        <span style={{
          fontFamily: "monospace",
          fontSize: "0.62rem",
          color: "var(--muted2)",
          flexShrink: 0,
        }}>
          {track.duration}
        </span>
      )}
    </li>
  );
}

function TrackList({ release }: { release: Release }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
      {release.tracks.map((track, i) => (
        <TrackRow key={track.number} track={track} release={release} index={i} />
      ))}
    </ol>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function LatestRelease({ release }: LatestReleaseProps) {
  const year = new Date(release.releaseDate).getFullYear();
  const streamingEntries = Object.entries(release.streamingLinks).filter(([, url]) => url);

  return (
    <section style={{
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "80px 40px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section label */}
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "3rem",
        }}>
          Latest Release
        </p>

        {/* Two-column layout — stacks on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
          gap: "4rem",
          alignItems: "center",
        }}>

          {/* Left — cover art */}
          <div>
            <CoverArt src={release.coverArt} title={release.title} />
          </div>

          {/* Right — info */}
          <div>
            {/* Type badge */}
            <span style={{
              display: "inline-block",
              fontFamily: "monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "var(--accent-dim)",
              border: "1px solid rgba(200,146,42,0.25)",
              borderRadius: "9999px",
              padding: "3px 10px",
              marginBottom: "1rem",
            }}>
              {release.type} · {year}
            </span>

            {/* Album title */}
            <h2 style={{
              fontFamily: "var(--display-font)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 0.95,
              color: "#fff",
              marginBottom: "1.25rem",
              letterSpacing: "0.01em",
            }}>
              {release.title}
            </h2>

            {/* Description */}
            {release.description && (
              <p style={{
                fontSize: "0.9rem",
                fontWeight: 300,
                color: "var(--muted)",
                lineHeight: 1.75,
                marginBottom: "2rem",
                maxWidth: 440,
              }}>
                {release.description}
              </p>
            )}

            {/* Track list */}
            {release.tracks.length > 0 && (
              <TrackList release={release} />
            )}

            {/* Streaming links */}
            {streamingEntries.length > 0 && (
              <div>
                <p style={{
                  fontFamily: "monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  marginBottom: "0.75rem",
                }}>
                  Listen on
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {streamingEntries.map(([platform, url]) => {
                    const meta = STREAMING_ICONS[platform] ?? { label: platform, icon: "→" };
                    return (
                      <a
                        key={platform}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontFamily: "var(--body-font)",
                          fontSize: "0.75rem",
                          fontWeight: 400,
                          color: "var(--text)",
                          textDecoration: "none",
                          padding: "8px 16px",
                          borderRadius: "9999px",
                          border: "1px solid var(--border2)",
                          background: "var(--bg3)",
                          transition: "border-color 0.2s, color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,146,42,0.5)";
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-warm)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border2)";
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                        }}
                      >
                        <span style={{ fontSize: "0.8rem" }}>{meta.icon}</span>
                        {meta.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
