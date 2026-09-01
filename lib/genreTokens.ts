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
    accent:         "#c8922a",
    accentWarm:     "#e0aa48",
    accentDim:      "rgba(200,146,42,0.12)",
    bg:             "#0c0b09",
    bg2:            "#141210",
    bg3:            "#1d1a16",
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
    accent:         "#d4b84a",
    accentWarm:     "#e8cc66",
    accentDim:      "rgba(212,184,74,0.12)",
    bg:             "#0b0a07",
    bg2:            "#141208",
    bg3:            "#1c1a0e",
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
    accent:         "#5eada8",
    accentWarm:     "#78c5bf",
    accentDim:      "rgba(94,173,168,0.12)",
    bg:             "#080d0d",
    bg2:            "#0e1515",
    bg3:            "#141e1e",
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
    accent:         "#8aaa5c",
    accentWarm:     "#a3c274",
    accentDim:      "rgba(138,170,92,0.12)",
    bg:             "#09100a",
    bg2:            "#101810",
    bg3:            "#172118",
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
    accent:         "#e04040",
    accentWarm:     "#f06060",
    accentDim:      "rgba(224,64,64,0.12)",
    bg:             "#0a0a0a",
    bg2:            "#111111",
    bg3:            "#1a1a1a",
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
    accent:         "#7b68ee",
    accentWarm:     "#9b88ff",
    accentDim:      "rgba(123,104,238,0.12)",
    bg:             "#09090f",
    bg2:            "#101018",
    bg3:            "#181822",
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
    accent:         "#e63946",
    accentWarm:     "#ff5560",
    accentDim:      "rgba(230,57,70,0.12)",
    bg:             "#080808",
    bg2:            "#0f0f0f",
    bg3:            "#181818",
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
    accent:         "#00c8c8",
    accentWarm:     "#30e0e0",
    accentDim:      "rgba(0,200,200,0.10)",
    bg:             "#060a0f",
    bg2:            "#0c1018",
    bg3:            "#121820",
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
    accent:         "#6699cc",
    accentWarm:     "#88aadd",
    accentDim:      "rgba(102,153,204,0.10)",
    bg:             "#080b10",
    bg2:            "#0e1218",
    bg3:            "#141820",
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
    accent:         "#c41a1a",
    accentWarm:     "#e02020",
    accentDim:      "rgba(196,26,26,0.12)",
    bg:             "#060606",
    bg2:            "#0c0c0c",
    bg3:            "#131313",
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
    accent:         "#a03060",
    accentWarm:     "#c04878",
    accentDim:      "rgba(160,48,96,0.12)",
    bg:             "#0a0709",
    bg2:            "#120d10",
    bg3:            "#1c1218",
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
    accent:         "#d4622a",
    accentWarm:     "#ec7e44",
    accentDim:      "rgba(212,98,42,0.12)",
    bg:             "#0d0807",
    bg2:            "#16100c",
    bg3:            "#201812",
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
    accent:         "#f5c842",
    accentWarm:     "#ffd966",
    accentDim:      "rgba(245,200,66,0.12)",
    bg:             "#08080a",
    bg2:            "#0f0f12",
    bg3:            "#171719",
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
    accent:         "#4a7fb5",
    accentWarm:     "#6095cc",
    accentDim:      "rgba(74,127,181,0.12)",
    bg:             "#080a0e",
    bg2:            "#0e1016",
    bg3:            "#141820",
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
    accent:         "#c0432a",
    accentWarm:     "#d85c40",
    accentDim:      "rgba(192,67,42,0.12)",
    bg:             "#0e0908",
    bg2:            "#180f0c",
    bg3:            "#221612",
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
  bg:             "#0a0a0a",
  bg2:            "#111111",
  bg3:            "#181818",
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
