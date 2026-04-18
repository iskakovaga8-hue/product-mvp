import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbo: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};

export default nextConfig;
