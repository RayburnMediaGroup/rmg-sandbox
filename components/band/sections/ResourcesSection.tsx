"use client";

import { useState } from "react";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

export interface Resource {
  name: string;
  category: string;
  city: string;
  state: string;
  url?: string;
  email?: string;
  description?: string;
}

const DEMO_RESOURCES: Resource[] = [
  // ── Radio Stations ──
  { name: "KJAC 99.5 The Mountain",  category: "Radio",        city: "Denver",      state: "CO", url: "https://995themountain.com",        description: "Active rock & Americana. Music director: on-air submissions accepted." },
  { name: "KVCU Radio 1190 AM",      category: "Radio",        city: "Denver",      state: "CO", url: "https://radio1190.org",              description: "University of Colorado indie/Americana station. Open to local submissions." },
  { name: "KUNC 91.5 FM",            category: "Radio",        city: "Denver",      state: "CO", url: "https://kunc.org",                   description: "NPR affiliate, airs local music programs. Americana & roots friendly." },
  { name: "WSM 650 AM",              category: "Radio",        city: "Nashville",   state: "TN", url: "https://wsmonline.com",              description: "Legendary Grand Ole Opry station. Country heritage & emerging artists." },
  { name: "Lightning 100 WRLT",      category: "Radio",        city: "Nashville",   state: "TN", url: "https://lightning100.com",           description: "Nashville's independent music station. Americana, alt-country, local focus." },
  { name: "WMOT Roots Radio 89.5",   category: "Radio",        city: "Nashville",   state: "TN", url: "https://wmot.org",                   description: "Belmont University roots/Americana station. Strong regional reach." },
  { name: "KUTX 98.9 FM",            category: "Radio",        city: "Austin",      state: "TX", url: "https://kutx.org",                   description: "UT Austin music station. Americana, indie, Texas country. Accepts submissions." },
  { name: "KOKE FM 99.3",            category: "Radio",        city: "Austin",      state: "TX", url: "https://kokefm.com",                 description: "Progressive country & outlaw. Strong fit for Americana/rock crossover acts." },
  { name: "KUT 90.5 FM",             category: "Radio",        city: "Austin",      state: "TX", url: "https://kut.org",                    description: "NPR Austin. Features local music shows including Texas Music Matters." },
  // ── Magazines ──
  { name: "Relix Magazine",            category: "Magazine",      city: "New York",    state: "NY", url: "https://relix.com",                 description: "Premier jam, Americana & festival culture magazine. Covers touring acts." },
  { name: "No Depression",             category: "Magazine",      city: "Nashville",   state: "TN", url: "https://nodepression.com",           description: "Roots & Americana quarterly print + daily web. Music director accepts pitches." },
  { name: "American Songwriter",       category: "Magazine",      city: "Nashville",   state: "TN", url: "https://americansongwriter.com",     description: "Craft-focused publication covering country, folk & Americana." },
  { name: "Paste Magazine",            category: "Magazine",      city: "Atlanta",     state: "GA", url: "https://pastemagazine.com",          description: "Indie & Americana music coverage. Reviews, interviews, live sessions." },
  // ── Online Press ──
  { name: "Nugs.net",                  category: "Online Press",  city: "Denver",      state: "CO", url: "https://nugs.net",                  description: "Live music streaming & high-res downloads. Partner for touring artists." },
  { name: "Grateful Web",             category: "Online Press",  city: "Denver",      state: "CO", url: "https://gratefulweb.com",            description: "Colorado-based Americana & jam band news. Covers live shows & touring acts." },
  { name: "Wide Open Country",         category: "Online Press",  city: "Nashville",   state: "TN", url: "https://wideopencountry.com",        description: "Country & Americana editorial. Artist features, new releases, tour coverage." },
  { name: "Saving Country Music",      category: "Online Press",  city: "Dallas",      state: "TX", url: "https://savingcountrymusic.com",     description: "Outlaw country & Americana criticism. Known for authentic roots coverage." },
  { name: "Glide Magazine",            category: "Online Press",  city: "San Francisco", state: "CA", url: "https://glidemagazine.com",        description: "Live music, reviews & interviews. Rock, Americana & jam band focus." },
  { name: "Consequence of Sound",      category: "Online Press",  city: "Chicago",     state: "IL", url: "https://consequence.net",            description: "Major indie & Americana outlet. Tour news, album reviews, interviews." },
  // ── Service Providers (placeholder — replace with real vendors) ──
  { name: "Red Rocks Photo Co.",     category: "Photographer",  city: "Denver",      state: "CO", url: "https://example.com", description: "Live music & touring band photography." },
  { name: "Westword Graphics",       category: "Designer",      city: "Denver",      state: "CO", url: "https://example.com", description: "Album artwork, posters, merch design." },
  { name: "Emerald City Recording",  category: "Studio",        city: "Nashville",   state: "TN", url: "https://example.com", description: "Full-service tracking & mixing studio." },
  { name: "Mile High Press",         category: "Publicist",     city: "Denver",      state: "CO", email: "press@example.com", description: "Music PR & media relations." },
  { name: "Austin Sound Studios",    category: "Studio",        city: "Austin",      state: "TX", url: "https://example.com", description: "Recording & live room, full backline available." },
  { name: "Lone Star Promo",         category: "Promoter",      city: "Austin",      state: "TX", url: "https://example.com", description: "Regional touring & show promotion." },
  { name: "Third Coast Merch",       category: "Merch",         city: "Nashville",   state: "TN", url: "https://example.com", description: "Tour merch printing & fulfillment." },
  { name: "Stage Right Lighting",    category: "Production",    city: "Nashville",   state: "TN", url: "https://example.com", description: "Lighting & stage production rentals." },
];

const CATEGORIES = ["All", "Radio", "Magazine", "Online Press", "Photographer", "Studio", "Designer", "Publicist", "Promoter", "Merch", "Production"];

interface Props { tokens: TokenSet; }

export default function ResourcesSection({ tokens }: Props) {
  const isMobile = useMobile();
  const [cityFilter, setCityFilter] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;

  const states = [...new Set(DEMO_RESOURCES.map(r => r.state))].sort();
  const cities = [...new Set(DEMO_RESOURCES.map(r => r.city))].sort();

  const filtered = DEMO_RESOURCES.filter(r => {
    const matchCat = catFilter === "All" || r.category === catFilter;
    const matchCity = !cityFilter || r.city === cityFilter || r.state === cityFilter;
    return matchCat && matchCity;
  });

  const grouped = filtered.reduce((acc, r) => {
    const key = `${r.city}, ${r.state}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {} as Record<string, Resource[]>);

  const inp: React.CSSProperties = {
    background: "transparent", border: border2, borderRadius: 4,
    color: tokens.muted, padding: "5px 10px", fontSize: "0.72rem",
    fontFamily: "Inter, sans-serif", cursor: "pointer",
  };

  return (
    <section id="resources" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label" style={{ marginBottom: "0.4rem" }}>Resources</p>
          <p style={{ ...T, fontSize: "0.78rem", color: tokens.muted2, fontWeight: 300, marginTop: "0.4rem" }}>
            Radio, magazines, online press, photographers, studios & service providers — searchable by city.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ ...inp }}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inp }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Results grouped by city */}
        {Object.keys(grouped).length === 0 && (
          <p style={{ ...lbl, color: tokens.muted2 }}>No results for those filters.</p>
        )}

        {Object.entries(grouped).map(([city, items]) => (
          <div key={city} style={{ marginBottom: "2rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem", paddingBottom: "0.4rem", borderBottom: border1 }}>{city}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {items.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: "0.5rem 1.5rem", padding: "12px 0", borderBottom: border2, alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                      <span style={{ ...T, fontSize: "0.85rem", color: tokens.text, fontWeight: 400 }}>{r.name}</span>
                      <span style={{ ...lbl, color: tokens.accent, fontSize: "0.5rem", border: `1px solid ${tokens.accent}44`, borderRadius: 3, padding: "1px 5px" }}>{r.category}</span>
                    </div>
                    {r.description && <p style={{ ...T, fontSize: "0.78rem", color: tokens.muted2, fontWeight: 300, lineHeight: 1.5 }}>{r.description}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
                    {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Website ↗</a>}
                    {r.email && <a href={`mailto:${r.email}`} style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Email ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
