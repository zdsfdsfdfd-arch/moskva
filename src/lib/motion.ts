import type { Transition, Variants } from "framer-motion";

/** Water: springy with a soft overshoot. The site's default spring. */
export const springWater: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 18,
  mass: 0.9,
};

/** Snap: quick, slightly bouncy — for buttons and stickers. */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 26,
  mass: 0.6,
};

/** Slow, heavy — big windows and scene moves. */
export const springHeavy: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 20,
  mass: 1.2,
};

export const easeWater = [0.22, 1, 0.36, 1] as const;

/** A reveal that rises like a droplet settling — used sparingly. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeWater },
  },
};

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

/** Squash & stretch for cartoon taps. */
export const squash = {
  whileHover: { y: -2, rotate: -1 },
  whileTap: { scale: 0.96, scaleX: 1.02, rotate: 0 },
} as const;
