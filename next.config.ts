import type { NextConfig } from "next";
import path from "path";

const repoName = "waal";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}`,
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
