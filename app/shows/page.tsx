import type { Metadata } from "next";
import { artist, shows } from "@/lib/data";
import { resolveTokens } from "@/lib/genreTokens";
import BandTheme from "@/components/band/BandTheme";
import Navbar from "@/components/band/Navbar";
import { Show } from "@/lib/data";

export const metadata: Metadata = {
  title: `${artist.name} — Tour Dates`,
  description: `Upcoming shows and tour dates for ${artist.name}.`,
};

const MONTH_SHORT = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function parseDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return {
    month: MONTH_SHORT[d.getMonth()],
    day: String(d.getDate()).padStart(2, "0"),
    year: d.getFullYear(),
    full: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
}

function StatusChip({ status }: { status: Show["status"] }) {
  const map: Record<Show["status"], { label: string; color: string; bg: string }> = {
    upcoming:  { label: "Tickets",   color: "var(--accent)",  bg: "var(--accent-dim)" },
    "sold-out":{ label: "Sold Out",  color: "#888",           bg: "rgba(255,255,255,0.04)" },
    cancelled: { label: "Cancelled", color: "#d95c5c",        bg: "rgba(217,92,92,0.08)" },
    past:      { label: "Past",      color: "var(--muted2)",  bg: "transparent" },
  };
  const s = map[status];
  return (
    <span style={{
      fontFamily: "monospace",
      fontSize: "0.52rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.color === "var(--accent)" ? "var(--border2)" : "var(--border)"}`,
      borderRadius: "9999px",
      padding: "4px 12px",
      flexShrink: 0,
    }}>
      {s.label}
    </span>
  );
}

function ShowRow({ show }: { show: Show }) {
  const d = parseDate(show.date);
  const isPast = show.status === "past";
  const location = [show.venue, show.city, show.state].filter(Boolean).join(", ");

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      padding: "20px 0",
      borderBottom: "1px solid var(--border)",
      opacity: isPast ? 0.45 : 1,
    }}>
      {/* Date block */}
      <div style={{
        width: 56,
        flexShrink: 0,
        textAlign: "center",
        borderRight: "1px solid var(--border)",
        paddingRight: "1.5rem",
      }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: isPast ? "var(--muted2)" : "var(--accent)",
          marginBottom: "2px",
        }}>
          {d.month}
        </p>
        <p style={{
          fontFamily: "var(--display-font)",
          fontSize: "2rem",
          lineHeight: 1,
          color: isPast ? "var(--muted2)" : "#fff",
        }}>
          {d.day}
        </p>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.48rem",
          color: "var(--muted2)",
          marginTop: "2px",
        }}>
          {d.year}
        </p>
      </div>

      {/* Venue info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "var(--body-font)",
          fontSize: "1rem",
          fontWeight: 400,
          color: isPast ? "var(--muted)" : "var(--text)",
          marginBottom: "3px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap" as const,
        }}>
          {show.venue}
        </p>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted2)",
        }}>
          {[show.city, show.state, show.country !== "US" ? show.country : null].filter(Boolean).join(" · ")}
        </p>
        {show.notes && (
          <p style={{
            fontFamily: "var(--body-font)",
            fontSize: "0.78rem",
            fontWeight: 300,
            color: "var(--muted2)",
            fontStyle: "italic",
            marginTop: "4px",
          }}>
            {show.notes}
          </p>
        )}
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0 }}>
        {show.ticketUrl && show.status === "upcoming" ? (
          <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block",
            fontFamily: "monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#000",
            background: "var(--accent)",
            border: "none",
            borderRadius: "9999px",
            padding: "10px 20px",
            textDecoration: "none",
          }}>
            Tickets →
          </a>
        ) : (
          <StatusChip status={show.status} />
        )}
      </div>
    </div>
  );
}

export default function ShowsPage() {
  const tokens = resolveTokens(artist.genre);

  const upcoming = shows.filter((s) => s.status === "upcoming" || s.status === "sold-out");
  const past     = shows.filter((s) => s.status === "past" || s.status === "cancelled");

  // Sort upcoming ascending, past descending
  const sortedUpcoming = [...upcoming].sort((a, b) => a.date.localeCompare(b.date));
  const sortedPast     = [...past].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <BandTheme tokens={tokens} />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
        <Navbar artist={artist} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 40px" }}>

          {/* Header */}
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted2)",
            marginBottom: "0.75rem",
          }}>
            Live &amp; On Tour
          </p>
          <h1 style={{
            fontFamily: "var(--display-font)",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 0.92,
            color: "#fff",
            marginBottom: "3rem",
          }}>
            Tour Dates
          </h1>

          {/* Upcoming */}
          {sortedUpcoming.length > 0 ? (
            <div style={{ marginBottom: "4rem" }}>
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "0.25rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}>
                Upcoming Shows — {sortedUpcoming.length}
              </p>
              {sortedUpcoming.map((show, i) => (
                <ShowRow key={i} show={show} />
              ))}
            </div>
          ) : (
            <div style={{
              padding: "4rem 0",
              textAlign: "center",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              marginBottom: "4rem",
            }}>
              <p style={{
                fontFamily: "var(--display-font)",
                fontSize: "1.5rem",
                color: "var(--muted2)",
                marginBottom: "0.5rem",
              }}>
                No upcoming shows
              </p>
              <p style={{
                fontFamily: "var(--body-font)",
                fontSize: "0.85rem",
                fontWeight: 300,
                color: "var(--muted2)",
              }}>
                Check back soon — or{" "}
                {artist.newsletterUrl && (
                  <a href={artist.newsletterUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--accent)", textDecoration: "none" }}>
                    subscribe for updates
                  </a>
                )}
                .
              </p>
            </div>
          )}

          {/* Past shows */}
          {sortedPast.length > 0 && (
            <div>
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted2)",
                marginBottom: "0.25rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}>
                Past Shows — {sortedPast.length}
              </p>
              {sortedPast.map((show, i) => (
                <ShowRow key={i} show={show} />
              ))}
            </div>
          )}

          {/* Booking prompt */}
          {artist.bookingEmail && (
            <div style={{
              marginTop: "4rem",
              padding: "2rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border2)",
              background: "var(--bg2)",
            }}>
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "0.5rem",
              }}>
                Book a Show
              </p>
              <p style={{
                fontSize: "0.9rem",
                fontWeight: 300,
                color: "var(--muted)",
                marginBottom: "1rem",
                lineHeight: 1.65,
              }}>
                Interested in booking {artist.name} for your venue or festival?
              </p>
              <a href={`mailto:${artist.bookingEmail}`} style={{
                fontFamily: "monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent)",
                textDecoration: "none",
              }}>
                {artist.bookingEmail} →
              </a>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
