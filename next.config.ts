import type { NextConfig } from "next";
const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  devIndicators: false,
  images: { unoptimized: true },
  redirects: async () => [{ source: "/ru/:path*", destination: "/:path*", permanent: false }],
  experimental: { agentUpgrade: "security" },
  headers: async () =>
    ["/admin/:path*", "/api/admin/:path*"].map((source) => ({
      source,
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "same-origin" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    })),
};
export default config;
