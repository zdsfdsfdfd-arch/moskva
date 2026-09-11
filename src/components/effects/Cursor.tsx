"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Squeegee } from "@/components/illustrations/Squeegee";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks";

type Mode = "default" | "button" | "card" | "wash" | "drag" | "hidden";

/**
 * Desktop-only cursor. A small ink dot that grows on buttons, hollows on
 * cards, turns into a squeegee over washable glass and into a "тяни" pill
 * over draggable dividers. Elements opt in via data-cursor="...".
 */
export function Cursor() {
  const enabled = useMediaQuery("(pointer: fine) and (hover: hover)", false);
  const [mode, setMode] = useState<Mode>("hidden");
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (mode === "hidden") setMode("default");
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = (target?.dataset.cursor as Mode | undefined) ?? "default";
      setMode(next);
    };
    const onLeave = () => setMode("hidden");
    const onEnter = () => setMode("default");
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;

  const scale = pressed ? 0.85 : 1;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={{ scale, opacity: mode === "hidden" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* dot / ring */}
        <motion.div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink",
            mode === "button" ? "bg-sun/90" : mode === "card" ? "bg-transparent" : "bg-ink",
          )}
          animate={{
            width: mode === "button" ? 40 : mode === "card" ? 28 : mode === "wash" || mode === "drag" ? 0 : 12,
            height: mode === "button" ? 40 : mode === "card" ? 28 : mode === "wash" || mode === "drag" ? 0 : 12,
            opacity: mode === "wash" || mode === "drag" ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
        {/* squeegee */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-12 w-8 -translate-x-1/2 -translate-y-[80%]"
          animate={{ opacity: mode === "wash" ? 1 : 0, scale: mode === "wash" ? 1 : 0.4, rotate: -18 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        >
          <Squeegee className="h-full w-full drop-shadow-[0_3px_0_rgba(27,31,42,0.25)]" grip="#ff6b2c" />
        </motion.div>
        {/* drag pill */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full ink-border bg-cream px-3 py-1 font-hand text-base text-ink shadow-[0_3px_0_0_#1b1f2a]"
          animate={{ opacity: mode === "drag" ? 1 : 0, scale: mode === "drag" ? 1 : 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        >
          ← тяни →
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
