/**
 * Сайт может жить не в корне домена, а в подпапке (например, /clear).
 * Значение задаётся в NEXT_PUBLIC_BASE_PATH на этапе сборки и подставляется
 * и в next.config.ts, и в код.
 *
 * next/link и next/image подставляют basePath сами. Всё остальное —
 * обычные <img src>, fetch к API, ручные ссылки — нужно оборачивать в withBasePath().
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** "/textures/dirt.svg" → "/clear/textures/dirt.svg" */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
