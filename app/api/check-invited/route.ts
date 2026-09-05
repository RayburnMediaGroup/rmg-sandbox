import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { user_id, email } = await req.json();
  if (!user_id && !email) return NextResponse.json({ invited: false });

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Try by user_id first, fall back to email
  let data = null;
  if (user_id) {
    const result = await adminSupabase
      .from("waitlist")
      .select("invited")
      .eq("user_id", user_id)
      .maybeSingle();
    data = result.data;
  }
  if (!data && email) {
    const result = await adminSupabase
      .from("waitlist")
      .select("invited")
      .eq("email", email)
      .maybeSingle();
    data = result.data;
  }

  return NextResponse.json({ invited: data?.invited === true });
}
