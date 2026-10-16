// ─────────────────────────────────────────────
//  BandStack · Genre Token System
//
//  One genre selection transforms the entire site.
//  Intake form genre answer → resolves to a TokenSet.
//  TokenSet → injected as CSS variables on :root.
//  Every component reads var(--accent), var(--display-font), etc.
// ─────────────────────────────────────────────

export interface TokenSet {
  displayFont: string;        // Google Fonts family name
  bodyFont: string;
  displayFontUrl: string;     // Google Fonts URL to load
  bodyFontUrl: string;
  accent: string;             // primary accent hex
  accentWarm: string;         // hover / highlight
  accentDim: string;          // rgba bg tint
  bg: string;                 // page ground
  bg2: string;                // surface
  bg3: string;                // raised surface
  border: string;             // rgba border
  border2: string;            // rgba border hover
  text: string;               // primary text
  muted: string;              // muted text
  muted2: string;             // very muted
}

// ─── Token presets per genre ─────────────────────────────────────

const TOKENS: Record<string, TokenSet> = {

  // Outlaw / Traditional Country / Americana
  "outlaw country": {
    displayFont:    "Bebas Neue",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#b8822a",
    accentWarm:     "#cc9638",
    accentDim:      "rgba(184,130,42,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(255,220,150,0.08)",
    border2:        "rgba(255,220,150,0.18)",
    text:           "#ede8df",
    muted:          "rgba(237,232,223,0.70)",
    muted2:         "rgba(237,232,223,0.45)",
  },

  // Country / Country Rock — bright sunlit gold, separate from outlaw's burnt amber
  "country": {
    displayFont:    "Bebas Neue",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#bea43e",
    accentWarm:     "#d4b84a",
    accentDim:      "rgba(190,164,62,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(240,220,100,0.08)",
    border2:        "rgba(240,220,100,0.18)",
    text:           "#f0ecd8",
    muted:          "rgba(240,236,216,0.70)",
    muted2:         "rgba(240,236,216,0.45)",
  },

  // Indie — cool mint green, contemporary, airy
  "indie": {
    displayFont:    "Playfair Display",
    bodyFont:       "Lora",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;1,400&display=swap",
    accent:         "#529a96",
    accentWarm:     "#68b0aa",
    accentDim:      "rgba(82,154,150,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(100,200,195,0.08)",
    border2:        "rgba(100,200,195,0.16)",
    text:           "#d8eeec",
    muted:          "rgba(216,238,236,0.70)",
    muted2:         "rgba(216,238,236,0.45)",
  },

  // Folk — muted sage olive, organic, earthy (not warm brown)
  "folk": {
    displayFont:    "Playfair Display",
    bodyFont:       "Lora",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;1,400&display=swap",
    accent:         "#7a9852",
    accentWarm:     "#8fae66",
    accentDim:      "rgba(122,152,82,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(160,210,120,0.08)",
    border2:        "rgba(160,210,120,0.16)",
    text:           "#ddecd8",
    muted:          "rgba(221,236,216,0.70)",
    muted2:         "rgba(221,236,216,0.45)",
  },

  // Rock / Alternative
  "rock": {
    displayFont:    "Anton",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#c43636",
    accentWarm:     "#d84e4e",
    accentDim:      "rgba(196,54,54,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(255,255,255,0.07)",
    border2:        "rgba(255,255,255,0.14)",
    text:           "#e8e8e8",
    muted:          "rgba(232,232,232,0.70)",
    muted2:         "rgba(232,232,232,0.45)",
  },

  "alternative": {
    displayFont:    "Anton",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#6a58d4",
    accentWarm:     "#8472e8",
    accentDim:      "rgba(106,88,212,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(200,180,255,0.08)",
    border2:        "rgba(200,180,255,0.16)",
    text:           "#e4e2f0",
    muted:          "rgba(228,226,240,0.70)",
    muted2:         "rgba(228,226,240,0.45)",
  },

  // Punk / Hardcore
  "punk": {
    displayFont:    "Bebas Neue",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#cc3040",
    accentWarm:     "#e04858",
    accentDim:      "rgba(204,48,64,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(255,255,255,0.07)",
    border2:        "rgba(255,255,255,0.14)",
    text:           "#f0f0f0",
    muted:          "rgba(240,240,240,0.70)",
    muted2:         "rgba(240,240,240,0.45)",
  },

  // Electronic / Ambient / Synth
  "electronic": {
    displayFont:    "Space Grotesk",
    bodyFont:       "Space Mono",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&display=swap",
    accent:         "#00aaaa",
    accentWarm:     "#20c2c2",
    accentDim:      "rgba(0,170,170,0.10)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(0,200,200,0.1)",
    border2:        "rgba(0,200,200,0.2)",
    text:           "#d8eef0",
    muted:          "rgba(216,238,240,0.70)",
    muted2:         "rgba(216,238,240,0.45)",
  },

  "ambient": {
    displayFont:    "Space Grotesk",
    bodyFont:       "Space Mono",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&display=swap",
    accent:         "#5588ba",
    accentWarm:     "#6e9ecc",
    accentDim:      "rgba(85,136,186,0.10)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(100,150,200,0.1)",
    border2:        "rgba(100,150,200,0.2)",
    text:           "#d5dde8",
    muted:          "rgba(213,221,232,0.70)",
    muted2:         "rgba(213,221,232,0.45)",
  },

  // Metal
  "metal": {
    displayFont:    "Anton",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#ac1818",
    accentWarm:     "#c42e2e",
    accentDim:      "rgba(172,24,24,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(196,26,26,0.15)",
    border2:        "rgba(196,26,26,0.25)",
    text:           "#e8e8e8",
    muted:          "rgba(232,232,232,0.68)",
    muted2:         "rgba(232,232,232,0.42)",
  },

  // Jazz / Soul / R&B
  // Jazz — deep burgundy/wine, smoky and sophisticated
  "jazz": {
    displayFont:    "Cormorant Garamond",
    bodyFont:       "Outfit",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap",
    accent:         "#8e2a56",
    accentWarm:     "#a83e6e",
    accentDim:      "rgba(142,42,86,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(200,100,140,0.08)",
    border2:        "rgba(200,100,140,0.18)",
    text:           "#edd8e4",
    muted:          "rgba(237,216,228,0.70)",
    muted2:         "rgba(237,216,228,0.45)",
  },

  // Soul — deep orange-copper, warm and visceral
  "soul": {
    displayFont:    "Cormorant Garamond",
    bodyFont:       "Outfit",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap",
    accent:         "#bc5626",
    accentWarm:     "#d06e3a",
    accentDim:      "rgba(188,86,38,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(220,130,80,0.08)",
    border2:        "rgba(220,130,80,0.18)",
    text:           "#f0e0d0",
    muted:          "rgba(240,224,208,0.70)",
    muted2:         "rgba(240,224,208,0.45)",
  },

  // Hip-Hop / Rap
  "hip-hop": {
    displayFont:    "Syne",
    bodyFont:       "DM Sans",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap",
    accent:         "#d4aa30",
    accentWarm:     "#e8c048",
    accentDim:      "rgba(212,170,48,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(245,200,66,0.08)",
    border2:        "rgba(245,200,66,0.18)",
    text:           "#f0f0f0",
    muted:          "rgba(240,240,240,0.70)",
    muted2:         "rgba(240,240,240,0.45)",
  },

  // Blues
  "blues": {
    displayFont:    "Playfair Display",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#4070a0",
    accentWarm:     "#5586b8",
    accentDim:      "rgba(64,112,160,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(100,150,200,0.08)",
    border2:        "rgba(100,150,200,0.16)",
    text:           "#d8dde8",
    muted:          "rgba(216,221,232,0.70)",
    muted2:         "rgba(216,221,232,0.45)",
  },

  // Americana — dusty brick red / terracotta, southwestern
  "americana": {
    displayFont:    "Playfair Display",
    bodyFont:       "Inter",
    displayFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
    bodyFontUrl:    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap",
    accent:         "#a83c26",
    accentWarm:     "#bc5238",
    accentDim:      "rgba(168,60,38,0.12)",
    bg:             "#141414",
    bg2:            "#1c1c1c",
    bg3:            "#242424",
    border:         "rgba(210,100,70,0.08)",
    border2:        "rgba(210,100,70,0.18)",
    text:           "#f0ddd8",
    muted:          "rgba(240,221,216,0.70)",
    muted2:         "rgba(240,221,216,0.45)",
  },
};

// ─── Default fallback ─────────────────────────────────────────────

const DEFAULT_TOKENS: TokenSet = {
  displayFont:    "Inter",
  bodyFont:       "Inter",
  displayFontUrl: "",
  bodyFontUrl:    "",
  accent:         "#888888",
  accentWarm:     "#aaaaaa",
  accentDim:      "rgba(136,136,136,0.10)",
  bg:             "#141414",
  bg2:            "#1c1c1c",
  bg3:            "#242424",
  border:         "rgba(255,255,255,0.07)",
  border2:        "rgba(255,255,255,0.13)",
  text:           "#e8e8e8",
  muted:          "rgba(232,232,232,0.68)",
  muted2:         "rgba(232,232,232,0.42)",
};

// ─── Resolver ────────────────────────────────────────────────────
// Takes artist.genre[] and returns the first matching TokenSet.
// Falls back to DEFAULT_TOKENS if no match found.

export function resolveTokens(genres: string[]): TokenSet {
  for (const g of genres) {
    const key = g.toLowerCase().trim();
    if (TOKENS[key]) return TOKENS[key];
    const partial = Object.keys(TOKENS).find((k) => key.includes(k) || k.includes(key));
    if (partial) return TOKENS[partial];
  }
  return DEFAULT_TOKENS;
}

export function applyMode(tokens: TokenSet, mode: "dark" | "light"): TokenSet {
  if (mode === "dark") return tokens;
  return {
    ...tokens,
    bg:      "#f5f5f5",
    bg2:     "#eeeeee",
    bg3:     "#e6e6e6",
    border:  "rgba(0,0,0,0.08)",
    border2: "rgba(0,0,0,0.15)",
    text:    "#111111",
    muted:   "rgba(0,0,0,0.5)",
    muted2:  "rgba(0,0,0,0.3)",
  };
}

export { TOKENS };
