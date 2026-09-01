import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Ryan Chrys YouTube channel ID
const DEFAULT_CHANNEL = "UCBbnTBjit1exp-1Tvws1uZQ";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId") ?? DEFAULT_CHANNEL;
  const key = process.env.YOUTUBE_API_KEY;

  if (!key || key === "your_youtube_key_here") {
    return NextResponse.json({ error: "YOUTUBE_API_KEY not configured" }, { status: 503 });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${key}`;
    const res = await fetch(url, { cache: "no-store" });
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
