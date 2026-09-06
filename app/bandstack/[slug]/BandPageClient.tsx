"use client";

import { useEffect, useState } from "react";
import BandPage from "@/components/band/BandPage";
import { supabase } from "@/lib/supabase";
import type { ProfileData } from "@/lib/bandProfile";

interface Props {
  slug: string;
  profile: ProfileData;
  bandUserId: string | null;
}

export default function BandPageClient({ slug, profile, bandUserId }: Props) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!bandUserId) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id && session.user.id === bandUserId) {
        setIsOwner(true);
      }
    });
  }, [bandUserId]);

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
