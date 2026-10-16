"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function VerifiedPage() {
  const inserted = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (inserted.current) return;

    async function writeWaitlist() {
      // PKCE flow: Supabase sends ?code= in the URL — must exchange it first
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Fallback: listen for SIGNED_IN event (implicit/hash flow)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (event === "SIGNED_IN" && newSession && !inserted.current) {
            inserted.current = true;
            subscription.unsubscribe();
            await upsertWaitlist(newSession.user);
            await redirectToBandPage(newSession.user.id);
          }
        });
        return;
      }

      if (inserted.current) return;
      inserted.current = true;
      await upsertWaitlist(session.user);
      await redirectToBandPage(session.user.id);
    }

    async function redirectToBandPage(userId: string) {
      const { data: band } = await supabase.from("bands").select("slug").eq("user_id", userId).maybeSingle();
      if (band?.slug) {
        router.push(`/bandstack/${band.slug}`);
      } else {
        router.push("/intake");
      }
    }

    async function upsertWaitlist(user: { id: string; email?: string; user_metadata?: Record<string, string> }) {
      await supabase.from("waitlist").insert({
        user_id: user.id,
        first_name: user.user_metadata?.first_name ?? "",
        last_name: user.user_metadata?.last_name ?? "",
        email: user.email,
        invited: false,
      });
    }

    writeWaitlist();
  }, [router]);

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
          setting up your account…
        </p>
        <p style={{ fontSize: "1.1rem", color: "#888", fontWeight: 300, lineHeight: 1.9, maxWidth: 400, textAlign: "center" }}>
          you&apos;re in. taking you to your page builder now.
        </p>
        <a href="/intake" style={{ display: "inline-block", marginTop: "2rem", fontSize: "0.75rem", color: "#d4a843", fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
          click here if not redirected →
        </a>
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
