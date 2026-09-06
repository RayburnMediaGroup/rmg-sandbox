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
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (!bandUserId) { setSessionChecked(true); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id && session.user.id === bandUserId) {
        setIsOwner(true);
      }
      setSessionChecked(true);
    });
  }, [bandUserId]);

  const profileKey = `bandstack-${slug}-v1`;

  // Wait until we know if the viewer is the owner before rendering.
  // This ensures defaultEditMode is correct on first render so the
  // PIN system never triggers for a logged-in owner.
  if (!sessionChecked) return null;

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
