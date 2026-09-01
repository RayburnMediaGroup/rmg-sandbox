import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get("artist") ?? "Ryan Chrys & The Rough Cuts";
  const key = process.env.LASTFM_API_KEY;

  if (!key || key === "your_lastfm_key_here") {
    return NextResponse.json({ error: "LASTFM_API_KEY not configured" }, { status: 503 });
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${key}&format=json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.message }, { status: 404 });
    }

    const info = data.artist;
    return NextResponse.json({
      source: "last.fm",
      verified: true,
      name: info.name,
      listeners: parseInt(info.stats?.listeners ?? "0"),
      playcount: parseInt(info.stats?.playcount ?? "0"),
      similar: (info.similar?.artist ?? []).slice(0, 6).map((a: { name: string; url: string }) => ({ name: a.name, url: a.url })),
      tags: (info.tags?.tag ?? []).slice(0, 5).map((t: { name: string }) => t.name),
      bio: info.bio?.summary?.replace(/<[^>]+>/g, "").split("Read more")[0].trim() ?? "",
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch Last.fm data" }, { status: 500 });
  }
}
