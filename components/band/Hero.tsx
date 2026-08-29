"use client";

import Link from "next/link";
import { Artist, Release } from "@/lib/data";

interface HeroProps {
  artist: Artist;
  featuredRelease: Release;
}

// Placeholder gradient — swap src prop for real photo in production
function HeroBackground({ src }: { src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
        }}
      />
    );
  }

  // Placeholder: warm dark gradient with subtle grain
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 60% 30%, rgba(120,70,20,0.35) 0%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 20% 70%, rgba(80,40,10,0.2) 0%, transparent 60%),
          linear-gradient(160deg, #1a1208 0%, #0c0b09 50%, #0e0c0a 100%)
        `,
      }}
    >
      {/* Grain texture via SVG filter */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute", inset: 0,
          filter: "url(#grain)",
          opacity: 0.06,
          background: "#fff",
        }}
      />
      {/* Placeholder label — remove when real photo is in */}
      <div style={{
        position: "absolute", bottom: 24, left: 24,
        fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.18em",
        textTransform: "uppercase", color: "rgba(200,146,42,0.4)",
      }}>
        ⚠ Hero photo placeholder — replace with band image
      </div>
    </div>
  );
}

export default function Hero({ artist, featuredRelease }: HeroProps) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Background — pass imageSrc prop when real photo is ready */}
      <HeroBackground />

      {/* Gradient overlay — bottom fade so text is always readable */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          background: `
            linear-gradient(to top, #0c0b09 0%, rgba(12,11,9,0.85) 30%, rgba(12,11,9,0.3) 60%, transparent 100%)
          `,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 10,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px 72px",
        }}
      >
        {/* Eyebrow — genre */}
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "1rem",
        }}>
          {artist.genre[0]}
        </p>

        {/* Band name */}
        <h1 style={{
          fontFamily: "var(--display-font)",
          fontSize: "clamp(3.5rem, 10vw, 9rem)",
          lineHeight: 0.92,
          letterSpacing: "0.01em",
          color: "#fff",
          margin: "0 0 1.25rem",
          textWrap: "balance",
        }}>
          {artist.name}
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
          fontWeight: 300,
          color: "rgba(237,232,223,0.65)",
          lineHeight: 1.5,
          marginBottom: "2.5rem",
          maxWidth: 520,
        }}>
          {artist.tagline}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href={featuredRelease.streamingLinks.spotify ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#0c0b09",
              fontFamily: "var(--body-font)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "13px 28px",
              borderRadius: "9999px",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-warm)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            Latest Album
          </Link>

          <Link
            href="#shows"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "var(--text)",
              fontFamily: "var(--body-font)",
              fontSize: "0.8rem",
              fontWeight: 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(237,232,223,0.25)",
              transition: "border-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(237,232,223,0.6)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(237,232,223,0.25)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            Upcoming Shows
          </Link>
        </div>

        {/* Origin + founding */}
        <p style={{
          marginTop: "2.5rem",
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(237,232,223,0.28)",
        }}>
          {artist.origin} · Est. {artist.founded}
        </p>
      </div>
    </section>
  );
}
