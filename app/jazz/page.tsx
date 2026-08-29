import type { Metadata } from "next";
import { artist, releases, shows } from "@/lib/data-milo-vega";
import { resolveTokens } from "@/lib/genreTokens";
import { AudioPlayerProvider } from "@/lib/audioContext";
import Schema from "@/components/band/Schema";
import BandTheme from "@/components/band/BandTheme";
import Navbar from "@/components/band/Navbar";
import Hero from "@/components/band/Hero";
import LatestRelease from "@/components/band/LatestRelease";
import Shows from "@/components/band/Shows";
import PressStrip from "@/components/band/PressStrip";
import AboutSnippet from "@/components/band/AboutSnippet";
import StreamingFooter from "@/components/band/StreamingFooter";
import MiniPlayer from "@/components/band/MiniPlayer";

const CANONICAL_URL = "https://milovegaquartet.com";

export const metadata: Metadata = {
  title: `${artist.name} | Official Site`,
  description: artist.bio[0].slice(0, 160),
  openGraph: {
    title: artist.name,
    description: artist.tagline,
    type: "music.song",
    url: CANONICAL_URL,
  },
};

export default function JazzPage() {
  const tokens = resolveTokens(artist.genre);
  const featuredRelease = releases.find((r) => r.isFeatured) ?? releases[releases.length - 1];

  return (
    <AudioPlayerProvider>
      <main id="top" style={{ background: tokens.bg, paddingBottom: 80 }}>
        <Schema artist={artist} releases={releases} shows={shows} canonicalUrl={CANONICAL_URL} />
        <BandTheme tokens={tokens} />
        <Navbar artist={artist} />
        <Hero artist={artist} featuredRelease={featuredRelease} />
        <div id="music">
          <LatestRelease release={featuredRelease} />
        </div>
        <Shows shows={shows} />
        <PressStrip quotes={artist.pressQuotes} />
        <div id="about">
          <AboutSnippet artist={artist} />
        </div>
        <div id="contact">
          <StreamingFooter artist={artist} />
        </div>
        <MiniPlayer />
      </main>
    </AudioPlayerProvider>
  );
}
