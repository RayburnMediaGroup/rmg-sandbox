import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Default to Ryan Chrys — overridden per-request via ?artistId=
const DEFAULT_ARTIST_ID = "1211414535";

function msToMin(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const artistId = new URL(req.url).searchParams.get("artistId") ?? DEFAULT_ARTIST_ID;
  try {
    // Fetch all albums for the artist
    const albumsRes = await fetch(
      `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=50`,
      { cache: "no-store" }
    );
    const albumsData = await albumsRes.json();

    // First result is the artist, rest are albums
    const albumItems = (albumsData.results ?? []).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => r.wrapperType === "collection"
    );

    // Fetch tracks for each album in parallel
    const albums = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      albumItems.map(async (album: any) => {
        const tracksRes = await fetch(
          `https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song&limit=50`,
          { cache: "no-store" }
        );
        const tracksData = await tracksRes.json();

        const tracks = (tracksData.results ?? [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((r: any) => r.wrapperType === "track" && r.kind === "song")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((t: any) => ({
            number: t.trackNumber,
            title: t.trackName,
            duration: msToMin(t.trackTimeMillis ?? 0),
            itunesId: t.trackId,
            previewUrl: t.previewUrl ?? null,
            explicit: t.trackExplicitness === "explicit",
          }));

        return {
          itunesId: album.collectionId,
          title: album.collectionName,
          type: album.collectionType === "Album" ? "album" : album.collectionType === "EP" ? "ep" : "single",
          releaseDate: album.releaseDate?.slice(0, 10) ?? "",
          coverArt: album.artworkUrl100?.replace("100x100", "600x600") ?? null,
          itunesUrl: album.collectionViewUrl ?? null,
          trackCount: album.trackCount,
          tracks,
        };
      })
    );

    // Sort oldest first
    albums.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

    return NextResponse.json({
      source: "itunes",
      verified: true,
      artistId,
      albums,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
