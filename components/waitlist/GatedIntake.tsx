"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import IntakeForm from "@/components/intake/IntakeForm";

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

      // Check invited status via server API (bypasses RLS)
      const res = await fetch("/api/check-invited", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, email: session.user.email }),
      });
      const { invited } = await res.json();
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
    router.replace("/waiting");
    return null;
  }

  return <IntakeForm />;
}
