import { createClient } from "@supabase/supabase-js";
import BandPageClient from "./BandPageClient";
import type { ProfileData } from "@/lib/bandProfile";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from("bands").select("profile").eq("slug", slug).maybeSingle();
  const name = (data?.profile as ProfileData | null)?.name;
  return { title: name ? `${name} · bandwidth` : "bandwidth" };
}

export default async function BandSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: bandData } = await supabase
    .from("bands")
    .select("profile, user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!bandData) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#555", fontSize: "0.9rem" }}>
          Band not found.
        </p>
        <a href="/intake" style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#c8a86b", fontSize: "0.8rem", textDecoration: "none" }}>
          Build your page →
        </a>
      </div>
    );
  }

  return (
    <BandPageClient
      slug={slug}
      profile={bandData.profile as ProfileData}
      bandUserId={bandData.user_id}
    />
  );
}
