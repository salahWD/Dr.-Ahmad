import type { NextConfig } from "next";

const config: NextConfig = {
  // Runs as a Node.js server (`next start`): bookings and the admin need a database.
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    // Admin image uploads are capped at 5 MB in the upload handler.
    serverActions: { bodySizeLimit: "6mb" },
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default config;
