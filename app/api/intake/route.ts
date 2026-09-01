import { NextRequest, NextResponse } from "next/server";

const LASTFM_KEY  = process.env.LASTFM_API_KEY!;
const SETLIST_KEY = process.env.SETLISTFM_API_KEY!;
const SP_ID       = process.env.SPOTIFY_CLIENT_ID!;
const SP_SECRET   = process.env.SPOTIFY_CLIENT_SECRET!;

// ── Spotify token ─────────────────────────────────────────────────────────────
async function getSpotifyToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SP_ID}:${SP_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

// ── Spotify artist + albums ───────────────────────────────────────────────────
async function fetchSpotify(artistId: string) {
  try {
    const token = await getSpotifyToken();
    const headers = { Authorization: `Bearer ${token}` };

    const [artistRes, albumsRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${artistId}`, { headers }),
      fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US&limit=20`, { headers }),
    ]);

    const artist = await artistRes.json();
    const albumsData = await albumsRes.json();

    // Fetch tracks for first 5 releases
    const releases = (albumsData.items ?? []).slice(0, 8);
    const withTracks = await Promise.all(releases.map(async (r: any) => {
      try {
        const tr = await fetch(`https://api.spotify.com/v1/albums/${r.id}/tracks?limit=20`, { headers });
        const trData = await tr.json();
        return { ...r, tracks: trData.items ?? [] };
      } catch { return { ...r, tracks: [] }; }
    }));

    return {
      name: artist.name,
      genres: artist.genres ?? [],
      followers: artist.followers?.total ?? 0,
      popularity: artist.popularity ?? 0,
      spotifyUrl: artist.external_urls?.spotify ?? "",
      image: artist.images?.[0]?.url ?? "",
      releases: withTracks.map((r: any) => ({
        title: r.name,
        type: r.album_type,
        releaseDate: r.release_date,
        spotifyUrl: r.external_urls?.spotify ?? "",
        coverArt: r.images?.[0]?.url ?? "",
        tracks: (r.tracks ?? []).map((t: any, i: number) => ({
          number: i + 1,
          title: t.name,
          duration: t.duration_ms ? msToTime(t.duration_ms) : undefined,
        })),
      })),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── Last.fm artist info + bio ─────────────────────────────────────────────────
async function fetchLastfm(artistName: string) {
  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_KEY}&format=json`
    );
    const data = await res.json();
    const a = data.artist;
    if (!a) return { error: "Not found" };

    const bio = a.bio?.summary?.replace(/<a[^>]*>.*?<\/a>/g, "").replace(/<[^>]+>/g, "").trim() ?? "";

    return {
      listeners: parseInt(a.stats?.listeners ?? "0"),
      playcount: parseInt(a.stats?.playcount ?? "0"),
      bio,
      tags: (a.tags?.tag ?? []).map((t: any) => t.name),
      similar: (a.similar?.artist ?? []).map((s: any) => s.name),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── Setlist.fm — recent shows ─────────────────────────────────────────────────
async function fetchSetlist(artistName: string) {
  try {
    const res = await fetch(
      `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artistName)}&p=1`,
      { headers: { Accept: "application/json", "x-api-key": SETLIST_KEY } }
    );
    const data = await res.json();
    const setlists = data.setlist ?? [];
    return {
      total: data.total ?? 0,
      setlists: setlists.slice(0, 5).map((s: any) => ({
        date: s.eventDate,
        venue: s.venue?.name ?? "",
        city: `${s.venue?.city?.name ?? ""}, ${s.venue?.city?.stateCode ?? s.venue?.city?.country?.code ?? ""}`,
        songs: (s.sets?.set ?? []).flatMap((set: any) => set.song ?? []).map((s: any) => s.name),
      })),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── iTunes — find Apple Music artist ID ──────────────────────────────────────
async function fetchItunes(artistName: string) {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=5`
    );
    const data = await res.json();
    const match = (data.results ?? []).find((r: any) =>
      r.artistName.toLowerCase().includes(artistName.toLowerCase().split(" ")[0])
    );
    return match ? { artistId: match.artistId, appleMusicUrl: match.artistLinkUrl, genre: match.primaryGenreName } : null;
  } catch { return null; }
}

// ── Generic page scraper — extracts all OG/meta tags + social links ──────────
async function scrapePage(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    const html = await res.text();

    function og(prop: string) {
      return html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']{1,500})["']`, "i"))?.[1]?.trim()
          ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']og:${prop}["']`, "i"))?.[1]?.trim()
          ?? "";
    }
    function meta(name: string) {
      return html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']{1,500})["']`, "i"))?.[1]?.trim()
          ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,500})["'][^>]+name=["']${name}["']`, "i"))?.[1]?.trim()
          ?? "";
    }

    // Social links found anywhere in the page
    // Facebook: handle must be a word slug (not a pure number like /2008/)
    const instagramMatch = html.match(/instagram\.com\/([a-zA-Z][a-zA-Z0-9_.]{2,40})[/"']/);
    const facebookMatch  = html.match(/facebook\.com\/([a-zA-Z][a-zA-Z0-9_.]{2,60})[/"']/);
    const youtubeMatch   = html.match(/youtube\.com\/@?([a-zA-Z0-9_.-]{3,60})[/"']/);
    const spotifyMatch   = html.match(/open\.spotify\.com\/artist\/([a-zA-Z0-9]{10,30})/);
    const tiktokMatch    = html.match(/tiktok\.com\/@([a-zA-Z0-9_.]{2,40})[/"']/);

    return {
      title:    og("title")  || meta("title")  || "",
      bio:      og("description") || meta("description") || "",
      image:    og("image")  || "",
      siteName: og("site_name") || "",
      socialLinks: {
        instagram: instagramMatch ? `https://instagram.com/${instagramMatch[1]}` : "",
        facebook:  facebookMatch  ? `https://facebook.com/${facebookMatch[1]}`  : "",
        youtube:   youtubeMatch   ? `https://youtube.com/${youtubeMatch[1]}`    : "",
        spotify:   spotifyMatch   ? `https://open.spotify.com/artist/${spotifyMatch[1]}` : "",
        tiktok:    tiktokMatch    ? `https://tiktok.com/@${tiktokMatch[1]}`     : "",
      },
    };
  } catch (e) {
    return { error: String(e), title: "", bio: "", image: "", siteName: "", socialLinks: {} };
  }
}

// ── Facebook scrape — OG tags on public pages ─────────────────────────────────
async function scrapeFacebook(fbUrl: string) {
  // Facebook serves OG tags to the facebookexternalhit UA — reuse scrapePage
  return scrapePage(fbUrl);
}

// ── Website scrape ────────────────────────────────────────────────────────────
async function scrapeWebsite(url: string) {
  return scrapePage(url);
}

function msToTime(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  return `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, "0")}`;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spotifyId  = searchParams.get("spotify");
  const websiteUrl = searchParams.get("website");
  const facebookUrl = searchParams.get("facebook");
  const instagramUrl = searchParams.get("instagram");
  const nameOverride = searchParams.get("name");

  // Need at least one source
  if (!spotifyId && !websiteUrl && !facebookUrl && !nameOverride) {
    return NextResponse.json({ error: "Provide at least one of: spotify, website, facebook, name" }, { status: 400 });
  }

  // Round 1 — scrape all pages + Spotify in parallel
  const [spotify, website, facebook, instagram] = await Promise.all([
    spotifyId   ? fetchSpotify(spotifyId)           : Promise.resolve(null),
    websiteUrl  ? scrapeWebsite(websiteUrl)          : Promise.resolve(null),
    facebookUrl ? scrapeFacebook(facebookUrl)        : Promise.resolve(null),
    instagramUrl ? scrapePage(instagramUrl)          : Promise.resolve(null),
  ]);

  const sp  = (spotify   ?? {}) as any;
  const web = (website   ?? {}) as any;
  const fb  = (facebook  ?? {}) as any;
  const ig  = (instagram ?? {}) as any;

  // Resolve artist name — best source wins
  const artistName = nameOverride || sp.name || fb.title?.replace(/ \|.*/, "").trim() || web.title?.replace(/ \|.*/, "").trim() || "";

  // Round 2 — now we have the name, hit music APIs
  const [lastfm, setlist, itunes] = await Promise.all([
    artistName ? fetchLastfm(artistName)  : Promise.resolve(null),
    artistName ? fetchSetlist(artistName) : Promise.resolve(null),
    artistName ? fetchItunes(artistName)  : Promise.resolve(null),
  ]);

  const lfm = (lastfm  ?? {}) as any;
  const sl  = (setlist ?? {}) as any;
  const it  = (itunes  ?? {}) as any;

  // Merge social links — website > facebook > instagram, each fills gaps
  const mergedSocial = {
    instagram: web.socialLinks?.instagram || fb.socialLinks?.instagram || ig.socialLinks?.instagram || (instagramUrl ?? ""),
    facebook:  web.socialLinks?.facebook  || fb.socialLinks?.facebook  || (facebookUrl ?? ""),
    youtube:   web.socialLinks?.youtube   || fb.socialLinks?.youtube   || "",
    spotify:   web.socialLinks?.spotify   || fb.socialLinks?.spotify   || (spotifyId ? `https://open.spotify.com/artist/${spotifyId}` : ""),
    tiktok:    web.socialLinks?.tiktok    || fb.socialLinks?.tiktok    || "",
  };

  // Bio — prefer Last.fm (longer), fall back to FB/website OG description
  const bio = lfm.bio || fb.bio || web.bio || ig.bio || "";

  // Hero image — prefer Spotify (high res press photo), fall back to website/fb OG
  const heroImage = sp.image || web.image || fb.image || "";

  const profile = {
    // Identity
    name:    artistName,
    genre:   sp.genres?.[0] ?? lfm.tags?.[0] ?? it?.genre ?? "",
    genres:  sp.genres ?? lfm.tags ?? [],
    tagline: bio.slice(0, 140).replace(/\n/g, " "),
    bio,

    // Streaming stats
    spotifyFollowers:  sp.followers   ?? 0,
    spotifyPopularity: sp.popularity  ?? 0,
    lastfmListeners:   lfm.listeners  ?? 0,
    lastfmPlaycount:   lfm.playcount  ?? 0,
    lastfmTags:        lfm.tags       ?? [],
    similarArtists:    lfm.similar    ?? [],

    // Music
    releases:         sp.releases ?? [],
    appleMusicArtistId: it?.artistId ?? null,
    appleMusicUrl:    it?.appleMusicUrl ?? "",

    // Shows
    showsTotal:   sl.total    ?? 0,
    recentShows:  sl.setlists ?? [],

    // Links & images
    spotifyUrl:   mergedSocial.spotify,
    heroImage,
    socialLinks:  mergedSocial,

    // What each source returned — for the intake UI to show coverage
    _sources: {
      spotifyOk:   !sp.error   && !!sp.name,
      lastfmOk:    !lfm.error  && !!lfm.bio,
      setlistOk:   !sl.error   && sl.total >= 0,
      itunesOk:    !!it?.artistId,
      websiteOk:   !web.error  && !!web.bio,
      facebookOk:  !fb.error   && !!fb.bio,
      instagramOk: !ig.error   && !!ig.bio,
    },
    _raw: { fb: { title: fb.title, bio: fb.bio?.slice(0,200) }, web: { title: web.title, bio: web.bio?.slice(0,200) } },
  };

  return NextResponse.json(profile);
}
