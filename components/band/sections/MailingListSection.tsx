"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

// Mock subscriber list for UI scaffold — replace with Supabase query
const MOCK_SUBSCRIBERS = [
  { email: "fan1@example.com", city: "Denver, CO",    joined: "2026-08-01" },
  { email: "fan2@example.com", city: "Nashville, TN", joined: "2026-07-28" },
  { email: "fan3@example.com", city: "Austin, TX",    joined: "2026-07-15" },
  { email: "fan4@example.com", city: "Denver, CO",    joined: "2026-07-10" },
  { email: "fan5@example.com", city: "Fort Collins, CO", joined: "2026-06-22" },
];

// Mock sent campaigns
const MOCK_CAMPAIGNS = [
  { subject: "New show announced — Grizzly Rose, Sept 20", sent: "2026-08-15", opens: 312, recipients: 480 },
  { subject: "Gothic Theatre tickets on sale now", sent: "2026-08-10", opens: 290, recipients: 480 },
  { subject: "New single out Friday", sent: "2026-07-30", opens: 340, recipients: 451 },
];

export default function MailingListSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState<"subscribers" | "compose" | "sent">("compose");

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const inp: React.CSSProperties = { background: "#111", border: `1px solid ${tokens.border2}`, borderRadius: 4, color: "#d8d8d8", padding: "10px 14px", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", width: "100%", outline: "none" };
  const subscriberCount = profile.mailingListCount ?? MOCK_SUBSCRIBERS.length;

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to Supabase subscribers table
    setSubmitted(true);
    setEmail("");
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // TODO: trigger Resend/SendGrid via API route
    setTimeout(() => { setSending(false); setSent(true); setSubject(""); setBody(""); }, 1200);
  }

  // ── Fan view ─────────────────────────────────────────────────────
  if (!isArtist) {
    return (
      <section id="mailing-list" style={{ borderBottom: border1 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>
          <p className="section-label" style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>Mailing List</p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p style={{ ...T, fontSize: "1.1rem", color: tokens.accent, fontWeight: 500, marginBottom: "0.5rem" }}>You're in.</p>
              <p style={{ ...T, fontSize: "0.85rem", color: tokens.muted2, fontWeight: 300 }}>You'll hear from {profile.name} first — shows, new music, and news direct to your inbox.</p>
            </div>
          ) : (
            <div style={{ maxWidth: 480 }}>
              <p style={{ ...T, fontSize: "0.88rem", color: tokens.muted, fontWeight: 300, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Get show announcements, new music, and news from {profile.name} before anyone else.
              </p>
              <form onSubmit={handleSignup} style={{ display: "flex", gap: "0.5rem", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ ...inp, flex: 1 }}
                />
                <button type="submit" style={{
                  ...T, background: tokens.accent, color: "#0c0b09",
                  border: "none", borderRadius: 4, padding: "10px 20px",
                  fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em",
                  textTransform: "uppercase", cursor: "pointer", flexShrink: 0,
                }}>
                  Subscribe
                </button>
              </form>
              <p style={{ ...lbl, marginTop: "0.75rem", fontSize: "0.52rem" }}>No spam. Unsubscribe anytime.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ── Artist view ──────────────────────────────────────────────────
  return (
    <section id="mailing-list" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Mailing List</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ ...T, fontSize: "1.4rem", fontWeight: 700, color: tokens.accent }}>{subscriberCount}</span>
            <span style={{ ...lbl }}>Subscribers</span>
          </div>
        </div>

        {/* Coming soon banner */}
        <div style={{ background: `${tokens.accent}11`, border: `1px solid ${tokens.accent}33`, borderRadius: 6, padding: "10px 16px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ color: tokens.accent, fontSize: "0.8rem" }}>⚡</span>
          <p style={{ ...lbl, textTransform: "none", letterSpacing: 0, fontSize: "0.72rem", color: tokens.muted }}>
            Full send capability coming soon — subscriber storage and delivery powered by Supabase + Resend.
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: "0", borderBottom: border1, marginBottom: "1.5rem" }}>
          {(["compose", "subscribers", "sent"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              ...T, background: "transparent", border: "none", cursor: "pointer",
              padding: "8px 16px", fontSize: "0.72rem", fontWeight: tab === t ? 600 : 300,
              color: tab === t ? tokens.accent : tokens.muted2,
              borderBottom: tab === t ? `2px solid ${tokens.accent}` : "2px solid transparent",
              textTransform: "capitalize", letterSpacing: "0.05em",
            }}>
              {t === "sent" ? "Sent Campaigns" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Compose tab */}
        {tab === "compose" && (
          <form onSubmit={handleSend} style={{ maxWidth: 580 }}>
            {sent && (
              <div style={{ background: "#0d2010", border: "1px solid #5aab72", borderRadius: 6, padding: "10px 16px", marginBottom: "1rem" }}>
                <p style={{ ...lbl, color: "#5aab72", textTransform: "none", letterSpacing: 0, fontSize: "0.75rem" }}>✓ Campaign queued — {subscriberCount} subscribers will receive it shortly.</p>
              </div>
            )}
            <div style={{ marginBottom: "0.75rem" }}>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Subject</p>
              <input value={subject} onChange={e => setSubject(e.target.value)} required placeholder="New show announced…" style={inp} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ ...lbl, marginBottom: "0.4rem" }}>Message</p>
              <textarea value={body} onChange={e => setBody(e.target.value)} required rows={8} placeholder={`Hey everyone,\n\nWe've got a big show coming up…`} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button type="submit" disabled={sending} style={{
                ...T, background: tokens.accent, color: "#0c0b09", border: "none",
                borderRadius: 4, padding: "10px 22px", fontSize: "0.78rem", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase", cursor: sending ? "wait" : "pointer",
                opacity: sending ? 0.7 : 1,
              }}>
                {sending ? "Sending…" : `Send to ${subscriberCount} subscribers`}
              </button>
              <p style={{ ...lbl, fontSize: "0.52rem" }}>Preview sends first — live sending requires Supabase</p>
            </div>
          </form>
        )}

        {/* Subscribers tab */}
        {tab === "subscribers" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0.5rem 1.5rem", padding: "6px 0", borderBottom: border1, marginBottom: "0.25rem" }}>
              <span style={lbl}>Email</span>
              <span style={lbl}>Location</span>
              <span style={lbl}>Joined</span>
            </div>
            {MOCK_SUBSCRIBERS.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0.5rem 1.5rem", padding: "9px 0", borderBottom: border2, alignItems: "center" }}>
                <span style={{ ...T, fontSize: "0.82rem", color: tokens.muted, fontWeight: 300 }}>{s.email}</span>
                <span style={{ ...lbl, color: tokens.muted2 }}>{s.city}</span>
                <span style={{ ...lbl, color: tokens.muted2 }}>{s.joined}</span>
              </div>
            ))}
            <p style={{ ...lbl, marginTop: "1rem", color: tokens.muted2 }}>Showing {MOCK_SUBSCRIBERS.length} of {subscriberCount} — full list requires Supabase</p>
          </div>
        )}

        {/* Sent tab */}
        {tab === "sent" && (
          <div>
            {MOCK_CAMPAIGNS.map((c, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: border2 }}>
                <p style={{ ...T, fontSize: "0.85rem", color: tokens.text, fontWeight: 400, marginBottom: "0.3rem" }}>{c.subject}</p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <span style={{ ...lbl }}>{c.sent}</span>
                  <span style={{ ...lbl, color: tokens.muted }}>{c.recipients} sent</span>
                  <span style={{ ...lbl, color: "#5aab72" }}>{c.opens} opens · {Math.round(c.opens / c.recipients * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
