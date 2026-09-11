"use client";

import { motion } from "framer-motion";
import { City } from "@/components/illustrations/City";
import { Dirt } from "@/components/illustrations/Dirt";
import { Klir } from "@/components/illustrations/Klir";
import { AREA_STOPS, type CalculatorState } from "@/data/calculator";
import { springHeavy } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** How the window looks for a given area / type: sashes across and down, box size. */
function layoutFor(state: CalculatorState) {
  const area = AREA_STOPS[state.areaIndex];
  const w = state.windows ?? "standard";
  let cols = 1, rows = 1, width = 42, height = 46;
  if (w === "panoramic" || w === "storefront") {
    cols = area <= 10 ? 2 : area <= 30 ? 3 : area <= 50 ? 4 : 6;
    rows = 1;
    width = area <= 5 ? 55 : area <= 20 ? 75 : 100;
    height = w === "panoramic" ? 88 : 70;
  } else if (w === "balcony") {
    cols = area <= 5 ? 3 : area <= 20 ? 4 : area <= 50 ? 6 : 8;
    rows = 1;
    width = area <= 10 ? 70 : 100;
    height = 58;
  } else if (w === "complex") {
    cols = area <= 10 ? 1 : area <= 30 ? 2 : 3;
    rows = area <= 20 ? 2 : 3;
    width = area <= 10 ? 32 : area <= 30 ? 50 : 70;
    height = 92;
  } else {
    // standard: one sash grows into a wall of windows
    if (area <= 5) { cols = 1; rows = 1; width = 40; height = 50; }
    else if (area <= 10) { cols = 2; rows = 1; width = 58; height = 52; }
    else if (area <= 20) { cols = 3; rows = 1; width = 78; height = 54; }
    else if (area <= 30) { cols = 3; rows = 2; width = 82; height = 70; }
    else if (area <= 50) { cols = 4; rows = 2; width = 96; height = 76; }
    else { cols = 5; rows = 2; width = 100; height = 84; }
  }
  return { cols, rows, width, height };
}

function lineFor(state: CalculatorState): string {
  const area = AREA_STOPS[state.areaIndex];
  if (state.extras.includes("high-access")) return "Без паники. У меня штанга.";
  if (state.extras.includes("renovation")) return "Пыль после ремонта? Обожаю.";
  if (area >= 100) return "Ого. Ну ладно.";
  if (state.windows === "panoramic") return "Панорама. Мой любимый жанр.";
  if (state.windows === "balcony") return "Створочки. Много створочек.";
  if (state.windows === "storefront") return "До открытия успеем.";
  if (state.object === "house") return "За город — с удовольствием.";
  if (state.object === "office") return "Договор, акт, чистые окна.";
  if (!state.object) return "Ну? С чего начнём?";
  return "Так. Смотрю.";
}

/** Live cartoon window that grows and changes with the calculator. */
export function WindowPreview({ state, compact = false }: { state: CalculatorState; compact?: boolean }) {
  const { cols, rows, width, height } = layoutFor(state);
  const dark = state.windows === "storefront" || state.object === "shop";
  const frameFill = dark ? "#3a4152" : "#fff9ee";
  const edge = dark ? "#2b3140" : "#e8dfcf";
  const showSill = state.extras.includes("sills") || (state.object === "apartment" && state.windows === "standard");
  const highlightFrame = state.extras.includes("frames");
  const cells = Array.from({ length: cols * rows });

  return (
    <div className={cn("relative w-full", compact ? "aspect-[16/9]" : "aspect-[5/4] lg:aspect-[4/3]")}>
      {/* interior wall */}
      <div aria-hidden className="absolute inset-0 rounded-[12px] ink-border bg-[#f3e2a2] [background-image:repeating-linear-gradient(90deg,transparent_0_26px,rgba(27,31,42,0.08)_26px_28px)]" />
      {/* house: a gable above */}
      {state.object === "house" && (
        <div aria-hidden className="absolute inset-x-[10%] -top-4 h-6 rounded-t-[10px] ink-border border-b-0 bg-[#e9b8a4]" />
      )}
      {/* office: blinds */}
      {state.object === "office" && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[18%] rounded-t-[12px] bg-[repeating-linear-gradient(0deg,#d5dde6_0_6px,#1b1f2a_6px_8px)] opacity-90" />
      )}

      <motion.div
        className="absolute left-1/2 top-1/2"
        initial={false}
        animate={{ width: `${width}%`, height: `${height}%`, x: "-50%", y: "-50%" }}
        transition={springHeavy}
        style={{ willChange: "width, height" }}
      >
        {/* cradle for high-access */}
        {state.extras.includes("high-access") && (
          <div aria-hidden className="absolute -top-[40%] left-1/2 z-30 w-[46%] -translate-x-1/2">
            <svg viewBox="0 0 200 60" overflow="visible" className="w-full">
              <path d="M20 40 V-600 M180 40 V-600" stroke="#1b1f2a" strokeWidth="4" />
              <rect x="4" y="36" width="192" height="18" rx="6" fill="#178f83" stroke="#1b1f2a" strokeWidth="3" />
            </svg>
            <div className="absolute bottom-[12%] left-1/2 w-[46%] -translate-x-1/2">
              <Klir pose="wipe" expression="focused" idle={false} className="w-full" />
            </div>
          </div>
        )}

        <div
          className={cn("relative h-full w-full rounded-[8px] transition-shadow duration-300", highlightFrame && "shadow-[0_0_0_5px_#ff6b2c]")}
          style={{ padding: compact ? 6 : 10, background: frameFill, border: "3px solid #1b1f2a", boxShadow: highlightFrame ? "0 0 0 5px #ff6b2c, inset 0 -5px 0 0 " + edge : `inset 0 -5px 0 0 ${edge}` }}
        >
          <div
            className="grid h-full w-full gap-[6px]"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
          >
            {cells.map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-[3px] bg-sky" style={{ border: "2.5px solid #1b1f2a" }}>
                <div className="absolute inset-0" style={{ width: `${cols * 100}%`, height: `${rows * 100}%`, transform: `translate(${-((i % cols) * 100) / cols}%, ${-(Math.floor(i / cols) * 100) / rows}%)` }}>
                  <City lite seed={5} celestial={i === cols - 1} />
                </div>
                {/* renovation dust */}
                {state.extras.includes("renovation") && (
                  <div className="absolute inset-0 opacity-90">
                    <Dirt texture="dirt-renovation.svg" />
                  </div>
                )}
                {/* mosquito mesh on the first sash */}
                {state.extras.includes("mosquito") && i === 0 && (
                  <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(27,31,42,0.35)_0_1px,transparent_1px_5px),repeating-linear-gradient(90deg,rgba(27,31,42,0.35)_0_1px,transparent_1px_5px)]" />
                )}
                {/* side arrows */}
                {state.sides && i === cells.length - 1 && (
                  <span aria-hidden className="absolute bottom-1 right-1 rounded-full bg-cream px-1.5 py-0.5 font-hand text-[11px] leading-none text-ink ink-border-2">
                    {state.sides === "two" ? "⇄" : "→"}
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* shop sign */}
          {state.object === "shop" && (
            <div aria-hidden className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-md ink-border-2 bg-sun px-2 py-0.5 font-hand text-xs">
              ОТКРЫТО
            </div>
          )}
        </div>
        {/* sill */}
        {showSill && (
          <div aria-hidden className="absolute -inset-x-[4%] top-full h-[8%] rounded-b-[6px] ink-border border-t-0 bg-cream" />
        )}
      </motion.div>

      {/* Klir in the corner with a remark */}
      {!compact && (
        <div className="pointer-events-none absolute -bottom-3 right-3 flex w-[28%] flex-col items-end">
          <div className="mb-1 mr-[40%] max-w-[220px] whitespace-nowrap rounded-[14px] rounded-br-[4px] bg-cream px-3 py-1.5 font-hand text-base leading-tight text-ink ink-border-2 shadow-[0_2px_0_0_#1b1f2a]" key={lineFor(state)}>
            {lineFor(state)}
          </div>
          <Klir pose="stand" expression={state.extras.includes("renovation") ? "happy" : "smirk"} track className="w-full" />
        </div>
      )}
    </div>
  );
}
