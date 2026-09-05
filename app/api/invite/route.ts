import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "bandwidth-admin-2026";

export async function POST(req: NextRequest) {
  const { secret, email, first_name } = await req.json();

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Flip invited = true
  const { error: updateError } = await adminSupabase
    .from("waitlist")
    .update({ invited: true })
    .eq("email", email);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Send "you're in" email via Resend
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bandstack-template.vercel.app"}/login`;
  const name = first_name ?? "there";

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "bandwidth <noreply@rayburnmedia.com>",
      to: [email],
      subject: "you're in.",
      html: `
        <div style="background:#080808;min-height:100vh;padding:60px 24px;font-family:Inter,system-ui,sans-serif;">
          <div style="max-width:480px;margin:0 auto;">
            <p style="font-family:'Georgia',serif;font-style:italic;font-size:28px;color:#d8d8d8;margin:0 0 48px;letter-spacing:0.04em;">bandwidth</p>
            <p style="font-size:20px;color:#d8d8d8;font-weight:300;margin:0 0 16px;">hey ${name},</p>
            <p style="font-size:16px;color:#888;font-weight:300;line-height:1.8;margin:0 0 40px;">
              your access is ready.<br/>
              sign in and set up your profile.
            </p>
            <a href="${loginUrl}" style="display:inline-block;background:#d4a843;color:#080808;text-decoration:none;padding:14px 36px;border-radius:4px;font-size:13px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;">
              sign in
            </a>
            <p style="font-size:12px;color:#444;margin:48px 0 0;">© 2026 bandwidth · by rayburn media</p>
          </div>
        </div>
      `,
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.text();
    return NextResponse.json({ error: `email failed: ${err}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
