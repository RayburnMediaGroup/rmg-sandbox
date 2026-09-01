import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get("artist") ?? "Ryan Chrys";
  const key = process.env.SETLISTFM_API_KEY;

  if (!key || key === "your_setlistfm_key_here") {
    return NextResponse.json({ error: "SETLISTFM_API_KEY not configured" }, { status: 503 });
  }

  try {
    const url = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(artist)}&p=1`;
    const res = await fetch(url, {
      headers: {
        "x-api-key": key,
        "Accept": "application/json",
      },
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    if (!data.setlist) {
      return NextResponse.json({ error: "No setlists found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setlists = data.setlist.slice(0, 10).map((s: any) => ({
      date: s.eventDate,
      venue: s.venue?.name ?? "",
      city: s.venue?.city?.name ?? "",
      state: s.venue?.city?.stateCode ?? "",
      country: s.venue?.city?.country?.code ?? "",
      url: s.url,
      songs: (s.sets?.set ?? []).flatMap((set: any) =>
        (set.song ?? []).map((song: any) => ({
          name: song.name,
          cover: song.cover ? { artist: song.cover.name } : null,
          tape: song.tape ?? false,
        }))
      ),
    }));

    return NextResponse.json({ source: "setlist.fm", verified: true, total: data.total, setlists });
  } catch {
    return NextResponse.json({ error: "Failed to fetch Setlist.fm data" }, { status: 500 });
  }
}
