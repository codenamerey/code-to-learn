import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pyodide", "@clerk/nextjs"],
  turbopack: {},
  output: "standalone",
  trailingSlash: true,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
};

export default nextConfig;
