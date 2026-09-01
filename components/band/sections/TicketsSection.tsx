"use client";

import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

const TICKET_PLATFORMS = [
  { label: "Bandsintown",  url: "https://bandsintown.com",  note: "Follow for show alerts" },
  { label: "Songkick",     url: "https://songkick.com",     note: "Track & get notified" },
  { label: "Ticketmaster", url: "https://ticketmaster.com", note: "Major venue ticketing" },
  { label: "AXS",          url: "https://axs.com",          note: "Venue box office partner" },
  { label: "Eventbrite",   url: "https://eventbrite.com",   note: "Independent shows & events" },
  { label: "Seated",       url: "https://seated.com",       note: "Independent venue partner" },
];

interface Props { profile: ProfileData; tokens: TokenSet; }

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function TicketsSection({ profile, tokens }: Props) {
  const isMobile = useMobile();
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const upcoming = (profile.shows ?? []).filter(s => s.status === "upcoming" || s.status === "sold-out");

  return (
    <section id="tickets" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Tickets</p>

        {/* Upcoming shows with ticket links */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Upcoming Shows</p>
            {upcoming.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: "0.75rem 1.5rem", padding: "14px 0", borderBottom: border2, alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
                    {s.ticketUrl && s.status !== "sold-out" && <span style={{ fontSize: "0.9rem" }}>🎟</span>}
                    <span style={{ ...T, fontSize: "0.88rem", color: tokens.text, fontWeight: 400 }}>{s.venue}</span>
                    {s.status === "sold-out" && (
                      <span style={{ ...lbl, fontSize: "0.48rem", color: "#d95c5c", border: "1px solid #d95c5c", borderRadius: 3, padding: "1px 5px" }}>Sold Out</span>
                    )}
                  </div>
                  <p style={{ ...lbl, color: tokens.muted2 }}>{s.city}, {s.state} · {fmtDate(s.date)}</p>
                  {s.notes && <p style={{ ...T, fontSize: "0.75rem", color: tokens.muted2, fontWeight: 300, marginTop: "0.2rem" }}>{s.notes}</p>}
                </div>
                {s.ticketUrl && s.status !== "sold-out" && (
                  <a
                    href={s.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...T, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em",
                      textTransform: "uppercase", textDecoration: "none",
                      background: tokens.accent, color: "#0c0b09",
                      padding: "8px 18px", borderRadius: 4, flexShrink: 0,
                      display: "inline-block", textAlign: "center",
                    }}
                  >
                    Get Tickets →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {upcoming.length === 0 && (
          <div style={{ padding: "24px 0", marginBottom: "2rem", borderBottom: border2 }}>
            <p style={{ ...lbl, color: tokens.muted2 }}>No upcoming shows scheduled — follow on Bandsintown for alerts.</p>
          </div>
        )}

        {/* Ticket platforms */}
        <div>
          <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Ticket Platforms</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0" }}>
            {TICKET_PLATFORMS.map((p, i) => (
              <a
                key={i}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: border2, gap: "1rem" }}
                onMouseEnter={e => (e.currentTarget.querySelector("span")!.style.color = tokens.text)}
                onMouseLeave={e => (e.currentTarget.querySelector("span")!.style.color = tokens.muted)}
              >
                <div>
                  <span style={{ ...T, fontSize: "0.85rem", color: tokens.muted, fontWeight: 300, display: "block" }}>{p.label}</span>
                  <span style={{ ...lbl, fontSize: "0.52rem", textTransform: "none", letterSpacing: 0, color: tokens.muted2 }}>{p.note}</span>
                </div>
                <span style={{ ...lbl, color: tokens.muted2 }}>↗</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
