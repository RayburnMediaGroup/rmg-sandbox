"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BandPage from "@/components/band/BandPage";
import { supabase } from "@/lib/supabase";
import type { ProfileData } from "@/lib/bandProfile";

export default function BandSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      const [{ data: bandData, error }, { data: { session } }] = await Promise.all([
        supabase.from("bands").select("profile, user_id").eq("slug", slug).maybeSingle(),
        supabase.auth.getSession(),
      ]);

      if (error || !bandData) {
        setNotFound(true);
        return;
      }

      setProfile(bandData.profile as ProfileData);
      // Only the user who created this band can edit it
      if (session?.user?.id && bandData.user_id && session.user.id === bandData.user_id) {
        setIsOwner(true);
      }
    }

    load();
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
      defaultEditMode={isOwner}
      supabaseSlug={slug}
    />
  );
}
