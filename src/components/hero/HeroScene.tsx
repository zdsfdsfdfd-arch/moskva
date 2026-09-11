"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import { City } from "@/components/illustrations/City";
import { Window } from "@/components/illustrations/Window";
import { Klir, type KlirExpression, type KlirPose } from "@/components/illustrations/Klir";
import { Bucket, Cactus, SprayBottle, FlyingPigeon } from "@/components/illustrations/Props";
import { Button } from "@/components/ui/Button";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { Sparkle } from "@/components/brand/Sparkle";
import { cta } from "@/data/nav";
import { brand } from "@/data/brand";
import { useFastScroll } from "@/lib/hooks";
import { Cradle } from "./Cradle";
import { RunawayDrops } from "./RunawayDrops";
import { dirtClipPath, heroState, KLIR_BLADE_W, KLIR_BLADE_Y } from "./heroTimeline";

type Props = {
  progress: MotionValue<number>;
  stripes: number;
  /** Reduced motion: render the clean final state statically. */
  staticClean?: boolean;
};

const KLIR_ASPECT = 270 / 220;

export function HeroScene({ progress, stripes, staticClean = false }: Props) {
  const glassRef = useRef<HTMLDivElement>(null);
  const [glass, setGlass] = useState({ w: 1200, h: 600 });
  const sizeRef = useRef(glass);

  // Motion values driven once per frame from the timeline.
  const clip = useMotionValue(dirtClipPath(new Array(stripes).fill(0)));
  const heroOpacity = useMotionValue(1);
  const heroY = useMotionValue(0);
  const hintOpacity = useMotionValue(1);
  const finalOpacity = useMotionValue(0);
  const finalY = useMotionValue(24);
  const klirX = useMotionValue(0);
  const klirY = useMotionValue(0);
  const klirOpacity = useMotionValue(0);
  const cityFilter = useMotionValue("brightness(0.8) saturate(0.85)");
  const wetX = useMotionValue(0);
  const wetY = useMotionValue(0);
  const wetOpacity = useMotionValue(0);
  const sparkleOpacity = useMotionValue(0);

  const [pose, setPose] = useState<KlirPose>("wipe");
  const [expression, setExpression] = useState<KlirExpression>("smirk");
  const [done, setDone] = useState(false);
  const [surprised, setSurprised] = useState(false);

  useFastScroll(
    useCallback(() => {
      setSurprised(true);
      window.setTimeout(() => setSurprised(false), 1400);
    }, []),
  );

  const klirW = (glass.w / stripes) / KLIR_BLADE_W;
  const klirH = klirW * KLIR_ASPECT;

  /** Drives every layer from one timeline evaluation. Reads sizes from a ref so it stays stable. */
  const apply = useCallback(
    (p: number) => {
      const { w, h } = sizeRef.current;
      const kw = (w / stripes) / KLIR_BLADE_W;
      const kh = kw * KLIR_ASPECT;
      const s = heroState(staticClean ? 1 : p, stripes);
      clip.set(dirtClipPath(s.wipes));
      heroOpacity.set(s.heroText);
      heroY.set((1 - s.heroText) * -40);
      hintOpacity.set(s.hint);
      finalOpacity.set(s.finalText);
      finalY.set((1 - s.finalText) * 24);
      klirOpacity.set(s.klirVisible ? 1 : 0);
      klirX.set((s.klirX / 100) * w - kw / 2);
      klirY.set(s.bladeY * h - KLIR_BLADE_Y * kh);
      const b = 0.8 + 0.25 * s.bright;
      const sat = 0.85 + 0.2 * s.bright;
      cityFilter.set(`brightness(${b.toFixed(3)}) saturate(${sat.toFixed(3)})`);
      const wiping = s.active >= 0 && s.wipes[s.active] > 0.02 && s.wipes[s.active] < 0.98;
      wetOpacity.set(wiping ? 1 : 0);
      if (s.active >= 0) {
        wetX.set((s.active / stripes) * w);
        wetY.set(s.wipes[s.active] * h);
      }
      sparkleOpacity.set(s.finalText);
      setPose((prev) => (prev === s.pose ? prev : s.pose));
      setExpression((prev) => (prev === s.expression ? prev : s.expression));
      setDone((prev) => (prev === s.done ? prev : s.done));
    },
    [
      stripes, staticClean,
      clip, heroOpacity, heroY, hintOpacity, finalOpacity, finalY, klirOpacity, klirX, klirY, cityFilter, wetX, wetY, wetOpacity, sparkleOpacity,
    ],
  );

  useMotionValueEvent(progress, "change", apply);

  // Measure the glass; re-apply on resize and once on mount (a reload mid-page starts at p > 0).
  useEffect(() => {
    const el = glassRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      sizeRef.current = { w: width, h: height };
      setGlass({ w: width, h: height });
      apply(progress.get());
    });
    ro.observe(el);
    const raf = requestAnimationFrame(() => apply(progress.get()));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [apply, progress]);

  const stripeW = glass.w / stripes;

  return (
    <div className="relative h-full w-full">
      {/* wall */}
      <div aria-hidden className="absolute inset-0 bg-paper" />

      {/* the window */}
      <div className="absolute inset-x-[3vw] top-[calc(var(--nav-h)+8px)] bottom-[16svh] sm:inset-x-[4vw] sm:bottom-[13svh] lg:inset-x-[5vw]">
        <Window
          cols={1}
          className="h-full"
          sill
          handle
          frameWidth="clamp(12px, 1.8vw, 26px)"
          sillContent={
            <div className="flex items-end gap-[2vw] px-[6%] sm:px-[5%]">
              <Bucket className="w-[clamp(44px,6vw,96px)]" />
              <SprayBottle className="w-[clamp(26px,3.4vw,54px)]" />
              <Cactus className="hidden w-[clamp(28px,4vw,64px)] sm:block" />
            </div>
          }
        >
          {/* glass content: measured for the timeline */}
          <div ref={glassRef} className="absolute inset-0" data-cursor="wash">
            {/* outside: city */}
            <motion.div className="absolute inset-0" style={{ filter: cityFilter }}>
              <City variant="day" seed={7} lite={stripes < 5} />
            </motion.div>

            {/* a pigeon flies by now and then */}
            <motion.div
              aria-hidden
              className="absolute top-[22%] w-[clamp(40px,4vw,64px)]"
              initial={{ x: "-20vw" }}
              animate={{ x: "110vw" }}
              transition={{ duration: 12, repeat: Infinity, repeatDelay: 18, ease: "linear", delay: 6 }}
            >
              <FlyingPigeon className="w-full" />
            </motion.div>

            {/* outside: Klir on the cradle */}
            <motion.div
              className="absolute left-0 top-0"
              style={{ x: klirX, y: klirY, opacity: klirOpacity, width: klirW, height: klirH }}
            >
              <Cradle className="absolute bottom-[-2%] left-[-14%] w-[128%]" />
              <Klir
                pose={pose}
                expression={surprised ? "surprised" : expression}
                idle={done}
                track={done}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute -right-[6%] top-[4%] hidden sm:block">
                <SpeechBubble show={done} tail="bottom-left" size="lg">
                  Так-то.
                </SpeechBubble>
              </div>
            </motion.div>

            {/* the grime, clipped away stripe by stripe */}
            <motion.img
              src="/textures/dirt.svg"
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
              style={{ clipPath: clip }}
            />

            {/* wet band + drips under the blade */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0"
              style={{ x: wetX, y: wetY, opacity: wetOpacity, width: stripeW }}
            >
              <div className="h-[3px] w-full bg-white/70" />
              <div className="h-[clamp(6px,1.4vh,14px)] w-full bg-gradient-to-b from-sky-pale/80 to-transparent" />
              <div className="relative h-16 w-full">
                {[0.12, 0.34, 0.58, 0.8].map((x, i) => (
                  <span
                    key={i}
                    className="drip absolute top-0 h-5 w-[6px] rounded-full bg-sky-deep/80"
                    style={{ left: `${x * 100}%`, animationDelay: `${i * 0.28}s` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* runaway drops (easter egg) — fade with the hero copy */}
            <motion.div className="absolute inset-0" style={{ opacity: heroOpacity }}>
              <RunawayDrops />
            </motion.div>

            {/* inside: the copy */}
            <motion.div
              className="absolute left-[5%] top-[6%] max-w-[92%] sm:top-[8%] sm:max-w-[62%] lg:max-w-[56%]"
              style={{ opacity: heroOpacity, y: heroY }}
            >
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold tracking-wide text-ink ink-border-2 sm:text-sm">
                <Sparkle className="h-4 w-4" />
                {brand.city} • выезд по городу и области
              </p>
              <h1 className="font-display halo text-balance text-[clamp(28px,4.5vw,66px)] font-black leading-[1.02] tracking-[-0.03em] text-ink">
                Окна, через которые хочется смотреть.
              </h1>
              <p className="halo mt-3 max-w-[34ch] text-[clamp(14px,1.3vw,19px)] font-medium leading-snug text-ink sm:mt-4">
                Моем окна, панорамное остекление, витрины и стеклянные поверхности в Москве.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
                <Button href={cta.primary.href} size="lg">
                  {cta.primary.label}
                </Button>
                <Button href={cta.services.href} size="lg" variant="secondary">
                  {cta.services.label}
                </Button>
              </div>
            </motion.div>

            {/* inside: the payoff */}
            <motion.div
              className="absolute left-[5%] top-[10%] max-w-[92%] sm:top-[14%] sm:max-w-[56%]"
              style={{ opacity: finalOpacity, y: finalY, pointerEvents: done ? "auto" : "none" }}
              aria-hidden={!done}
            >
              <p className="font-display halo text-[clamp(30px,5.4vw,80px)] font-black leading-[1] tracking-[-0.03em] text-ink">
                Вот теперь видно.
              </p>
              <p className="halo mt-4 text-[clamp(15px,1.4vw,20px)] font-medium text-ink">
                Профессиональная мойка окон в Москве.
              </p>
              <div className="mt-6">
                <Button href={cta.primary.href} size="lg" tabIndex={done ? 0 : -1}>
                  {cta.primary.label}
                </Button>
              </div>
            </motion.div>

            {/* the gleam — earned */}
            <motion.div className="pointer-events-none absolute right-[8%] top-[10%] w-[clamp(36px,4vw,64px)]" style={{ opacity: sparkleOpacity }}>
              <Sparkle animate={done ? "twinkle" : "none"} />
            </motion.div>
          </div>
        </Window>
      </div>

      {/* scroll hint */}
      <motion.p
        className="absolute inset-x-0 bottom-[3svh] hidden text-center font-hand text-lg text-ink-soft sm:block"
        style={{ opacity: hintOpacity }}
        aria-hidden
      >
        <span className="inline-block animate-bounce">↓</span> листайте — сейчас отмоем
      </motion.p>
    </div>
  );
}
