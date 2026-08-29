import type { Metadata } from "next";
import { artist, releases } from "@/lib/data";
import { resolveTokens } from "@/lib/genreTokens";
import BandTheme from "@/components/band/BandTheme";

const CANONICAL_URL = "https://roughcutsband.com";

export const metadata: Metadata = {
  title: `${artist.name} — Electronic Press Kit`,
  description: `Official EPK for ${artist.name}. Bio, press quotes, awards, booking info.`,
  robots: "noindex",
};

// ─── Sub-components ───────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "monospace",
      fontSize: "0.58rem",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "var(--accent)",
      marginBottom: "1.25rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid var(--border)",
    }}>
      {children}
    </p>
  );
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section style={{
      borderBottom: "1px solid var(--border)",
      padding: "48px 0",
      ...style,
    }}>
      {children}
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function EPKPage() {
  const tokens = resolveTokens(artist.genre);
  const featuredRelease = releases.find((r) => r.isFeatured) ?? releases[0];
  const totalReleases = releases.length;

  return (
    <>
      <BandTheme tokens={tokens} />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>

        {/* ── Top bar ── */}
        <div style={{
          background: "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: "0.5rem",
        }}>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}>
            Electronic Press Kit · {artist.name}
          </p>
          {artist.bookingEmail && (
            <a href={`mailto:${artist.bookingEmail}`} style={{
              fontFamily: "monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              textDecoration: "none",
            }}>
              Booking: {artist.bookingEmail}
            </a>
          )}
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px 80px" }}>

          {/* ── Hero ── */}
          <Section style={{ paddingTop: 64 }}>
            <p style={{
              fontFamily: "monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted2)",
              marginBottom: "1rem",
            }}>
              {artist.origin} · Est. {artist.founded}
            </p>

            <h1 style={{
              fontFamily: "var(--display-font)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.92,
              color: "#fff",
              marginBottom: "1.25rem",
              letterSpacing: "0.01em",
            }}>
              {artist.name}
            </h1>

            <p style={{
              fontSize: "1.05rem",
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.65,
              maxWidth: 600,
              marginBottom: "2rem",
            }}>
              {artist.tagline}
            </p>

            {/* Genre + stats chips */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
              {artist.genre.map((g) => (
                <span key={g} style={{
                  fontFamily: "monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  background: "var(--accent-dim)",
                  border: "1px solid var(--border2)",
                  borderRadius: "9999px",
                  padding: "4px 12px",
                }}>
                  {g}
                </span>
              ))}
              <span style={{
                fontFamily: "monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted2)",
                border: "1px solid var(--border)",
                borderRadius: "9999px",
                padding: "4px 12px",
              }}>
                {totalReleases} releases
              </span>
              <span style={{
                fontFamily: "monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted2)",
                border: "1px solid var(--border)",
                borderRadius: "9999px",
                padding: "4px 12px",
              }}>
                {artist.members.length} members
              </span>
            </div>
          </Section>

          {/* ── Bio ── */}
          <Section>
            <SectionLabel>Biography</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
              {artist.bio.map((p, i) => (
                <p key={i} style={{
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: i === 0 ? "var(--text)" : "var(--muted)",
                  lineHeight: 1.8,
                  maxWidth: 720,
                }}>
                  {p}
                </p>
              ))}
            </div>
          </Section>

          {/* ── Press quotes ── */}
          {artist.pressQuotes.length > 0 && (
            <Section>
              <SectionLabel>Press</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>
                {artist.pressQuotes.map((q, i) => (
                  <div key={i} style={{
                    borderLeft: "3px solid var(--accent)",
                    paddingLeft: "1.5rem",
                  }}>
                    <p style={{
                      fontSize: "1rem",
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: "var(--text)",
                      lineHeight: 1.7,
                      marginBottom: "0.5rem",
                    }}>
                      &ldquo;{q.quote}&rdquo;
                    </p>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: "0.58rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                    }}>
                      {q.url ? (
                        <a href={q.url} target="_blank" rel="noopener noreferrer"
                          style={{ color: "inherit", textDecoration: "none" }}>
                          {q.source}
                        </a>
                      ) : q.source}
                      {" "}·{" "}{q.year}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ── Awards ── */}
          {artist.awards.length > 0 && (
            <Section>
              <SectionLabel>Awards & Recognition</SectionLabel>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
                {artist.awards.map((award, i) => (
                  <li key={i} style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.75rem",
                    fontSize: "0.88rem",
                    fontWeight: 300,
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, fontSize: "0.5rem" }}>◆</span>
                    {award}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ── Members ── */}
          <Section>
            <SectionLabel>Band Members</SectionLabel>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
              gap: "1px",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}>
              {artist.members.map((m, i) => (
                <div key={i} style={{
                  padding: "1rem 1.25rem",
                  background: i % 2 === 0 ? "var(--bg2)" : "var(--bg3)",
                }}>
                  <p style={{
                    fontFamily: "var(--body-font)",
                    fontSize: "0.88rem",
                    fontWeight: 400,
                    color: "var(--text)",
                    marginBottom: "3px",
                  }}>
                    {m.name}
                  </p>
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                  }}>
                    {m.role}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Discography summary ── */}
          <Section>
            <SectionLabel>Discography</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
              {releases.map((r) => {
                const year = new Date(r.releaseDate).getFullYear();
                return (
                  <div key={r.slug} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    gap: "1rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {r.isFeatured && (
                        <span style={{
                          fontFamily: "monospace",
                          fontSize: "0.48rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          background: "var(--accent-dim)",
                          border: "1px solid var(--border2)",
                          borderRadius: "9999px",
                          padding: "2px 8px",
                          flexShrink: 0,
                        }}>
                          Featured
                        </span>
                      )}
                      <p style={{
                        fontSize: "0.88rem",
                        fontWeight: r.isFeatured ? 400 : 300,
                        color: r.isFeatured ? "var(--text)" : "var(--muted)",
                      }}>
                        {r.title}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexShrink: 0 }}>
                      <span style={{
                        fontFamily: "monospace",
                        fontSize: "0.55rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--muted2)",
                      }}>
                        {r.type}
                      </span>
                      <span style={{
                        fontFamily: "monospace",
                        fontSize: "0.55rem",
                        color: "var(--muted2)",
                      }}>
                        {year}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── Press assets ── */}
          <Section>
            <SectionLabel>Press Assets</SectionLabel>
            {artist.pressPhotos && artist.pressPhotos.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}>
                {artist.pressPhotos.map((photo, i) => (
                  <div key={i} style={{
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "var(--bg2)",
                    overflow: "hidden",
                  }}>
                    {/* Photo placeholder */}
                    <div style={{
                      height: 120,
                      background: "var(--bg3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid var(--border)",
                    }}>
                      <span style={{ color: "var(--muted2)", fontSize: "1.5rem" }}>◈</span>
                    </div>
                    <div style={{ padding: "0.75rem" }}>
                      <p style={{
                        fontFamily: "var(--body-font)",
                        fontSize: "0.75rem",
                        fontWeight: 300,
                        color: "var(--muted)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.4,
                      }}>
                        {photo.label}
                      </p>
                      {photo.url ? (
                        <a href={photo.url} download style={{
                          fontFamily: "monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          textDecoration: "none",
                        }}>
                          Download →
                        </a>
                      ) : (
                        <p style={{
                          fontFamily: "monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--muted2)",
                        }}>
                          ⚠ Add url to data.ts
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted2)",
              }}>
                ⚠ Add pressPhotos[] to artist data
              </p>
            )}

            {/* One-sheet + stage plot */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
              {[
                { label: "One-Sheet (PDF)", url: artist.oneSheetUrl },
                { label: "Stage Plot", url: artist.stageplotUrl },
                { label: "Technical Rider", url: artist.riderUrl },
              ].map(({ label, url }) => (
                <div key={label} style={{
                  padding: "10px 18px",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border)",
                  background: "var(--bg2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}>
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: url ? "var(--text)" : "var(--muted2)",
                  }}>
                    {label}
                  </p>
                  {url ? (
                    <a href={url} download style={{
                      fontFamily: "monospace",
                      fontSize: "0.52rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}>
                      Download →
                    </a>
                  ) : (
                    <span style={{
                      fontFamily: "monospace",
                      fontSize: "0.48rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted2)",
                    }}>
                      ⚠ pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── Streaming links ── */}
          <Section>
            <SectionLabel>Stream</SectionLabel>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
              {Object.entries(artist.streamingLinks).filter(([, url]) => url).map(([platform, url]) => (
                <a key={platform} href={url!} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid var(--border)",
                  background: "var(--bg2)",
                }}>
                  {platform === "appleMusic" ? "Apple Music" : platform.charAt(0).toUpperCase() + platform.slice(1)} →
                </a>
              ))}
            </div>
          </Section>

          {/* ── Contact ── */}
          <Section style={{ borderBottom: "none" }}>
            <SectionLabel>Contact</SectionLabel>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
              gap: "1px",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}>
              {[
                { label: "Booking", value: artist.bookingEmail, href: `mailto:${artist.bookingEmail}` },
                { label: "Agent / Manager", value: artist.bookingContact },
                { label: "Press / PR", value: artist.prEmail, href: artist.prEmail ? `mailto:${artist.prEmail}` : undefined },
                { label: "Management", value: artist.managementEmail, href: artist.managementEmail ? `mailto:${artist.managementEmail}` : undefined },
              ].filter(({ value }) => value).map(({ label, value, href }, i) => (
                <div key={label} style={{
                  padding: "1rem 1.25rem",
                  background: i % 2 === 0 ? "var(--bg2)" : "var(--bg3)",
                }}>
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                    marginBottom: "4px",
                  }}>
                    {label}
                  </p>
                  {href ? (
                    <a href={href} style={{
                      fontFamily: "var(--body-font)",
                      fontSize: "0.88rem",
                      fontWeight: 300,
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}>
                      {value}
                    </a>
                  ) : (
                    <p style={{
                      fontFamily: "var(--body-font)",
                      fontSize: "0.88rem",
                      fontWeight: 300,
                      color: "var(--text)",
                    }}>
                      {value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            {Object.keys(artist.socialLinks).length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <p style={{
                  fontFamily: "monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  marginBottom: "0.75rem",
                }}>
                  Social
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
                  {Object.entries(artist.socialLinks).filter(([, url]) => url).map(([platform, url]) => (
                    <a key={platform} href={url!} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: "monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      textDecoration: "none",
                    }}>
                      {platform} →
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Section>

        </div>

        {/* Footer bar */}
        <div style={{
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: "0.5rem",
        }}>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted2)",
          }}>
            {artist.name} · EPK · {new Date().getFullYear()}
          </p>
          <a href="/band" style={{
            fontFamily: "monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
          }}>
            ← Official Site
          </a>
        </div>

      </div>
    </>
  );
}
