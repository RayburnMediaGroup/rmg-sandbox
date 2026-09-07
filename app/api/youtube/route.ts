import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function extractHandle(input: string): { type: "id" | "handle" | "username"; value: string } | null {
  const s = input.trim();
  // Already a raw channel ID (UC...)
  if (/^UC[\w-]{20,}$/.test(s)) return { type: "id", value: s };
  // URL with /channel/UC...
  const chanMatch = s.match(/youtube\.com\/channel\/(UC[\w-]+)/);
  if (chanMatch) return { type: "id", value: chanMatch[1] };
  // URL with @handle or bare @handle
  const handleMatch = s.match(/(?:youtube\.com\/)?@([\w.-]+)/);
  if (handleMatch) return { type: "handle", value: handleMatch[1] };
  // URL with /user/
  const userMatch = s.match(/youtube\.com\/user\/([\w.-]+)/);
  if (userMatch) return { type: "username", value: userMatch[1] };
  // Bare word — treat as username
  if (/^[\w.-]+$/.test(s)) return { type: "username", value: s };
  return null;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("channelId") ?? req.nextUrl.searchParams.get("channel") ?? "";
  const key = process.env.YOUTUBE_API_KEY;

  if (!key || key === "your_youtube_key_here") {
    return NextResponse.json({ error: "YOUTUBE_API_KEY not configured" }, { status: 503 });
  }
  if (!raw) {
    return NextResponse.json({ error: "No channel provided" }, { status: 400 });
  }

  const parsed = extractHandle(raw);
  if (!parsed) return NextResponse.json({ error: "Could not parse channel" }, { status: 400 });

  try {
    let apiUrl: string;
    if (parsed.type === "id") {
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${parsed.value}&key=${key}`;
    } else if (parsed.type === "handle") {
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forHandle=${encodeURIComponent(parsed.value)}&key=${key}`;
    } else {
      apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forUsername=${encodeURIComponent(parsed.value)}&key=${key}`;
    }

    const res = await fetch(apiUrl, { cache: "no-store" });
    const data = await res.json();

    const channel = data.items?.[0];
    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    return NextResponse.json({
      source: "youtube",
      verified: true,
      subscribers: parseInt(channel.statistics.subscriberCount ?? "0"),
      totalViews: parseInt(channel.statistics.viewCount ?? "0"),
      videoCount: parseInt(channel.statistics.videoCount ?? "0"),
      title: channel.snippet.title,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}
