"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatRub } from "@/lib/utils";

/** The number "counts" toward its target with a heavy spring — never a jump. */
export function PriceCounter({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 70, damping: 18, mass: 1 });
  const text = useTransform(spring, (v) => formatRub(Math.round(v / 10) * 10, "≈ "));

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  return (
    <motion.span className={className} aria-live="polite" aria-atomic>
      {text}
    </motion.span>
  );
}
