"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Klir } from "@/components/illustrations/Klir";
import { faq } from "@/data/faq";
import { cn } from "@/lib/utils";
import { easeWater } from "@/lib/motion";

function Snow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[6, 18, 31, 44, 58, 72, 86, 94].map((left, i) => (
        <span
          key={i}
          className="absolute top-0 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(27,31,42,0.35)]"
          style={{ left: `${left}%`, animation: `drip ${2.2 + (i % 3) * 0.6}s linear ${i * 0.25}s infinite` }}
        />
      ))}
    </div>
  );
}

/**
 * FAQ as window blinds: each slat is a question; opening one lets the
 * light (and the answer) through.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title="Вопросы, которые задают до звонка."
              lede="Коротко и без «обратитесь к менеджеру». Если вашего вопроса нет — задайте его в заявке."
            />
            <div className="mt-8 hidden w-40 lg:block">
              <Klir pose="stand" expression="smirk" track className="w-full" />
            </div>
          </div>

          <div className="rounded-[14px] ink-border bg-cream p-2 shadow-[0_6px_0_0_#1b1f2a] sm:p-3">
            {/* blind cord */}
            <div aria-hidden className="mb-2 flex justify-end pr-4">
              <span className="block h-6 w-[3px] bg-ink" />
            </div>
            <ul className="space-y-2">
              {faq.map((item, i) => {
                const isOpen = open === i;
                const panelId = `${base}-panel-${i}`;
                const btnId = `${base}-btn-${i}`;
                return (
                  <li key={item.q} className={cn("overflow-hidden rounded-[8px] ink-border-2 transition-colors", isOpen ? "bg-sky-pale" : "bg-paper")}>
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : i)}
                        data-cursor="button"
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-display text-[15px] font-bold text-ink sm:px-5 sm:text-base"
                      >
                        <span>{item.q}</span>
                        <span
                          aria-hidden
                          className={cn(
                            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ink-border-2 text-lg transition-transform duration-300",
                            isOpen ? "rotate-45 bg-sun" : "bg-cream",
                          )}
                        >
                          +
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={btnId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: easeWater }}
                          className="relative overflow-hidden"
                        >
                          {item.winter && <Snow />}
                          <p className="relative px-4 pb-5 text-[15px] leading-relaxed text-ink-soft sm:px-5 sm:text-base">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
