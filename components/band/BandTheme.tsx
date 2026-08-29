"use client";

import { useEffect } from "react";
import { TokenSet } from "@/lib/genreTokens";

interface BandThemeProps {
  tokens: TokenSet;
}

export default function BandTheme({ tokens }: BandThemeProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg",            tokens.bg);
    root.style.setProperty("--bg2",           tokens.bg2);
    root.style.setProperty("--bg3",           tokens.bg3);
    root.style.setProperty("--border",        tokens.border);
    root.style.setProperty("--border2",       tokens.border2);
    root.style.setProperty("--accent",        tokens.accent);
    root.style.setProperty("--accent-warm",   tokens.accentWarm);
    root.style.setProperty("--accent-dim",    tokens.accentDim);
    root.style.setProperty("--text",          tokens.text);
    root.style.setProperty("--muted",         tokens.muted);
    root.style.setProperty("--muted2",        tokens.muted2);
    root.style.setProperty("--display-font",  `'${tokens.displayFont}', sans-serif`);
    root.style.setProperty("--body-font",     `'${tokens.bodyFont}', system-ui, sans-serif`);
    root.style.setProperty("background-color", tokens.bg);
  }, [tokens]);

  // Inject the correct Google Fonts for this genre's font pair
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {tokens.displayFontUrl !== tokens.bodyFontUrl ? (
        <>
          <link href={tokens.displayFontUrl} rel="stylesheet" />
          <link href={tokens.bodyFontUrl} rel="stylesheet" />
        </>
      ) : (
        <link href={tokens.displayFontUrl} rel="stylesheet" />
      )}
    </>
  );
}
