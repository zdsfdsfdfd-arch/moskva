"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export type KlirPose = "stand" | "clean" | "wipe" | "sit" | "point" | "catch" | "wave";
export type KlirExpression = "smirk" | "happy" | "surprised" | "focused" | "wink";

export type KlirProps = {
  pose?: KlirPose;
  expression?: KlirExpression;
  /** Where the eyes look, each axis in [-1, 1]. Ignored when `track` is on. */
  look?: { x: number; y: number };
  /** Pupils follow the pointer (desktop only). */
  track?: boolean;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Gentle idle animation. */
  idle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

const INK = "#1b1f2a";
const SUIT = "#ff6b2c";
const SUIT_DARK = "#e2521a";
const SKIN = "#ffd2ad";
const CAP = "#1fb6a6";
const CAP_DARK = "#178f83";
const GLOVE = "#ffd23f";

/* Arm paths per pose. Shoulders: L(76,128) R(144,128). Hands returned for gloves. */
const ARMS: Record<
  KlirPose,
  { left: string; right: string; handL: [number, number]; handR: [number, number] }
> = {
  stand: {
    left: "M76 128 C62 150 58 172 66 194",
    right: "M144 128 C158 150 164 168 160 186",
    handL: [66, 196],
    handR: [160, 188],
  },
  clean: {
    left: "M76 128 C62 150 58 172 66 194",
    right: "M144 128 C160 112 176 96 186 76",
    handL: [66, 196],
    handR: [188, 74],
  },
  wipe: {
    left: "M76 128 C78 148 86 158 98 156",
    right: "M144 128 C142 148 134 158 122 156",
    handL: [98, 158],
    handR: [122, 158],
  },
  sit: {
    left: "M76 128 C66 150 66 168 78 186",
    right: "M144 128 C154 150 154 168 142 186",
    handL: [80, 188],
    handR: [142, 188],
  },
  point: {
    left: "M76 128 C62 150 58 172 66 194",
    right: "M144 128 C170 128 196 126 220 124",
    handL: [66, 196],
    handR: [222, 124],
  },
  catch: {
    left: "M76 128 C60 110 48 96 40 78",
    right: "M144 128 C160 110 172 96 180 78",
    handL: [38, 76],
    handR: [182, 76],
  },
  wave: {
    left: "M76 128 C62 150 58 172 66 194",
    right: "M144 128 C168 114 178 92 172 62",
    handL: [66, 196],
    handR: [172, 58],
  },
};

function Face({ expression }: { expression: KlirExpression }) {
  switch (expression) {
    case "happy":
      return (
        <>
          <path d="M70 60 Q86 50 100 58" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M118 56 Q134 48 150 58" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M86 104 Q110 136 136 102 Z" fill={INK} />
          <path d="M92 106 Q110 116 130 104 Q112 120 92 106Z" fill="#fff" />
          <path d="M100 118 Q110 128 122 116" fill="#f47c7c" />
        </>
      );
    case "surprised":
      return (
        <>
          <path d="M68 48 Q86 34 102 46" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M118 44 Q136 32 154 46" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="112" cy="114" rx="10" ry="14" fill={INK} />
          <ellipse cx="112" cy="121" rx="5" ry="5" fill="#f47c7c" />
        </>
      );
    case "focused":
      return (
        <>
          <path d="M70 62 Q86 66 100 74" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M150 62 Q134 66 120 74" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M98 110 h22" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          {/* tongue out — maximum concentration */}
          <path d="M112 112 q10 0 9 9 q-1 6 -8 5 q-5 -2 -4 -8Z" fill="#f47c7c" stroke={INK} strokeWidth="2.5" />
        </>
      );
    case "wink":
      return (
        <>
          <path d="M70 58 Q86 48 100 56" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M118 56 Q134 50 150 58" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M88 108 Q112 128 138 104" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M136 104 q6 2 4 8" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      );
    case "smirk":
    default:
      return (
        <>
          <path d="M70 58 Q86 50 100 58" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M118 62 Q134 60 150 62" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M90 108 Q110 124 136 104" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M134 104 q6 2 5 8" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      );
  }
}

/**
 * Клир — the mascot. viewBox 0 0 220 270, feet on y≈262.
 * Overflow is visible so raised tools can poke outside the box.
 */
export function Klir({
  pose = "stand",
  expression = "smirk",
  look = { x: 0, y: 0 },
  track = false,
  flip = false,
  idle = true,
  className,
  style,
  title,
}: KlirProps) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);

  const px = useMotionValue(look.x * 6);
  const py = useMotionValue(look.y * 5);
  const sx = useSpring(px, { stiffness: 260, damping: 20 });
  const sy = useSpring(py, { stiffness: 260, damping: 20 });

  useEffect(() => {
    if (track) return;
    px.set(look.x * 6);
    py.set(look.y * 5);
  }, [look.x, look.y, track, px, py]);

  useEffect(() => {
    if (!track) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = svgRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.3;
        const dx = (e.clientX - cx) / Math.max(r.width, 1);
        const dy = (e.clientY - cy) / Math.max(r.height, 1);
        const len = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, len * 2.2);
        px.set((dx / len) * k * 6 * (flip ? -1 : 1));
        py.set((dy / len) * k * 5);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [track, flip, px, py]);

  const arms = ARMS[pose];
  const sitting = pose === "sit";
  const eyesWide = expression === "surprised";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 220 270"
      overflow="visible"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn(idle && "idle-bob", className)}
      style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={`${id}-eyeL`}>
          <ellipse cx="88" cy="80" rx="15" ry="18" />
        </clipPath>
        <clipPath id={`${id}-eyeR`}>
          <ellipse cx="128" cy="78" rx="19" ry="22" />
        </clipPath>
      </defs>

      {/* ---------- ground shadow ---------- */}
      <ellipse cx="110" cy="262" rx={sitting ? 60 : 52} ry="7" fill={INK} opacity="0.12" />

      {/* ---------- legs ---------- */}
      {sitting ? (
        <g>
          <path d="M92 214 L150 214 L152 244" stroke={INK} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M92 214 L150 214 L152 244" stroke={SUIT} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M128 214 L184 214 L186 244" stroke={INK} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M128 214 L184 214 L186 244" stroke={SUIT_DARK} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* boots */}
          <rect x="136" y="238" width="34" height="22" rx="9" fill={INK} />
          <rect x="170" y="238" width="34" height="22" rx="9" fill={INK} />
          <rect x="138" y="252" width="30" height="7" rx="3" fill={GLOVE} />
          <rect x="172" y="252" width="30" height="7" rx="3" fill={GLOVE} />
        </g>
      ) : (
        <g>
          <path d="M92 210 L88 240" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <path d="M92 210 L88 240" stroke={SUIT} strokeWidth="18" strokeLinecap="round" />
          <path d="M128 210 L132 240" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <path d="M128 210 L132 240" stroke={SUIT} strokeWidth="18" strokeLinecap="round" />
          {/* boots */}
          <path d="M66 246 h44 a10 10 0 0 1 10 10 v4 H62 v-4 a8 8 0 0 1 4 -10Z" fill={INK} />
          <path d="M112 246 h44 a10 10 0 0 1 10 10 v4 H108 v-4 a8 8 0 0 1 4 -10Z" fill={INK} />
          <rect x="63" y="255" width="55" height="6" rx="3" fill={GLOVE} />
          <rect x="109" y="255" width="55" height="6" rx="3" fill={GLOVE} />
        </g>
      )}

      {/* ---------- left arm (behind body) ---------- */}
      <path d={arms.left} stroke={INK} strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d={arms.left} stroke={SUIT} strokeWidth="16" strokeLinecap="round" fill="none" />

      {/* ---------- body (pear) ---------- */}
      <path
        d="M78 118 C64 150 50 176 56 212 Q110 236 164 212 C170 176 156 150 142 118 Z"
        fill={SUIT}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* belly highlight */}
      <path d="M72 160 C66 178 66 190 70 204" stroke="#ff9a6a" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      {/* zipper */}
      <path d="M110 122 v78" stroke={INK} strokeWidth="3" strokeDasharray="5 4" opacity="0.7" />
      {/* belt */}
      <path d="M58 196 Q110 218 162 196" stroke={INK} strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M58 196 Q110 218 162 196" stroke={CAP} strokeWidth="10" strokeLinecap="round" fill="none" />
      <rect x="100" y="197" width="22" height="16" rx="4" fill={GLOVE} stroke={INK} strokeWidth="3" />
      {/* name tag */}
      <rect x="120" y="140" width="34" height="16" rx="4" fill="#fff9ee" stroke={INK} strokeWidth="2.5" />
      <text x="137" y="152" textAnchor="middle" fontSize="10" fontFamily="var(--font-neucha), cursive" fill={INK}>
        Клир
      </text>
      {/* holster with spray bottle */}
      <rect x="62" y="186" width="14" height="30" rx="4" fill={SUIT_DARK} stroke={INK} strokeWidth="3" />

      {/* ---------- right arm (in front) ---------- */}
      <path d={arms.right} stroke={INK} strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d={arms.right} stroke={SUIT} strokeWidth="16" strokeLinecap="round" fill="none" />

      {/* ---------- tools per pose ---------- */}
      {pose === "stand" && (
        <g transform={`translate(${arms.handR[0]} ${arms.handR[1] - 40})`}>
          {/* squeegee resting like a cane */}
          <rect x="-6" y="0" width="12" height="100" rx="5" fill={CAP} stroke={INK} strokeWidth="3.5" />
          <rect x="-34" y="96" width="68" height="14" rx="4" fill="#d5dde6" stroke={INK} strokeWidth="3.5" />
          <rect x="-36" y="108" width="72" height="9" rx="3" fill="#3a4152" stroke={INK} strokeWidth="3" />
        </g>
      )}
      {pose === "clean" && (
        <g transform={`translate(${arms.handR[0]} ${arms.handR[1]})`}>
          {/* squeegee held by the handle, blade below the hand */}
          <rect x="-6" y="-24" width="12" height="70" rx="5" fill={CAP} stroke={INK} strokeWidth="3.5" />
          <rect x="-46" y="44" width="92" height="14" rx="4" fill="#d5dde6" stroke={INK} strokeWidth="3.5" />
          <rect x="-50" y="56" width="100" height="9" rx="3" fill="#3a4152" stroke={INK} strokeWidth="3" />
        </g>
      )}
      {pose === "wipe" && (
        <g>
          {/* wide pro squeegee held with both hands, blade at the waist */}
          <rect x="104" y="150" width="12" height="36" rx="5" fill={CAP} stroke={INK} strokeWidth="3.5" />
          <rect x="16" y="182" width="188" height="14" rx="5" fill="#d5dde6" stroke={INK} strokeWidth="3.5" />
          <path d="M28 187 h40" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <rect x="12" y="194" width="196" height="10" rx="4" fill="#3a4152" stroke={INK} strokeWidth="3" />
        </g>
      )}
      {pose === "catch" && (
        <g>
          {/* net: pole rises from the hands, hoop tilted up to the right */}
          <path d="M110 78 L150 -6" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M110 78 L150 -6" stroke={CAP} strokeWidth="5" strokeLinecap="round" />
          <g transform="translate(150 -6) rotate(-24)">
            <ellipse cx="46" cy="0" rx="50" ry="22" fill="#d8f3fc" fillOpacity="0.55" stroke={INK} strokeWidth="4" />
            <path d="M4 4 q42 40 84 0 M12 10 q34 26 68 0 M22 16 q24 14 48 0" stroke={INK} strokeWidth="2" fill="none" opacity="0.6" />
          </g>
        </g>
      )}

      {/* ---------- gloves ---------- */}
      <circle cx={arms.handL[0]} cy={arms.handL[1]} r="15" fill={GLOVE} stroke={INK} strokeWidth="4" />
      <circle cx={arms.handR[0]} cy={arms.handR[1]} r="15" fill={GLOVE} stroke={INK} strokeWidth="4" />
      {pose === "point" && (
        <rect x={arms.handR[0] + 6} y={arms.handR[1] - 6} width="22" height="12" rx="6" fill={GLOVE} stroke={INK} strokeWidth="4" />
      )}
      {pose === "wave" && (
        <path d={`M${arms.handR[0] - 6} ${arms.handR[1] - 12} l-2 -12 M${arms.handR[0] + 2} ${arms.handR[1] - 14} l2 -12 M${arms.handR[0] + 9} ${arms.handR[1] - 10} l6 -10`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      )}

      {/* ---------- head ---------- */}
      <path
        d="M56 78 C56 40 82 26 112 26 C146 26 166 46 164 84 C162 116 146 132 112 132 C78 132 56 112 56 78 Z"
        fill={SKIN}
        stroke={INK}
        strokeWidth="5"
      />
      {/* ear */}
      <ellipse cx="60" cy="90" rx="7" ry="9" fill={SKIN} stroke={INK} strokeWidth="4" />
      {/* cheeks */}
      <ellipse cx="80" cy="102" rx="8" ry="5" fill="#ffb1a3" opacity="0.7" />
      <ellipse cx="146" cy="100" rx="8" ry="5" fill="#ffb1a3" opacity="0.7" />
      {/* nose */}
      <path d="M108 86 q10 6 4 16" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* eyes: whites, pupils (spring-driven), lids for blink */}
      <g className={cn(!eyesWide && "blink")}>
        <ellipse cx="88" cy="80" rx="15" ry="18" fill="#fff" stroke={INK} strokeWidth="4" transform={eyesWide ? "scale(1.12) translate(-9 -8)" : undefined} />
        <ellipse cx="128" cy="78" rx="19" ry="22" fill="#fff" stroke={INK} strokeWidth="4" transform={eyesWide ? "scale(1.12) translate(-13 -8)" : undefined} />
        {expression === "wink" ? (
          <path d="M74 82 q14 10 28 0" stroke={INK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        ) : (
          <g clipPath={`url(#${id}-eyeL)`}>
            <motion.g style={{ x: sx, y: sy }}>
              <circle cx="90" cy="82" r="6.5" fill={INK} />
              <circle cx="92.5" cy="79.5" r="2" fill="#fff" />
            </motion.g>
          </g>
        )}
        <g clipPath={`url(#${id}-eyeR)`}>
          <motion.g style={{ x: sx, y: sy }}>
            <circle cx="130" cy="80" r="8" fill={INK} />
            <circle cx="133" cy="77" r="2.5" fill="#fff" />
          </motion.g>
        </g>
        {expression === "focused" && (
          <>
            <path d="M72 66 q16 -2 32 6 v-16 h-32Z" fill={SKIN} />
            <path d="M108 60 q20 -2 40 8 v-18 h-40Z" fill={SKIN} />
          </>
        )}
      </g>

      <Face expression={expression} />

      {/* ---------- cap ---------- */}
      <path d="M58 66 C60 34 84 18 114 18 C146 18 164 36 166 66 Z" fill={CAP} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M58 66 h108" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M150 58 L200 62 Q204 70 196 74 L150 68 Z" fill={CAP_DARK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M112 18 v-8" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="112" cy="8" r="5" fill={GLOVE} stroke={INK} strokeWidth="3" />
      {/* cap gleam */}
      <path d="M76 48 q14 -16 34 -18" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
