"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const INTAKE_KEY = "bandstack-intake-v2";
const PROFILE_KEY = "bandstack-profile-v1";

interface Member {
  name: string;
  role: string;
}

interface ProfileData {
  name: string;
  contactEmail: string;
  genre: string;
  tagline: string;
  origin: string;
  founded: string;
  bio: string;
  members: Member[];
  bookingEmail: string;
  instagram: string;
  spotify: string;
  appleMusic: string;
  heroImage: string;
  albumArt: string;
}

const EMPTY: ProfileData = {
  name: "", contactEmail: "", genre: "", tagline: "", origin: "",
  founded: "", bio: "", members: [{ name: "", role: "" }], bookingEmail: "",
  instagram: "", spotify: "", appleMusic: "", heroImage: "", albumArt: "",
};

// ─── Image Upload ──────────────────────────────────────────────────

function ImageUpload({ label, value, onChange, role, slug, size = 160 }: {
  label: string; value: string; onChange: (url: string) => void;
  role: string; slug: string; size?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("role", role);
      form.append("slug", slug || "artist");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json() as { url?: string };
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }

  const border = dragging ? "1px dashed #c4a832" : value ? "1px solid rgba(232,232,232,0.08)" : "1px dashed rgba(232,232,232,0.15)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <span style={labelStyle}>{label}</span>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: size, height: size, borderRadius: 6, border,
          background: value ? "transparent" : dragging ? "rgba(196,168,50,0.04)" : "rgba(255,255,255,0.02)",
          cursor: uploading ? "default" : "pointer",
          overflow: "hidden", position: "relative", flexShrink: 0,
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} disabled={uploading} />
        {value ? (
          <>
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.5)", opacity: 0, transition: "opacity 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", color: "#e8e8e8" }}>replace</span>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(232,232,232,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.65rem", letterSpacing: "0.06em", color: "rgba(232,232,232,0.2)", textAlign: "center", lineHeight: 1.5 }}>
              {uploading ? "uploading…" : "drop or click"}
            </span>
          </div>
        )}
      </label>
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: "0.62rem", letterSpacing: "0.12em",
  color: "rgba(232,232,232,0.3)", textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "transparent", border: "none",
  borderBottom: "1px solid rgba(232,232,232,0.1)",
  color: "#d8d8d8", fontSize: "0.95rem",
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: 300, padding: "8px 0 10px", outline: "none",
  letterSpacing: "0.01em", caretColor: "#c4a832",
};

function Field({ label, value, onChange, placeholder, type = "text", multiline = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={labelStyle}>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={4}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.7 }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

// ─── Divider ───────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingTop: "0.5rem" }}>
      <span style={{ ...labelStyle, color: "#c4a832", letterSpacing: "0.14em" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(232,232,232,0.06)" }} />
    </div>
  );
}

// ─── Member List ───────────────────────────────────────────────────

const ROLE_SUGGESTIONS = ["Lead Vocals", "Vocals", "Guitar", "Bass", "Drums", "Keys", "Fiddle", "Pedal Steel", "Trumpet", "Saxophone", "Percussion"];

function MemberList({ members, onChange }: { members: Member[]; onChange: (m: Member[]) => void }) {
  function update(i: number, field: keyof Member, v: string) {
    const next = members.map((m, idx) => idx === i ? { ...m, [field]: v } : m);
    onChange(next);
  }
  function add() { onChange([...members, { name: "", role: "" }]); }
  function remove(i: number) { onChange(members.filter((_, idx) => idx !== i)); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {members.map((m, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {i === 0 && <span style={labelStyle}>Name</span>}
            <input
              value={m.name} onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Full name" style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {i === 0 && <span style={labelStyle}>Role</span>}
            <input
              value={m.role} onChange={(e) => update(i, "role", e.target.value)}
              placeholder="Guitar" list="role-suggestions" style={inputStyle}
            />
          </div>
          <button
            onClick={() => remove(i)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(232,232,232,0.2)", fontSize: "1rem",
              padding: "0 0 10px", lineHeight: 1,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d95c5c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,232,232,0.2)")}
          >×</button>
        </div>
      ))}
      <datalist id="role-suggestions">
        {ROLE_SUGGESTIONS.map((r) => <option key={r} value={r} />)}
      </datalist>
      <button
        onClick={add}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.72rem", letterSpacing: "0.08em",
          color: "#c4a832", textAlign: "left", padding: "4px 0",
          opacity: 0.7,
        }}
      >
        + add member
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────

export default function BandBuildPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(PROFILE_KEY);
      if (existing) { setProfile(JSON.parse(existing) as ProfileData); return; }
      const intake = localStorage.getItem(INTAKE_KEY);
      if (intake) {
        const d = JSON.parse(intake) as { name?: string; contactEmail?: string; genre?: string };
        setProfile((p) => ({
          ...p,
          name: d.name || "",
          contactEmail: d.contactEmail || "",
          genre: Array.isArray(d.genre) ? d.genre[0] : d.genre || "",
        }));
      }
    } catch {}
  }, []);

  function set(k: keyof ProfileData, v: string) {
    setProfile((p) => ({ ...p, [k]: v }));
  }


  function handleSubmit() {
    setSaving(true);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
    setTimeout(() => router.push("/band/studio"), 500);
  }

  const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "artist";

  return (
    <main style={{ background: "#0e0e0e", minHeight: "100vh", padding: "64px 24px 120px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

        {/* Header */}
        <div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic", fontWeight: 600,
            fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
            color: "#e8e8e8", lineHeight: 1.05, marginBottom: "0.5rem",
          }}>
            {profile.name || "your site."}
          </h1>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(232,232,232,0.25)", fontWeight: 300, letterSpacing: "0.04em" }}>
            fill in what you have — everything builds your site
          </p>
        </div>

        {/* Identity */}
        <Divider label="Identity" />
        <Field label="Artist / Band Name" value={profile.name} onChange={(v) => set("name", v)} placeholder="Your name" />
        <Field label="Tagline" value={profile.tagline} onChange={(v) => set("tagline", v)} placeholder="One line that says it all" />
        <Field label="Genre" value={profile.genre} onChange={(v) => set("genre", v)} placeholder="Outlaw country" />
        <Field label="Origin" value={profile.origin} onChange={(v) => set("origin", v)} placeholder="Denver, CO" />
        <Field label="Founded" value={profile.founded} onChange={(v) => set("founded", v)} placeholder="2008" />

        {/* Images */}
        <Divider label="Images" />
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <ImageUpload label="Hero Photo" value={profile.heroImage} onChange={(v) => set("heroImage", v)} role="hero" slug={slug} size={160} />
          <ImageUpload label="Album Art" value={profile.albumArt} onChange={(v) => set("albumArt", v)} role="album" slug={slug} size={160} />
        </div>

        {/* Bio */}
        <Divider label="Bio" />
        <Field label="Artist Bio" value={profile.bio} onChange={(v) => set("bio", v)} placeholder="Your story." multiline />

        {/* Members */}
        <Divider label="Members" />
        <MemberList members={profile.members} onChange={(m) => setProfile((p) => ({ ...p, members: m }))} />

        {/* Contact */}
        <Divider label="Contact" />
        <Field label="Email" value={profile.contactEmail} onChange={(v) => set("contactEmail", v)} placeholder="you@email.com" type="email" />
        <Field label="Booking" value={profile.bookingEmail} onChange={(v) => set("bookingEmail", v)} placeholder="booking@agency.com" type="email" />

        {/* Streaming */}
        <Divider label="Streaming" />
        <Field label="Spotify" value={profile.spotify} onChange={(v) => set("spotify", v)} placeholder="https://open.spotify.com/artist/…" />
        <Field label="Apple Music" value={profile.appleMusic} onChange={(v) => set("appleMusic", v)} placeholder="https://music.apple.com/…" />

        {/* Social */}
        <Divider label="Social" />
        <Field label="Instagram" value={profile.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/yourhandle" />

        {/* Submit */}
        <div style={{ paddingTop: "1rem" }}>
          <button onClick={handleSubmit} disabled={saving} style={{
            background: "transparent",
            border: "1px solid rgba(196,168,50,0.4)",
            color: "#c4a832",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem", letterSpacing: "0.1em",
            fontWeight: 500, textTransform: "uppercase",
            padding: "14px 32px", borderRadius: 3,
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.5 : 1,
            transition: "opacity 0.3s",
          }}>
            {saving ? "saving…" : "build my site →"}
          </button>
        </div>

      </div>
    </main>
  );
}
