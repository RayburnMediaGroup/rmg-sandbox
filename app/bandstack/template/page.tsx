"use client";
import BandPage from "@/components/band/BandPage";
import { TEMPLATE_PROFILE } from "@/lib/bandProfile";

const TEMPLATE_KEY = "bandstack-template-v1";
const EDIT_KEY = `bandstack-editmode-${TEMPLATE_KEY}`;
const SESSION_KEY = `bandstack-unlocked-${TEMPLATE_KEY}`;
const DATA_VERSION = "v3"; // bump to wipe stale localStorage on all clients

if (typeof window !== "undefined") {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    sessionStorage.setItem(EDIT_KEY, "1");
    // Wipe stale cached profile if it predates current template version
    const versionKey = `${TEMPLATE_KEY}-dataversion`;
    if (localStorage.getItem(versionKey) !== DATA_VERSION) {
      localStorage.removeItem(TEMPLATE_KEY);
      localStorage.setItem(versionKey, DATA_VERSION);
    }
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
