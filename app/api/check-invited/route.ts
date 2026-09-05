import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  const { user_id } = await req.json();
  if (!user_id) return NextResponse.json({ invited: false });

  const { data } = await adminSupabase
    .from("waitlist")
    .select("invited")
    .eq("user_id", user_id)
    .maybeSingle();

  return NextResponse.json({ invited: data?.invited === true });
}
