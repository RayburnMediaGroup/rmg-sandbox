import { Metadata } from "next";

export const metadata: Metadata = { title: "bandwidth" };

export default function WaitingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.6);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ textAlign: "center", animation: "fadeUp 0.7s ease both" }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#d8d8d8", margin: "0 auto 2.5rem",
          animation: "breathe 2.8s ease-in-out infinite",
        }} />
        <p style={{ fontSize: "2.2rem", fontWeight: 300, color: "#d8d8d8", marginBottom: "0.75rem", letterSpacing: "0.01em" }}>
          you&apos;re on the list.
        </p>
        <p style={{ fontSize: "1.1rem", color: "#888", fontWeight: 300, lineHeight: 1.9, maxWidth: 400, textAlign: "center" }}>
          your spot is reserved.<br />
          we&apos;ll reach out when access opens.
        </p>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.4rem",
          color: "#666",
          marginTop: "3.5rem",
          letterSpacing: "0.04em",
        }}>
          bandwidth
        </p>
      </div>
    </div>
  );
}
