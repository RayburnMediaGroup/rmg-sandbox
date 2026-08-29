// Server component — outputs JSON-LD script tags for the band page.
// Three schemas: MusicGroup (artist) + MusicAlbum (each release) + MusicEvent (upcoming shows).

import { Artist, Release, Show } from "@/lib/data";

interface SchemaProps {
  artist: Artist;
  releases: Release[];
  shows: Show[];
  canonicalUrl: string;
}

function buildMusicGroup(artist: Artist, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${canonicalUrl}#musicgroup`,
    "name": artist.name,
    "description": artist.bio[0],
    "foundingDate": String(artist.founded),
    "foundingLocation": {
      "@type": "Place",
      "name": artist.origin,
    },
    "genre": artist.genre,
    "url": canonicalUrl,
    "member": artist.members.map((m) => ({
      "@type": "OrganizationRole",
      "member": {
        "@type": "Person",
        "name": m.name,
      },
      "roleName": m.role,
    })),
    "sameAs": [
      artist.socialLinks.instagram,
      artist.socialLinks.facebook,
      artist.socialLinks.youtube,
      artist.socialLinks.tiktok,
      artist.socialLinks.twitter,
      artist.streamingLinks.spotify,
      artist.streamingLinks.appleMusic,
    ].filter(Boolean),
  };
}

function buildMusicAlbum(release: Release, artist: Artist, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": release.type === "single" ? "MusicRecording" : "MusicAlbum",
    "@id": `${canonicalUrl}#release-${release.slug}`,
    "name": release.title,
    "datePublished": release.releaseDate,
    "byArtist": {
      "@id": `${canonicalUrl}#musicgroup`,
    },
  };

  if (release.description) schema["description"] = release.description;
  if (release.coverArt)    schema["image"] = release.coverArt;

  if (release.tracks.length > 0) {
    schema["track"] = release.tracks.map((t) => ({
      "@type": "MusicRecording",
      "name": t.title,
      "position": t.number,
      ...(t.duration ? { "duration": t.duration } : {}),
      "byArtist": { "@id": `${canonicalUrl}#musicgroup` },
    }));
  }

  const streamUrls = Object.values(release.streamingLinks).filter(Boolean);
  if (streamUrls.length > 0) schema["sameAs"] = streamUrls;

  return schema;
}

function buildMusicEvent(show: Show, artist: Artist, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": `${artist.name} at ${show.venue}`,
    "startDate": show.date,
    "location": {
      "@type": "Place",
      "name": show.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": show.city,
        ...(show.state ? { "addressRegion": show.state } : {}),
        "addressCountry": show.country,
      },
    },
    "performer": {
      "@id": `${canonicalUrl}#musicgroup`,
    },
    "eventStatus":
      show.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : show.status === "sold-out"
        ? "https://schema.org/EventSoldOut"
        : "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    ...(show.ticketUrl ? { "url": show.ticketUrl } : {}),
    ...(show.notes ? { "description": show.notes } : {}),
  };
}

export default function Schema({ artist, releases, shows, canonicalUrl }: SchemaProps) {
  const upcomingShows = shows.filter(
    (s) => s.status === "upcoming" || s.status === "sold-out"
  );

  const schemas = [
    buildMusicGroup(artist, canonicalUrl),
    ...releases.map((r) => buildMusicAlbum(r, artist, canonicalUrl)),
    ...upcomingShows.map((s) => buildMusicEvent(s, artist, canonicalUrl)),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  );
}
