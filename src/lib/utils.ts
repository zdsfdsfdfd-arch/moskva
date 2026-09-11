export type ClassValue = string | number | false | null | undefined;

/** Tiny className joiner — no library needed for a handful of components. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps t from [inMin, inMax] to [0,1], clamped. */
export const range = (t: number, inMin: number, inMax: number) =>
  clamp((t - inMin) / (inMax - inMin), 0, 1);

const NBSP = " ";

/** 4200 -> "4 200 ₽" with non-breaking spaces (Russian formatting). */
export function formatRub(value: number, prefix = ""): string {
  const rounded = Math.round(value);
  const grouped = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${prefix}${grouped}${NBSP}₽`;
}

/** Round to the nearest step (e.g. 50 ₽) so estimates look intentional. */
export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

/** Deterministic pseudo-random for decorative layouts (no hydration mismatch). */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
