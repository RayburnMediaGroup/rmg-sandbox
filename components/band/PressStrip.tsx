"use client";

import { PressQuote } from "@/lib/data";

interface PressStripProps {
  quotes: PressQuote[];
}

export default function PressStrip({ quotes }: PressStripProps) {
  return (
    <section style={{
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "80px 40px",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "3rem",
        }}>
          Press
        </p>

        {/* Quote grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(quotes.length, 3)}, 1fr)`,
          gap: "2px",
        }}>
          {quotes.map((q, i) => (
            <div
              key={i}
              style={{
                background: i % 2 === 0 ? "var(--bg3)" : "transparent",
                borderRadius: i === 0 ? "0.75rem 0 0 0.75rem"
                            : i === quotes.length - 1 ? "0 0.75rem 0.75rem 0"
                            : "0",
                padding: "40px 36px",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                border: "1px solid var(--border)",
              }}
            >
              {/* Big quote mark */}
              <span style={{
                fontFamily: "var(--display-font)",
                fontSize: "5rem",
                lineHeight: 0.7,
                color: "var(--accent)",
                opacity: 0.4,
                userSelect: "none",
              }}>
                "
              </span>

              {/* Quote text */}
              <p style={{
                fontSize: "1rem",
                fontWeight: 300,
                color: "var(--text)",
                lineHeight: 1.75,
                fontStyle: "italic",
                flex: 1,
              }}>
                {q.quote}
              </p>

              {/* Source + year */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border)",
              }}>
                {q.url ? (
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    {q.source}
                  </a>
                ) : (
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}>
                    {q.source}
                  </span>
                )}
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "0.58rem",
                  color: "var(--muted2)",
                }}>
                  {q.year}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
