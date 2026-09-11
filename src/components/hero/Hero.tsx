"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { HeroScene } from "./HeroScene";

/**
 * Hero + scroll-cleaning experience in one pinned section.
 * The page scrolls ~4 screens while the window stays put and gets washed.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section
      id="top"
      ref={ref}
      aria-label="Мойка окон в Москве — БЛИК"
      className="relative"
      style={{ height: reduced ? "100svh" : "420svh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroScene progress={scrollYProgress} stripes={mobile ? 4 : 5} staticClean={reduced} />
      </div>
    </section>
  );
}
