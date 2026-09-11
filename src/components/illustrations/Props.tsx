"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSnap } from "@/lib/motion";

const INK = "#1b1f2a";

/** Bucket with a sponge that pops out on hover. */
export function Bucket({ className }: { className?: string }) {
  const [popped, setPopped] = useState(false);
  return (
    <div
      className={cn("relative select-none", className)}
      onPointerEnter={() => setPopped(true)}
      onPointerLeave={() => setPopped(false)}
      onClick={() => setPopped((v) => !v)}
      data-cursor="card"
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 120 120"
        className="pointer-events-none absolute left-1/2 top-0 w-[55%] -translate-x-1/2"
        initial={false}
        animate={popped ? { y: -34, rotate: -14, opacity: 1 } : { y: 6, rotate: 0, opacity: 0 }}
        transition={springSnap}
      >
        <rect x="20" y="40" width="80" height="44" rx="8" fill="#ffd23f" stroke={INK} strokeWidth="4" />
        <rect x="20" y="40" width="80" height="16" rx="6" fill="#1fb6a6" stroke={INK} strokeWidth="4" />
        <circle cx="45" cy="70" r="3" fill="#f2b90d" />
        <circle cx="70" cy="66" r="2.5" fill="#f2b90d" />
        <circle cx="85" cy="74" r="2" fill="#f2b90d" />
      </motion.svg>
      <svg viewBox="0 0 120 120" className="relative block w-full">
        <path d="M16 40 h88 l-8 66 a8 8 0 0 1 -8 8 H32 a8 8 0 0 1 -8 -8 Z" fill="#1fb6a6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M22 46 h76" stroke="#178f83" strokeWidth="6" />
        <ellipse cx="60" cy="40" rx="44" ry="8" fill="#a9e4f7" stroke={INK} strokeWidth="4" />
        <path d="M30 40 q30 -6 60 0" stroke="#fff" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
        <path d="M22 44 q38 -50 76 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M34 60 v40" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
}

/** Spray bottle. Hover: a puff of mist. */
export function SprayBottle({ className }: { className?: string }) {
  return (
    <div className={cn("group/spray relative select-none", className)} aria-hidden>
      <svg viewBox="0 0 100 140" className="block w-full">
        <rect x="30" y="56" width="44" height="76" rx="10" fill="#ff6b2c" stroke={INK} strokeWidth="4" />
        <rect x="38" y="40" width="20" height="20" rx="3" fill="#d5dde6" stroke={INK} strokeWidth="4" />
        <path d="M48 40 v-14 h28 a8 8 0 0 1 8 8 v8 h-12" fill="#1fb6a6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M60 44 l8 14 h-8 Z" fill="#d5dde6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <rect x="36" y="78" width="32" height="26" rx="4" fill="#fff9ee" stroke={INK} strokeWidth="3" />
        <path d="M42 86 h20 M42 94 h14" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <g className="opacity-0 transition-opacity duration-200 group-hover/spray:opacity-100" fill="#a9e4f7" stroke={INK} strokeWidth="2">
          <circle cx="90" cy="26" r="4" />
          <circle cx="98" cy="18" r="3" />
          <circle cx="97" cy="34" r="2.5" />
        </g>
      </svg>
    </div>
  );
}

/** Cactus on the sill. Hover: it wiggles, a little offended. */
export function Cactus({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("select-none", className)}
      whileHover={{ rotate: [0, -6, 6, -4, 0], transition: { duration: 0.5 } }}
      style={{ transformOrigin: "50% 100%" }}
      aria-hidden
    >
      <svg viewBox="0 0 100 140" className="block w-full">
        <path d="M22 100 h56 l-6 34 H28 Z" fill="#e9b8a4" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <rect x="18" y="92" width="64" height="14" rx="4" fill="#d9926f" stroke={INK} strokeWidth="4" />
        <rect x="38" y="30" width="24" height="66" rx="12" fill="#5fc08c" stroke={INK} strokeWidth="4" />
        <path d="M38 62 h-12 a8 8 0 0 1 -8 -8 v-14" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d="M38 62 h-12 a8 8 0 0 1 -8 -8 v-14" fill="none" stroke="#5fc08c" strokeWidth="7" strokeLinecap="round" />
        <path d="M62 54 h12 a8 8 0 0 0 8 -8 v-10" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d="M62 54 h12 a8 8 0 0 0 8 -8 v-10" fill="none" stroke="#5fc08c" strokeWidth="7" strokeLinecap="round" />
        <path d="M44 44 l-4 -4 M56 50 l4 -4 M46 70 l-4 3 M56 78 l4 3" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="28" r="7" fill="#ff6b2c" stroke={INK} strokeWidth="3" />
      </svg>
    </motion.div>
  );
}

/** A flying pigeon for the sky. Flaps via CSS. */
export function FlyingPigeon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 50" aria-hidden className={cn("block", className)} style={style}>
      <ellipse cx="40" cy="30" rx="16" ry="9" fill="#b8bfcb" stroke={INK} strokeWidth="3" />
      <circle cx="54" cy="24" r="6" fill="#8e97a8" stroke={INK} strokeWidth="3" />
      <path d="M60 24 l7 2 l-7 2Z" fill="#ff6b2c" stroke={INK} strokeWidth="1.5" />
      <motion.path
        d="M34 28 q-10 -22 -30 -18 q14 8 30 18Z"
        fill="#d5dde6"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
        animate={{ scaleY: [1, -0.6, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
      />
    </svg>
  );
}

/** Single water drop with a highlight. */
export function Drop({ className, style, color = "#a9e4f7" }: { className?: string; style?: React.CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden className={cn("block", className)} style={style}>
      <path d="M12 2c4.5 6 8 10 8 16a8 8 0 1 1-16 0c0-6 3.5-10 8-16Z" fill={color} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="8.5" cy="18" rx="1.8" ry="3" fill="#fff" opacity="0.9" />
    </svg>
  );
}
