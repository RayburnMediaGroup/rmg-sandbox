"use client";

import { useState, useEffect } from "react";

const ADMIN_SECRET = "bandwidth-admin-2026";

type WaitlistRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  invited: boolean;
  created_at: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [rows, setRows] = useState<WaitlistRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadList() {
    setLoading(true);
    const res = await fetch("/api/admin-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: ADMIN_SECRET }),
    });
    const { data } = await res.json();
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (authed) loadList();
  }, [authed]);

  async function invite(row: WaitlistRow) {
    setSending(row.email);
    setMessage("");
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: ADMIN_SECRET,
        email: row.email,
        first_name: row.first_name,
      }),
    });
    const result = await res.json();
    if (result.ok) {
      setMessage(`✓ invited ${row.email}`);
      setRows(prev => prev.map(r => r.email === row.email ? { ...r, invited: true } : r));
    } else {
      setMessage(`✗ ${result.error}`);
    }
    setSending(null);
  }

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

  if (!authed) {
    return (
      <div style={{ ...T, minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 320 }}>
          <p style={{ color: "#d8d8d8", fontSize: "1.1rem", marginBottom: "1.5rem" }}>admin</p>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="password"
            onKeyDown={e => e.key === "Enter" && pin === ADMIN_SECRET && setAuthed(true)}
            style={{ ...T, width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #333", color: "#d8d8d8", padding: "12px 0", fontSize: "1rem", outline: "none", marginBottom: "1rem" }}
          />
          <button
            onClick={() => pin === ADMIN_SECRET && setAuthed(true)}
            style={{ ...T, background: "#d4a843", color: "#080808", border: "none", padding: "12px 24px", borderRadius: 4, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
          >
            enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...T, minHeight: "100vh", background: "#080808", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <p style={{ color: "#d8d8d8", fontSize: "1.2rem", fontWeight: 300 }}>waitlist</p>
          <button onClick={loadList} style={{ ...T, background: "transparent", color: "#666", border: "1px solid #333", padding: "6px 14px", borderRadius: 4, fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer" }}>
            refresh
          </button>
        </div>

        {message && (
          <p style={{ color: message.startsWith("✓") ? "#5aab72" : "#d95c5c", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{message}</p>
        )}

        {loading ? (
          <p style={{ color: "#555" }}>loading…</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                {["name", "email", "status", ""].map(h => (
                  <th key={h} style={{ ...T, color: "#555", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "left", padding: "0 0 10px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ ...T, color: "#d8d8d8", fontSize: "0.85rem", padding: "14px 0" }}>{row.first_name} {row.last_name}</td>
                  <td style={{ ...T, color: "#888", fontSize: "0.8rem", padding: "14px 16px 14px 0" }}>{row.email}</td>
                  <td style={{ padding: "14px 16px 14px 0" }}>
                    <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: row.invited ? "#5aab72" : "#555" }}>
                      {row.invited ? "invited" : "waiting"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 0", textAlign: "right" }}>
                    {!row.invited && (
                      <button
                        onClick={() => invite(row)}
                        disabled={sending === row.email}
                        style={{ ...T, background: "transparent", color: "#d4a843", border: "1px solid rgba(212,168,67,0.4)", padding: "6px 14px", borderRadius: 4, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
                      >
                        {sending === row.email ? "sending…" : "invite"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
