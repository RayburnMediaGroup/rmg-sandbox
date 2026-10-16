import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Hit daily by the Vercel cron in vercel.json so the free Supabase
// project never sits idle long enough to auto-pause.
export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await supabase.from("bands").select("slug").limit(1);

  if (error) {
    console.error("keep-alive failed:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
