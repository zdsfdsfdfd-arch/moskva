"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll, useVelocity } from "framer-motion";
import { FAST_SCROLL_EVENT } from "@/lib/hooks";
import { brand } from "@/data/brand";

/**
 * Two small global behaviours:
 * 1. Broadcasts a "fast scroll" event so the mascot can look surprised.
 * 2. Changes the tab title when the user wanders off. Windows are patient.
 */
export function ScrollWatcher() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const last = useRef(0);

  useMotionValueEvent(velocity, "change", (v) => {
    const now = performance.now();
    if (Math.abs(v) > 5200 && now - last.current > 2500) {
      last.current = now;
      window.dispatchEvent(new CustomEvent(FAST_SCROLL_EVENT));
    }
  });

  useEffect(() => {
    const original = document.title;
    const onVis = () => {
      document.title = document.hidden ? `Окна ждут… — ${brand.name}` : original;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return null;
}
