"use client";

import { venues, Venue } from "@/lib/data-venues";


const CAPACITY_LABEL = (cap: number) => {
  if (cap >= 5000) return "Arena";
  if (cap >= 2000) return "Large";
  if (cap >= 800)  return "Mid-Size";
  if (cap >= 300)  return "Club";
  return "Intimate";
};

function CapChip({ cap }: { cap: number }) {
  const label = CAPACITY_LABEL(cap);
  const color =
    cap >= 5000 ? "#c084fc" :
    cap >= 2000 ? "#60a5fa" :
    cap >= 800  ? "var(--accent)" :
    cap >= 300  ? "#4ade80" : "var(--muted)";
  return (
    <span style={{
      fontFamily: "monospace",
      fontSize: "0.5rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}33`,
      borderRadius: "9999px",
      padding: "3px 9px",
    }}>
      {label} · {cap.toLocaleString()}
    </span>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  const hasBackline = venue.tech.backline.drumKit || venue.tech.backline.bassAmp || venue.tech.backline.guitarAmp;
  const hasPiano = venue.tech.backline.piano;

  return (
    <a
      href={`/venues/${venue.slug}`}
      style={{
        display: "block",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px 26px",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,146,42,0.35)";
        (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg2)";
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
          <h2 style={{
            fontFamily: "var(--display-font)",
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            color: "#fff",
            lineHeight: 1.1,
          }}>
            {venue.name}
          </h2>
          <CapChip cap={venue.capacity} />
        </div>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted2)",
        }}>
          {venue.city}, {venue.state}{venue.neighborhood ? ` · ${venue.neighborhood}` : ""}
        </p>
      </div>

      {/* Description */}
      <p style={{
        fontSize: "0.85rem",
        fontWeight: 300,
        color: "var(--muted)",
        lineHeight: 1.7,
        marginBottom: "18px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical" as const,
        overflow: "hidden",
      }}>
        {venue.description}
      </p>

      {/* Quick specs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, marginBottom: "16px" }}>
        {hasBackline && (
          <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4ade80", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: "4px", padding: "3px 8px" }}>
            Backline ✓
          </span>
        )}
        {hasPiano && (
          <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4ade80", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: "4px", padding: "3px 8px" }}>
            Piano ✓
          </span>
        )}
        {venue.tech.backline.di > 0 && (
          <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted2)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "4px", padding: "3px 8px" }}>
            {venue.tech.backline.di} DI
          </span>
        )}
        {venue.tech.pa.monitorMixes > 0 && (
          <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted2)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "4px", padding: "3px 8px" }}>
            {venue.tech.pa.monitorMixes} Mon Mixes
          </span>
        )}
        {venue.tech.pa.inEarMonitors && (
          <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted2)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "4px", padding: "3px 8px" }}>
            IEM ✓
          </span>
        )}
        {venue.tech.stageWidth && (
          <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted2)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "4px", padding: "3px 8px" }}>
            {venue.tech.stageWidth}′ × {venue.tech.stageDepth}′
          </span>
        )}
      </div>

      {/* Genre tags */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
        {venue.genres.slice(0, 4).map((g) => (
          <span key={g} style={{
            fontFamily: "monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            background: "var(--accent-dim)",
            borderRadius: "4px",
            padding: "2px 7px",
          }}>
            {g}
          </span>
        ))}
      </div>
    </a>
  );
}

export default function VenuesPage() {
  const sorted = [...venues].sort((a, b) => b.capacity - a.capacity);

  return (
    <div style={{ background: "#0e0e0e", minHeight: "100vh", color: "#d8d8d8" }}>

      {/* Simple top bar */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 40px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <a href="/" style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(200,146,42,0.8)", textDecoration: "none" }}>
          ← BandStack
        </a>
        <p style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          Colorado Venues · {venues.length} profiles
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px 96px" }}>

        {/* Header */}
        <p style={{ fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,146,42,0.8)", marginBottom: "0.75rem" }}>
          Phase 3 · Venue Profiles
        </p>
        <h1 style={{
          fontFamily: "var(--display-font, 'Anton', sans-serif)",
          fontSize: "clamp(3rem, 7vw, 5.5rem)",
          lineHeight: 0.92,
          color: "#fff",
          marginBottom: "1rem",
          letterSpacing: "0.01em",
        }}>
          Colorado Venues
        </h1>
        <p style={{ fontSize: "0.92rem", fontWeight: 300, color: "rgba(216,216,216,0.55)", lineHeight: 1.7, marginBottom: "3.5rem", maxWidth: 540 }}>
          Tech specs, backline inventory, stage dimensions, and booking contacts for Colorado's top music venues. Select a venue to see full details and check tech compatibility with your stage plot.
        </p>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(360px, 100%), 1fr))",
          gap: "16px",
        }}>
          {sorted.map((v) => (
            <VenueCard key={v.slug} venue={v} />
          ))}
        </div>

      </div>
    </div>
  );
}
