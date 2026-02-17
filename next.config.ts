import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['googleapis', 'google-spreadsheet'],
};

export default nextConfig;
