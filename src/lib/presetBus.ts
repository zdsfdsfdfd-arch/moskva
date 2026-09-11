import type { Service } from "@/data/services";

export type CalculatorPreset = Service["preset"];

export const PRESET_EVENT = "blik:preset";

/** Services → calculator handoff without a global store: a DOM event. */
export function pushPreset(preset: CalculatorPreset) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<CalculatorPreset>(PRESET_EVENT, { detail: preset }));
  }
}
