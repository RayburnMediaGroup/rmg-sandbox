"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { releases, artist } from "@/lib/data";
import { resolveTokens } from "@/lib/genreTokens";
import { AudioPlayerProvider } from "@/lib/audioContext";
import BandTheme from "@/components/band/BandTheme";
import Navbar from "@/components/band/Navbar";
import MiniPlayer from "@/components/band/MiniPlayer";
import { useAudioPlayer } from "@/lib/audioContext";
import { useState } from "react";
import { Release, Track } from "@/lib/data";

// ─── Icons ────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 12 12" fill="currentColor">
      <polygon points="1,0.5 11.5,6 1,11.5" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="0.5" width="3.5" height="11" rx="1" />
      <rect x="7.5" y="0.5" width="3.5" height="11" rx="1" />
    </svg>
  );
}

// ─── Track row ────────────────────────────────────────────────────

function TrackRow({ track, release, index }: { track: Track; release: Release; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { playTrack, nowPlaying, isPlaying, togglePlay } = useAudioPlayer();
  const isActive = nowPlaying?.track.number === track.number && nowPlaying?.release.slug === release.slug;
  const canPlay = Boolean(track.audioSrc);

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
        gap: "1rem",
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
        cursor: canPlay ? "pointer" : "default",
        background: hovered && canPlay ? "var(--accent-dim)" : "transparent",
        transition: "background 0.15s",
        borderRadius: "4px",
        paddingLeft: hovered && canPlay ? "8px" : "0",
      }}
    >
      {/* Number / play */}
      <div style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
        {canPlay && (hovered || isActive) ? (
          <span style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}>
            {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
          </span>
        ) : (
          <span style={{
            fontFamily: "monospace",
            fontSize: "0.62rem",
            color: isActive ? "var(--accent)" : "var(--muted2)",
          }}>
            {String(track.number).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Title */}
      <span style={{
        flex: 1,
        fontSize: "0.95rem",
        fontWeight: isActive ? 400 : 300,
        color: isActive ? "var(--accent-warm)" : "var(--text)",
        transition: "color 0.15s",
      }}>
        {track.title}
      </span>

      {/* Duration */}
      {track.duration && (
        <span style={{
          fontFamily: "monospace",
          fontSize: "0.65rem",
          color: "var(--muted2)",
          flexShrink: 0,
        }}>
          {track.duration}
        </span>
      )}
    </li>
  );
}

// ─── Cover art ────────────────────────────────────────────────────

function CoverArt({ src, title }: { src?: string; title: string }) {
  if (src) {
    return (
      <img src={src} alt={`${title} cover art`} style={{
        width: "100%",
        aspectRatio: "1/1",
        objectFit: "cover",
        borderRadius: "1rem",
        display: "block",
      }} />
    );
  }
  return (
    <div style={{
      width: "100%",
      aspectRatio: "1/1",
      borderRadius: "1rem",
      background: `radial-gradient(ellipse 70% 70% at 30% 30%, var(--accent-dim) 0%, transparent 60%), var(--bg2)`,
      border: "1px solid var(--border2)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      position: "relative" as const,
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: "72%", height: "72%", borderRadius: "50%", border: "1px solid var(--border)" }} />
      <div style={{ position: "absolute", width: "28%", height: "28%", borderRadius: "50%", border: "1px solid var(--border2)" }} />
      <p style={{
        fontFamily: "var(--display-font)",
        fontSize: "clamp(1.2rem, 3vw, 2.2rem)",
        color: "rgba(237,232,223,0.7)",
        textAlign: "center",
        lineHeight: 1.1,
        padding: "0 2rem",
        position: "relative",
        zIndex: 1,
      }}>
        {title}
      </p>
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.48rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--muted2)",
        marginTop: "1rem",
        position: "relative",
        zIndex: 1,
      }}>
        ⚠ Cover art placeholder
      </p>
    </div>
  );
}

// ─── Release content (needs audio context) ────────────────────────

function ReleaseContent({ release }: { release: Release }) {
  const year = new Date(release.releaseDate).getFullYear();
  const month = new Date(release.releaseDate).toLocaleDateString("en-US", { month: "long" });
  const trackCount = release.tracks.length;
  const streamingEntries = Object.entries(release.streamingLinks).filter(([, url]) => url);

  // Total runtime
  const totalSeconds = release.tracks.reduce((acc, t) => {
    if (!t.duration) return acc;
    const [m, s] = t.duration.split(":").map(Number);
    return acc + (m * 60) + (s || 0);
  }, 0);
  const totalMin = Math.floor(totalSeconds / 60);
  const totalSec = totalSeconds % 60;
  const runtime = totalSeconds > 0 ? `${totalMin}:${String(totalSec).padStart(2, "0")}` : null;

  return (
    <main style={{ background: "var(--bg)", paddingBottom: 80, minHeight: "100vh" }}>
      <BandTheme tokens={resolveTokens(artist.genre)} />
      <Navbar artist={artist} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 0" }}>

        {/* Breadcrumb */}
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--muted2)",
          marginBottom: "2.5rem",
        }}>
          <a href="/band" style={{ color: "inherit", textDecoration: "none" }}>{artist.name}</a>
          {" / "}
          <a href="/band#music" style={{ color: "inherit", textDecoration: "none" }}>Releases</a>
          {" / "}
          <span style={{ color: "var(--muted)" }}>{release.title}</span>
        </p>

        {/* Two-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: "4rem",
          alignItems: "start",
        }}>

          {/* Left — art + meta */}
          <div>
            <CoverArt src={release.coverArt} title={release.title} />

            {/* Quick stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              marginTop: "1.5rem",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}>
              {[
                { label: "Released",    value: `${month} ${year}` },
                { label: "Type",        value: release.type.charAt(0).toUpperCase() + release.type.slice(1) },
                ...(trackCount > 0 ? [{ label: "Tracks", value: String(trackCount) }] : []),
                ...(runtime         ? [{ label: "Runtime", value: runtime }] : []),
              ].map(({ label, value }, i) => (
                <div key={label} style={{
                  padding: "10px 14px",
                  background: i % 2 === 0 ? "var(--bg2)" : "var(--bg3)",
                }}>
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                    marginBottom: "3px",
                  }}>
                    {label}
                  </p>
                  <p style={{ fontSize: "0.85rem", fontWeight: 300, color: "var(--text)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Streaming links */}
            {streamingEntries.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <p style={{
                  fontFamily: "monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  marginBottom: "0.6rem",
                }}>
                  Listen on
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                  {streamingEntries.map(([platform, url]) => (
                    <a key={platform} href={url!} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: "monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--text)",
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: "9999px",
                      border: "1px solid var(--border2)",
                      background: "var(--bg2)",
                    }}>
                      {platform === "appleMusic" ? "Apple Music" : platform.charAt(0).toUpperCase() + platform.slice(1)} →
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — title + tracklist */}
          <div>
            {/* Type + year badge */}
            <span style={{
              display: "inline-block",
              fontFamily: "monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "var(--accent-dim)",
              border: "1px solid var(--border2)",
              borderRadius: "9999px",
              padding: "3px 12px",
              marginBottom: "1rem",
            }}>
              {release.type} · {year}
            </span>

            <h1 style={{
              fontFamily: "var(--display-font)",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              lineHeight: 0.92,
              color: "#fff",
              marginBottom: "1rem",
              letterSpacing: "0.01em",
            }}>
              {release.title}
            </h1>

            <p style={{
              fontFamily: "monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted2)",
              marginBottom: release.description ? "1rem" : "2rem",
            }}>
              {artist.name}
            </p>

            {release.description && (
              <p style={{
                fontSize: "0.9rem",
                fontWeight: 300,
                color: "var(--muted)",
                lineHeight: 1.75,
                marginBottom: "2rem",
                maxWidth: 480,
              }}>
                {release.description}
              </p>
            )}

            {/* Tracklist */}
            {trackCount > 0 ? (
              <>
                <p style={{
                  fontFamily: "monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  marginBottom: "0.5rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid var(--border)",
                }}>
                  Tracklist
                </p>
                <ol style={{ listStyle: "none", padding: 0 }}>
                  {release.tracks.map((track, i) => (
                    <TrackRow key={track.number} track={track} release={release} index={i} />
                  ))}
                </ol>
                {runtime && (
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                    marginTop: "0.75rem",
                    textAlign: "right",
                  }}>
                    Total: {runtime}
                  </p>
                )}
              </>
            ) : (
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted2)",
              }}>
                ⚠ Add tracks to data.ts
              </p>
            )}
          </div>
        </div>
      </div>

      <MiniPlayer />
    </main>
  );
}

// ─── Page wrapper ────────────────────────────────────────────────

export default function ReleasePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const release = releases.find((r) => r.slug === slug);
  if (!release) notFound();

  const tokens = resolveTokens(artist.genre);

  return (
    <AudioPlayerProvider>
      <ReleaseContent release={release} />
    </AudioPlayerProvider>
  );
}
