import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) return NextResponse.json({ error: "server misconfigured" }, { status: 500 });

  const { secret } = await req.json();

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data, error } = await adminSupabase
    .from("waitlist")
    .select("id, email, first_name, last_name, invited, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
