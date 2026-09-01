"use client";

import { useState, useEffect } from "react";
import { useMobile } from "@/lib/useMobile";
import { resolveTokens } from "@/lib/genreTokens";
import { isUnlocked } from "@/lib/artistAuth";
import PinUnlock from "@/components/band/PinUnlock";
import EditField from "@/components/band/EditField";

const PROFILE = {
  name: "Michael Emanuelle",
  business: "Backstage Flash",
  tagline: "Live Concert Photography · Colorado & Beyond",
  bio: "Michael Emanuelle has spent over a decade with a camera and a backstage pass — from intimate 200-cap clubs to the open stages of Red Rocks Amphitheatre. Backstage Flash was built on one conviction: the best photograph makes you hear the music.",
  origin: "Denver, Colorado",
  founded: "2012",
  stats: [
    { val: "500+", label: "Shows Shot" },
    { val: "15K",  label: "Images" },
    { val: "12yr", label: "In the Pit" },
  ],
  specialties: ["Live Concert", "Festival", "Artist Portraits", "Album Artwork", "Backstage & Editorial"],
  markets: ["Denver, CO", "Boulder, CO", "Red Rocks, CO", "Austin, TX", "Nashville, TN"],
  gear: ["Canon EOS R5", "Canon EF 70–200mm f/2.8L IS III", "Canon EF 24–70mm f/2.8L II", "Canon EF 16–35mm f/2.8L III", "2× Speedlite 600EX II-RT"],
  credits: [
    { artist: "Samantha Fish",                 event: "Ogden Theatre, Denver 2024" },
    { artist: "Ani DiFranco",                  event: "Chautauqua Auditorium, Boulder 2023" },
    { artist: "Elise Trouw",                   event: "Bluebird Theater, Denver 2023" },
    { artist: "Mer.Sal",                       event: "Summit Music Hall, Denver 2024" },
    { artist: "Ryan Chrys & The Rough Cuts",   event: "Grizzly Rose, Denver 2025" },
  ],
  portfolio: [
    { url: "/samantha-fish.jpg",  label: "Samantha Fish — Ogden Theatre" },
    { url: "/samantha2.jpg",      label: "Samantha Fish — in the pit" },
    { url: "/ani-difranco.jpg",   label: "Ani DiFranco — Chautauqua" },
    { url: "/amanda.jpg",         label: "Amanda Anne Platt" },
    { url: "/elise-turrow.jpg",   label: "Elise Trouw — Bluebird" },
    { url: "/mer-sal.jpg",        label: "Mer.Sal — Summit Music Hall" },
    { url: "/featured1.jpg",      label: "Featured editorial" },
    { url: "/crowd1.jpg",         label: "Red Rocks crowd" },
  ],
  contact: {
    email: "backstageflash@gmail.com",
    facebook: "https://www.facebook.com/BackstageFlashLiveConcertPhotography",
  },
  heroImage: "/crowd1.jpg",
  portraitImage: "/owner-photographer-michael-emanuelle.jpg",
  logoImage: "/backstage-flash-logo.jpg",
};

const PROFILE_KEY = "bandstack-backstage-flash-v1";

function savePhotoProfile(p: typeof PROFILE) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
}
function loadPhotoProfile(): typeof PROFILE {
  if (typeof window === "undefined") return PROFILE;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return { ...PROFILE, ...JSON.parse(saved) };
  } catch {}
  return PROFILE;
}

const NAV = [
  { id: "about",     label: "About" },
  { id: "portfolio", label: "Portfolio" },
  { id: "credits",   label: "Credits" },
  { id: "gear",      label: "Gear" },
  { id: "markets",   label: "Markets" },
  { id: "contact",   label: "Contact" },
];

export default function BackstageFlashPage() {
  const isMobile = useMobile();
  const [profile, setProfile] = useState(PROFILE);
  const [active, setActive] = useState("about");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [artistUnlocked, setArtistUnlocked] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    setProfile(loadPhotoProfile());
    setArtistUnlocked(isUnlocked());
  }, []);

  function onUpdate(updates: Partial<typeof PROFILE>) {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      savePhotoProfile(next);
      return next;
    });
  }

  const tokens = resolveTokens(["outlaw country"]);
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid rgba(255,220,150,0.04)`;

  function scrollTo(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ background: tokens.bg, minHeight: "100vh", color: tokens.text, position: "relative" }}>

      {/* Page-wide sample watermark */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        pointerEvents: "none", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${(i % 4) * 28 - 10}%`,
            left: "-20%",
            width: "140%",
            textAlign: "center",
            transform: `translateY(${Math.floor(i / 4) * 180}px) rotate(-30deg)`,
            fontSize: "2.2rem",
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.045)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            SAMPLE USER · SAMPLE USER · SAMPLE USER · SAMPLE USER
          </div>
        ))}
      </div>

      {/* ── HERO — same structure as band hero ───────────────────────────── */}
      <div style={{ borderBottom: border1 }}>

        {/* Cover photo strip */}
        <div style={{ position: "relative", width: "100%", height: isMobile ? 200 : 320, overflow: "hidden", background: tokens.bg }}>
          <img src={PROFILE.heroImage} alt="Backstage Flash concert photography"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)" }} />
        </div>

        {/* Identity row — overlaps cover photo bottom, same offsets as band */}
        <div style={{ padding: isMobile ? "0 16px 24px" : "0 40px 32px", marginTop: isMobile ? -60 : -80, position: "relative" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", gap: isMobile ? "0.75rem" : "1.75rem" }}>

            {/* Logo square — same size/shape as band avatar */}
            <div style={{
              width: isMobile ? 90 : 140, height: isMobile ? 90 : 140,
              borderRadius: 8, flexShrink: 0,
              background: "#111",
              border: `3px solid ${tokens.bg}`, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }}>
              <img src={PROFILE.logoImage} alt="Backstage Flash logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Identity text — same structure as band */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.4rem" }}>
                Live Concert Photography · {PROFILE.origin}
              </p>
              <h1 className="editorial-h1" style={{ fontSize: isMobile ? "clamp(1.6rem, 7vw, 2.4rem)" : "clamp(2rem, 5vw, 3.8rem)", color: tokens.text, margin: "0 0 0.4rem" }}>
                {editMode ? <EditField value={profile.business} onSave={v => onUpdate({ business: v })} accentColor={tokens.accent} style={{ fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit" }} /> : profile.business}
              </h1>
              <p style={{ ...T, fontSize: isMobile ? "0.8rem" : "0.88rem", fontWeight: 300, color: tokens.muted, lineHeight: 1.6, marginBottom: "1rem", maxWidth: 480 }}>
                {editMode ? <EditField value={profile.tagline} onSave={v => onUpdate({ tagline: v })} accentColor={tokens.accent} style={{ fontSize: "inherit" }} /> : profile.tagline}
              </p>
              {/* CTA row — same pattern as band */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                <a href={`mailto:${PROFILE.contact.email}`}
                  style={{ background: tokens.accent, color: "#000", ...T, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "8px 16px", borderRadius: 4 }}>
                  Book
                </a>
                <a href={PROFILE.contact.facebook} target="_blank" rel="noreferrer"
                  style={{ border: `1px solid ${tokens.border}`, color: tokens.muted, ...T, fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", padding: "7px 14px", borderRadius: 4 }}>
                  Facebook ↗
                </a>
              </div>
              {/* Stats chips */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {PROFILE.stats.map(s => (
                  <span key={s.label} style={{ ...lbl, border: `1px solid ${tokens.border}`, background: `${tokens.accent}12`, borderRadius: 3, padding: "3px 8px", fontSize: "0.55rem", color: tokens.muted }}>
                    {s.val} {s.label}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── NAV — identical structure to band nav ─────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: border1, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: `${tokens.bg}dd` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "0 8px" : "0 40px", display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", overflowX: "auto", flex: 1, scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)}
                style={{ ...lbl, background: "none", border: "none", cursor: "pointer",
                  padding: isMobile ? "12px 10px" : "14px 18px",
                  color: active === n.id ? tokens.accent : tokens.muted2,
                  borderBottom: active === n.id ? `2px solid ${tokens.accent}` : "2px solid transparent",
                  whiteSpace: "nowrap", transition: "color 0.2s", flexShrink: 0 }}>
                {n.label}
              </button>
            ))}
          </div>
          {/* Lock / Edit Mode button — same as band */}
          <button
            onClick={() => artistUnlocked ? setEditMode(e => !e) : setShowPinModal(true)}
            title={artistUnlocked ? (editMode ? "Exit Edit Mode" : "Edit Mode") : "Artist Login"}
            style={{
              background: editMode ? `${tokens.accent}22` : artistUnlocked ? `${tokens.accent}11` : "transparent",
              border: `1px solid ${artistUnlocked ? tokens.accent + "55" : tokens.border}`,
              borderRadius: 6, padding: "5px 8px", marginRight: isMobile ? 8 : 0, flexShrink: 0,
              cursor: "pointer", color: artistUnlocked ? tokens.accent : tokens.muted2,
              fontSize: "0.68rem", lineHeight: 1, ...T,
            }}
          >{artistUnlocked ? (editMode ? "✓ Done" : "✏ Edit") : "🔒"}</button>
        </div>
      </div>

      {/* ── SECTIONS ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "0 16px" : "0 40px" }}>

        {/* ABOUT */}
        <section id="about" style={{ borderBottom: border1 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 0" : "48px 0" }}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
              <p className="section-label">About</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "160px 1fr", gap: "2.5rem", alignItems: "start" }}>
              <div style={{ width: isMobile ? 100 : 160, height: isMobile ? 100 : 160, borderRadius: "50%", overflow: "hidden", border: border1, flexShrink: 0 }}>
                <img src={PROFILE.portraitImage} alt={PROFILE.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div>
                <p style={{ ...T, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: tokens.muted2, marginBottom: "0.75rem" }}>
                  {PROFILE.origin} · Est. {PROFILE.founded}
                </p>
                <p style={{ ...T, fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.75, color: tokens.muted, marginBottom: "1.25rem" }}>
                  {editMode
                    ? <EditField value={profile.bio} onSave={v => onUpdate({ bio: v })} multiline accentColor={tokens.accent} style={{ fontSize: "0.9rem", lineHeight: 1.75 }} />
                    : <><span style={{ color: tokens.accent }}>{profile.name}</span>{profile.bio.slice(profile.name.length)}</>
                  }
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {PROFILE.specialties.map(s => (
                    <span key={s} style={{ ...lbl, border: border1, borderRadius: 3, padding: "3px 8px", color: tokens.muted }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" style={{ borderBottom: border1 }}>
          <div style={{ padding: isMobile ? "32px 0" : "48px 0" }}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
              <p className="section-label">Portfolio</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "6px" }}>
              {PROFILE.portfolio.map((p, i) => (
                <div key={i} onClick={() => setLightbox(p.url)}
                  style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: 4, cursor: "pointer", background: tokens.bg2 }}>
                  <img src={p.url} alt={p.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
              ))}
            </div>
            <p style={{ ...lbl, marginTop: "0.75rem" }}>Click any image to enlarge · Full gallery on request</p>
          </div>
        </section>

        {/* CREDITS */}
        <section id="credits" style={{ borderBottom: border1 }}>
          <div style={{ padding: isMobile ? "32px 0" : "48px 0" }}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
              <p className="section-label">Artist Credits</p>
            </div>
            {PROFILE.credits.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", padding: "12px 0", borderBottom: border2, gap: "0.25rem 1rem", alignItems: "center" }}>
                <p style={{ ...T, fontSize: "0.85rem", fontWeight: 500, color: tokens.text }}>{c.artist}</p>
                <p style={{ ...lbl, color: tokens.muted2 }}>{c.event}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GEAR */}
        <section id="gear" style={{ borderBottom: border1 }}>
          <div style={{ padding: isMobile ? "32px 0" : "48px 0" }}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
              <p className="section-label">Gear</p>
            </div>
            {PROFILE.gear.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "10px 0", borderBottom: border2 }}>
                <span style={{ color: tokens.accent, fontSize: "0.7rem" }}>→</span>
                <p style={{ ...T, fontSize: "0.82rem", fontWeight: 300, color: tokens.muted }}>{g}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MARKETS */}
        <section id="markets" style={{ borderBottom: border1 }}>
          <div style={{ padding: isMobile ? "32px 0" : "48px 0" }}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
              <p className="section-label">Markets</p>
            </div>
            <p style={{ ...T, fontSize: "0.82rem", fontWeight: 300, color: tokens.muted2, marginBottom: "1rem" }}>
              Primary markets — available for travel nationwide.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {PROFILE.markets.map(m => (
                <span key={m} style={{ ...lbl, border: border1, borderRadius: 3, padding: "5px 12px", color: tokens.muted }}>{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div style={{ padding: isMobile ? "32px 0 64px" : "48px 0 72px" }}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
              <p className="section-label">Contact</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
              <p style={{ ...T, fontSize: "0.85rem", color: tokens.accent, fontWeight: 400 }}>
                {editMode
                  ? <EditField value={profile.contact.email} onSave={v => onUpdate({ contact: { ...profile.contact, email: v } })} accentColor={tokens.accent} />
                  : <a href={`mailto:${profile.contact.email}`} style={{ color: tokens.accent, textDecoration: "none" }}>{profile.contact.email}</a>
                }
              </p>
              <p style={{ ...lbl, color: tokens.muted }}>
                {editMode
                  ? <EditField value={profile.contact.facebook} onSave={v => onUpdate({ contact: { ...profile.contact, facebook: v } })} accentColor={tokens.accent} />
                  : <a href={profile.contact.facebook} target="_blank" rel="noreferrer" style={{ color: tokens.muted, textDecoration: "none" }}>Facebook · Backstage Flash Live Concert Photography ↗</a>
                }
              </p>
            </div>
            <div style={{ background: tokens.bg2, border: border1, borderLeft: `3px solid ${tokens.accent}`, borderRadius: 8, padding: "16px 20px" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.4rem" }}>Booking a session</p>
              <p style={{ ...T, fontSize: "0.82rem", fontWeight: 300, color: tokens.muted2, lineHeight: 1.7 }}>
                Reach out with your show date, venue, and artist name. Michael works the first three songs in the pit plus full backstage access for select engagements.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ── FOOTER — identical to band footer ────────────────────────────── */}
      <div style={{ borderTop: border1, padding: isMobile ? "16px 20px" : "20px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ ...lbl }}>Backstage Flash · {PROFILE.origin}</p>
        <p style={{ ...lbl }}>BandStack · <span style={{ color: tokens.accent }}>Powered by Rayburn Media Group</span></p>
      </div>

      {/* ── PIN MODAL ────────────────────────────────────────────────────── */}
      {showPinModal && (
        <PinUnlock
          accentColor={tokens.accent}
          onUnlock={() => { setArtistUnlocked(true); setShowPinModal(false); setEditMode(true); }}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {/* ── EDIT MODE BANNER ─────────────────────────────────────────────── */}
      {editMode && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 500, background: tokens.accent, color: "#000", borderRadius: 6, padding: "8px 20px", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", ...T, fontSize: "0.72rem", fontWeight: 600 }}>
          ✏ Edit Mode — click any field to edit
          <button onClick={() => setEditMode(false)} style={{ background: "rgba(0,0,0,0.15)", border: "none", borderRadius: 4, color: "#000", padding: "3px 8px", cursor: "pointer", fontWeight: 700, ...T, fontSize: "0.68rem" }}>Done</button>
        </div>
      )}

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={lightbox} alt="" style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 4 }} />
          <button onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 20, right: 28, background: "none", border: "none", color: tokens.muted, fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
      )}

    </div>
  );
}
