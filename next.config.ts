import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.join(__dirname, "src"),
        "@/data/questions": path.join(__dirname, "src/data/questions.ts"),
        "@/types": path.join(__dirname, "src/types/index.ts"),
        "@/lib/db": path.join(__dirname, "src/lib/db.ts"),
        "@/lib/session": path.join(__dirname, "src/lib/session.ts"),
        "@/lib/scoring": path.join(__dirname, "src/lib/scoring.ts"),
      };
    }
    return config;
  },
};

export default nextConfig;
