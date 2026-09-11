"use client";

import { AREA_STOPS } from "@/data/calculator";
import { cn } from "@/lib/utils";

type Props = { value: number; onChange: (index: number) => void };

/** Discrete m² slider with a native range input underneath (keyboard + touch). */
export function AreaSlider({ value, onChange }: Props) {
  const max = AREA_STOPS.length - 1;
  const pct = (value / max) * 100;
  const area = AREA_STOPS[value];
  return (
    <div className="relative pt-2">
      <div className="relative h-14">
        {/* track */}
        <div aria-hidden className="absolute left-0 right-0 top-6 h-3 rounded-full ink-border-2 bg-cream" />
        {/* fill: water level */}
        <div aria-hidden className="absolute left-0 top-6 h-3 rounded-full bg-sky-deep ink-border-2" style={{ width: `calc(${pct}% + 6px)` }} />
        {/* stops */}
        {AREA_STOPS.map((s, i) => (
          <span
            key={s}
            aria-hidden
            className={cn(
              "absolute top-[30px] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
              i <= value ? "bg-ink" : "bg-ink/40",
            )}
            style={{ left: `${(i / max) * 100}%` }}
          />
        ))}
        {/* thumb: a drop */}
        <div aria-hidden className="pointer-events-none absolute top-[30px] -translate-x-1/2 -translate-y-1/2 transition-[left] duration-200 ease-out" style={{ left: `${pct}%` }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full ink-border bg-tangerine shadow-[0_3px_0_0_#1b1f2a]">
            <span className="font-display text-[13px] font-bold text-ink">{area}{value === max ? "+" : ""}</span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Примерная площадь остекления"
          aria-valuetext={`${area}${value === max ? " и больше" : ""} квадратных метров`}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          data-cursor="drag"
        />
      </div>
      <div className="mt-1 flex justify-between font-hand text-base text-ink-mute" aria-hidden>
        {AREA_STOPS.map((s, i) => (
          <span key={s} className={cn(i === value && "text-ink")}>
            {s}{i === max ? "+" : ""}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        ≈ <b className="text-ink">{area}{value === max ? "+" : ""} м²</b>. Не знаете точно — прикиньте, уточним при звонке.
      </p>
    </div>
  );
}
