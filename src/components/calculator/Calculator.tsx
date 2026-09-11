"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  AREA_STOPS,
  extraOptions,
  initialCalculatorState,
  labelFor,
  objectOptions,
  sideOptions,
  windowOptions,
  type CalculatorState,
  type ExtraId,
  type ObjectType,
  type Sides,
  type WindowType,
} from "@/data/calculator";
import { estimate } from "@/lib/pricing";
import { PRESET_EVENT, type CalculatorPreset } from "@/lib/presetBus";
import { cta } from "@/data/nav";
import { formatRub } from "@/lib/utils";
import { OptionTiles } from "./OptionTiles";
import { AreaSlider } from "./AreaSlider";
import { WindowPreview } from "./WindowPreview";
import { PriceCounter } from "./PriceCounter";
import { StepShell } from "./StepShell";
import { OrderFlow } from "./OrderFlow";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

function applyPreset(state: CalculatorState, preset: CalculatorPreset): CalculatorState {
  return {
    ...state,
    object: preset.object as ObjectType,
    windows: preset.windows as WindowType,
    extras: (preset.extras as ExtraId[] | undefined) ?? [],
  };
}

export function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);
  const [step, setStep] = useState<Step>(1);
  const [ordering, setOrdering] = useState(false);

  const result = useMemo(() => estimate(state), [state]);
  const allAnswered = state.object && state.windows && state.sides;

  const onPreset = useCallback((preset: CalculatorPreset) => {
    setState((s) => applyPreset(s, preset));
    setStep(3);
    setOrdering(false);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => onPreset((e as CustomEvent<CalculatorPreset>).detail);
    window.addEventListener(PRESET_EVENT, handler);
    return () => window.removeEventListener(PRESET_EVENT, handler);
  }, [onPreset]);

  const set = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => setState((s) => ({ ...s, [key]: value }));

  const toggleExtra = (id: ExtraId) =>
    setState((s) => ({ ...s, extras: s.extras.includes(id) ? s.extras.filter((x) => x !== id) : [...s.extras, id] }));

  const areaLabel = `${AREA_STOPS[state.areaIndex]}${state.areaIndex === AREA_STOPS.length - 1 ? "+" : ""} м²`;

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="relative scroll-mt-16 bg-sand/60 py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          id="calculator-title"
          eyebrow="Калькулятор"
          title="Прикинем стоимость за минуту."
          lede="Пять вопросов — и ориентировочная сумма. Окно будет расти вместе с ответами. Точную цену подтвердим после уточнения деталей."
        />

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
          {/* ---- preview (first on mobile, sticky on desktop) ---- */}
          <div className="order-first lg:order-last">
            <div className="lg:sticky lg:top-24">
              <div className="hidden lg:block">
                <WindowPreview state={state} />
              </div>
              <div className="lg:hidden">
                <WindowPreview state={state} compact />
              </div>

              <div className="mt-6 rounded-[14px] ink-border bg-cream p-5 shadow-[0_5px_0_0_#1b1f2a] sm:mt-8 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-mute">Предварительная стоимость</p>
                <PriceCounter value={result.total} className="mt-1 block font-display text-[clamp(34px,4.6vw,56px)] font-black leading-none tracking-[-0.03em] text-ink" />
                <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                  {result.breakdown.map((b) => (
                    <li key={b.label} className="flex justify-between gap-3">
                      <span>{b.label}</span>
                      <span className="whitespace-nowrap">{formatRub(b.amount)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-ink-mute">
                  Это ориентировочный расчёт. Точную стоимость подтвердим после уточнения деталей. Минимальный заказ — {formatRub(2500)}.
                </p>
                {!ordering && (
                  <div className="mt-4">
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => { setOrdering(true); }} disabled={!allAnswered}>
                      {cta.exact.label}
                    </Button>
                    {!allAnswered && <p className="mt-2 text-xs text-ink-mute">Ответьте на пять вопросов — и кнопка оживёт.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ---- steps ---- */}
          <div className="space-y-4">
            <StepShell
              index={1}
              title="Что будем мыть?"
              active={step === 1 && !ordering}
              done={Boolean(state.object)}
              summary={labelFor.object(state.object)}
              onEdit={() => { setStep(1); setOrdering(false); }}
            >
              <OptionTiles name="Тип объекта" options={objectOptions} value={state.object} columns={4} onChange={(id: ObjectType) => { set("object", id); setStep(2); }} />
            </StepShell>

            <StepShell
              index={2}
              title="Какие окна?"
              active={step === 2 && !ordering}
              done={Boolean(state.windows)}
              muted={step < 2}
              summary={labelFor.windows(state.windows)}
              onEdit={() => { setStep(2); setOrdering(false); }}
            >
              <OptionTiles name="Тип окон" options={windowOptions} value={state.windows} columns={5} onChange={(id: WindowType) => { set("windows", id); setStep(3); }} />
            </StepShell>

            <StepShell
              index={3}
              title="Примерная площадь"
              active={step === 3 && !ordering}
              done={step > 3}
              muted={step < 3}
              summary={areaLabel}
              onEdit={() => { setStep(3); setOrdering(false); }}
            >
              <AreaSlider value={state.areaIndex} onChange={(i) => set("areaIndex", i)} />
              <div className="mt-4">
                <Button variant="secondary" onClick={() => setStep(4)}>
                  Дальше
                </Button>
              </div>
            </StepShell>

            <StepShell
              index={4}
              title="Сколько сторон?"
              active={step === 4 && !ordering}
              done={Boolean(state.sides)}
              muted={step < 4}
              summary={state.sides ? `${labelFor.sides(state.sides)} — ${sideOptions.find((s) => s.id === state.sides)?.hint}` : undefined}
              onEdit={() => { setStep(4); setOrdering(false); }}
            >
              <OptionTiles name="Сколько сторон" options={sideOptions} value={state.sides} columns={2} onChange={(id: Sides) => { set("sides", id); setStep(5); }} />
            </StepShell>

            <StepShell
              index={5}
              title="Дополнительные работы?"
              active={step === 5 && !ordering}
              done={step > 5}
              muted={step < 5}
              summary={state.extras.length ? state.extras.map(labelFor.extra).join(", ") : "без дополнительных работ"}
              onEdit={() => { setStep(5); setOrdering(false); }}
            >
              <OptionTiles name="Дополнительные работы" options={extraOptions} value={state.extras} multi columns={3} onChange={toggleExtra} />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => { setStep(6); setOrdering(true); }}>
                  {cta.exact.label}
                </Button>
                <Button variant="ghost" onClick={() => { setStep(6); setOrdering(true); }}>
                  Ничего не нужно
                </Button>
              </div>
            </StepShell>

            <AnimatePresence initial={false}>
              {ordering && (
                <motion.div
                  key="order"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4 pt-2"
                >
                  <p className="pl-1 font-hand text-2xl text-ink">Отлично. Теперь три коротких вопроса.</p>
                  <OrderFlow state={state} estimate={result.total} onBack={() => { setOrdering(false); setStep(5); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
