"use client";

/**
 * RMG Glass Card — Next.js component
 *
 * Self-contained. No external CSS required. Drop into any Next.js project.
 *
 * SIZES: Only change the aspect ratio prop.
 *   "16/10"  — listings, restaurants, resorts (default)
 *   "3/4"    — portrait, towns, people
 *   "2/1"    — hero strips, featured banners
 *
 * RULES:
 *   - Section/grid containers must NOT have overflow:hidden — cards lift on hover
 *   - Scroll strips need padding-top:8px + overflow-y:hidden (see scroll strip usage below)
 */

import Link from "next/link";
import { useState } from "react";

interface GlassCardProps {
  href: string;
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  eyebrow?: string;
  title: string;
  body?: string;
  aspect?: "16/10" | "3/4" | "2/1";
  accentColor?: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function GlassCard({
  href,
  image,
  imageAlt,
  imageWidth = 800,
  imageHeight = 500,
  eyebrow,
  title,
  body,
  aspect = "16/10",
  accentColor = "#f59e0b",
}: GlassCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => { setHovered(true); setImgHovered(true); }}
      onMouseLeave={() => { setHovered(false); setImgHovered(false); }}
      style={{
        display: "block",
        textDecoration: "none",
        // Glass surface
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "1.25rem",
        boxShadow: hovered
          ? "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.13)"
          : "0 8px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        // Lift — NO overflow:hidden on the card so this is never clipped
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: `transform 0.4s ${EASE}, box-shadow 0.4s ${EASE}, background 0.4s ${EASE}, border-color 0.4s ${EASE}`,
        height: "100%",
      }}
    >
      {/* Image wrapper — overflow:hidden lives HERE, not on the card */}
      <div
        style={{
          overflow: "hidden",
          borderRadius: "1.25rem 1.25rem 0 0",
          aspectRatio: aspect,
          position: "relative",
          background: "#111118",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={imageWidth}
          height={imageHeight}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            // Own border-radius: when GPU-promoted on scale, the image keeps its
            // own rounded corners even if it escapes the parent overflow clip
            borderRadius: "1.25rem 1.25rem 0 0",
            transform: imgHovered ? "scale(1.05)" : "scale(1)",
            transition: `transform 0.7s ${EASE}`,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 40%, rgba(5,5,10,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px" }}>
        {eyebrow && (
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: accentColor,
            marginBottom: "10px",
          }}>
            {eyebrow}
          </p>
        )}
        <h3 style={{
          color: "#fff",
          fontSize: "1.05rem",
          fontWeight: 400,
          lineHeight: 1.3,
          marginBottom: body ? "8px" : 0,
          textWrap: "balance",
        }}>
          {title}
        </h3>
        {body && (
          <p style={{
            color: "rgba(232,232,240,0.5)",
            fontSize: "0.82rem",
            lineHeight: 1.7,
          }}>
            {body}
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * USAGE — Grid:
 *
 * <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
 *   <GlassCard href="/page" image="/img.webp" imageAlt="..." eyebrow="Category" title="Card Title" body="Description." />
 * </div>
 *
 * USAGE — Horizontal scroll strip:
 *
 * <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", overflowY: "hidden", paddingTop: "8px", paddingBottom: "16px" }}>
 *   <div style={{ flexShrink: 0, width: 280 }}>
 *     <GlassCard href="/page" image="/img.webp" imageAlt="..." title="Card Title" />
 *   </div>
 * </div>
 */
