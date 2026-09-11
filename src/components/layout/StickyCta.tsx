"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cta } from "@/data/nav";

/** Mobile-only bottom CTA. Appears after the hero, hides while the calculator is on screen. */
export function StickyCta() {
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 1.2));

  useEffect(() => {
    const el = document.getElementById("calculator");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCalcVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = pastHero && !calcVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 md:hidden"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/80 to-transparent" />
          <Button href={cta.primary.href} size="lg" className="relative w-full">
            {cta.primary.label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
