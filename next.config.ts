import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/bandstack/template/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        { key: "Pragma", value: "no-cache" },
      ],
    },
  ],
};

export default nextConfig;
