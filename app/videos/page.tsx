import type { Metadata } from "next";
import { artist, videos } from "@/lib/data";
import { resolveTokens } from "@/lib/genreTokens";
import BandTheme from "@/components/band/BandTheme";
import Navbar from "@/components/band/Navbar";

export const metadata: Metadata = {
  title: `${artist.name} — Videos`,
  description: `Official music videos and live footage from ${artist.name}.`,
};

export default function VideosPage() {
  const tokens = resolveTokens(artist.genre);
  const active  = videos.filter((v) => v.youtubeId.trim() !== "");
  const pending = videos.filter((v) => v.youtubeId.trim() === "");

  return (
    <>
      <BandTheme tokens={tokens} />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
        <Navbar artist={artist} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>

          {/* Header */}
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted2)",
            marginBottom: "0.75rem",
          }}>
            {active.length} video{active.length !== 1 ? "s" : ""}
            {pending.length > 0 && ` · ${pending.length} pending`}
          </p>
          <h1 style={{
            fontFamily: "var(--display-font)",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 0.92,
            color: "#fff",
            marginBottom: "3rem",
          }}>
            Videos
          </h1>

          {/* Live videos grid */}
          {active.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
              gap: "1.5rem",
              marginBottom: pending.length > 0 ? "4rem" : 0,
            }}>
              {active.map((v) => (
                <div key={v.youtubeId} style={{
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "var(--bg2)",
                }}>
                  <div style={{ position: "relative", paddingTop: "56.25%" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        border: "none",
                      }}
                    />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{
                      fontFamily: "var(--body-font)",
                      fontSize: "0.85rem",
                      fontWeight: 400,
                      color: "var(--text)",
                      lineHeight: 1.4,
                    }}>
                      {v.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending videos */}
          {pending.length > 0 && (
            <>
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted2)",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
                marginBottom: "1.5rem",
              }}>
                Pending — Add YouTube ID to data.ts
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                gap: "1rem",
              }}>
                {pending.map((v, i) => (
                  <div key={i} style={{
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    border: "1px dashed var(--border)",
                    background: "var(--bg2)",
                    opacity: 0.5,
                  }}>
                    {/* 16:9 placeholder */}
                    <div style={{
                      position: "relative",
                      paddingTop: "56.25%",
                      background: "var(--bg3)",
                    }}>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column" as const,
                        gap: "0.5rem",
                      }}>
                        <span style={{ fontSize: "1.5rem", color: "var(--muted2)" }}>▶</span>
                        <p style={{
                          fontFamily: "monospace",
                          fontSize: "0.48rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--muted2)",
                        }}>
                          ⚠ Pending
                        </p>
                      </div>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <p style={{
                        fontFamily: "var(--body-font)",
                        fontSize: "0.8rem",
                        fontWeight: 300,
                        color: "var(--muted)",
                        lineHeight: 1.4,
                      }}>
                        {v.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {active.length === 0 && pending.length === 0 && (
            <div style={{
              padding: "4rem 0",
              textAlign: "center",
              borderTop: "1px solid var(--border)",
            }}>
              <p style={{
                fontFamily: "var(--display-font)",
                fontSize: "1.5rem",
                color: "var(--muted2)",
              }}>
                No videos yet
              </p>
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted2)",
                marginTop: "0.5rem",
              }}>
                Add YouTube IDs to videos[] in data.ts
              </p>
            </div>
          )}

          {/* YouTube channel link */}
          {artist.socialLinks.youtube && (
            <div style={{ marginTop: "3rem", textAlign: "center" }}>
              <a href={artist.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted2)",
                textDecoration: "none",
              }}>
                Full channel on YouTube →
              </a>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
