"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { resolveTokens, applyMode } from "@/lib/genreTokens";
import { artist, releases as dataReleases, shows as dataShows } from "@/lib/data";

const PROFILE_KEY = "bandstack-profile-v1";

interface ProfileMember { name: string; role: string; }
interface ProfileTrack { number: number; title: string; duration?: string; }
interface ProfileRelease {
  title: string; type: "album" | "ep" | "single" | "live";
  year: string; description: string; spotifyUrl: string; coverArt: string;
  tracks?: ProfileTrack[];
}
interface ProfileShow {
  date: string; venue: string; city: string; state?: string;
  ticketUrl?: string; status?: string; notes?: string;
}
interface ProfileData {
  name: string; contactEmail: string; genre: string; tagline: string;
  origin: string; founded: string; bio: string; members: ProfileMember[];
  releases: ProfileRelease[]; shows?: ProfileShow[];
  bookingEmail: string; instagram: string; spotify: string; appleMusic: string;
  youtube?: string; facebook?: string; tiktok?: string;
  heroImage: string; albumArt: string; colorMode: "dark" | "light";
  pressQuotes?: { quote: string; source: string; year?: number }[];
  awards?: string[];
  bookingContact?: string;
}

const DEMO_PROFILE: ProfileData = {
  name: artist.name,
  contactEmail: artist.bookingEmail ?? "",
  genre: artist.genre[0] ?? "",
  tagline: artist.tagline,
  origin: artist.origin,
  founded: String(artist.founded),
  bio: artist.bio.join(" "),
  members: artist.members.map(m => ({ name: m.name, role: m.role })),
  releases: dataReleases.map(r => ({
    title: r.title,
    type: r.type as "album" | "ep" | "single" | "live",
    year: new Date(r.releaseDate).getFullYear().toString(),
    description: r.description ?? "",
    spotifyUrl: r.streamingLinks.spotify ?? "",
    coverArt: r.coverArt ?? "",
    tracks: r.tracks.map(t => ({ number: t.number, title: t.title, duration: t.duration })),
  })),
  shows: dataShows.map(s => ({
    date: s.date, venue: s.venue, city: s.city, state: s.state,
    ticketUrl: s.ticketUrl, status: s.status, notes: s.notes,
  })),
  bookingEmail: artist.bookingEmail ?? "",
  bookingContact: artist.bookingContact,
  instagram: artist.socialLinks.instagram ?? "",
  spotify: artist.streamingLinks.spotify ?? "",
  appleMusic: artist.streamingLinks.appleMusic ?? "",
  youtube: artist.socialLinks.youtube ?? "",
  facebook: artist.socialLinks.facebook ?? "",
  tiktok: artist.socialLinks.tiktok ?? "",
  heroImage: "",
  albumArt: "",
  colorMode: "dark",
  pressQuotes: artist.pressQuotes?.map(q => ({ quote: q.quote, source: q.source, year: q.year })),
  awards: artist.awards,
};

export default function StagePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeRelease, setActiveRelease] = useState(0);
  const [activeSection, setActiveSection] = useState("music");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) { setProfile(JSON.parse(saved) as ProfileData); return; }
      const intake = localStorage.getItem("bandstack-intake-v2");
      if (intake) {
        const d = JSON.parse(intake) as { name?: string; contactEmail?: string; genre?: string | string[] };
        const genre = Array.isArray(d.genre) ? d.genre[0] : d.genre || "";
        setProfile({ ...DEMO_PROFILE, name: d.name || DEMO_PROFILE.name, contactEmail: d.contactEmail || "", genre });
        return;
      }
    } catch {}
    setProfile(DEMO_PROFILE);
  }, []);

  if (!profile) return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(232,232,232,0.2)" }}>loading…</p>
    </main>
  );

  const tokens = applyMode(resolveTokens(profile.genre ? [profile.genre] : []), profile.colorMode ?? "dark");
  const acc = tokens.accent;
  const isLt = profile.colorMode === "light";
  const releases = profile.releases?.length > 0 ? profile.releases : [];
  const release = releases[activeRelease] ?? releases[0];
  const members = (profile.members || []).filter(m => m.name.trim());
  const upcomingShows = (profile.shows || []).filter(s => s.status !== "past");
  const pastShows = (profile.shows || []).filter(s => s.status === "past");

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.6rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.88rem", color: tokens.text, fontWeight: 300, lineHeight: 1.75 };

  const formatDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const NAV_ITEMS = ["music", "shows", "about", "contact"];

  return (
    <main style={{ background: tokens.bg, minHeight: "100vh", color: tokens.text, ...T }}>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: isLt ? "rgba(245,245,245,0.92)" : "rgba(10,10,10,0.88)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${tokens.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 52,
      }}>
        <span style={{ ...T, fontWeight: 700, fontSize: "0.9rem", color: tokens.text, letterSpacing: "0.01em" }}>
          {profile.name || "BandStack"}
        </span>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {NAV_ITEMS.map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{
              background: activeSection === s ? acc : "transparent",
              border: "none", cursor: "pointer",
              color: activeSection === s ? (isLt ? "#fff" : "#000") : tokens.muted,
              ...T, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase",
              fontWeight: activeSection === s ? 600 : 400,
              padding: "6px 14px", borderRadius: 4,
            }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {profile.spotify && <a href={profile.spotify} target="_blank" rel="noreferrer" style={{ ...lbl, color: acc, textDecoration: "none" }}>Spotify</a>}
          {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Instagram</a>}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        padding: "72px 40px 56px",
        borderBottom: `1px solid ${tokens.border}`,
        background: isLt
          ? `linear-gradient(180deg, #ebebeb 0%, ${tokens.bg} 100%)`
          : `linear-gradient(180deg, #111 0%, ${tokens.bg} 100%)`,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ ...lbl, color: acc, marginBottom: "1rem" }}>{profile.genre} · {profile.origin}</p>
          <h1 style={{ ...T, fontWeight: 800, fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: tokens.text, lineHeight: 1, margin: "0 0 1.25rem", letterSpacing: "-0.02em" }}>
            {profile.name || "Your Artist Name"}
          </h1>
          {profile.tagline && (
            <p style={{ ...body, color: tokens.muted, fontSize: "1rem", maxWidth: 560, marginBottom: "2rem" }}>{profile.tagline}</p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {profile.spotify && (
              <a href={profile.spotify} target="_blank" rel="noreferrer" style={{
                background: acc, color: isLt ? "#fff" : "#000",
                ...T, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em",
                textTransform: "uppercase", textDecoration: "none",
                padding: "11px 24px", borderRadius: 4,
              }}>Listen on Spotify</a>
            )}
            {profile.bookingEmail && (
              <a href={`mailto:${profile.bookingEmail}`} style={{
                border: `1px solid ${tokens.border2}`, color: tokens.muted,
                ...T, fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase",
                textDecoration: "none", padding: "10px 22px", borderRadius: 4,
              }}>Book the Band</a>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>

        {/* MUSIC */}
        {activeSection === "music" && (
          <div style={{ paddingTop: 48, paddingBottom: 64 }}>

            {/* Album scroll strip */}
            {releases.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ ...lbl, marginBottom: "1rem" }}>Discography</p>
                <div style={{ overflowX: "auto", marginLeft: -40, marginRight: -40, paddingLeft: 40, paddingRight: 40 }}>
                  <div style={{ display: "flex", gap: "1rem", paddingBottom: "1rem", width: "max-content" }}>
                    {releases.map((r, i) => (
                      <button key={i} onClick={() => setActiveRelease(i)} style={{
                        background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
                      }}>
                        <div style={{
                          width: 120, height: 120, borderRadius: 6, marginBottom: "0.5rem",
                          background: isLt ? "#e0e0e0" : "#161616",
                          border: `2px solid ${i === activeRelease ? acc : tokens.border}`,
                          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {r.coverArt
                            ? <img src={r.coverArt} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={i === activeRelease ? acc : tokens.muted2} strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                          }
                        </div>
                        <p style={{ ...T, fontSize: "0.75rem", fontWeight: i === activeRelease ? 500 : 300, color: i === activeRelease ? acc : tokens.muted, width: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</p>
                        <p style={{ ...lbl, marginTop: "0.15rem" }}>{r.type} · {r.year}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Selected release detail */}
            {release && (
              <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "1.75rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 6, flexShrink: 0,
                    background: isLt ? "#ddd" : "#181818", border: `1px solid ${tokens.border}`,
                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {release.coverArt
                      ? <img src={release.coverArt} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ ...T, fontWeight: 700, fontSize: "1.4rem", color: tokens.text, margin: "0 0 0.3rem" }}>{release.title}</h2>
                    <p style={{ ...lbl }}>{release.type} · {release.year}</p>
                    {release.description && <p style={{ ...body, color: tokens.muted, fontSize: "0.82rem", marginTop: "0.5rem" }}>{release.description}</p>}
                  </div>
                  {release.spotifyUrl && (
                    <a href={release.spotifyUrl} target="_blank" rel="noreferrer" style={{
                      background: acc, color: isLt ? "#fff" : "#000",
                      ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em",
                      textTransform: "uppercase", textDecoration: "none",
                      padding: "8px 16px", borderRadius: 4, flexShrink: 0,
                    }}>Listen</a>
                  )}
                </div>

                {/* Tracklist */}
                {release.tracks && release.tracks.length > 0 && (
                  <div style={{ borderTop: `1px solid ${tokens.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 72px", padding: "8px 8px 6px", borderBottom: `1px solid ${tokens.border}` }}>
                      <span style={lbl}>#</span>
                      <span style={lbl}>Title</span>
                      <span style={{ ...lbl, textAlign: "right" }}>Time</span>
                    </div>
                    {release.tracks.map(t => (
                      <div key={t.number} style={{ display: "grid", gridTemplateColumns: "32px 1fr 72px", padding: "10px 8px", borderBottom: `1px solid ${tokens.border}`, alignItems: "center" }}>
                        <span style={{ ...lbl, color: tokens.muted2 }}>{t.number}</span>
                        <span style={{ ...body, fontSize: "0.85rem" }}>{t.title}</span>
                        <span style={{ ...lbl, textAlign: "right" }}>{t.duration || "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SHOWS */}
        {activeSection === "shows" && (
          <div style={{ paddingTop: 48, paddingBottom: 64 }}>
            <h2 style={{ ...T, fontWeight: 700, fontSize: "1.6rem", color: tokens.text, margin: "0 0 2rem" }}>Shows</h2>

            {upcomingShows.length === 0 && pastShows.length === 0 && (
              <p style={{ ...body, color: tokens.muted }}>No shows listed yet.</p>
            )}

            {upcomingShows.length > 0 && (
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ ...lbl, color: acc, marginBottom: "1rem" }}>Upcoming</p>
                {upcomingShows.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: "1.5rem", padding: "16px 0", borderBottom: `1px solid ${tokens.border}`, alignItems: "center" }}>
                    <div>
                      <p style={{ ...T, fontWeight: 500, fontSize: "0.85rem", color: tokens.text }}>{formatDate(s.date)}</p>
                    </div>
                    <div>
                      <p style={{ ...T, fontWeight: 500, fontSize: "0.95rem", color: tokens.text }}>{s.venue}</p>
                      <p style={{ ...lbl, marginTop: "0.2rem" }}>{s.city}{s.state ? `, ${s.state}` : ""}</p>
                      {s.notes && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.2rem" }}>{s.notes}</p>}
                    </div>
                    {s.ticketUrl
                      ? <a href={s.ticketUrl} target="_blank" rel="noreferrer" style={{ background: acc, color: isLt ? "#fff" : "#000", ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "8px 16px", borderRadius: 4 }}>Tickets</a>
                      : <span style={{ ...lbl }}>Free / RSVP</span>
                    }
                  </div>
                ))}
              </div>
            )}

            {pastShows.length > 0 && (
              <div>
                <p style={{ ...lbl, color: tokens.muted2, marginBottom: "0.75rem" }}>Past</p>
                {pastShows.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1.5rem", padding: "12px 0", borderBottom: `1px solid ${tokens.border}`, alignItems: "start" }}>
                    <p style={{ ...lbl, color: tokens.muted2, lineHeight: 1.6 }}>{formatDate(s.date)}</p>
                    <div>
                      <p style={{ ...body, fontSize: "0.85rem", color: tokens.muted }}>{s.venue}</p>
                      <p style={{ ...lbl, marginTop: "0.15rem" }}>{s.city}{s.state ? `, ${s.state}` : ""}</p>
                      {s.notes && <p style={{ ...lbl, color: tokens.muted2, marginTop: "0.15rem" }}>{s.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABOUT */}
        {activeSection === "about" && (
          <div style={{ paddingTop: 48, paddingBottom: 64 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "3rem", alignItems: "start" }}>
              <div>
                <h2 style={{ ...T, fontWeight: 700, fontSize: "1.6rem", color: tokens.text, margin: "0 0 1.5rem" }}>About</h2>
                {profile.bio && <p style={{ ...body, color: tokens.muted, marginBottom: "2rem" }}>{profile.bio}</p>}

                {/* Press */}
                {profile.pressQuotes && profile.pressQuotes.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <p style={{ ...lbl, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${tokens.border}` }}>Press</p>
                    {profile.pressQuotes.map((q, i) => (
                      <div key={i} style={{ marginBottom: "1.5rem" }}>
                        <p style={{ ...body, color: tokens.muted, fontStyle: "italic", fontSize: "0.9rem" }}>"{q.quote}"</p>
                        <p style={{ ...lbl, marginTop: "0.4rem" }}>— {q.source}{q.year ? `, ${q.year}` : ""}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Awards */}
                {profile.awards && profile.awards.length > 0 && (
                  <div>
                    <p style={{ ...lbl, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${tokens.border}` }}>Awards</p>
                    {profile.awards.map((a, i) => (
                      <p key={i} style={{ ...body, color: tokens.muted, fontSize: "0.82rem", marginBottom: "0.5rem" }}>
                        <span style={{ color: acc, marginRight: "0.5rem" }}>·</span>{a}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Members */}
                {members.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <p style={{ ...lbl, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${tokens.border}` }}>Members</p>
                    {members.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${tokens.border}` }}>
                        <span style={{ ...body, fontSize: "0.82rem" }}>{m.name}</span>
                        {m.role && <span style={{ ...lbl, textAlign: "right", maxWidth: "55%", lineHeight: 1.5 }}>{m.role}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Stage plot link */}
                <div style={{ marginBottom: "2rem" }}>
                  <p style={{ ...lbl, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${tokens.border}` }}>For Venues</p>
                  <Link href="/band/stage-plot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${tokens.border}`, textDecoration: "none" }}>
                    <span style={{ ...body, fontSize: "0.82rem" }}>Stage Plot &amp; Tech Rider</span>
                    <span style={{ ...lbl, color: acc }}>View →</span>
                  </Link>
                  <a href={`mailto:${profile.bookingEmail}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${tokens.border}`, textDecoration: "none" }}>
                    <span style={{ ...body, fontSize: "0.82rem" }}>Press Kit / EPK</span>
                    <span style={{ ...lbl, color: tokens.muted2 }}>Request →</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeSection === "contact" && (
          <div style={{ paddingTop: 48, paddingBottom: 64 }}>
            <h2 style={{ ...T, fontWeight: 700, fontSize: "1.6rem", color: tokens.text, margin: "0 0 0.5rem" }}>Contact</h2>
            <p style={{ ...body, color: tokens.muted, marginBottom: "2.5rem" }}>Booking, press, and general inquiries.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {/* Booking */}
              <div style={{ background: isLt ? "#f0f0f0" : "#111", border: `1px solid ${tokens.border}`, borderRadius: 8, padding: "24px" }}>
                <p style={{ ...lbl, color: acc, marginBottom: "0.75rem" }}>Booking</p>
                {profile.bookingContact && <p style={{ ...T, fontWeight: 500, fontSize: "0.9rem", color: tokens.text, marginBottom: "0.3rem" }}>{profile.bookingContact}</p>}
                <a href={`mailto:${profile.bookingEmail}`} style={{ ...body, color: acc, fontSize: "0.85rem", textDecoration: "none" }}>{profile.bookingEmail}</a>
                <div style={{ marginTop: "1.25rem" }}>
                  <Link href="/band/stage-plot" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Stage Plot & Tech Rider →</Link>
                </div>
              </div>

              {/* Social */}
              <div style={{ background: isLt ? "#f0f0f0" : "#111", border: `1px solid ${tokens.border}`, borderRadius: 8, padding: "24px" }}>
                <p style={{ ...lbl, color: tokens.muted2, marginBottom: "0.75rem" }}>Social &amp; Streaming</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {profile.spotify && <a href={profile.spotify} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: acc, textDecoration: "none" }}>Spotify →</a>}
                  {profile.appleMusic && <a href={profile.appleMusic} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: acc, textDecoration: "none" }}>Apple Music →</a>}
                  {profile.youtube && <a href={profile.youtube} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: tokens.muted, textDecoration: "none" }}>YouTube →</a>}
                  {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: tokens.muted, textDecoration: "none" }}>Instagram →</a>}
                  {profile.facebook && <a href={profile.facebook} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: tokens.muted, textDecoration: "none" }}>Facebook →</a>}
                  {profile.tiktok && <a href={profile.tiktok} target="_blank" rel="noreferrer" style={{ ...body, fontSize: "0.82rem", color: tokens.muted, textDecoration: "none" }}>TikTok →</a>}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${tokens.border}`, padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ ...lbl, color: tokens.muted2 }}>{profile.name}{profile.founded ? ` · Est. ${profile.founded}` : ""}</p>
        <p style={{ ...lbl, color: tokens.muted2 }}>Powered by BandStack</p>
      </footer>
    </main>
  );
}
