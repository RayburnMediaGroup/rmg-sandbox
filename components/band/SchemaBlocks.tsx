// Server component — drops all JSON-LD into <head> via Next.js script injection.
// Covers: MusicGroup, Event, Review, BreadcrumbList, Speakable (AEO),
//         ContactPoint (AXO), sameAs streaming/social links (ASO/GEO).

import Script from "next/script";
import type { artist as ArtistType } from "@/lib/data";

type Artist = typeof ArtistType;
type Release = { title: string; type: string; releaseDate: string; coverArt?: string; streamingLinks: { spotify?: string; appleMusic?: string } };
type Show    = { date: string; venue: string; city: string; state?: string; country?: string; status?: string; ticketUrl?: string; capacity?: number };

interface Props {
  artist: Artist;
  releases: Release[];
  shows: Show[];
  baseUrl: string;
  profileUrl: string;
}

export default function SchemaBlocks({ artist, releases, shows, baseUrl, profileUrl }: Props) {
  const upcomingShows = shows.filter(s => s.status === "upcoming");

  // ── MusicGroup (core entity) ──────────────────────────────────────────────
  const musicGroup = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": profileUrl,
    name: artist.name,
    description: artist.bio.join(" "),
    url: profileUrl,
    image: `${baseUrl}/ryan-chrys-cover.jpg`,
    logo: `${baseUrl}/ryan-chrys-logo.jpg`,
    foundingLocation: {
      "@type": "Place",
      name: artist.origin,
    },
    genre: artist.genre,
    member: artist.members.map(m => ({
      "@type": "OrganizationRole",
      member: { "@type": "Person", name: m.name },
      roleName: m.role,
    })),
    sameAs: [
      artist.streamingLinks.spotify,
      artist.streamingLinks.appleMusic,
      artist.socialLinks.instagram,
      artist.socialLinks.youtube,
      artist.socialLinks.facebook,
    ].filter(Boolean),
    album: releases.filter(r => r.type === "album").map(r => ({
      "@type": "MusicAlbum",
      name: r.title,
      datePublished: r.releaseDate,
      image: r.coverArt,
      "@id": r.streamingLinks.spotify,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "booking",
      email: artist.bookingEmail,
      name: artist.bookingContact,
      availableLanguage: "English",
    },
  };

  // ── Event blocks (upcoming shows) ─────────────────────────────────────────
  const events = upcomingShows.map(s => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${artist.name} at ${s.venue}`,
    startDate: s.date,
    location: {
      "@type": "MusicVenue",
      name: s.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: s.city,
        addressRegion: s.state,
        addressCountry: s.country ?? "US",
      },
    },
    performer: { "@type": "MusicGroup", name: artist.name, "@id": profileUrl },
    ...(s.capacity && { maximumAttendeeCapacity: s.capacity }),
    ...(s.ticketUrl && {
      offers: {
        "@type": "Offer",
        url: s.ticketUrl,
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString(),
      },
    }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  }));

  // ── Review / Press Quote blocks ───────────────────────────────────────────
  const reviews = (artist.pressQuotes ?? []).map(q => ({
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: q.quote,
    author: { "@type": "Organization", name: q.source },
    itemReviewed: { "@type": "MusicGroup", name: artist.name, "@id": profileUrl },
    ...(q.year && { datePublished: String(q.year) }),
  }));

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "BandStack", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Artists", item: `${baseUrl}/artists` },
      { "@type": "ListItem", position: 3, name: artist.name, item: profileUrl },
    ],
  };

  // ── Speakable (AEO — answer engines, voice assistants) ───────────────────
  // Points to the bio paragraph and press section so Google/Alexa/Siri can read
  // these passages aloud or surface them in AI Overviews.
  const speakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": profileUrl,
    name: `${artist.name} | BandStack`,
    url: profileUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#about", "#press"],
    },
  };

  // ── FAQ (AIO / GEO — Google AI Overviews, ChatGPT citations) ─────────────
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What genre is ${artist.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${artist.name} plays ${artist.genre.join(", ")}, blending traditional outlaw country with 70s rock. Based in ${artist.origin}.`,
        },
      },
      {
        "@type": "Question",
        name: `Where is ${artist.name} from?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${artist.name} is based in ${artist.origin}. The band was formed in ${artist.founded}.`,
        },
      },
      {
        "@type": "Question",
        name: `How can I book ${artist.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Booking inquiries for ${artist.name} can be sent to ${artist.bookingEmail}${artist.bookingContact ? ` (${artist.bookingContact})` : ""}.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I stream ${artist.name}'s music?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${artist.name}'s music is available on Spotify (${artist.streamingLinks.spotify}), Apple Music (${artist.streamingLinks.appleMusic}), and YouTube.`,
        },
      },
      ...(upcomingShows.length > 0 ? [{
        "@type": "Question",
        name: `When is ${artist.name} playing next?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${artist.name} is playing at ${upcomingShows[0].venue} in ${upcomingShows[0].city}, ${upcomingShows[0].state} on ${upcomingShows[0].date}.${upcomingShows[0].ticketUrl ? ` Tickets at ${upcomingShows[0].ticketUrl}` : ""}`,
        },
      }] : []),
    ],
  };

  // ── MusicRecording blocks (top tracks for ASO / music search) ────────────
  const recordings = releases.slice(0, 3).flatMap(r =>
    (r as any).tracks?.slice(0, 3).map((t: any) => ({
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: t.title,
      byArtist: { "@type": "MusicGroup", name: artist.name },
      inAlbum: { "@type": "MusicAlbum", name: r.title },
      duration: t.duration ? `PT${t.duration.replace(":", "M")}S` : undefined,
    })) ?? []
  );

  const allSchemas = [
    musicGroup,
    breadcrumb,
    speakable,
    faq,
    ...events,
    ...reviews,
    ...recordings,
  ];

  return (
    <>
      {allSchemas.map((schema, i) => (
        <Script
          key={i}
          id={`schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="beforeInteractive"
        />
      ))}
    </>
  );
}
