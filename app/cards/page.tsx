const gridCards = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&auto=format",
    alt: "Mountain lake at dawn",
    label: "Landscape",
    title: "Sierra Nevada at First Light",
    desc: "High alpine terrain captured just before sunrise — golden hour cascading across granite peaks.",
  },
  {
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop&auto=format",
    alt: "City skyline at dusk",
    label: "Architecture",
    title: "Urban Geometry",
    desc: "Steel and glass towers trace the last of the day's light against a deep blue sky.",
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop&auto=format",
    alt: "Coastal cliffs",
    label: "Coastal",
    title: "Pacific Shoreline",
    desc: "Windswept headlands where the continent meets the open ocean — raw and uncompromising.",
  },
];

const stripCards = [
  {
    src: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&h=400&fit=crop&auto=format",
    alt: "Dark forest path",
    label: "Forest",
    title: "Old Growth",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format",
    alt: "Desert landscape",
    label: "Desert",
    title: "Red Canyon",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format",
    alt: "Snowy peaks",
    label: "Alpine",
    title: "Winter Ascent",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop&auto=format",
    alt: "Starry night mountains",
    label: "Astrophoto",
    title: "Milky Way Ridge",
  },
];

export default function CardsPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 120px" }}>

      {/* Page header */}
      <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f59e0b", marginBottom: "1rem", fontFamily: "monospace" }}>
        Component — Glass Card
      </p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
        Glass Card
      </h1>
      <p style={{ color: "rgba(232,232,240,0.45)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 560, marginBottom: "4rem" }}>
        Dark glass card — hover lift, image zoom, and rounded corners. Two layouts: 3-column grid and horizontal scroll strip.
      </p>

      {/* ── Section 1: Grid ──────────────────────────────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", fontFamily: "monospace" }}>
            Grid — 3 column
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {gridCards.map((card) => (
            <a
              key={card.title}
              href="#"
              className="group glass-card overflow-hidden rounded-[1.25rem]"
              style={{ display: "block", textDecoration: "none" }}
            >
              {/* Image wrapper — first child, overflow-hidden — gets top radius from CSS rule */}
              <div className="overflow-hidden" style={{ aspectRatio: "16/10", position: "relative" }}>
                <img
                  src={card.src}
                  alt={card.alt}
                  width={800}
                  height={500}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  className="group-hover:scale-105"
                />
                {/* Category badge */}
                <span style={{
                  position: "absolute",
                  top: "0.75rem",
                  left: "0.75rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  color: "#f59e0b",
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(8px)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(245,158,11,0.3)",
                }}>
                  {card.label}
                </span>
              </div>
              {/* Content */}
              <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                <h3 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 400, marginBottom: "0.5rem", lineHeight: 1.3 }}>
                  {card.title}
                </h3>
                <p style={{ color: "rgba(232,232,240,0.45)", fontSize: "0.82rem", lineHeight: 1.7 }}>
                  {card.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Section 2: Horizontal scroll strip ───────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", fontFamily: "monospace" }}>
            Scroll strip — horizontal
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* overflow-x-auto class applies: padding-top:8px + overflow-y:hidden */}
        <div
          className="overflow-x-auto"
          style={{ display: "flex", gap: "1.25rem", paddingBottom: "1rem" }}
        >
          {stripCards.map((card) => (
            <a
              key={card.title}
              href="#"
              className="group glass-card overflow-hidden rounded-[1.25rem]"
              style={{
                display: "block",
                textDecoration: "none",
                flexShrink: 0,
                width: 280,
              }}
            >
              <div className="overflow-hidden" style={{ aspectRatio: "16/10", position: "relative" }}>
                <img
                  src={card.src}
                  alt={card.alt}
                  width={600}
                  height={400}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  className="group-hover:scale-105"
                />
                <span style={{
                  position: "absolute",
                  top: "0.75rem",
                  left: "0.75rem",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  color: "#f59e0b",
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(8px)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(245,158,11,0.3)",
                }}>
                  {card.label}
                </span>
              </div>
              <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                <h3 style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 400, lineHeight: 1.3 }}>
                  {card.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Notes ────────────────────────────────────────────────── */}
      <div style={{ marginTop: "5rem", padding: "1.5rem 2rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#888", fontFamily: "monospace", marginBottom: "1rem" }}>
          Implementation notes
        </p>
        <ul style={{ color: "rgba(232,232,240,0.5)", fontSize: "0.82rem", lineHeight: 2, paddingLeft: "1.25rem" }}>
          <li><code style={{ color: "#f59e0b", fontFamily: "monospace" }}>.glass-card</code> — backdrop-filter glass, border, shadow, lift transition</li>
          <li><code style={{ color: "#f59e0b", fontFamily: "monospace" }}>.overflow-hidden &gt; img</code> — inherits border-radius so GPU-promoted image never shows square corners on hover</li>
          <li><code style={{ color: "#f59e0b", fontFamily: "monospace" }}>.glass-card &gt; .overflow-hidden:first-child</code> — top corners only (1.25rem 1.25rem 0 0) for image wrapper</li>
          <li><code style={{ color: "#f59e0b", fontFamily: "monospace" }}>.overflow-x-auto</code> — padding-top:8px gives hover lift room inside the clip boundary; overflow-y:hidden blocks vertical scroll</li>
          <li>Section containers never get <code style={{ color: "#f59e0b", fontFamily: "monospace" }}>overflow-hidden</code> — cards must be able to lift without clipping</li>
        </ul>
      </div>

    </main>
  );
}
