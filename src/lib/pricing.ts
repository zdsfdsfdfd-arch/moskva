import { AREA_STOPS, type CalculatorState, type ExtraId, type ObjectType, type WindowType } from "@/data/calculator";
import { roundTo } from "@/lib/utils";

/**
 * Ориентировочная модель стоимости. Ставки — за м² при мойке с двух
 * сторон, откалиброваны по ориентирам московского рынка так, чтобы
 * одностворчатое окно (~1 м²) давало ≈ 350 ₽. Это НЕ реальный прайс.
 */
const RATE_PER_M2: Record<WindowType, number> = {
  standard: 340,
  panoramic: 180,
  balcony: 260,
  storefront: 140,
  complex: 320,
};

const OBJECT_FACTOR: Record<ObjectType, number> = {
  apartment: 1,
  house: 1.1, // выезд за город
  office: 0.95, // объёмы
  shop: 0.92,
};

const ONE_SIDE_FACTOR = 0.6;
const MIN_ORDER = 2500;
const MOSQUITO_NET_PRICE = 250;

export type Breakdown = { label: string; amount: number }[];

export function estimate(state: CalculatorState): { total: number; breakdown: Breakdown; area: number } {
  const area = AREA_STOPS[state.areaIndex] ?? 20;
  const windows = state.windows ?? "standard";
  const object = state.object ?? "apartment";
  const sides = state.sides ?? "two";

  const base = area * RATE_PER_M2[windows] * OBJECT_FACTOR[object] * (sides === "one" ? ONE_SIDE_FACTOR : 1);
  const breakdown: Breakdown = [{ label: `Стекло, ${area} м²`, amount: base }];

  const percent: Partial<Record<ExtraId, number>> = { frames: 0.15, sills: 0.08, renovation: 0.4, "high-access": 0.35 };
  for (const extra of state.extras) {
    if (extra === "mosquito") {
      const nets = Math.max(1, Math.ceil(area / 3));
      breakdown.push({ label: `Москитные сетки × ${nets}`, amount: nets * MOSQUITO_NET_PRICE });
    } else if (percent[extra]) {
      breakdown.push({ label: extraLabel(extra), amount: base * percent[extra]! });
    }
  }

  const raw = breakdown.reduce((sum, b) => sum + b.amount, 0);
  const total = Math.max(MIN_ORDER, roundTo(raw, 50));
  return { total, breakdown, area };
}

function extraLabel(id: ExtraId) {
  switch (id) {
    case "frames":
      return "Рамы и откосы";
    case "sills":
      return "Подоконники";
    case "renovation":
      return "После ремонта";
    case "high-access":
      return "Сложный доступ";
    default:
      return id;
  }
}

export const pricingAssumptions = { MIN_ORDER, ONE_SIDE_FACTOR, RATE_PER_M2 };
