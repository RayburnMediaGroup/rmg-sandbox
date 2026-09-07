"use client";

import styles from "./SocialChips.module.css";
import type { ProfileData } from "@/lib/bandProfile";

const PLATFORMS = [
  { key: "website",    label: "Website",      color: "#b0b0b0" },
  { key: "instagram",  label: "Instagram",    color: "#E1306C" },
  { key: "tiktok",     label: "TikTok",       color: "#69C9D0" },
  { key: "facebook",   label: "Facebook",     color: "#1877F2" },
  { key: "twitter",    label: "X / Twitter",  color: "#e2e2e2" },
  { key: "youtube",    label: "YouTube",      color: "#FF0000" },
  { key: "spotify",    label: "Spotify",      color: "#1DB954" },
  { key: "appleMusic", label: "Apple Music",  color: "#FC3C44" },
  { key: "amazonMusic",label: "Amazon Music", color: "#00A8E1" },
  { key: "soundcloud", label: "SoundCloud",   color: "#FF5500" },
  { key: "bandcamp",   label: "Bandcamp",     color: "#1DA0C3" },
] as const;

interface Props {
  profile: ProfileData;
}

export default function SocialChips({ profile }: Props) {
  const p = profile as unknown as Record<string, unknown>;
  const filled = PLATFORMS.filter(pl => !!p[pl.key]);
  const empty  = PLATFORMS.filter(pl => !p[pl.key]);
  const all    = [...filled, ...empty];

  return (
    <div className={styles.row}>
      {all.map(({ key, label, color }) => {
        const url = p[key] as string | undefined;
        const hasFill = !!url;
        return (
          <a
            key={key}
            href={url || "#"}
            target={url ? "_blank" : undefined}
            rel="noreferrer"
            className={styles.chip}
            style={{
              "--chip-color": color,
              borderColor: hasFill ? color + "70" : color + "30",
              background:   hasFill ? color + "14" : color + "07",
              color:        hasFill ? color        : color + "88",
              opacity:      hasFill ? 1            : 0.5,
            } as React.CSSProperties}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
