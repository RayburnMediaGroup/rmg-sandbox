import Link from "next/link";

const components = [
  {
    href: "/cards",
    label: "Glass Card",
    desc: "Dark glass card — grid + scroll strip. Hover lift, image zoom, rounded corners.",
    status: "live",
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
      <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f59e0b", marginBottom: "1rem", fontFamily: "monospace" }}>
        Rayburn Media Group
      </p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
        RMG Sandbox
      </h1>
      <p style={{ color: "rgba(232,232,240,0.5)", fontSize: "1rem", marginBottom: "4rem", maxWidth: 520 }}>
        Every UI element — built, broken, and fixed here before it ships to a client site.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {components.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              display: "block",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1rem",
              padding: "1.5rem",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace", color: c.status === "live" ? "#4ade80" : "#888" }}>
                {c.status}
              </span>
            </div>
            <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.5rem" }}>{c.label}</h2>
            <p style={{ color: "rgba(232,232,240,0.45)", fontSize: "0.8rem", lineHeight: 1.6 }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
