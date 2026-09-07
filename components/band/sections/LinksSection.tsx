"use client";

import type { ProfileData, ProfileLink } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import Link from "next/link";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

const CATS = ["Streaming", "Video", "Social", "Purchase", "Discovery", "Official"] as const;
type Cat = typeof CATS[number];

const CAT_ICONS: Record<Cat, string> = { Streaming: "♫", Video: "▶", Social: "◉", Purchase: "⬡", Discovery: "◎", Official: "★" };

export default function LinksSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;


  // Platform keys → auto-populated links with correct category
  const PLATFORM_MAP: { key: keyof ProfileData; label: string; category: Cat }[] = [
    { key: "website",    label: "Website",      category: "Official" },
    { key: "facebook",   label: "Facebook",     category: "Social" },
    { key: "instagram",  label: "Instagram",    category: "Social" },
    { key: "tiktok",     label: "TikTok",       category: "Social" },
    { key: "twitter",    label: "X / Twitter",  category: "Social" },
    { key: "youtube",    label: "YouTube",      category: "Video" },
    { key: "spotify",    label: "Spotify",      category: "Streaming" },
    { key: "appleMusic", label: "Apple Music",  category: "Streaming" },
    { key: "amazonMusic",label: "Amazon Music", category: "Streaming" },
    { key: "soundcloud", label: "SoundCloud",   category: "Streaming" },
    { key: "bandcamp",   label: "Bandcamp",     category: "Purchase" },
  ];

  const manualLinks: ProfileLink[] = profile.links ?? [];
  const manualLabels = new Set(manualLinks.map(l => l.label));

  const platformLinks: ProfileLink[] = PLATFORM_MAP
    .filter(({ key, label }) => {
      const url = profile[key] as string | undefined;
      return url && url.trim() && !manualLabels.has(label);
    })
    .map(({ key, label, category }) => ({ label, url: profile[key] as string, category }));

  const allLinks: ProfileLink[] = [...platformLinks, ...manualLinks];

  const grouped = CATS.reduce((acc, cat) => {
    acc[cat] = allLinks.filter(l => l.category === cat);
    return acc;
  }, {} as Record<Cat, ProfileLink[]>);


  return (
    <section id="links" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Links & Platforms</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/band/stage-plot" style={{ ...lbl, color: tokens.accent, textDecoration: "none" }}>Stage Plot →</Link>
          </div>
        </div>


        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem" }}>
          {CATS.map(cat => {
            const items = grouped[cat];
            if (!items.length && !isArtist) return null;
            return (
              <div key={cat}>
                <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>{CAT_ICONS[cat]}  {cat}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {items.map(link => (
                    <div key={link.label} style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${tokens.border2}`, gap: "0.4rem", padding: "4px 0" }}>
                      <span style={{ ...T, fontSize: "0.83rem", fontWeight: 300, color: tokens.muted, flex: "0 0 auto", minWidth: 80 }}>{link.label}</span>
                      <a href={link.url} target="_blank" rel="noreferrer" style={{ ...T, fontSize: "0.83rem", fontWeight: 300, color: tokens.muted, textDecoration: "none", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {link.url ? link.url : <span style={{ color: tokens.muted2, fontStyle: "italic" }}>—</span>}
                        {link.url && <span style={{ ...lbl, color: tokens.muted2, marginLeft: "0.4rem" }}>↗</span>}
                      </a>
                    </div>
                  ))}
                  {items.length === 0 && isArtist && (
                    <p style={{ ...lbl, fontStyle: "italic" }}>No {cat} links yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
