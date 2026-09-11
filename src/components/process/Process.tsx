"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Klir } from "@/components/illustrations/Klir";
import { Sparkle } from "@/components/brand/Sparkle";
import { LogoMark } from "@/components/brand/Logo";
import { processSteps } from "@/data/process";
import { easeWater } from "@/lib/motion";

const INK = "#1b1f2a";

function PanelScene({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="relative h-full w-full bg-sky-pale">
          {/* phone with the form, paper plane leaving */}
          <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect x="60" y="14" width="80" height="130" rx="12" fill="#fff9ee" stroke={INK} strokeWidth="4" />
            <rect x="68" y="26" width="64" height="100" rx="4" fill="#a9e4f7" stroke={INK} strokeWidth="2.5" />
            <rect x="76" y="36" width="48" height="10" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x="76" y="52" width="48" height="10" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x="76" y="68" width="30" height="10" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x="76" y="100" width="48" height="16" rx="8" fill="#ff6b2c" stroke={INK} strokeWidth="2.5" />
            <motion.path
              d="M0 8 L40 -6 L26 22 L18 12 Z"
              fill="#fff9ee"
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
              initial={{ x: 100, y: 60, rotate: 0, opacity: 0 }}
              whileInView={{ x: 150, y: 20, rotate: -12, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: easeWater, delay: 0.3 }}
            />
            <path d="M104 100 q10 -16 30 -14" stroke={INK} strokeWidth="2" strokeDasharray="4 4" fill="none" />
          </svg>
        </div>
      );
    case 1:
      return (
        <div className="relative h-full w-full bg-[#f3e2a2]">
          <div className="absolute bottom-0 left-[6%] w-[46%]">
            <Klir pose="point" expression="smirk" idle={false} className="w-full" />
          </div>
          {/* phone handset + question bubble */}
          <svg viewBox="0 0 120 90" className="absolute right-[6%] top-[10%] w-[44%]" aria-hidden>
            <path d="M10 60 q0 -50 50 -50 q50 0 50 40 q0 34 -40 34 l-16 12 v-14 q-44 -2 -44 -22Z" fill="#fff9ee" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="40" y="26" width="42" height="34" rx="3" fill="#a9e4f7" stroke={INK} strokeWidth="2.5" />
            <path d="M61 26 v34 M40 43 h42" stroke={INK} strokeWidth="2.5" />
            <text x="92" y="36" fontFamily="var(--font-unbounded)" fontWeight="900" fontSize="18" fill="#ff6b2c" stroke={INK} strokeWidth="1">?</text>
          </svg>
        </div>
      );
    case 2:
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#bfe3d6]">
          {/* road */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[26%] bg-[#3a4152]" />
          <div aria-hidden className="absolute inset-x-0 bottom-[12%] h-[3px] bg-[repeating-linear-gradient(90deg,#ffd23f_0_18px,transparent_18px_34px)]" />
          {/* van */}
          <motion.svg
            viewBox="0 0 220 110"
            className="absolute bottom-[8%] left-[6%] w-[80%]"
            aria-hidden
            initial={{ x: -140 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: easeWater }}
          >
            <path d="M10 80 V36 q0 -8 8 -8 h110 l30 10 l40 8 q10 2 10 12 v22 Z" fill="#ff6b2c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M128 30 l30 10 l40 8 v14 h-70 Z" fill="#a9e4f7" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="24" y="40" width="90" height="30" rx="4" fill="#fff9ee" stroke={INK} strokeWidth="3" />
            <text x="69" y="62" textAnchor="middle" fontFamily="var(--font-unbounded)" fontWeight="900" fontSize="18" fill={INK}>БЛИК</text>
            <circle cx="50" cy="84" r="14" fill={INK} />
            <circle cx="50" cy="84" r="6" fill="#d5dde6" />
            <circle cx="170" cy="84" r="14" fill={INK} />
            <circle cx="170" cy="84" r="6" fill="#d5dde6" />
            {/* ladder on the roof */}
            <path d="M20 26 h100 M20 20 h100 M30 20 v6 M50 20 v6 M70 20 v6 M90 20 v6 M110 20 v6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            {/* bucket */}
            <path d="M130 8 h22 l-3 18 h-16 Z" fill="#1fb6a6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          </motion.svg>
        </div>
      );
    default:
      return (
        <div className="relative h-full w-full bg-[#eadfcb]">
          <div className="absolute inset-x-[12%] top-[10%] bottom-[24%] rounded-[6px] ink-border bg-cream p-[6px]">
            <div className="relative h-full w-full overflow-hidden rounded-[3px] ink-border-2 bg-sky">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_30%,rgba(255,243,176,0.9),transparent_70%)]" />
              <div aria-hidden className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-cream shadow-[0_0_0_2px_#1b1f2a]" />
              <Sparkle animate="twinkle" className="absolute right-[12%] top-[14%] w-8" />
              <Sparkle animate="twinkle" className="absolute left-[16%] bottom-[18%] w-5" style={{ animationDelay: "0.8s" }} />
            </div>
          </div>
          <div className="absolute bottom-0 right-[6%] w-[34%]">
            <Klir pose="stand" expression="wink" idle={false} className="w-full" />
          </div>
          <div aria-hidden className="absolute inset-x-[8%] bottom-[20%] h-[5%] rounded-[3px] ink-border-2 bg-cream" />
        </div>
      );
  }
}

/** Four comic panels with thick frames and hand-lettered captions. */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="process-title"
            eyebrow="Как работаем"
            title="Без магии. Просто четыре шага."
            lede="Ни одного лишнего звонка, ни одного «менеджер свяжется с вами». Заявка, уточнение, выезд, чистые окна."
          />
          <div className="hidden items-center gap-2 text-sm text-ink-mute lg:flex">
            <LogoMark className="h-6 w-6" /> комикс в четырёх кадрах
          </div>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, i) => (
            <motion.li
              key={step.n}
              className="relative flex flex-col overflow-hidden rounded-[6px] bg-cream ink-border shadow-[6px_6px_0_0_#1b1f2a]"
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1.2 : -1.2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeWater, delay: i * 0.1 }}
            >
              <div className="relative aspect-[4/3] border-b-[3px] border-ink">
                <PanelScene index={i} />
                <span className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sun font-display text-sm font-black ink-border-2">
                  {step.n}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-display text-lg font-bold leading-tight text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-snug text-ink-soft">{step.text}</p>
                <p className="mt-auto pt-4 font-hand text-lg text-ink-mute">{step.caption}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
