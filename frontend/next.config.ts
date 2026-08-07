import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "/sistem-akademik-mini",
  assetPrefix: "/sistem-akademik-mini/",
};

export default nextConfig;
