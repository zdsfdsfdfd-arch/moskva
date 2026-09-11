import { clamp, lerp, range } from "@/lib/utils";
import type { KlirExpression, KlirPose } from "@/components/illustrations/Klir";

/**
 * Pure timeline for the hero scroll sequence. progress p ∈ [0, 1].
 *
 *  0.00–0.08  hero text, dirty glass, nobody outside
 *  0.08–0.16  the cradle slides in from the right at mid-height
 *  0.16–0.22  it rises to the top of the rightmost stripe
 *  0.22–0.86  stripes are wiped right → left, cradle descends per stripe
 *  0.86–1.00  Klir parks at the lower right and waves; final copy appears
 */
export const T = {
  enterStart: 0.08,
  enterEnd: 0.16,
  riseEnd: 0.22,
  cleanStart: 0.22,
  cleanEnd: 0.86,
  finalStart: 0.86,
  finalEnd: 0.94,
} as const;

/** Where the squeegee blade sits inside Klir's own box (fraction of height/width). */
export const KLIR_BLADE_Y = 0.75;
export const KLIR_BLADE_W = 0.873;

export type HeroState = {
  heroText: number;
  hint: number;
  finalText: number;
  /** Klir horizontal centre, % of glass width. */
  klirX: number;
  /** Blade line, fraction of glass height. */
  bladeY: number;
  klirVisible: boolean;
  pose: KlirPose;
  expression: KlirExpression;
  /** Cleaned fraction per stripe, left → right. */
  wipes: number[];
  /** Stripe being wiped right now, or -1. */
  active: number;
  /** 0..1 brightness/saturation lift of the city. */
  bright: number;
  done: boolean;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export function heroState(pRaw: number, stripes: number): HeroState {
  const p = clamp(pRaw, 0, 1);
  const centre = (i: number) => ((i + 0.5) / stripes) * 100;
  const wipes = new Array(stripes).fill(0);

  const heroText = 1 - range(p, 0.03, 0.12);
  const hint = 1 - range(p, 0.0, 0.05);
  const finalText = range(p, 0.88, 0.96);

  let klirX = 130;
  let bladeY = 0.42;
  let active = -1;
  let pose: KlirPose = "wipe";
  let expression: KlirExpression = "smirk";
  let klirVisible = false;

  if (p < T.enterStart) {
    klirVisible = false;
  } else if (p < T.enterEnd) {
    const t = range(p, T.enterStart, T.enterEnd);
    klirVisible = true;
    klirX = lerp(130, centre(stripes - 1), easeInOut(t));
    bladeY = 0.42;
  } else if (p < T.riseEnd) {
    const t = range(p, T.enterEnd, T.riseEnd);
    klirVisible = true;
    klirX = centre(stripes - 1);
    bladeY = lerp(0.42, 0, easeInOut(t));
    expression = "focused";
  } else if (p < T.cleanEnd) {
    klirVisible = true;
    expression = "focused";
    const slot = (T.cleanEnd - T.cleanStart) / stripes;
    const wipeLen = slot * 0.84;
    const local = p - T.cleanStart;
    const j = Math.min(stripes - 1, Math.floor(local / slot));
    const inSlot = local - j * slot;
    // stripes before j (in wipe order) are done
    for (let k = 0; k < j; k++) wipes[stripes - 1 - k] = 1;
    const s = stripes - 1 - j; // current stripe index (left-based)
    if (inSlot <= wipeLen) {
      const w = inSlot / wipeLen;
      wipes[s] = w;
      klirX = centre(s);
      bladeY = w;
      active = s;
    } else {
      wipes[s] = 1;
      const t = (inSlot - wipeLen) / (slot - wipeLen);
      const next = Math.max(0, s - 1);
      klirX = lerp(centre(s), centre(next), easeInOut(t));
      bladeY = lerp(1, 0, easeInOut(t));
      if (s === 0) {
        // last stripe: no next one, drift toward the parking spot instead
        klirX = lerp(centre(0), 50, easeInOut(t));
        bladeY = lerp(1, 1.1, t);
      }
    }
  } else {
    wipes.fill(1);
    klirVisible = true;
    const t = easeInOut(range(p, T.finalStart, T.finalEnd));
    klirX = lerp(50, 82, t);
    bladeY = lerp(1.1, 0.64, t);
    pose = t > 0.55 ? "wave" : "wipe";
    expression = t > 0.55 ? "happy" : "smirk";
  }

  const bright = range(p, T.cleanStart, T.cleanEnd);
  return {
    heroText,
    hint,
    finalText,
    klirX,
    bladeY,
    klirVisible,
    pose,
    expression,
    wipes,
    active,
    bright,
    done: p >= T.finalStart,
  };
}

/**
 * Clip-path polygon that keeps only the still-dirty parts of the glass:
 * a staircase whose top edge is each stripe's wipe line.
 */
export function dirtClipPath(wipes: number[]): string {
  const n = wipes.length;
  const pts: string[] = ["0% 100%"];
  for (let i = 0; i < n; i++) {
    const x0 = (i / n) * 100;
    const x1 = ((i + 1) / n) * 100;
    const y = Math.min(100, wipes[i] * 100);
    pts.push(`${x0}% ${y}%`, `${x1}% ${y}%`);
  }
  pts.push("100% 100%");
  return `polygon(${pts.join(", ")})`;
}
