import Link from "next/link";

const artists = [
  { slug: "/bandstack/ryan-chrys", name: "Ryan Chrys & The Rough Cuts", genre: "Americana / Country Rock" },
  { slug: "/backstage-flash", name: "Photographer Template", genre: "Photography Profile" },
];

export default function BandStackIndex() {
  return (
    <main style={{ minHeight: "100vh", background: "#0e0e0e", fontFamily: "Inter, system-ui, sans-serif", padding: "60px 40px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", marginBottom: "0.5rem" }}>Rayburn Media Group</p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 600, color: "#d8d8d8", marginBottom: "0.4rem" }}>BandStack</h1>
        <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "3rem" }}>One place. Everything your band needs.</p>

        <p style={{ fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "#333", marginBottom: "0.75rem" }}>Active Profiles</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid #1e1e1e", borderRadius: 8, overflow: "hidden", marginBottom: "2rem" }}>
          {artists.map(a => (
            <Link key={a.slug} href={a.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", background: "#111", textDecoration: "none", borderBottom: "1px solid #1e1e1e" }}>
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "#d8d8d8", marginBottom: "0.2rem" }}>{a.name}</p>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555" }}>{a.genre}</p>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#444" }}>→</span>
            </Link>
          ))}
        </div>

        <p style={{ fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "#333", marginBottom: "0.75rem" }}>Blank Template</p>
        <Link href="/bandstack/template" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", background: "#0e0e0e", textDecoration: "none", border: "1px dashed #2a2a2a", borderRadius: 8 }}>
          <div>
            <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "#444", marginBottom: "0.2rem" }}>New Artist</p>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#333" }}>Start from scratch</p>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#333" }}>→</span>
        </Link>
      </div>
    </main>
  );
}
