import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
      },
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
