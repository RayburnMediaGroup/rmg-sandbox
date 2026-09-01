"use client";
import BandPage from "@/components/band/BandPage";
import { DEMO_PROFILE } from "@/lib/bandProfile";

export default function RyanChrysPage() {
  return (
    <BandPage
      profileKey="bandstack-profile-v1"
      defaultProfile={DEMO_PROFILE}
      stagePlotHref="/bandstack/ryan-chrys/stage-plot"
    />
  );
}
