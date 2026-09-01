import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bandstack.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/band`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/band/stage-plot`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
