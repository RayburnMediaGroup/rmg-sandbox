import type { Metadata } from "next";
import { artist, releases, shows } from "@/lib/data";
import SchemaBlocks from "@/components/band/SchemaBlocks";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bandstack.io";
const PROFILE_URL = `${BASE_URL}/band`;

export const metadata: Metadata = {
  title: `${artist.name} | BandStack`,
  description: artist.tagline + " — official artist profile on BandStack.",
  keywords: [...artist.genre, artist.origin, artist.name, "live music", "touring band", "outlaw country"],
  authors: [{ name: artist.name }],
  creator: artist.name,
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: PROFILE_URL },
  openGraph: {
    type: "profile",
    url: PROFILE_URL,
    title: artist.name,
    description: artist.tagline,
    siteName: "BandStack",
    images: [
      {
        url: `${BASE_URL}/ryan-chrys-cover.jpg`,
        width: 1200,
        height: 630,
        alt: `${artist.name} — official press photo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: artist.name,
    description: artist.tagline,
    images: [`${BASE_URL}/ryan-chrys-cover.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function BandLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaBlocks artist={artist} releases={releases} shows={shows} baseUrl={BASE_URL} profileUrl={PROFILE_URL} />
      {children}
    </>
  );
}
