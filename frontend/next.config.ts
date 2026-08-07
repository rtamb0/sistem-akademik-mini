import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: "/sistem-akademik-mini",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/sistem-akademik-mini",
  },
};

export default nextConfig;
