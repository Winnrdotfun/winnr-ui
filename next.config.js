/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Add new rule to handle SVG with SVGR
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
