"use client";

import type { TokenSet } from "@/lib/genreTokens";

interface Props {
  text: string;
  tokens: TokenSet;
  style?: React.CSSProperties;
}

export default function HelperNote({ text, tokens, style }: Props) {
  return (
    <p style={{
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "0.72rem",
      color: tokens.accent,
      fontWeight: 400,
      lineHeight: 1.6,
      borderLeft: `2px solid ${tokens.accent}55`,
      paddingLeft: "0.6rem",
      marginTop: "0.4rem",
      opacity: 0.85,
      ...style,
    }}>
      {text}
    </p>
  );
}
