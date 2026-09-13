"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { City } from "@/components/illustrations/City";
import { Dirt } from "@/components/illustrations/Dirt";
import { Window } from "@/components/illustrations/Window";
import { Klir } from "@/components/illustrations/Klir";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sparkle } from "@/components/brand/Sparkle";
import { clamp } from "@/lib/utils";

const INK = "#1b1f2a";

/** Стартовое положение лезвия: чуть больше половины окна ещё грязное. */
const START = 52;

/** Реплика зависит от того, какая доля стекла уже чистая. */
function lineFor(clean: number) {
  if (clean >= 98) return "Вот. Теперь можно жить.";
  if (clean >= 70) return "Так уже лучше.";
  if (clean >= 35) return "Уже что-то.";
  return "Ну и ну.";
}

/**
 * One huge window; the divider is a squeegee blade. `dirty` is the divider
 * position in percent: everything left of it is the "before" side, so
 * dragging right grows the grime and `clean = 100 - dirty` shrinks.
 * Light, dust, the mascot's mood and the section tint all follow `clean`.
 */
export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(START);
  const [dragging, setDragging] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const clean = 100 - dirty;

  const mv = useMotionValue(START);
  const sx = useSpring(mv, { stiffness: 260, damping: 28, mass: 0.6 });
  const dirtClip = useTransform(sx, (v) => `inset(0 ${100 - v}% 0 0)`);
  // чище слева от лезвия → больше солнца, меньше пыли
  const glowOpacity = useTransform(sx, [0, 100], [0.9, 0.1]);
  const dustOpacity = useTransform(sx, [0, 100], [0.35, 1]);
  const dividerLeft = useTransform(sx, (v) => `${v}%`);

  const update = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const next = clamp(((clientX - r.left) / r.width) * 100, 0, 100);
      mv.set(next);
      setDirty(next);
      if (next <= 2) setCelebrated(true);
    },
    [mv],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    update(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    update(e.clientX);
  };
  const stop = () => setDragging(false);

  // Стрелки двигают ползунок «чистоты»: вправо — чище, то есть лезвие идёт влево.
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    let next = dirty;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = dirty - step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = dirty + step;
    else if (e.key === "Home") next = 100;
    else if (e.key === "End") next = 0;
    else return;
    e.preventDefault();
    next = clamp(next, 0, 100);
    mv.set(next);
    setDirty(next);
    if (next <= 2) setCelebrated(true);
  };

  return (
    <section
      id="before-after"
      aria-labelledby="before-after-title"
      className="relative overflow-hidden py-16 sm:py-24"
      style={{ background: `color-mix(in oklab, var(--color-paper) ${100 - clean * 0.35}%, var(--color-sky-pale))` }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="before-after-title"
            eyebrow="До / после"
            title="Разница — в одном движении."
            lede="Потяните сгон в сторону. Слева — как было, справа — как будет. Без фотошопа, без магии, только резина и вода."
          />
          <p className="font-hand text-xl text-ink-soft lg:pb-2" aria-hidden>
            ← тяните за ручку →
          </p>
        </div>

        <div className="relative mt-10 sm:mt-14">
          <Window cols={1} sill frameWidth="clamp(10px, 1.6vw, 24px)">
            <div
              ref={ref}
              className="relative aspect-[16/10] w-full touch-none select-none sm:aspect-[21/9]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={stop}
              onPointerCancel={stop}
              data-cursor="drag"
            >
              {/* clean world */}
              <div className="absolute inset-0">
                <City variant="day" seed={21} />
              </div>
              {/* sun glow rises as the glass clears */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  opacity: glowOpacity,
                  background: "radial-gradient(60% 70% at 78% 18%, rgba(255,243,176,0.9), rgba(255,243,176,0) 70%)",
                }}
              />
              {/* dirt, kept left of the blade */}
              <motion.div className="absolute inset-0" style={{ clipPath: dirtClip }}>
                <Dirt texture="dirt-2.svg" />
                {/* floating dust motes */}
                <motion.div aria-hidden className="absolute inset-0" style={{ opacity: dustOpacity }}>
                  {[12, 25, 41, 57, 66, 78, 90, 33, 48, 8].map((left, i) => (
                    <span
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full bg-grime opacity-70"
                      style={{
                        left: `${left}%`,
                        top: `${(i * 37) % 90 + 5}%`,
                        animation: `bob ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* the blade divider */}
              <motion.div className="absolute inset-y-0 w-0" style={{ left: dividerLeft }}>
                {/* wet sheen just right of the blade */}
                <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/50 to-transparent" />
                <div aria-hidden className="absolute inset-y-0 -left-[7px] w-[14px] rounded-full bg-[#3a4152] ring-[3px] ring-ink" />
                {/* drips on the dirty side */}
                <div aria-hidden className="absolute -left-6 top-[35%] h-24 w-4">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="drip absolute left-0 h-5 w-[6px] rounded-full bg-sky-deep/80" style={{ animationDelay: `${i * 0.45}s`, top: `${i * 30}%` }} />
                  ))}
                </div>
                {/* handle */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Сравнение до и после: положение сгона"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(clean)}
                  aria-valuetext={`${Math.round(clean)}% стекла отмыто`}
                  onKeyDown={onKey}
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full ink-border bg-tangerine shadow-[0_4px_0_0_#1b1f2a] active:cursor-grabbing"
                  data-cursor="drag"
                >
                  <svg viewBox="0 0 40 24" className="h-6 w-10" aria-hidden>
                    <path d="M12 4 L2 12 L12 20 M28 4 L38 12 L28 20" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 12 H36" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </div>
                {/* squeegee handle sticking up out of the frame */}
                <div aria-hidden className="absolute -top-6 left-1/2 h-10 w-5 -translate-x-1/2 rounded-full bg-teal ring-[3px] ring-ink" />
              </motion.div>

              {/* labels */}
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-ink ink-border-2">
                до
              </span>
              <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-sun px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-ink ink-border-2">
                после
              </span>

              {/* celebration sparkles */}
              {celebrated && (
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  {[[20, 30], [45, 15], [70, 40], [85, 20], [55, 65]].map(([l, t], i) => (
                    <Sparkle
                      key={i}
                      animate="pop"
                      className="absolute w-8"
                      style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Window>

          {/* Klir watches from the sill, right side */}
          <div className="pointer-events-none absolute -bottom-2 right-[3%] flex w-[clamp(80px,11vw,150px)] flex-col items-end sm:right-[5%]">
            <div className="pointer-events-auto mb-1 mr-[60%] whitespace-nowrap">
              <SpeechBubble tail="bottom-right" size="sm" key={lineFor(clean)}>
                {lineFor(clean)}
              </SpeechBubble>
            </div>
            <Klir pose="stand" expression={clean >= 70 ? "happy" : clean >= 35 ? "smirk" : "focused"} look={{ x: (dirty - 50) / 50, y: 0.3 }} className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
