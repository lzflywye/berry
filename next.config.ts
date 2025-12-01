import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@valkey/valkey-glide"],
};

export default nextConfig;
