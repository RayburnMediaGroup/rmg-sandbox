"use client";

import { Artist } from "@/lib/data";

interface StreamingFooterProps {
  artist: Artist;
}

const PLATFORMS = [
  { key: "spotify",    label: "Spotify",      icon: "♫" },
  { key: "appleMusic", label: "Apple Music",  icon: "♪" },
  { key: "youtube",    label: "YouTube",      icon: "▶" },
  { key: "soundcloud", label: "SoundCloud",   icon: "☁" },
  { key: "bandcamp",   label: "Bandcamp",     icon: "B" },
];

export default function StreamingFooter({ artist }: StreamingFooterProps) {
  const links = PLATFORMS.filter(
    (p) => artist.streamingLinks[p.key as keyof typeof artist.streamingLinks]
  );

  return (
    <section style={{
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      padding: "72px 40px",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted2)",
          marginBottom: "0.75rem",
        }}>
          Listen on your platform
        </p>

        <h2 style={{
          fontFamily: "var(--display-font)",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 1,
          color: "#fff",
          marginBottom: "2.5rem",
        }}>
          Stream the Music
        </h2>

        {/* Platform links */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "3rem",
        }}>
          {links.map((p) => {
            const url = artist.streamingLinks[p.key as keyof typeof artist.streamingLinks];
            return (
              <a
                key={p.key}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--body-font)",
                  fontSize: "0.82rem",
                  fontWeight: 400,
                  color: "var(--text)",
                  textDecoration: "none",
                  padding: "11px 22px",
                  borderRadius: "9999px",
                  border: "1px solid var(--border2)",
                  background: "var(--bg3)",
                  transition: "border-color 0.2s, color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "rgba(200,146,42,0.5)";
                  el.style.color = "var(--accent-warm)";
                  el.style.background = "rgba(200,146,42,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "var(--border2)";
                  el.style.color = "var(--text)";
                  el.style.background = "var(--bg3)";
                }}
              >
                <span style={{ fontSize: "1rem" }}>{p.icon}</span>
                {p.label}
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", marginBottom: "2rem" }} />

        {/* Footer meta */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted2)",
          }}>
            {artist.name} · {artist.origin} · Est. {artist.founded}
          </p>

          {artist.bookingEmail && (
            <a
              href={`mailto:${artist.bookingEmail}`}
              style={{
                fontFamily: "monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent)",
                textDecoration: "none",
              }}
            >
              Booking: {artist.bookingEmail}
            </a>
          )}
        </div>

      </div>
    </section>
  );
}
