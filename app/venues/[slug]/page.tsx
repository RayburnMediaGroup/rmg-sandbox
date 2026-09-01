import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { venues } from "@/lib/data-venues";
import { artist } from "@/lib/data";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const venue = venues.find((v) => v.slug === slug);
  if (!venue) return {};
  return {
    title: `${venue.name} — BandStack Venue Profile`,
    description: `Tech specs, backline, stage dimensions, and booking info for ${venue.name} in ${venue.city}, ${venue.state}.`,
  };
}

// ── Tech match logic ─────────────────────────────────────────────
// Compare the current artist's stage plot needs against the venue's capabilities.
// Returns a list of flags: pass, warning, or fail per item.

type MatchStatus = "pass" | "warn" | "fail";

interface MatchItem {
  label: string;
  status: MatchStatus;
  detail: string;
}

function buildTechMatch(venue: typeof venues[0]): MatchItem[] {
  const items: MatchItem[] = [];

  // PA / mains
  items.push({
    label: "PA System",
    status: venue.tech.pa.mains ? "pass" : "fail",
    detail: venue.tech.pa.mains
      ? (venue.tech.pa.system ? `${venue.tech.pa.system} in-house` : "In-house PA provided")
      : "No in-house PA — artist must supply",
  });

  // Monitors
  items.push({
    label: "Stage Monitors",
    status: venue.tech.pa.monitors ? "pass" : "fail",
    detail: venue.tech.pa.monitors
      ? `${venue.tech.pa.monitorMixes} independent monitor mix${venue.tech.pa.monitorMixes !== 1 ? "es" : ""}`
      : "No house monitors — bring your own",
  });

  // IEM
  items.push({
    label: "In-Ear Monitors",
    status: venue.tech.pa.inEarMonitors ? "pass" : "warn",
    detail: venue.tech.pa.inEarMonitors
      ? "IEM system available in-house"
      : "No IEM system — bring your own or use wedges",
  });

  // Drum kit
  items.push({
    label: "Drum Kit",
    status: venue.tech.backline.drumKit ? "pass" : "warn",
    detail: venue.tech.backline.drumKit
      ? (venue.tech.backline.drumKitNotes ?? "House drum kit provided")
      : "No house kit — artist must supply",
  });

  // Bass amp
  items.push({
    label: "Bass Amp",
    status: venue.tech.backline.bassAmp ? "pass" : "warn",
    detail: venue.tech.backline.bassAmp
      ? (venue.tech.backline.ampNotes ? `Available — ${venue.tech.backline.ampNotes}` : "House bass amp provided")
      : "No house bass amp — artist must supply",
  });

  // Guitar amp
  items.push({
    label: "Guitar Amp",
    status: venue.tech.backline.guitarAmp ? "pass" : "warn",
    detail: venue.tech.backline.guitarAmp
      ? (venue.tech.backline.ampNotes ? `Available — ${venue.tech.backline.ampNotes}` : "House guitar amp provided")
      : "No house guitar amp — artist must supply",
  });

  // Piano — only flag as fail if artist genre implies piano need
  const genreNeedsPiano = artist.genre.some((g) =>
    ["jazz", "blues", "soul", "classical", "gospel"].some((k) => g.includes(k))
  );
  items.push({
    label: "Piano / Keys",
    status: venue.tech.backline.piano ? "pass" : genreNeedsPiano ? "fail" : "warn",
    detail: venue.tech.backline.piano
      ? (venue.tech.backline.pianoNotes ?? "House piano provided")
      : genreNeedsPiano
        ? "⚠ No house piano — required for this genre, artist must supply or rent"
        : "No house piano — artist must supply if needed",
  });

  // DI boxes
  items.push({
    label: "DI Boxes",
    status: venue.tech.backline.di >= 4 ? "pass" : venue.tech.backline.di > 0 ? "warn" : "fail",
    detail: venue.tech.backline.di > 0
      ? `${venue.tech.backline.di} DI boxes available in-house`
      : "No house DIs — artist must supply",
  });

  // Lighting
  items.push({
    label: "Lighting Rig",
    status: venue.tech.lighting ? "pass" : "warn",
    detail: venue.tech.lighting
      ? (venue.tech.lightingNotes ?? "House lighting provided")
      : "No house lighting — artist must supply",
  });

  // Green room
  items.push({
    label: "Green Room",
    status: venue.tech.greenRoom ? "pass" : "warn",
    detail: venue.tech.greenRoom ? "Green room available" : "No green room — confirm holding space with venue",
  });

  return items;
}

const STATUS_COLOR: Record<MatchStatus, string> = {
  pass: "#4ade80",
  warn: "#f59e0b",
  fail: "#f87171",
};
const STATUS_ICON: Record<MatchStatus, string> = {
  pass: "✓",
  warn: "⚠",
  fail: "✕",
};

function SpecRow({ label, value }: { label: string; value: string | number | boolean | undefined }) {
  if (value === undefined || value === null) return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "start" }}>
      <p style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(216,216,216,0.35)", paddingTop: "2px" }}>{label}</p>
      <p style={{ fontSize: "0.88rem", color: "rgba(216,216,216,0.8)", fontWeight: 300 }}>{display}</p>
    </div>
  );
}

export default async function VenueDetailPage({ params }: Props) {
  const { slug } = await params;
  const venue = venues.find((v) => v.slug === slug);
  if (!venue) notFound();

  const matchItems = buildTechMatch(venue);
  const passes = matchItems.filter((i) => i.status === "pass").length;
  const warns  = matchItems.filter((i) => i.status === "warn").length;
  const fails  = matchItems.filter((i) => i.status === "fail").length;

  const CAPACITY_LABEL = (cap: number) => {
    if (cap >= 5000) return "Arena";
    if (cap >= 2000) return "Large";
    if (cap >= 800)  return "Mid-Size";
    if (cap >= 300)  return "Club";
    return "Intimate";
  };

  return (
    <div style={{ background: "#0e0e0e", minHeight: "100vh", color: "#d8d8d8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}>

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/venues" style={{ fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,146,42,0.8)", textDecoration: "none" }}>
          ← Venues
        </a>
        {venue.bookingEmail && (
          <a href={`mailto:${venue.bookingEmail}`} style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(200,146,42,0.9)", textDecoration: "none", border: "1px solid rgba(200,146,42,0.3)", borderRadius: "9999px", padding: "6px 14px" }}>
            Booking Inquiry
          </a>
        )}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 40px 96px" }}>

        {/* Venue header */}
        <div style={{ marginBottom: "48px", paddingBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" as const, marginBottom: "8px" }}>
            <h1 style={{ fontFamily: "var(--display-font, 'Anton', sans-serif)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.95, color: "#fff", letterSpacing: "0.01em" }}>
              {venue.name}
            </h1>
          </div>
          <p style={{ fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,146,42,0.7)", marginBottom: "20px" }}>
            {venue.city}, {venue.state}{venue.neighborhood ? ` · ${venue.neighborhood}` : ""} · {CAPACITY_LABEL(venue.capacity)} · {venue.capacity.toLocaleString()} cap{venue.yearOpened ? ` · Est. ${venue.yearOpened}` : ""}
          </p>
          <p style={{ fontSize: "0.92rem", fontWeight: 300, color: "rgba(216,216,216,0.6)", lineHeight: 1.8, maxWidth: 680 }}>
            {venue.description}
          </p>

          {/* Genre chips */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginTop: "20px" }}>
            {venue.genres.map((g) => (
              <span key={g} style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,146,42,0.8)", background: "rgba(200,146,42,0.07)", border: "1px solid rgba(200,146,42,0.18)", borderRadius: "4px", padding: "3px 8px" }}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "40px", alignItems: "start" }}>

          {/* LEFT — Tech match */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <p style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(216,216,216,0.3)" }}>
                Tech Match · {artist.name}
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.1em", color: "#4ade80", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "4px", padding: "2px 8px" }}>{passes} Pass</span>
                {warns > 0 && <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.1em", color: "#f59e0b", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "4px", padding: "2px 8px" }}>{warns} Warn</span>}
                {fails > 0 && <span style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.1em", color: "#f87171", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", padding: "2px 8px" }}>{fails} Fail</span>}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
              {matchItems.map((item) => (
                <div key={item.label} style={{
                  display: "grid",
                  gridTemplateColumns: "20px 120px 1fr",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: item.status === "fail" ? "rgba(248,113,113,0.04)" : item.status === "warn" ? "rgba(245,158,11,0.03)" : "rgba(74,222,128,0.03)",
                  border: `1px solid ${item.status === "fail" ? "rgba(248,113,113,0.12)" : item.status === "warn" ? "rgba(245,158,11,0.1)" : "rgba(74,222,128,0.08)"}`,
                  alignItems: "start",
                }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: STATUS_COLOR[item.status], paddingTop: "1px" }}>
                    {STATUS_ICON[item.status]}
                  </span>
                  <p style={{ fontFamily: "monospace", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(216,216,216,0.5)", paddingTop: "2px" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(216,216,216,0.7)", lineHeight: 1.5 }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Specs + contact */}
          <div>
            {/* Stage specs */}
            <p style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(216,216,216,0.3)", marginBottom: "4px" }}>
              Stage Specs
            </p>
            <div style={{ marginBottom: "32px" }}>
              <SpecRow label="Stage Width" value={venue.tech.stageWidth ? `${venue.tech.stageWidth} ft` : undefined} />
              <SpecRow label="Stage Depth" value={venue.tech.stageDepth ? `${venue.tech.stageDepth} ft` : undefined} />
              <SpecRow label="Ceiling Height" value={venue.tech.stageCeilingHeight ? `${venue.tech.stageCeilingHeight} ft` : undefined} />
              <SpecRow label="Load In" value={venue.tech.loadIn} />
              <SpecRow label="Power" value={venue.tech.powerAmps} />
              <SpecRow label="Parking" value={venue.tech.parkingNotes} />
            </div>

            {/* PA specs */}
            <p style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(216,216,216,0.3)", marginBottom: "4px" }}>
              PA System
            </p>
            <div style={{ marginBottom: "32px" }}>
              <SpecRow label="System" value={venue.tech.pa.system} />
              <SpecRow label="Mains" value={venue.tech.pa.mains} />
              <SpecRow label="Subwoofers" value={venue.tech.pa.subwoofers} />
              <SpecRow label="Monitor Mixes" value={venue.tech.pa.monitorMixes} />
              <SpecRow label="IEM System" value={venue.tech.pa.inEarMonitors} />
            </div>

            {/* Contact */}
            <p style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(216,216,216,0.3)", marginBottom: "12px" }}>
              Booking
            </p>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "18px 20px" }}>
              {venue.bookingContact && (
                <p style={{ fontSize: "0.85rem", color: "#d8d8d8", marginBottom: "6px" }}>{venue.bookingContact}</p>
              )}
              {venue.bookingEmail && (
                <a href={`mailto:${venue.bookingEmail}`} style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(200,146,42,0.9)", textDecoration: "none" }}>
                  {venue.bookingEmail} →
                </a>
              )}
              {venue.website && (
                <div style={{ marginTop: "10px" }}>
                  <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(216,216,216,0.4)", textDecoration: "none" }}>
                    {venue.website.replace("https://", "")} ↗
                  </a>
                </div>
              )}
            </div>

            {/* Notes */}
            {venue.notes && (
              <div style={{ marginTop: "20px", padding: "16px 18px", borderLeft: "2px solid rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.04)", borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,158,11,0.6)", marginBottom: "6px" }}>Venue Notes</p>
                <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(216,216,216,0.6)", lineHeight: 1.65 }}>{venue.notes}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
