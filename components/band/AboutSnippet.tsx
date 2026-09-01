"use client";

import Link from "next/link";
import { Artist } from "@/lib/data";

interface AboutSnippetProps {
  artist: Artist;
}

export default function AboutSnippet({ artist }: AboutSnippetProps) {
  return (
    <section style={{ padding: "80px 40px", background: "var(--bg)" }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
        gap: "5rem",
        alignItems: "center",
      }}>

        {/* Left — photo placeholder */}
        <div style={{
          aspectRatio: "4/3",
          borderRadius: "0.75rem",
          background: `
            radial-gradient(ellipse 60% 60% at 50% 40%, rgba(100,60,15,0.3) 0%, transparent 70%),
            linear-gradient(160deg, #181208 0%, #0e0c09 100%)
          `,
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          position: "relative" as const,
          overflow: "hidden",
        }}>
          {/* Silhouette suggestion */}
          <svg viewBox="0 0 120 80" width="40%" style={{ opacity: 0.08 }}>
            <ellipse cx="30" cy="35" rx="8" ry="10" fill="#ede8df" />
            <rect x="22" y="45" width="16" height="20" rx="3" fill="#ede8df" />
            <ellipse cx="60" cy="32" rx="9" ry="11" fill="#ede8df" />
            <rect x="51" y="43" width="18" height="22" rx="3" fill="#ede8df" />
            <ellipse cx="90" cy="36" rx="8" ry="10" fill="#ede8df" />
            <rect x="82" y="46" width="16" height="20" rx="3" fill="#ede8df" />
          </svg>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.1)",
          }}>
            ⚠ Band photo placeholder
          </p>
        </div>

        {/* Right — text */}
        <div>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "1.25rem",
          }}>
            About
          </p>

          <h2 style={{
            fontFamily: "var(--display-font)",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            lineHeight: 1,
            color: "#fff",
            marginBottom: "1.5rem",
          }}>
            {artist.name}
          </h2>

          {/* First two bio paragraphs */}
          {artist.bio.slice(0, 2).map((para, i) => (
            <p key={i} style={{
              fontSize: "0.92rem",
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.8,
              marginBottom: "1rem",
            }}>
              {para}
            </p>
          ))}

          {/* Members */}
          <div style={{ marginTop: "1.75rem", marginBottom: "2rem" }}>
            <p style={{
              fontFamily: "monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted2)",
              marginBottom: "0.75rem",
            }}>
              Members
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {artist.members.map((m) => (
                <div key={m.name} style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                  <span style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 400, minWidth: 140 }}>
                    {m.name}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "var(--muted2)", letterSpacing: "0.08em" }}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "2px",
            }}
          >
            Full Bio &amp; EPK →
          </Link>
        </div>

      </div>
    </section>
  );
}
