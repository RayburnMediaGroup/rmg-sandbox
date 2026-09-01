import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ARTIST_ID = "7bBwMFjw1i74dv0UN4FzP1"; // Ryan Chrys & The Rough Cuts

async function getToken(): Promise<string> {
  const id = process.env.SPOTIFY_CLIENT_ID!;
  const secret = process.env.SPOTIFY_CLIENT_SECRET!;
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get Spotify token");
  return data.access_token;
}

async function spotifyGet(path: string, token: string) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || clientId === "your_spotify_client_id_here" ||
      !clientSecret || clientSecret === "your_spotify_client_secret_here") {
    return NextResponse.json({ error: "SPOTIFY credentials not configured" }, { status: 503 });
  }

  try {
    const token = await getToken();

    // Fetch all albums (albums + singles, no compilations)
    const albumsData = await spotifyGet(
      `/artists/${ARTIST_ID}/albums?include_groups=album,single&market=US&limit=50`,
      token
    );

    // Deduplicate by name (Spotify sometimes returns duplicates for different markets)
    const seen = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueAlbums = (albumsData.items ?? []).filter((a: any) => {
      const key = a.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Fetch tracks for each album in parallel (max 10 to stay within rate limits)
    const albums = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uniqueAlbums.slice(0, 10).map(async (album: any) => {
        const tracksData = await spotifyGet(
          `/albums/${album.id}/tracks?market=US&limit=50`,
          token
        );
        return {
          id: album.id,
          name: album.name,
          type: album.album_type as "album" | "single" | "compilation",
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          coverArt: album.images?.[0]?.url ?? null,
          spotifyUrl: album.external_urls?.spotify ?? null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tracks: (tracksData.items ?? []).map((t: any) => ({
            number: t.track_number,
            name: t.name,
            duration: msToMin(t.duration_ms),
            spotifyId: t.id,
            previewUrl: t.preview_url ?? null,
            explicit: t.explicit,
          })),
        };
      })
    );

    // Sort oldest first
    albums.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

    return NextResponse.json({
      source: "spotify",
      verified: true,
      artistId: ARTIST_ID,
      albums,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function msToMin(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
