"use client";

import { useState, useEffect } from "react";
import type { ProfileData, VenueRecord } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; onUpdate?: (u: Partial<ProfileData>) => void; }

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function VenueSearchSection({ profile, tokens, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.8rem", color: tokens.muted };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const surface = isLt ? "#f4f4f4" : "#111";
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: border1, borderRadius: 4, color: tokens.text, padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", outline: "none" };

  const [city,    setCity]    = useState("");
  const [state,   setState]   = useState("CO");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [saved,   setSaved]   = useState<Set<string>>(new Set());

  const savedVenues: VenueRecord[] = (profile as any).savedVenues ?? [];

  useEffect(() => {
    setSaved(new Set(savedVenues.map((v: VenueRecord) => v.id)));
  }, [savedVenues.length]);

  async function search(overrideCity?: string, overrideState?: string) {
    const c = overrideCity  ?? city;
    const s = overrideState ?? state;
    if (!c && !s) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/venues?city=${encodeURIComponent(c)}&state=${encodeURIComponent(s)}`);
      const data = await res.json();
      if (data.results?.length > 0) {
        const sorted = [...data.results].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
        setResults(sorted);
      } else {
        setError("No venues found for that location.");
      }
    } catch (e: any) {
      setError(`Search failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Load all CO venues on mount
  useEffect(() => { search("", "CO"); }, []);

  function saveVenue(place: any) {
    const record: VenueRecord = {
      id: place.id ?? uid(),
      name: place.name,
      city: place.city,
      state: place.state,
      capacity: place.capacity ? parseInt(place.capacity.replace(/,/g, "")) || undefined : undefined,
      venueType: place.venueType ?? "Music Venue",
      contactName: "",
      contactEmail: "",
      contactPhone: place.phone ?? "",
      typicalGuarantee: "",
      notes: place.website ? `Website: ${place.website}` : "",
      relationship: "target",
      history: [],
    };
    const next = [...savedVenues, record];
    onUpdate?.({ savedVenues: next } as any);
    setSaved(prev => new Set([...prev, record.id]));
  }

  // Group by city
  const byCity: Record<string, any[]> = {};
  for (const v of results) {
    if (!byCity[v.city]) byCity[v.city] = [];
    byCity[v.city].push(v);
  }

  return (
    <section id="venue-search" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <p className="section-label">Find Venues</p>
            <span style={{ ...lbl, fontSize: "0.46rem", color: tokens.accent, border: `1px solid ${tokens.accent}`, borderRadius: 3, padding: "1px 5px" }}>Artist Only</span>
            {results.length > 0 && <span style={{ ...lbl, fontSize: "0.46rem", color: tokens.muted2 }}>{results.length} venues</span>}
          </div>
        </div>

        {/* Private notice */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: isLt ? "#f0f0f0" : "#111", border: border1, borderLeft: `3px solid ${tokens.accent}`, borderRadius: 6, padding: "10px 14px", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem" }}>🔒</span>
          <p style={{ ...T, fontSize: "0.75rem", color: tokens.muted, lineHeight: 1.5 }}>
            <strong style={{ color: tokens.text, fontWeight: 600 }}>Visible to logged-in artists only.</strong>{" "}
            Browse venues by state and city. Save any venue to your Venue CRM to track booking history and contacts.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="City (leave blank for all)"
            style={{ ...inp, flex: "1 1 180px" }}
            onKeyDown={e => e.key === "Enter" && search()}
          />
          <input
            value={state}
            onChange={e => setState(e.target.value.toUpperCase())}
            placeholder="State"
            maxLength={2}
            style={{ ...inp, flex: "0 0 70px" }}
            onKeyDown={e => e.key === "Enter" && search()}
          />
          <button onClick={() => search()} disabled={loading} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 4, padding: "7px 18px", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Loading…" : "Search"}
          </button>
        </div>

        {error && <p style={{ ...body, color: "#d95c5c", marginBottom: "1rem" }}>{error}</p>}

        {/* Results grouped by city */}
        {Object.entries(byCity).map(([cityName, venues]) => (
          <div key={cityName} style={{ marginBottom: "2rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem", paddingBottom: "0.4rem", borderBottom: `1px solid ${tokens.accent}33` }}>{cityName}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {venues.map(place => {
                const isSaved = saved.has(place.id);
                return (
                  <div key={place.id} style={{ background: surface, border: border1, borderRadius: 8, padding: "14px 18px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: "0.75rem", alignItems: "start" }}>
                    <div>
                      <p style={{ ...T, fontSize: "0.92rem", fontWeight: 600, color: tokens.text, marginBottom: "0.25rem" }}>{place.name}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem", marginBottom: "0.3rem" }}>
                        {place.address && <p style={{ ...lbl, color: tokens.muted2 }}>{place.address}, {place.city}, {place.state}</p>}
                        {place.capacity && <p style={{ ...lbl, color: tokens.muted2 }}>Cap: {place.capacity}</p>}
                        {place.venueType && <span style={{ ...lbl, fontSize: "0.46rem", color: tokens.accent, border: `1px solid ${tokens.accent}55`, borderRadius: 3, padding: "1px 6px" }}>{place.venueType}</span>}
                      </div>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {place.phone    && <p style={{ ...body, fontSize: "0.75rem" }}>{place.phone}</p>}
                        {place.website  && <a href={`https://${place.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" style={{ ...body, fontSize: "0.75rem", color: tokens.accent, textDecoration: "none" }}>{place.website.replace(/^https?:\/\//, "")}</a>}
                      </div>
                    </div>
                    <button
                      onClick={() => !isSaved && saveVenue(place)}
                      disabled={isSaved}
                      style={{ ...lbl, fontSize: "0.5rem", borderRadius: 4, padding: "6px 14px", cursor: isSaved ? "default" : "pointer", background: isSaved ? "transparent" : tokens.accent, color: isSaved ? tokens.muted2 : (isLt ? "#fff" : "#000"), border: isSaved ? border2 : "none", whiteSpace: "nowrap", marginTop: isMobile ? 0 : "2px" }}
                    >
                      {isSaved ? "✓ Saved" : "Save to CRM"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && !error && (
          <p style={{ ...body, color: tokens.muted2 }}>Enter a state to browse venues.</p>
        )}
      </div>
    </section>
  );
}
