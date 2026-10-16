"use client";

import { useState } from "react";

interface Video {
  title: string;
  youtubeId: string;
}

interface VideoSectionProps {
  videos: Video[];
}

function VideoCard({ v }: { v: Video }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;
  const fallback = `https://i.ytimg.com/vi/${v.youtubeId}/mqdefault.jpg`;

  return (
    <div style={{
      borderRadius: "0.75rem",
      overflow: "hidden",
      border: "1px solid var(--border)",
      background: "var(--bg3)",
    }}>
      <div style={{ position: "relative", paddingTop: "56.25%", cursor: playing ? "default" : "pointer" }}
           onClick={() => !playing && setPlaying(true)}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <>
            <img
              src={thumb}
              alt={v.title}
              onError={e => { (e.currentTarget as HTMLImageElement).src = fallback; }}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Play button */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.25)",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(0,0,0,0.75)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.6)",
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "18px solid #fff",
                  marginLeft: 4,
                }} />
              </div>
            </div>
          </>
        )}
      </div>
      <p style={{
        padding: "12px 14px",
        fontFamily: "var(--body-font)",
        fontSize: "0.8rem",
        fontWeight: 300,
        color: "var(--muted)",
        lineHeight: 1.4,
      }}>
        {v.title}
      </p>
    </div>
  );
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const active = videos.filter((v) => v.youtubeId.trim() !== "");
  if (active.length === 0) return null;

  return (
    <section style={{
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "80px 40px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "2.5rem",
        }}>
          Videos
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
          gap: "1.5rem",
        }}>
          {active.map((v) => <VideoCard key={v.youtubeId} v={v} />)}
        </div>
      </div>
    </section>
  );
}
