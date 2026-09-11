"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Drop } from "@/components/illustrations/Props";
import { springSnap } from "@/lib/motion";

const SPOTS = [
  { x: 68, y: 22, s: 1 },
  { x: 76, y: 48, s: 0.8 },
  { x: 58, y: 70, s: 1.15 },
  { x: 86, y: 74, s: 0.9 },
  { x: 90, y: 30, s: 0.7 },
];

/** Five live drops on the glass. Hover one and it scurries away. */
export function RunawayDrops() {
  const [offsets, setOffsets] = useState(() => SPOTS.map(() => ({ dx: 0, dy: 0 })));

  const scare = (i: number) => {
    setOffsets((prev) =>
      prev.map((o, k) => {
        if (k !== i) return o;
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 70;
        return { dx: o.dx + Math.cos(angle) * dist, dy: o.dy + Math.sin(angle) * dist * 0.6 };
      }),
    );
  };

  return (
    <>
      {SPOTS.map((spot, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute hidden sm:block"
          style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `clamp(14px, ${1.6 * spot.s}vw, 30px)` }}
          animate={{ x: offsets[i].dx, y: offsets[i].dy }}
          transition={springSnap}
          onPointerEnter={() => scare(i)}
        >
          <Drop className="w-full drop-shadow-[0_2px_0_rgba(27,31,42,0.2)]" />
        </motion.div>
      ))}
    </>
  );
}
