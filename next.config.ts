import type { NextConfig } from "next";

/**
 * Подпапка домена, если сайт живёт не в корне: NEXT_PUBLIC_BASE_PATH=/clear.
 * Пусто — сайт в корне. Значение должно совпадать с тем, что видит код
 * (src/lib/basePath.ts), поэтому переменная одна на оба места.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  agentRules: false,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
