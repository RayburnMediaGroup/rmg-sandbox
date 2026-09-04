"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import IntakeForm from "@/components/intake/IntakeForm";

const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

type Status = "loading" | "invited" | "waitlisted" | "unauthenticated";

export default function GatedIntake() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const invited = session.user.user_metadata?.invited === true;
      setStatus(invited ? "invited" : "waitlisted");
    }

    check();
  }, [router]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes breathe { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d8d8d8", animation: "breathe 2s ease-in-out infinite" }} />
      </div>
    );
  }

  if (status === "waitlisted") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "2.2rem",
          color: "#d8d8d8",
          marginBottom: "1.5rem",
          letterSpacing: "0.04em",
          textAlign: "center",
        }}>
          you&apos;re on the list.
        </p>
        <p style={{ ...T, fontSize: "1.1rem", color: "#aaa", fontWeight: 300, textAlign: "center", lineHeight: 1.9, maxWidth: 400 }}>
          your spot is reserved.<br />
          we&apos;ll reach out when access opens.
        </p>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.4rem",
          color: "#888",
          marginTop: "3.5rem",
          letterSpacing: "0.04em",
        }}>
          bandwidth
        </p>
      </div>
    );
  }

  return <IntakeForm />;
}
