"use client";

import { useState, useEffect, useRef } from "react";
import { resolveTokens, applyMode } from "@/lib/genreTokens";
import type { Artist, Release, Show } from "@/lib/data";
import { AudioPlayerProvider } from "@/lib/audioContext";
import Schema from "@/components/band/Schema";
import BandTheme from "@/components/band/BandTheme";
import Hero from "@/components/band/Hero";
import LatestRelease from "@/components/band/LatestRelease";
import Discography from "@/components/band/Discography";
import AboutSnippet from "@/components/band/AboutSnippet";
import NewsletterSignup from "@/components/band/NewsletterSignup";
import StreamingFooter from "@/components/band/StreamingFooter";
import MiniPlayer from "@/components/band/MiniPlayer";

const PROFILE_KEY = "bandstack-profile-v1";

interface ProfileMember { name: string; role: string; }
interface ProfileRelease {
  title: string;
  type: "album" | "ep" | "single" | "live";
  year: string;
  description: string;
  spotifyUrl: string;
  coverArt: string;
}
interface ProfileData {
  name: string; contactEmail: string; genre: string; tagline: string;
  origin: string; founded: string; bio: string; members: ProfileMember[];
  releases: ProfileRelease[];
  bookingEmail: string; instagram: string; spotify: string; appleMusic: string;
  heroImage: string; albumArt: string;
  colorMode: "dark" | "light";
}

const EMPTY_PROFILE: ProfileData = {
  name: "", contactEmail: "", genre: "", tagline: "", origin: "",
  founded: "", bio: "", members: [], releases: [], bookingEmail: "",
  instagram: "", spotify: "", appleMusic: "", heroImage: "", albumArt: "",
  colorMode: "dark",
};

const PLACEHOLDER_RELEASE: Release = {
  slug: "debut", title: "Your Album Title", type: "album",
  releaseDate: "2024-01-01",
  tracks: [{ number: 1, title: "Track One" }, { number: 2, title: "Track Two" }, { number: 3, title: "Track Three" }],
  streamingLinks: {}, description: "Add your release in the profile builder.", isFeatured: true,
};
const PLACEHOLDER_SHOWS: Show[] = [];

function toRelease(r: ProfileRelease, idx: number): Release {
  const slug = r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `release-${idx}`;
  return {
    slug, title: r.title || "Untitled", type: r.type,
    releaseDate: r.year ? `${r.year}-01-01` : "2024-01-01",
    coverArt: r.coverArt || undefined,
    tracks: [],
    streamingLinks: { spotify: r.spotifyUrl || undefined },
    description: r.description || undefined,
    isFeatured: idx === 0,
  };
}

function profileToArtist(p: ProfileData): Artist {
  const filled = (p.members || []).filter((m) => m.name.trim());
  const members = filled.length > 0 ? filled : [
    { name: "Vocals", role: "" }, { name: "Guitar", role: "" },
    { name: "Bass", role: "" }, { name: "Drums", role: "" }, { name: "Keys", role: "" },
  ];
  return {
    name: p.name || "Your Artist Name",
    slug: p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "your-artist",
    homeRoute: "/band/preview", tagline: p.tagline || "",
    bio: p.bio ? p.bio.split("\n\n").filter(Boolean) : [],
    origin: p.origin || "",
    genre: p.genre ? [p.genre] : [],
    founded: p.founded ? parseInt(p.founded) : 2020,
    members, pressQuotes: [], awards: [],
    socialLinks: { instagram: p.instagram || undefined },
    streamingLinks: { spotify: p.spotify || undefined, appleMusic: p.appleMusic || undefined },
    bookingEmail: p.bookingEmail || p.contactEmail || undefined,
    pressPhotos: p.heroImage ? [{ label: "Hero", url: p.heroImage }] : [],
    heroImage: p.heroImage || undefined,
    albumArt: p.albumArt || undefined,
  } as Artist;
}

// ─── Inline edit block ────────────────────────────────────────────

function InlineField({
  value, onSave, placeholder, label, multiline = false, accent,
}: {
  value: string; onSave: (v: string) => void; placeholder: string;
  label: string; multiline?: boolean; accent: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  function commit() {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  }

  if (!editing) {
    return (
      <div
        onClick={() => { setDraft(value); setEditing(true); }}
        style={{
          padding: "40px 32px", cursor: "text",
          border: `1px dashed ${accent}22`,
          borderRadius: 8, margin: "0 24px",
          display: "flex", alignItems: "center", gap: "0.75rem",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${accent}66`)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${accent}22`)}
      >
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.72rem", letterSpacing: "0.1em",
          color: `${accent}99`, textTransform: "uppercase",
        }}>
          + {label}
        </span>
        {value && (
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(232,232,232,0.4)", fontWeight: 300 }}>
            {value.slice(0, 60)}{value.length > 60 ? "…" : ""}
          </span>
        )}
      </div>
    );
  }

  const shared: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: `1px solid ${accent}44`, borderRadius: 6,
    color: "#e8e8e8", fontSize: "0.95rem",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300, padding: "16px", outline: "none",
    letterSpacing: "0.01em", lineHeight: 1.7,
    caretColor: accent, resize: "none",
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {multiline ? (
        <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} value={draft}
          onChange={(e) => setDraft(e.target.value)} onBlur={commit}
          placeholder={placeholder} rows={6} style={shared} />
      ) : (
        <input ref={ref as React.RefObject<HTMLInputElement>} value={draft}
          onChange={(e) => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder={placeholder} style={shared} />
      )}
      <button onClick={commit} style={{
        alignSelf: "flex-start", background: accent, border: "none",
        color: "#0e0e0e", fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 600,
        textTransform: "uppercase", padding: "8px 20px", borderRadius: 3, cursor: "pointer",
      }}>save</button>
    </div>
  );
}

// ─── Add Release Form ─────────────────────────────────────────────

const EMPTY_RELEASE: ProfileRelease = { title: "", type: "album", year: "", description: "", spotifyUrl: "", coverArt: "" };

function AddReleaseForm({ onAdd, accent }: { onAdd: (r: ProfileRelease) => void; accent: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProfileRelease>(EMPTY_RELEASE);

  function set(k: keyof ProfileRelease, v: string) { setDraft((d) => ({ ...d, [k]: v })); }

  function submit() {
    if (!draft.title.trim()) return;
    onAdd({ ...draft });
    setDraft(EMPTY_RELEASE);
    setOpen(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid rgba(232,232,232,0.1)", color: "#d8d8d8",
    fontSize: "0.9rem", fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300, padding: "8px 0 10px", outline: "none", caretColor: accent,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.62rem",
    letterSpacing: "0.12em", color: "rgba(232,232,232,0.3)", textTransform: "uppercase",
  };

  if (!open) return (
    <div style={{ padding: "32px 24px" }}>
      <button onClick={() => setOpen(true)} style={{
        background: "none", border: `1px dashed ${accent}44`, borderRadius: 6,
        color: `${accent}99`, fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "12px 24px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}99`; e.currentTarget.style.color = accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.color = `${accent}99`; }}
      >
        + add release
      </button>
    </div>
  );

  return (
    <div style={{
      margin: "0 24px 32px", padding: "28px", borderRadius: 8,
      background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}33`,
      display: "flex", flexDirection: "column", gap: "1.25rem",
    }}>
      <span style={{ ...labelStyle, color: accent }}>New Release</span>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <span style={labelStyle}>Title</span>
          <input value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Album title" style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <span style={labelStyle}>Type</span>
          <select value={draft.type} onChange={(e) => set("type", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
            <option value="album">Album</option>
            <option value="ep">EP</option>
            <option value="single">Single</option>
            <option value="live">Live</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <span style={labelStyle}>Year</span>
          <input value={draft.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span style={labelStyle}>Description</span>
        <textarea value={draft.description} onChange={(e) => set("description", e.target.value)}
          placeholder="What's this release about?" rows={3}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span style={labelStyle}>Spotify URL</span>
        <input value={draft.spotifyUrl} onChange={(e) => set("spotifyUrl", e.target.value)}
          placeholder="https://open.spotify.com/album/…" style={inputStyle} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button onClick={submit} style={{
          background: accent, border: "none", color: "#0e0e0e",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 600,
          textTransform: "uppercase", padding: "10px 24px", borderRadius: 3, cursor: "pointer",
        }}>add release</button>
        <button onClick={() => setOpen(false)} style={{
          background: "none", border: "none", color: "rgba(232,232,232,0.3)",
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.7rem",
          letterSpacing: "0.08em", cursor: "pointer",
        }}>cancel</button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────

export default function BandPreviewPage() {
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) { setProfile(JSON.parse(saved) as ProfileData); return; }
      const intake = localStorage.getItem("bandstack-intake-v2");
      if (intake) {
        const d = JSON.parse(intake) as { name?: string; contactEmail?: string; genre?: string | string[] };
        const genre = Array.isArray(d.genre) ? d.genre[0] : d.genre || "";
        setProfile((p) => ({ ...p, name: d.name || "", contactEmail: d.contactEmail || "", genre }));
      }
    } catch {}
  }, []);

  function update(k: keyof ProfileData, v: string) {
    const next = { ...profile, [k]: v };
    setProfile(next);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch {}
    setDirty(true);
    setTimeout(() => setDirty(false), 1800);
  }

  function addRelease(r: ProfileRelease) {
    const next = { ...profile, releases: [...(profile.releases || []), r] };
    setProfile(next);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch {}
    setDirty(true);
    setTimeout(() => setDirty(false), 1800);
  }

  function removeRelease(idx: number) {
    const next = { ...profile, releases: profile.releases.filter((_, i) => i !== idx) };
    setProfile(next);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch {}
  }

  const artist = profileToArtist(profile);
  const tokens = applyMode(resolveTokens(artist.genre), profile.colorMode ?? "dark");
  const acc = tokens.accent;

  function toggleMode() {
    const next = { ...profile, colorMode: (profile.colorMode === "light" ? "dark" : "light") as "dark" | "light" };
    setProfile(next);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch {}
  }

  return (
    <AudioPlayerProvider>
      {/* Top bar */}
      <div style={{
        background: "#0e0e0e", borderBottom: "1px solid rgba(232,232,232,0.07)",
        padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: dirty ? acc : "rgba(232,232,232,0.25)", textTransform: "uppercase" }}>
            {dirty ? "saved." : "Studio"}
          </span>
          <a href="/band/build" style={{
            fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(232,232,232,0.3)",
            textDecoration: "none", textTransform: "uppercase",
          }}>Builder</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <button onClick={toggleMode} style={{
            background: "none", border: "1px solid rgba(232,232,232,0.12)", borderRadius: 20,
            padding: "4px 12px", cursor: "pointer",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.65rem", letterSpacing: "0.1em",
            color: "rgba(232,232,232,0.45)", textTransform: "uppercase",
          }}>
            {profile.colorMode === "light" ? "◐ Dark" : "◑ Light"}
          </button>
          <a href="/band/stage" style={{
            fontSize: "0.68rem", letterSpacing: "0.08em", color: acc,
            textDecoration: "none", textTransform: "uppercase", fontWeight: 500,
          }}>Stage →</a>
        </div>
      </div>

      <main id="top" style={{ background: tokens.bg, paddingBottom: 80 }}>
        <Schema artist={artist} releases={[PLACEHOLDER_RELEASE]} shows={PLACEHOLDER_SHOWS} canonicalUrl="" />
        <BandTheme tokens={tokens} />
        <Hero artist={artist} featuredRelease={PLACEHOLDER_RELEASE} />

        {/* Tagline inline edit */}
        {!profile.tagline && (
          <InlineField value={profile.tagline} onSave={(v) => update("tagline", v)}
            label="Add tagline" placeholder="One line that says it all" accent={acc} />
        )}

        {/* Bio */}
        {profile.bio ? (
          <div id="about"><AboutSnippet artist={artist} /></div>
        ) : (
          <InlineField value={profile.bio} onSave={(v) => update("bio", v)}
            label="Add your bio" placeholder="Tell your story. Two or three paragraphs." multiline accent={acc} />
        )}

        <div id="music">
          {(() => {
            const releases = (profile.releases || []).length > 0
              ? profile.releases.map(toRelease)
              : [PLACEHOLDER_RELEASE];
            const featured = releases[0];
            return (
              <>
                <LatestRelease release={featured} />
                <Discography releases={releases} featuredSlug={featured.slug} />
                {/* Remove buttons for user's releases */}
                {profile.releases.length > 0 && (
                  <div style={{ padding: "0 24px 8px", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {profile.releases.map((r, i) => (
                      <button key={i} onClick={() => removeRelease(i)} style={{
                        background: "none", border: "1px solid rgba(217,92,92,0.3)", borderRadius: 4,
                        color: "rgba(217,92,92,0.6)", fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "0.65rem", letterSpacing: "0.08em", padding: "4px 10px",
                        cursor: "pointer", textTransform: "uppercase",
                      }}>
                        remove "{r.title}"
                      </button>
                    ))}
                  </div>
                )}
                <AddReleaseForm onAdd={addRelease} accent={acc} />
              </>
            );
          })()}
        </div>

        {/* Streaming */}
        {(profile.spotify || profile.appleMusic) ? (
          <div id="contact">
            <NewsletterSignup artist={artist} />
            <StreamingFooter artist={artist} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "40px 24px" }}>
            <InlineField value={profile.spotify} onSave={(v) => update("spotify", v)}
              label="Add Spotify URL" placeholder="https://open.spotify.com/artist/…" accent={acc} />
            <InlineField value={profile.appleMusic} onSave={(v) => update("appleMusic", v)}
              label="Add Apple Music URL" placeholder="https://music.apple.com/…" accent={acc} />
          </div>
        )}

        <MiniPlayer />
      </main>
    </AudioPlayerProvider>
  );
}
