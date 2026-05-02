import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jsdom", "axe-core"],
  transpilePackages: ["3d-tiles-renderer"],
};

export default nextConfig;
