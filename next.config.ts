import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "images.unsplash.com",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
