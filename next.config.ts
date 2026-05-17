import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "restaurantsukade.nl",
      },
      {
        protocol: "https",
        hostname: "sardiniameppel.nl",
      },
      {
        protocol: "https",
        hostname: "www.debrasserie.com",
      },
      {
        protocol: "https",
        hostname: "www.tonnamthai.nl",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

export default nextConfig;
