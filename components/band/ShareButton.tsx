"use client";

import { useState } from "react";

interface Props {
  tab: string;
  accentColor: string;
  label?: string;
}

export default function ShareButton({ tab, accentColor, label }: Props) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}?tab=${tab}`;
  }

  async function handleShare() {
    const url = getUrl();
    const title = label ?? document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {}
    }
    try { navigator.clipboard.writeText(url); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      title="Share this page"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: "50%",
        background: copied ? accentColor + "22" : "rgba(255,255,255,0.07)",
        border: `1px solid ${copied ? accentColor + "66" : "rgba(255,255,255,0.12)"}`,
        cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = accentColor + "22"; (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor + "66"; }}
      onMouseLeave={e => { if (!copied) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; } }}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </button>
  );
}
