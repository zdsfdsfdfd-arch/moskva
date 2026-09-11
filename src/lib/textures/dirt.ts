import { seeded } from "@/lib/utils";

export type DirtOptions = {
  seed?: number;
  /** Fewer marks, no noise filter — small previews and mobile. */
  lite?: boolean;
  /** Construction dust: paler haze, paint splatter, masking tape. */
  renovation?: boolean;
  idPrefix?: string;
};

const fmt = (n: number) => Math.round(n * 10) / 10;

/**
 * Cartoon grime on glass as an SVG string: taupe haze, mottled patches,
 * corner smog, rain streaks, dried drop rings, fingerprints, dust specks
 * and one impolite bird. Rendered once by a route handler and served as
 * an image, so browsers rasterise it a single time.
 */
export function renderDirtSvg({ seed = 3, lite = false, renovation = false, idPrefix = "dirt" }: DirtOptions = {}): string {
  const rand = seeded(seed);
  const n = lite ? 0.45 : 1;
  const grime = renovation ? "#a79e8f" : "#8c7a66";
  const dark = renovation ? "#8a8071" : "#6b5b48";
  const id = idPrefix;
  const parts: string[] = [];

  parts.push(`<defs>
  <filter id="${id}-mottle" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="${seed}" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.35" result="alpha"/>
    <feComposite in="SourceGraphic" in2="alpha" operator="in"/>
  </filter>
  <radialGradient id="${id}-corner" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${dark}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${dark}" stop-opacity="0"/>
  </radialGradient>
</defs>`);

  parts.push(`<rect width="1000" height="600" fill="${grime}" opacity="${renovation ? 0.46 : 0.38}"/>`);
  if (!lite) parts.push(`<rect width="1000" height="600" fill="${dark}" opacity="0.42" filter="url(#${id}-mottle)"/>`);
  parts.push(
    `<ellipse cx="0" cy="0" rx="420" ry="300" fill="url(#${id}-corner)"/>`,
    `<ellipse cx="1000" cy="600" rx="460" ry="320" fill="url(#${id}-corner)"/>`,
    `<ellipse cx="1000" cy="0" rx="300" ry="220" fill="url(#${id}-corner)"/>`,
    `<ellipse cx="0" cy="600" rx="300" ry="220" fill="url(#${id}-corner)"/>`,
  );

  // hand smudges
  for (let i = 0; i < Math.round(7 * n); i++) {
    const x = rand() * 1000, y = rand() * 600, rx = 40 + rand() * 90, ry = 18 + rand() * 50, rot = rand() * 180, o = 0.16 + rand() * 0.2;
    parts.push(`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(rx)}" ry="${fmt(ry)}" transform="rotate(${fmt(rot)} ${fmt(x)} ${fmt(y)})" fill="${dark}" opacity="${fmt(o)}"/>`);
  }
  // rain streaks
  for (let i = 0; i < Math.round(22 * n); i++) {
    const x = rand() * 1000, y = rand() * 300, h = 60 + rand() * 220, w = 3 + rand() * 6, o = 0.12 + rand() * 0.2;
    parts.push(`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(w / 2)}" fill="${dark}" opacity="${fmt(o)}"/>`);
  }
  // dried drop rings
  for (let i = 0; i < Math.round(26 * n); i++) {
    const x = rand() * 1000, y = rand() * 600, r = 8 + rand() * 26, o = 0.18 + rand() * 0.25;
    parts.push(`<g opacity="${fmt(o)}"><circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="none" stroke="${dark}" stroke-width="2.5"/><circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r * 0.55)}" fill="#fff" opacity="0.25"/></g>`);
  }
  // fingerprints
  if (!lite) {
    const fp = (x: number, y: number, rot: number) =>
      `<g transform="translate(${x} ${y}) rotate(${rot})" fill="none" stroke="${dark}" stroke-width="2" opacity="0.32"><ellipse rx="26" ry="36"/><ellipse rx="19" ry="27"/><ellipse rx="12" ry="18"/><ellipse rx="5" ry="9"/></g>`;
    parts.push(fp(180, 380, -20), fp(760, 150, 25), fp(520, 470, 5));
  }
  // dust specks
  for (let i = 0; i < Math.round(110 * n); i++) {
    const x = rand() * 1000, y = rand() * 600, r = 0.8 + rand() * 2.2, o = 0.25 + rand() * 0.5;
    parts.push(`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="${dark}" opacity="${fmt(o)}"/>`);
  }

  if (renovation) {
    parts.push(
      `<g fill="#fff" stroke="${dark}" stroke-width="2"><path d="M120 120 q30 -40 60 0 q20 30 -10 40 q-40 10 -50 -40Z"/><circle cx="210" cy="90" r="9"/><circle cx="105" cy="170" r="6"/></g>`,
      `<rect x="640" y="380" width="260" height="34" rx="4" fill="#f3e2a2" stroke="${dark}" stroke-width="2.5" transform="rotate(-8 770 397)" opacity="0.95"/>`,
      `<path d="M300 520 q80 -30 160 0" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity="0.6" fill="none"/>`,
      `<g stroke="${dark}" stroke-width="2" fill="#d5dde6" opacity="0.8"><path d="M80 470 l30 -6 l4 18 l-30 6Z"/><path d="M850 520 l40 8 l-3 14 l-40 -8Z"/></g>`,
    );
  } else if (!lite) {
    parts.push(
      `<g transform="translate(880 30) scale(0.75)"><path d="M0 0 q16 -18 36 -4 q18 -8 30 8 q10 14 -8 22 q-14 12 -30 4 q-22 4 -28 -14 q-6 -10 0 -16Z" fill="#fff" stroke="${dark}" stroke-width="2.5"/><path d="M22 26 q2 12 -2 22 M40 26 q4 10 2 30" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M22 26 q2 12 -2 22 M40 26 q4 10 2 30" stroke="${dark}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/></g>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">${parts.join("\n")}</svg>`;
}

export const DIRT_TEXTURES = {
  "dirt.svg": { seed: 3 },
  "dirt-2.svg": { seed: 11 },
  "dirt-lite.svg": { seed: 5, lite: true },
  "dirt-renovation.svg": { seed: 8, renovation: true },
} satisfies Record<string, DirtOptions>;

export type DirtTextureName = keyof typeof DIRT_TEXTURES;
