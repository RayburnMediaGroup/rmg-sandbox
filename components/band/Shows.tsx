"use client";

import { Show } from "@/lib/data";

interface ShowsProps {
  shows: Show[];
  limit?: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day:   d.toLocaleDateString("en-US", { day: "2-digit" }),
    year:  d.getFullYear(),
    full:  d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }),
  };
}

const STATUS_STYLES: Record<Show["status"], { label: string; color: string; bg: string; border: string }> = {
  upcoming:   { label: "Tickets",    color: "#0c0b09",          bg: "var(--accent)",    border: "transparent" },
  "sold-out": { label: "Sold Out",   color: "var(--accent)",    bg: "transparent",      border: "rgba(255,255,255,0.1)" },
  past:       { label: "Past Show",  color: "var(--muted2)",    bg: "transparent",      border: "rgba(237,232,223,0.1)" },
  cancelled:  { label: "Cancelled",  color: "rgba(248,113,113,0.8)", bg: "transparent", border: "rgba(248,113,113,0.2)" },
};

export default function Shows({ shows, limit = 4 }: ShowsProps) {
  const upcoming = shows
    .filter((s) => s.status === "upcoming" || s.status === "sold-out")
    .slice(0, limit);

  const hasUpcoming = upcoming.length > 0;

  return (
    <section id="shows" style={{ padding: "80px 40px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header row */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "3rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.5rem",
            }}>
              Live &amp; On Tour
            </p>
            <h2 style={{
              fontFamily: "var(--display-font)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1,
              color: "#fff",
              margin: 0,
            }}>
              Upcoming Shows
            </h2>
          </div>
          <a
            href="/shows"
            style={{
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
            All Dates →
          </a>
        </div>

        {/* Show rows */}
        {hasUpcoming ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {upcoming.map((show, i) => {
              const date = formatDate(show.date);
              const status = STATUS_STYLES[show.status];
              const isLast = i === upcoming.length - 1;

              return (
                <div
                  key={`${show.date}-${show.venue}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr auto",
                    alignItems: "center",
                    gap: "2rem",
                    padding: "20px 0",
                    borderBottom: isLast ? "none" : "1px solid var(--border)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Date block */}
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.14em",
                      color: "var(--accent)",
                      marginBottom: "2px",
                    }}>
                      {date.month}
                    </p>
                    <p style={{
                      fontFamily: "var(--display-font)",
                      fontSize: "2rem",
                      lineHeight: 1,
                      color: "#fff",
                    }}>
                      {date.day}
                    </p>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: "0.52rem",
                      color: "var(--muted2)",
                    }}>
                      {date.year}
                    </p>
                  </div>

                  {/* Venue + location */}
                  <div>
                    <p style={{
                      fontSize: "1rem",
                      fontWeight: 400,
                      color: "#fff",
                      marginBottom: "3px",
                      lineHeight: 1.3,
                    }}>
                      {show.venue}
                    </p>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: "var(--muted2)",
                      textTransform: "uppercase",
                    }}>
                      {show.city}{show.state ? `, ${show.state}` : ""} · {show.country}
                    </p>
                    {show.notes && (
                      <p style={{
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                        marginTop: "4px",
                        fontStyle: "italic",
                      }}>
                        {show.notes}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ flexShrink: 0 }}>
                    {show.ticketUrl && show.status === "upcoming" ? (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          fontFamily: "monospace",
                          fontSize: "0.6rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          padding: "9px 20px",
                          borderRadius: "9999px",
                          background: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`,
                        }}
                      >
                        {status.label}
                      </a>
                    ) : (
                      <span style={{
                        display: "inline-block",
                        fontFamily: "monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "9px 20px",
                        borderRadius: "9999px",
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.border}`,
                      }}>
                        {status.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div style={{
            textAlign: "center",
            padding: "60px 0",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}>
            <p style={{
              fontFamily: "var(--display-font)",
              fontSize: "1.5rem",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
              No Upcoming Shows
            </p>
            <p style={{
              fontSize: "0.82rem",
              color: "var(--muted)",
              fontWeight: 300,
            }}>
              Check back soon — or subscribe for updates.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
