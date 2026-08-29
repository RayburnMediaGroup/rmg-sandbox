import GlassCard from "@/components/GlassCard";

const gridCards = [
  {
    eyebrow: "Landscape",
    title: "Sierra Nevada at First Light",
    body: "High alpine terrain captured just before sunrise — golden hour cascading across granite peaks.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&auto=format",
    imageAlt: "Mountain lake at dawn",
  },
  {
    eyebrow: "Architecture",
    title: "Urban Geometry",
    body: "Steel and glass towers trace the last of the day's light against a deep blue sky.",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop&auto=format",
    imageAlt: "City skyline at dusk",
  },
  {
    eyebrow: "Coastal",
    title: "Pacific Shoreline",
    body: "Windswept headlands where the continent meets the open ocean — raw and uncompromising.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop&auto=format",
    imageAlt: "Coastal cliffs",
  },
];

const stripCards = [
  { eyebrow: "Forest",     title: "Old Growth",     image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=600&h=375&fit=crop&auto=format", imageAlt: "Dark forest" },
  { eyebrow: "Desert",     title: "Red Canyon",     image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=375&fit=crop&auto=format", imageAlt: "Desert canyon" },
  { eyebrow: "Astrophoto", title: "Milky Way Ridge", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=375&fit=crop&auto=format", imageAlt: "Starry night" },
  { eyebrow: "Coastal",    title: "Pacific Edge",   image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=375&fit=crop&auto=format", imageAlt: "Coastal cliffs" },
];

const MUTED2 = "rgba(232,232,240,0.25)";

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
        Hover lift, image zoom, rounded corners. Two layouts: 3-column grid and horizontal scroll strip.
        Self-contained inline styles — no globals.css dependency.
      </p>

      {/* ── Grid ── */}
      <div style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED2, fontFamily: "monospace", whiteSpace: "nowrap" }}>
            Grid — 3 column
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* NO overflow:hidden on this container — cards must lift freely */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {gridCards.map((card) => (
            <GlassCard
              key={card.title}
              href="#"
              image={card.image}
              imageAlt={card.imageAlt}
              imageWidth={800}
              imageHeight={500}
              eyebrow={card.eyebrow}
              title={card.title}
              body={card.body}
              aspect="16/10"
            />
          ))}
        </div>
      </div>

      {/* ── Scroll strip ── */}
      <div style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED2, fontFamily: "monospace", whiteSpace: "nowrap" }}>
            Scroll strip — horizontal
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* paddingTop:8px = lift room inside clip boundary, overflowY:hidden = locks vertical scroll */}
        <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", overflowY: "hidden", paddingTop: "8px", paddingBottom: "16px" }}>
          {stripCards.map((card) => (
            <div key={card.title} style={{ flexShrink: 0, width: 280 }}>
              <GlassCard
                href="#"
                image={card.image}
                imageAlt={card.imageAlt}
                imageWidth={600}
                imageHeight={375}
                eyebrow={card.eyebrow}
                title={card.title}
                aspect="16/10"
              />
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
