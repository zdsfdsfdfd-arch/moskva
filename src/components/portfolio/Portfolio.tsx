"use client";

import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { City } from "@/components/illustrations/City";
import { Dirt } from "@/components/illustrations/Dirt";
import { projects, type Project } from "@/data/portfolio";
import { clamp, cn } from "@/lib/utils";

const COLS: Record<Project["kind"], number> = { apartment: 3, office: 4, balcony: 5, storefront: 1 };

function MiniCompare({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(40);
  const [drag, setDrag] = useState(false);
  const cols = COLS[project.kind];
  const dark = project.kind === "storefront";

  const update = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setX(clamp(((clientX - r.left) / r.width) * 100, 0, 100));
  };

  return (
    <div
      ref={ref}
      className={cn("relative aspect-[4/3] touch-none select-none overflow-hidden rounded-[6px] ink-border-2", dark ? "bg-[#3a4152]" : "bg-sky")}
      onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDrag(true); update(e.clientX); }}
      onPointerMove={(e) => drag && update(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
      data-cursor="drag"
    >
      <div className="absolute inset-0 grid gap-[4px] p-[4px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-[2px] ink-border-2 bg-sky">
            <div className="absolute inset-0" style={{ width: `${cols * 100}%`, transform: `translateX(${-(i * 100) / cols}%)` }}>
              <City lite seed={project.seed} celestial={i === cols - 1} />
            </div>
          </div>
        ))}
      </div>
      {/* dirt kept left of the divider */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <Dirt texture="dirt-lite.svg" />
      </div>
      {/* divider */}
      <div className="absolute inset-y-0 w-0" style={{ left: `${x}%` }}>
        <div className="absolute inset-y-0 -left-[4px] w-[8px] rounded-full bg-[#3a4152] ring-2 ring-ink" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`${project.title}: сравнение до и после`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(x)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setX((v) => clamp(v + 4, 0, 100));
            if (e.key === "ArrowLeft") setX((v) => clamp(v - 4, 0, 100));
          }}
          className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full ink-border-2 bg-tangerine text-ink shadow-[0_3px_0_0_#1b1f2a]"
        >
          <span aria-hidden className="text-sm font-black">⇔</span>
        </div>
      </div>
      {/* stamp */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 -rotate-6 rounded-[3px] border-2 border-tangerine-deep px-1.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-tangerine-deep"
      >
        демо-пример
      </span>
    </div>
  );
}

/** Four concept projects, honestly stamped. Each has its own tiny squeegee slider. */
export function Portfolio() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="relative bg-sand/50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          id="portfolio-title"
          eyebrow="Работы"
          title="До / после — без магии."
          lede="Это демонстрационные примеры: мы показываем, как выглядит результат, а не выдаём чужие объекты за свои. Настоящие работы появятся здесь с адресами и датами."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {projects.map((p, i) => (
            <li
              key={p.n}
              className={cn(
                "flex flex-col rounded-[10px] bg-cream p-3 ink-border shadow-[0_5px_0_0_#1b1f2a]",
                i % 2 ? "lg:translate-y-6" : "",
              )}
            >
              <MiniCompare project={p} />
              <div className="px-1 pb-1 pt-3">
                <p className="font-hand text-base text-ink-mute">Демонстрационный пример №{p.n}</p>
                <h3 className="font-display text-base font-bold leading-tight text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  <b className="text-ink">{p.area}</b> · {p.note}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
