"use client";

import { Artist } from "@/lib/data";

interface MerchTeaserProps {
  artist: Artist;
}

const PLACEHOLDER_ITEMS = [
  { label: "T-Shirt",      icon: "◈", desc: "Classic cut, heavyweight cotton" },
  { label: "Vinyl",        icon: "◉", desc: "180g audiophile pressing" },
  { label: "Hat",          icon: "◇", desc: "Structured snapback" },
];

export default function MerchTeaser({ artist }: MerchTeaserProps) {
  if (!artist.merchUrl) return null;

  return (
    <section style={{
      background: "var(--bg3)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "72px 40px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}>
            Merch
          </p>
          <a
            href={artist.merchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted2)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted2)";
            }}
          >
            Shop all →
          </a>
        </div>

        {/* 3-column card row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
          gap: "1rem",
        }}>
          {PLACEHOLDER_ITEMS.map((item) => (
            <a
              key={item.label}
              href={artist.merchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textDecoration: "none",
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
              }}
            >
              {/* Product image placeholder */}
              <div style={{
                height: 200,
                background: "var(--bg3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                color: "var(--accent-dim)",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ color: "var(--muted2)", fontSize: "1.5rem" }}>{item.icon}</span>
              </div>

              <div style={{ padding: "1rem" }}>
                <p style={{
                  fontFamily: "var(--body-font)",
                  fontSize: "0.88rem",
                  fontWeight: 400,
                  color: "var(--text)",
                  marginBottom: "4px",
                }}>
                  {artist.name} — {item.label}
                </p>
                <p style={{
                  fontFamily: "var(--body-font)",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  color: "var(--muted)",
                }}>
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        <p style={{
          fontFamily: "monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted2)",
          marginTop: "1.25rem",
          textAlign: "center",
        }}>
          ⚠ Placeholder — connect real store at artist.merchUrl
        </p>

      </div>
    </section>
  );
}
