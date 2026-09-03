"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BandPage from "@/components/band/BandPage";
import { supabase } from "@/lib/supabase";
import type { ProfileData } from "@/lib/bandProfile";

export default function BandSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    // Always fetch from Supabase — ensures any device gets the latest saved data
    supabase
      .from("bands")
      .select("profile")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setProfile(data.profile as ProfileData);
        }
      });
  }, [slug]);

  if (notFound) {
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

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8a86b", animation: "breathe 2.8s ease-in-out infinite" }} />
        <style>{`@keyframes breathe{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.5);opacity:1}}`}</style>
      </div>
    );
  }

  const profileKey = `bandstack-${slug}-v1`;

  return (
    <BandPage
      profileKey={profileKey}
      defaultProfile={profile}
      stagePlotHref={`/bandstack/${slug}/stage-plot`}
      defaultEditMode={true}
      supabaseSlug={slug}
    />
  );
}
