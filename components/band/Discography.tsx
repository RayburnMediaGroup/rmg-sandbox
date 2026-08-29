"use client";

import { Release } from "@/lib/data";

interface DiscographyProps {
  releases: Release[];
  featuredSlug?: string;
}

function ReleaseCard({ release, isFeatured }: { release: Release; isFeatured: boolean }) {
  const year = new Date(release.releaseDate).getFullYear();

  return (
    <a
      href={`/releases/${release.slug}`}
      style={{
        display: "block",
        flexShrink: 0,
        width: 180,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Cover art */}
      <div style={{
        width: 180,
        height: 180,
        borderRadius: "0.75rem",
        background: isFeatured
          ? `radial-gradient(ellipse 80% 80% at 30% 30%, var(--accent-dim) 0%, transparent 60%), var(--bg3)`
          : "var(--bg3)",
        border: isFeatured
          ? "1px solid var(--border2)"
          : "1px solid var(--border)",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        position: "relative" as const,
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.25s",
        marginBottom: "0.75rem",
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border2)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = isFeatured ? "var(--border2)" : "var(--border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Vinyl ring */}
        <div style={{
          position: "absolute",
          width: "70%", height: "70%",
          borderRadius: "50%",
          border: "1px solid var(--border)",
        }} />
        <div style={{
          position: "absolute",
          width: "28%", height: "28%",
          borderRadius: "50%",
          border: "1px solid var(--border2)",
        }} />
        <p style={{
          fontFamily: "var(--display-font)",
          fontSize: "1rem",
          color: isFeatured ? "var(--text)" : "var(--muted)",
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 1rem",
          position: "relative",
          zIndex: 1,
        }}>
          {release.title}
        </p>
      </div>

      {/* Meta */}
      <p style={{
        fontFamily: "var(--body-font)",
        fontSize: "0.82rem",
        fontWeight: isFeatured ? 400 : 300,
        color: isFeatured ? "var(--text)" : "var(--muted)",
        marginBottom: "3px",
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {release.title}
      </p>
      <p style={{
        fontFamily: "monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: isFeatured ? "var(--accent)" : "var(--muted2)",
      }}>
        {release.type} · {year}
      </p>
    </a>
  );
}

export default function Discography({ releases, featuredSlug }: DiscographyProps) {
  if (releases.length <= 1) return null;

  return (
    <section style={{
      background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
      padding: "64px 0",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "2rem",
        }}>
          Discography
        </p>
      </div>

      {/* Horizontal scroll */}
      <div style={{
        overflowX: "auto",
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 16,
        scrollbarWidth: "none" as const,
      }}>
        <div style={{
          display: "flex",
          gap: "1.5rem",
          width: "max-content",
        }}>
          {releases.map((r) => (
            <ReleaseCard
              key={r.slug}
              release={r}
              isFeatured={r.slug === featuredSlug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
