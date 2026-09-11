"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/brand/Sparkle";
import { useIsMobile, usePrefersReducedMotion, useWebGLSupport } from "@/lib/hooks";
import { cta } from "@/data/nav";
import { JourneyFallback } from "./JourneyFallback";

const JourneyCanvas = dynamic(() => import("./JourneyCanvas").then((m) => m.JourneyCanvas), {
  ssr: false,
  loading: () => null,
});

/**
 * "Заглянем за стекло?" — a pinned scroll section. The camera starts in
 * the room, the glass clears, and we pass through into the cartoon city.
 * WebGL on capable desktops; layered 2.5D everywhere else.
 */
export function GlassJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const webgl = useWebGLSupport();
  const inView = useInView(ref, { margin: "40% 0px 40% 0px" });
  const [everInView, setEverInView] = useState(false);
  if (inView && !everInView) setEverInView(true);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const introOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.18], [0, -30]);
  const outroOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.78, 0.92], [24, 0]);

  const use3d = !reduced && !mobile && webgl === true;

  return (
    <section
      id="journey"
      ref={ref}
      aria-labelledby="journey-title"
      className="relative bg-night-deep"
      style={{ height: reduced ? "100svh" : "320svh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* scene */}
        <div className="absolute inset-0">
          {use3d ? (
            everInView && <JourneyCanvas progress={scrollYProgress} active={inView} />
          ) : (
            <JourneyFallback progress={scrollYProgress} staticEnd={reduced} />
          )}
        </div>

        {/* intro copy */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+4vh)] px-4 text-center sm:px-6"
          style={{ opacity: reduced ? 1 : introOpacity, y: reduced ? 0 : introY }}
        >
          <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border-2 border-cream/40 bg-night px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cream">
            <Sparkle className="h-3.5 w-3.5" />
            Маленький мультфильм
          </p>
          <h2 id="journey-title" className="font-display text-balance text-[clamp(30px,5vw,72px)] font-black leading-none tracking-[-0.03em] text-cream drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
            Заглянем за стекло?
          </h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-cream/75 sm:text-lg">
            {reduced ? "Снаружи — город. Когда стекло чистое, его видно целиком." : "Листайте. Стекло станет прозрачным, и мы выйдем наружу."}
          </p>
        </motion.div>

        {/* outro copy */}
        {!reduced && (
          <motion.div
            className="absolute inset-x-0 bottom-0 px-4 pb-[8vh] pt-[16vh] text-center sm:px-6 [background:linear-gradient(to_top,rgba(16,26,58,0.75),rgba(16,26,58,0))]"
            style={{ opacity: outroOpacity, y: outroY }}
          >
            <p className="font-display text-[clamp(24px,3.4vw,48px)] font-black leading-none tracking-[-0.03em] text-cream drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
              Снаружи тоже неплохо.
            </p>
            <p className="mx-auto mt-2 max-w-[40ch] text-cream/75">Особенно когда между вами и городом ничего нет. Даже пыли.</p>
            <div className="mt-5">
              <Button href={cta.primary.href} variant="night" size="lg">
                {cta.primary.label}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
