import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

console.log("Loading next.config.ts..."); // ログを追加

const nextConfig: NextConfig = {
  /* config options here */
  server: {
    https: {
      key: readFileSync(join(process.cwd(), 'certificates', 'localhost-key.pem')),
      cert: readFileSync(join(process.cwd(), 'certificates', 'localhost.pem')),
    },
  },
};

console.log("HTTPS config:", nextConfig.server?.https ? "Enabled" : "Disabled"); // HTTPS設定のログを追加

export default nextConfig;
