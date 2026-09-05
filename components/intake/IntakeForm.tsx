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
  managerName: string;
  managerEmail: string;
  agentName: string;
  agentEmail: string;
  label: string;
  website: string;
  epk: string;
  merch: string;
  // Streaming
  spotify: string;
  appleMusic: string;
  soundcloud: string;
  bandcamp: string;
  tidal: string;
  amazonMusic: string;
  // Video
  youtube: string;
  vimeo: string;
  // Social
  instagram: string;
  facebook: string;
  tiktok: string;
  twitter: string;
  threads: string;
}

const BLANK: FormState = {
  name: "", genre: "Americana", origin: "", founded: "",
  tagline: "", bio: "",
  members: [{ name: "", role: "" }],
  bookingContact: "", bookingEmail: "",
  managerName: "", managerEmail: "",
  agentName: "", agentEmail: "",
  label: "", website: "", epk: "", merch: "",
  spotify: "", appleMusic: "", soundcloud: "", bandcamp: "", tidal: "", amazonMusic: "",
  youtube: "", vimeo: "",
  instagram: "", facebook: "", tiktok: "", twitter: "", threads: "",
};

const GENRES = ["Americana", "Rock", "Country", "Folk", "Blues", "R&B", "Pop", "Hip-Hop", "Jazz", "Electronic", "Metal", "Indie", "Soul", "Punk", "Classical", "Other"];

const TEMPLATE_KEY = "bandstack-template-v1";
const DATA_VERSION = "v5";

// ─── Styles ────────────────────────────────────────────────────────

const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
const GOLD = "#d4a843";
const GOLD_DIM = "#a07c28";
const GOLD_LINE = "rgba(212,168,67,0.55)";

const inputStyle: React.CSSProperties = {
  ...T, width: "100%", background: "transparent",
  border: "none", borderBottom: `1px solid ${GOLD_LINE}`,
  color: "#d8d8d8", padding: "12px 0",
  fontSize: "0.95rem", outline: "none",
  letterSpacing: "0.01em",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  ...T, fontSize: "0.58rem", letterSpacing: "0.16em",
  textTransform: "uppercase", color: GOLD_DIM, fontWeight: 500,
  display: "block", marginBottom: "0",
};

const sectionHead: React.CSSProperties = {
  ...T, fontSize: "1.5rem", fontWeight: 300, color: "#d8d8d8",
  marginBottom: "0.35rem",
};

const sectionSub: React.CSSProperties = {
  ...T, fontSize: "0.85rem", color: "#888", fontWeight: 300,
  marginBottom: "2rem", lineHeight: 1.6,
};

const divider: React.CSSProperties = {
  border: "none", borderTop: `1px solid ${GOLD_LINE}`, margin: "2rem 0", opacity: 0.4,
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
      twitter: f.twitter.trim(),
      website: f.website.trim(),
      epk: f.epk.trim(),
      merch: f.merch.trim(),
      label: f.label.trim(),
      managerName: f.managerName.trim(),
      managerEmail: f.managerEmail.trim(),
      agentName: f.agentName.trim(),
      agentEmail: f.agentEmail.trim(),
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
    if (f.website) links.push({ label: "Website", url: f.website, category: "Web" as const });
    if (f.epk) links.push({ label: "EPK", url: f.epk, category: "Web" as const });
    if (f.merch) links.push({ label: "Merch", url: f.merch, category: "Web" as const });
    if (f.spotify) links.push({ label: "Spotify", url: f.spotify, category: "Streaming" as const });
    if (f.appleMusic) links.push({ label: "Apple Music", url: f.appleMusic, category: "Streaming" as const });
    if (f.soundcloud) links.push({ label: "SoundCloud", url: f.soundcloud, category: "Streaming" as const });
    if (f.bandcamp) links.push({ label: "Bandcamp", url: f.bandcamp, category: "Streaming" as const });
    if (f.tidal) links.push({ label: "Tidal", url: f.tidal, category: "Streaming" as const });
    if (f.amazonMusic) links.push({ label: "Amazon Music", url: f.amazonMusic, category: "Streaming" as const });
    if (f.youtube) links.push({ label: "YouTube", url: f.youtube, category: "Video" as const });
    if (f.vimeo) links.push({ label: "Vimeo", url: f.vimeo, category: "Video" as const });
    if (f.instagram) links.push({ label: "Instagram", url: f.instagram, category: "Social" as const });
    if (f.facebook) links.push({ label: "Facebook", url: f.facebook, category: "Social" as const });
    if (f.tiktok) links.push({ label: "TikTok", url: f.tiktok, category: "Social" as const });
    if (f.twitter) links.push({ label: "X / Twitter", url: f.twitter, category: "Social" as const });
    if (f.threads) links.push({ label: "Threads", url: f.threads, category: "Social" as const });
    return links;
  }

  function toSlug(name: string): string {
    return name.toLowerCase().trim()
      .replace(/[&+]/g, "and")      // & and + → "and"
      .replace(/'/g, "")            // apostrophes vanish (O'Brien → obrien)
      .replace(/[^a-z0-9\s-]/g, "") // all other special chars stripped
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");       // trim leading/trailing dashes
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

    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("bands").insert({ slug, profile, user_id: session?.user?.id ?? null });

    if (error) {
      // Show error visibly so we can diagnose
      alert(`Supabase error: ${error.message} (${error.code})`);
      setSubmitted(false);
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

  const accent = GOLD;

  const btnPrimary: React.CSSProperties = {
    ...T, background: canAdvance() ? GOLD : "transparent",
    color: canAdvance() ? "#080808" : GOLD_DIM,
    border: `1px solid ${canAdvance() ? GOLD : GOLD_LINE}`,
    borderRadius: 4, padding: "13px 28px", fontSize: "0.72rem",
    fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
    cursor: canAdvance() ? "pointer" : "not-allowed",
    transition: "all 0.2s",
  };

  const btnSecondary: React.CSSProperties = {
    ...T, background: "transparent", color: "#888",
    border: `1px solid rgba(255,255,255,0.12)`,
    borderRadius: 4, padding: "13px 28px", fontSize: "0.72rem",
    fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase",
    cursor: "pointer", transition: "all 0.2s",
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
              <select value={f.genre} onChange={e => set("genre", e.target.value)} style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
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
                <button onClick={() => removeMember(i)} style={{ ...T, background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "1rem", padding: "0 4px" }}>✕</button>
              </div>
            ))}
            <button onClick={addMember} style={{ ...T, background: "transparent", border: `1px dashed ${GOLD_LINE}`, borderRadius: 4, color: GOLD_DIM, padding: "10px 20px", fontSize: "0.8rem", cursor: "pointer", letterSpacing: "0.06em" }}>
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
            <p style={sectionSub}>Add everything — all optional, editable later. More data means better discovery.</p>

            <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>Web</p>
            <Field label="Official Website"><Input value={f.website} onChange={v => set("website", v)} placeholder="https://yourband.com" /></Field>

            <hr style={divider} />
            <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>Streaming</p>
            <Field label="Spotify"><Input value={f.spotify} onChange={v => set("spotify", v)} placeholder="https://open.spotify.com/artist/…" /></Field>
            <Field label="Apple Music"><Input value={f.appleMusic} onChange={v => set("appleMusic", v)} placeholder="https://music.apple.com/…" /></Field>
            <Field label="SoundCloud"><Input value={f.soundcloud} onChange={v => set("soundcloud", v)} placeholder="https://soundcloud.com/…" /></Field>
            <Field label="Bandcamp"><Input value={f.bandcamp} onChange={v => set("bandcamp", v)} placeholder="https://yourband.bandcamp.com" /></Field>
            <hr style={divider} />
            <p style={{ ...T, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: "1rem" }}>Social</p>
            <Field label="Facebook"><Input value={f.facebook} onChange={v => set("facebook", v)} placeholder="https://facebook.com/…" /></Field>
            <Field label="Instagram"><Input value={f.instagram} onChange={v => set("instagram", v)} placeholder="https://instagram.com/…" /></Field>
            <Field label="TikTok"><Input value={f.tiktok} onChange={v => set("tiktok", v)} placeholder="https://tiktok.com/@…" /></Field>
            <Field label="YouTube"><Input value={f.youtube} onChange={v => set("youtube", v)} placeholder="https://youtube.com/@…" /></Field>
            <Field label="X / Twitter"><Input value={f.twitter} onChange={v => set("twitter", v)} placeholder="https://x.com/…" /></Field>
          </>
        );
      default:
        return null;
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      backgroundImage: "linear-gradient(to bottom, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.86) 40%, rgba(8,8,8,0.92) 100%), url('/red-rocks-hero.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        input, textarea, select { font-family: Inter, system-ui, sans-serif; }
        input:focus, textarea:focus, select:focus { border-bottom-color: ${GOLD} !important; }
        input::placeholder, textarea::placeholder { color: #666; }
        select option { background: #161616; color: #d8d8d8; }
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.5);opacity:1} }
      `}</style>

      {/* Progress bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.08)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: "100%", background: GOLD, width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 0.3s ease" }} />
      </div>

      {/* Header */}
      <div style={{ padding: "2rem 2.5rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic", fontWeight: 400,
          fontSize: "1.3rem", color: "#d8d8d8",
          letterSpacing: "0.04em", margin: 0,
        }}>
          bandwidth
        </p>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= step ? GOLD : "rgba(255,255,255,0.2)", transition: "background 0.2s" }} />
          ))}
        </div>
      </div>

      {/* Form body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>

          {/* Step label */}
          <p style={{ ...T, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD_DIM, marginBottom: "1.5rem", fontWeight: 500 }}>
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
