import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/config/securityHeaders";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@agl/ui", "@agl/cms-types"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders(process.env.NODE_ENV === "development"),
      },
    ];
  },
};

export default nextConfig;
