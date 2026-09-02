"use client";
import BandPage from "@/components/band/BandPage";
import { TEMPLATE_PROFILE } from "@/lib/bandProfile";

const TEMPLATE_KEY = "bandstack-template-v1";
const EDIT_KEY = `bandstack-editmode-${TEMPLATE_KEY}`;
const SESSION_KEY = `bandstack-unlocked-${TEMPLATE_KEY}`;

// Pre-unlock on every module load — no PIN, no Done button kills it
if (typeof window !== "undefined") {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    sessionStorage.setItem(EDIT_KEY, "1");
  } catch {}
}

export default function TemplatePage() {
  return (
    <BandPage
      profileKey={TEMPLATE_KEY}
      defaultProfile={TEMPLATE_PROFILE}
      stagePlotHref="/bandstack/template/stage-plot"
      defaultEditMode={true}
    />
  );
}
