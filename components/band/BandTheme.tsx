"use client";

import { useEffect } from "react";
import { TokenSet } from "@/lib/genreTokens";

interface BandThemeProps {
  tokens: TokenSet;
}

function injectFont(href: string) {
  if (!href || document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export default function BandTheme({ tokens }: BandThemeProps) {
  useEffect(() => {
    // CSS tokens
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

    // Google Fonts — imperative DOM injection, bypasses PostCSS entirely
    injectFont(tokens.displayFontUrl);
    if (tokens.bodyFontUrl !== tokens.displayFontUrl) {
      injectFont(tokens.bodyFontUrl);
    }
  }, [tokens]);

  // No JSX rendered — pure side-effect component
  return null;
}
