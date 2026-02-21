import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "g.cricapi.com",
      },
    ],
  },
};

export default nextConfig;
