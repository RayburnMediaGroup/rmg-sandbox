"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileData } from "@/lib/bandProfile";
import { supabase } from "@/lib/supabase";

// ─── Types ─────────────────────────────────────────────────────────

interface MemberEntry { name: string; role: string; }

interface FormState {
  name: string;
  genre: string;
  origin: string;
  founded: string;
  tagline: string;
  bio: string;
  members: MemberEntry[];
  bookingContact: string;
  bookingEmail: string;
  spotify: string;
  appleMusic: string;
  youtube: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

const BLANK: FormState = {
  name: "", genre: "Americana", origin: "", founded: "",
  tagline: "", bio: "",
  members: [{ name: "", role: "" }],
  bookingContact: "", bookingEmail: "",
  spotify: "", appleMusic: "", youtube: "",
  instagram: "", facebook: "", tiktok: "",
};

const GENRES = ["Americana", "Rock", "Country", "Folk", "Blues", "R&B", "Pop", "Hip-Hop", "Jazz", "Electronic", "Metal", "Indie", "Soul", "Punk", "Classical", "Other"];

const TEMPLATE_KEY = "bandstack-template-v1";
const DATA_VERSION = "v5";

// ─── Styles ────────────────────────────────────────────────────────

const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };

const inputStyle: React.CSSProperties = {
  ...T, width: "100%", background: "#0e0e0e",
  border: "1px solid #2e2e2e", borderRadius: 6,
  color: "#d8d8d8", padding: "12px 16px",
  fontSize: "0.95rem", outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  ...T, fontSize: "0.6rem", letterSpacing: "0.14em",
  textTransform: "uppercase", color: "#555", fontWeight: 500,
  display: "block", marginBottom: "0.4rem",
};

const sectionHead: React.CSSProperties = {
  ...T, fontSize: "1.1rem", fontWeight: 400, color: "#d8d8d8",
  marginBottom: "0.25rem",
};

const sectionSub: React.CSSProperties = {
  ...T, fontSize: "0.82rem", color: "#555", fontWeight: 300,
  marginBottom: "1.5rem", lineHeight: 1.6,
};

const divider: React.CSSProperties = {
  border: "none", borderTop: "1px solid #1e1e1e", margin: "2rem 0",
};

// ─── Field components ──────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
    />
  );
}

// ─── Steps ────────────────────────────────────────────────────────

const STEPS = [
  { id: "identity", label: "Identity" },
  { id: "bio", label: "Bio" },
  { id: "members", label: "Members" },
  { id: "booking", label: "Booking" },
  { id: "links", label: "Links" },
];

// ─── Main component ────────────────────────────────────────────────

export default function IntakeForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>(BLANK);
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setF(prev => ({ ...prev, [k]: v }));
  }

  function addMember() {
    setF(prev => ({ ...prev, members: [...prev.members, { name: "", role: "" }] }));
  }

  function updateMember(i: number, field: keyof MemberEntry, v: string) {
    setF(prev => {
      const next = [...prev.members];
      next[i] = { ...next[i], [field]: v };
      return { ...prev, members: next };
    });
  }

  function removeMember(i: number) {
    setF(prev => ({ ...prev, members: prev.members.filter((_, idx) => idx !== i) }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return f.name.trim().length > 0 && f.genre.trim().length > 0;
      case 1: return f.bio.trim().length > 0;
      case 2: return f.members.some(m => m.name.trim().length > 0);
      case 3: return f.bookingEmail.trim().includes("@");
      case 4: return true;
      default: return true;
    }
  }

  function buildProfile(): ProfileData {
    return {
      name: f.name.trim(),
      contactEmail: f.bookingEmail.trim(),
      genre: f.genre,
      tagline: f.tagline.trim() || `${f.name.trim()} · ${f.genre}`,
      origin: f.origin.trim(),
      founded: f.founded.trim(),
      bio: f.bio.trim(),
      members: f.members.filter(m => m.name.trim()).map(m => ({ name: m.name.trim(), role: m.role.trim() })),
      releases: [],
      shows: [],
      bookingEmail: f.bookingEmail.trim(),
      bookingContact: f.bookingContact.trim(),
      instagram: f.instagram.trim(),
      spotify: f.spotify.trim(),
      appleMusic: f.appleMusic.trim(),
      youtube: f.youtube.trim(),
      facebook: f.facebook.trim(),
      tiktok: f.tiktok.trim(),
      heroImage: "",
      coverImage: "",
      albumArt: "",
      colorMode: "dark",
      links: buildLinks(f),
      gear: [],
      videos: [],
      showHistory: [],
      venues: [],
    };
  }

  function buildLinks(f: FormState) {
    const links = [];
    if (f.spotify) links.push({ label: "Spotify", url: f.spotify, category: "Streaming" as const });
    if (f.appleMusic) links.push({ label: "Apple Music", url: f.appleMusic, category: "Streaming" as const });
    if (f.youtube) links.push({ label: "YouTube", url: f.youtube, category: "Video" as const });
    if (f.instagram) links.push({ label: "Instagram", url: f.instagram, category: "Social" as const });
    if (f.facebook) links.push({ label: "Facebook", url: f.facebook, category: "Social" as const });
    if (f.tiktok) links.push({ label: "TikTok", url: f.tiktok, category: "Social" as const });
    return links;
  }

  function toSlug(name: string): string {
    return name.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function submit() {
    setSubmitted(true);
    const profile = buildProfile();
    const baseSlug = toSlug(f.name) || "band";

    // Try slug, append number if taken
    let slug = baseSlug;
    let attempts = 0;
    while (attempts < 10) {
      const { data } = await supabase.from("bands").select("id").eq("slug", slug).maybeSingle();
      if (!data) break;
      attempts++;
      slug = `${baseSlug}-${attempts}`;
    }

    const { error } = await supabase.from("bands").insert({ slug, profile });

    if (error) {
      console.error("Supabase insert error:", error.message, error.code, error.details);
      // Fallback: localStorage only
      try {
        localStorage.setItem(TEMPLATE_KEY, JSON.stringify(profile));
        localStorage.setItem(`${TEMPLATE_KEY}-dataversion`, DATA_VERSION);
        sessionStorage.setItem(`bandstack-unlocked-${TEMPLATE_KEY}`, "1");
        sessionStorage.setItem(`bandstack-editmode-${TEMPLATE_KEY}`, "1");
      } catch {}
      router.push("/bandstack/template");
    } else {
      router.push(`/bandstack/${slug}`);
    }
  }

  // ── Submitted screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c8a86b", margin: "0 auto 2rem", animation: "breathe 2.8s ease-in-out infinite" }} />
          <p style={{ ...T, fontSize: "1rem", color: "#888", fontWeight: 300, letterSpacing: "0.04em" }}>
            building {f.name || "your page"}…
          </p>
          <style>{`@keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.5);opacity:1} }`}</style>
        </div>
      </div>
    );
  }

  const accent = "#c8a86b";

  const btnPrimary: React.CSSProperties = {
    ...T, background: accent, color: "#0a0a0a", border: "none",
    borderRadius: 6, padding: "12px 28px", fontSize: "0.82rem",
    fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
    cursor: canAdvance() ? "pointer" : "not-allowed",
    opacity: canAdvance() ? 1 : 0.35,
    transition: "opacity 0.15s",
  };

  const btnSecondary: React.CSSProperties = {
    ...T, background: "transparent", color: "#555", border: "1px solid #2e2e2e",
    borderRadius: 6, padding: "12px 28px", fontSize: "0.82rem",
    fontWeight: 400, letterSpacing: "0.04em", cursor: "pointer",
  };

  // ── Step content ──────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <p style={sectionHead}>Who are you?</p>
            <p style={sectionSub}>Start with the basics — your name and your sound.</p>
            <Field label="Artist / Band Name *">
              <Input value={f.name} onChange={v => set("name", v)} placeholder="e.g. Ryan Chrys & The Rough Cuts" />
            </Field>
            <Field label="Genre *">
              <select value={f.genre} onChange={e => set("genre", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Origin (City, State)">
              <Input value={f.origin} onChange={v => set("origin", v)} placeholder="e.g. Nashville, TN" />
            </Field>
            <Field label="Year Founded">
              <Input value={f.founded} onChange={v => set("founded", v)} placeholder="e.g. 2018" />
            </Field>
            <Field label="Tagline">
              <Input value={f.tagline} onChange={v => set("tagline", v)} placeholder="One line that captures your sound" />
            </Field>
          </>
        );
      case 1:
        return (
          <>
            <p style={sectionHead}>Tell your story.</p>
            <p style={sectionSub}>2–4 paragraphs. Origin, sound, what drives you, where you&apos;ve been.</p>
            <Field label="Bio *">
              <Textarea value={f.bio} onChange={v => set("bio", v)} placeholder={`${f.name || "Your band"} formed in…`} rows={10} />
            </Field>
          </>
        );
      case 2:
        return (
          <>
            <p style={sectionHead}>Who&apos;s in the band?</p>
            <p style={sectionSub}>Add each member — name and role. You can edit this later.</p>
            {f.members.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "center" }}>
                <input
                  value={m.name}
                  onChange={e => updateMember(i, "name", e.target.value)}
                  placeholder="Member name"
                  style={inputStyle}
                />
                <input
                  value={m.role}
                  onChange={e => updateMember(i, "role", e.target.value)}
                  placeholder="Role (e.g. Guitar)"
                  style={inputStyle}
                />
                <button onClick={() => removeMember(i)} style={{ ...T, background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "1rem", padding: "0 4px" }}>✕</button>
              </div>
            ))}
            <button onClick={addMember} style={{ ...T, background: "transparent", border: "1px dashed #2e2e2e", borderRadius: 6, color: accent, padding: "10px 20px", fontSize: "0.8rem", cursor: "pointer", letterSpacing: "0.06em" }}>
              + Add Member
            </button>
          </>
        );
      case 3:
        return (
          <>
            <p style={sectionHead}>How do venues reach you?</p>
            <p style={sectionSub}>Booking contact info — shown on your page.</p>
            <Field label="Booking Contact Name">
              <Input value={f.bookingContact} onChange={v => set("bookingContact", v)} placeholder="Name or agency" />
            </Field>
            <Field label="Booking Email *">
              <Input value={f.bookingEmail} onChange={v => set("bookingEmail", v)} placeholder="booking@yourband.com" type="email" />
            </Field>
          </>
        );
      case 4:
        return (
          <>
            <p style={sectionHead}>Where do fans find you?</p>
            <p style={sectionSub}>Add what you have — everything is optional and editable later.</p>
            <hr style={divider} />
            <p style={{ ...T, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: "1rem" }}>Streaming</p>
            <Field label="Spotify"><Input value={f.spotify} onChange={v => set("spotify", v)} placeholder="https://open.spotify.com/artist/…" /></Field>
            <Field label="Apple Music"><Input value={f.appleMusic} onChange={v => set("appleMusic", v)} placeholder="https://music.apple.com/…" /></Field>
            <hr style={divider} />
            <p style={{ ...T, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: "1rem" }}>Social</p>
            <Field label="YouTube"><Input value={f.youtube} onChange={v => set("youtube", v)} placeholder="https://youtube.com/@…" /></Field>
            <Field label="Instagram"><Input value={f.instagram} onChange={v => set("instagram", v)} placeholder="https://instagram.com/…" /></Field>
            <Field label="Facebook"><Input value={f.facebook} onChange={v => set("facebook", v)} placeholder="https://facebook.com/…" /></Field>
            <Field label="TikTok"><Input value={f.tiktok} onChange={v => set("tiktok", v)} placeholder="https://tiktok.com/@…" /></Field>
          </>
        );
      default:
        return null;
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <style>{`
        * { box-sizing: border-box; }
        input, textarea, select { font-family: Inter, system-ui, sans-serif; }
        input:focus, textarea:focus, select:focus { border-color: ${accent} !important; }
        input::placeholder, textarea::placeholder { color: #333; }
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.5);opacity:1} }
      `}</style>

      {/* Progress bar */}
      <div style={{ height: 2, background: "#1a1a1a", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: "100%", background: accent, width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 0.3s ease" }} />
      </div>

      {/* Header */}
      <div style={{ padding: "2rem 2rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ ...T, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#333", fontWeight: 400 }}>
          BandStack
        </p>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= step ? accent : "#1e1e1e", transition: "background 0.2s" }} />
          ))}
        </div>
      </div>

      {/* Form body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>

          {/* Step label */}
          <p style={{ ...T, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginBottom: "1.5rem", fontWeight: 500 }}>
            {step + 1} / {STEPS.length} · {STEPS[step].label}
          </p>

          {renderStep()}

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2.5rem", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {step > 0 && (
                <button style={btnSecondary} onClick={() => setStep(s => s - 1)}>
                  ← Back
                </button>
              )}
            </div>
            <button
              style={btnPrimary}
              disabled={!canAdvance()}
              onClick={() => {
                if (!canAdvance()) return;
                if (isLast) {
                  submit();
                } else {
                  setStep(s => s + 1);
                }
              }}
            >
              {isLast ? "Build My Page →" : "Continue →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
