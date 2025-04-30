import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // Add your image domains here if you're using external images
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
