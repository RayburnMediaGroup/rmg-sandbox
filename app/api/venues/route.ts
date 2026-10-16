import { NextRequest, NextResponse } from "next/server";
import { VENUE_SEED } from "@/lib/venueData";

const TM_KEY = process.env.TICKETMASTER_API_KEY;
const API_BASE = "https://app.ticketmaster.com/discovery/v2";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city  = (searchParams.get("city")  ?? "").trim().toLowerCase();
  const state = (searchParams.get("state") ?? "").trim().toUpperCase();

  if (!city && !state) {
    return NextResponse.json({ error: "city or state required" }, { status: 400 });
  }

  // Seed results — must match state if provided; city narrows further
  const seedResults = VENUE_SEED.filter(v => {
    if (state && v.state.toUpperCase() !== state) return false;
    if (city  && !v.city.toLowerCase().includes(city)) return false;
    return true;
  }).map(v => ({ ...v, source: "seed" }));

  return NextResponse.json({ results: seedResults });
}
