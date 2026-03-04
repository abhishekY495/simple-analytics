import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "getmetadata.abhisheky495.workers.dev",
      },
    ],
  },
};

export default nextConfig;
