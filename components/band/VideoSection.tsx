interface Video {
  title: string;
  youtubeId: string;
}

interface VideoSectionProps {
  videos: Video[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const active = videos.filter((v) => v.youtubeId.trim() !== "");
  if (active.length === 0) return null;

  return (
    <section style={{
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "80px 40px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "2.5rem",
        }}>
          Videos
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
          gap: "1.5rem",
        }}>
          {active.map((v) => (
            <div key={v.youtubeId} style={{
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg3)",
            }}>
              {/* 16:9 embed */}
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
              <p style={{
                padding: "12px 14px",
                fontFamily: "var(--body-font)",
                fontSize: "0.8rem",
                fontWeight: 300,
                color: "var(--muted)",
                lineHeight: 1.4,
              }}>
                {v.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
