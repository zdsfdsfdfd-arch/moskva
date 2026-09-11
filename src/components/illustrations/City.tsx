import { useId } from "react";
import { seeded } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type CityVariant = "day" | "night";

type Palette = {
  skyTop: string;
  skyBottom: string;
  far: string;
  farLine: string;
  mid: string[];
  midLine: string;
  near: string[];
  nearLine: string;
  window: string;
  windowLit: string;
  cloud: string;
  cloudLine: string;
  litChance: number;
};

const PALETTES: Record<CityVariant, Palette> = {
  day: {
    skyTop: "#5bc3e8",
    skyBottom: "#d8f3fc",
    far: "#c3dbe8",
    farLine: "#93b7c9",
    mid: ["#eadfcb", "#e9b8a4", "#bfe3d6", "#f3e2a2", "#d9caae", "#f0c8c0"],
    midLine: "#1b1f2a",
    near: ["#fff9ee", "#f6f1e7", "#eadfcb"],
    nearLine: "#1b1f2a",
    window: "#d8f3fc",
    windowLit: "#ffd23f",
    cloud: "#ffffff",
    cloudLine: "#1b1f2a",
    litChance: 0.12,
  },
  night: {
    skyTop: "#0a1129",
    skyBottom: "#22315f",
    far: "#182552",
    farLine: "#2c3c78",
    mid: ["#1f2d5c", "#26346b", "#1b2a58", "#2a3a72", "#20306a", "#1d2c60"],
    midLine: "#0a1129",
    near: ["#141f47", "#182552", "#1b2a58"],
    nearLine: "#0a1129",
    window: "#2a3a72",
    windowLit: "#ffc857",
    cloud: "#3a4a86",
    cloudLine: "#0a1129",
    litChance: 0.62,
  },
};

type CityProps = {
  variant?: CityVariant;
  className?: string;
  style?: React.CSSProperties;
  /** Seed changes which windows are lit / building rhythm. */
  seed?: number;
  /** Render fewer details (mobile, small previews). */
  lite?: boolean;
  /** Show the sun/moon */
  celestial?: boolean;
};

type Building = {
  x: number;
  w: number;
  h: number;
  color: string;
  cols: number;
  rows: number;
  roof?: "flat" | "ac" | "antenna" | "tank" | "billboard";
  /** Pre-rolled lit windows, row-major, so rendering stays pure. */
  lit: boolean[];
};

/* All randomness happens here, in one pass, so server and client agree
   even when React double-renders children in StrictMode. */
function makeBuildings(
  rand: () => number,
  colors: string[],
  count: number,
  minH: number,
  maxH: number,
  maxW: number,
  litChance: number,
) {
  const list: Building[] = [];
  let x = -40;
  for (let i = 0; i < count; i++) {
    const w = 110 + rand() * maxW;
    const h = minH + rand() * (maxH - minH);
    const cols = Math.max(2, Math.floor(w / 42));
    const rows = Math.max(2, Math.floor(h / 48));
    const roofs: Building["roof"][] = ["flat", "ac", "antenna", "tank", "flat", "ac"];
    const lit = Array.from({ length: cols * rows }, () => rand() < litChance);
    list.push({
      x,
      w,
      h,
      color: colors[Math.floor(rand() * colors.length)],
      cols,
      rows,
      roof: roofs[Math.floor(rand() * roofs.length)],
      lit,
    });
    x += w - 12 + rand() * 40;
    if (x > 1700) break;
  }
  return list;
}

function Windows({ b, baseY, p, lite }: { b: Building; baseY: number; p: Palette; lite: boolean }) {
  const cellW = b.w / b.cols;
  const cellH = b.h / b.rows;
  const nodes: React.ReactNode[] = [];
  const step = lite ? 2 : 1;
  for (let r = 0; r < b.rows; r += step) {
    for (let c = 0; c < b.cols; c += step) {
      const lit = b.lit[r * b.cols + c];
      nodes.push(
        <rect
          key={`${r}-${c}`}
          x={b.x + c * cellW + cellW * 0.22}
          y={baseY - b.h + r * cellH + cellH * 0.22}
          width={cellW * 0.56}
          height={cellH * 0.5}
          rx="3"
          fill={lit ? p.windowLit : p.window}
          stroke={p.midLine}
          strokeWidth="2"
        />,
      );
    }
  }
  return <>{nodes}</>;
}

function Roof({ b, baseY, p }: { b: Building; baseY: number; p: Palette }) {
  const top = baseY - b.h;
  switch (b.roof) {
    case "ac":
      return (
        <g>
          <rect x={b.x + 18} y={top - 18} width="34" height="18" rx="3" fill="#d5dde6" stroke={p.midLine} strokeWidth="2.5" />
          <circle cx={b.x + 35} cy={top - 9} r="5" fill="none" stroke={p.midLine} strokeWidth="2" />
        </g>
      );
    case "antenna":
      return (
        <g stroke={p.midLine} strokeWidth="3" strokeLinecap="round">
          <path d={`M${b.x + b.w - 30} ${top} v-40`} />
          <path d={`M${b.x + b.w - 42} ${top - 30} h24 M${b.x + b.w - 38} ${top - 20} h16`} />
        </g>
      );
    case "tank":
      return (
        <g>
          <rect x={b.x + b.w - 60} y={top - 30} width="36" height="30" rx="8" fill="#d5dde6" stroke={p.midLine} strokeWidth="2.5" />
          <path d={`M${b.x + b.w - 56} ${top} v-8 M${b.x + b.w - 28} ${top} v-8`} stroke={p.midLine} strokeWidth="2.5" />
        </g>
      );
    default:
      return null;
  }
}

/**
 * A stylised cartoon skyline inspired by modern Moscow: tiered tower with a
 * spire, glass towers, a needle-thin TV tower, panel blocks, cranes,
 * rooftop clutter. Fills its box, anchored to the bottom.
 */
export function City({
  variant = "day",
  className,
  style,
  seed = 7,
  lite = false,
  celestial = true,
}: CityProps) {
  const id = useId();
  const p = PALETTES[variant];
  const rand = seeded(seed);
  const mid = makeBuildings(rand, p.mid, lite ? 7 : 11, 180, 330, 120, p.litChance);
  const near = makeBuildings(rand, p.near, lite ? 4 : 6, 110, 190, 180, p.litChance);
  const stars = Array.from({ length: 40 }, () => ({ x: rand() * 1600, y: rand() * 420, r: 0.8 + rand() * 1.6, o: 0.5 + rand() * 0.5 }));
  const midBase = 760;
  const nearBase = 920;
  const night = variant === "night";

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={cn("block h-full w-full", className)}
      style={style}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.skyTop} />
          <stop offset="1" stopColor={p.skyBottom} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={night ? "#ffe9a8" : "#fff3b0"} stopOpacity={night ? 0.5 : 0.75} />
          <stop offset="1" stopColor={night ? "#ffe9a8" : "#fff3b0"} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill={`url(#${id}-sky)`} />

      {/* stars */}
      {night && !lite && (
        <g fill="#fff">
          {stars.map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.r} opacity={st.o} />
          ))}
        </g>
      )}

      {/* sun / moon */}
      {celestial && (
        <g data-city-layer="sky">
          <circle cx="1230" cy="180" r="190" fill={`url(#${id}-glow)`} />
          {night ? (
            <path
              d="M1250 110 a70 70 0 1 0 40 128 a54 54 0 1 1 -40 -128Z"
              fill="#fff3c4"
              stroke={p.cloudLine}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <circle cx="1230" cy="180" r="66" fill="#ffd23f" stroke="#1b1f2a" strokeWidth="4" />
              <circle cx="1214" cy="164" r="12" fill="#fff" opacity="0.7" />
            </>
          )}
        </g>
      )}

      {/* clouds */}
      <g data-city-layer="sky" className="drift">
        <Cloud x={220} y={170} s={1.1} fill={p.cloud} line={p.cloudLine} />
        <Cloud x={720} y={110} s={0.8} fill={p.cloud} line={p.cloudLine} />
        {!lite && <Cloud x={1430} y={300} s={0.7} fill={p.cloud} line={p.cloudLine} />}
      </g>

      {/* ---------- far layer: skyline silhouettes ---------- */}
      <g data-city-layer="far" fill={p.far} stroke={p.farLine} strokeWidth="4" strokeLinejoin="round">
        {/* tiered tower with spire */}
        <path d="M120 760 V520 h60 v-70 h40 v-90 h30 v-60 h14 v-80 l6 -40 l6 40 v80 h14 v60 h30 v90 h40 v70 h60 v240 Z" />
        {/* needle TV tower */}
        <path d="M600 760 V420 h10 v-120 h6 v-180 l4 -60 l4 60 v180 h6 v120 h10 v340 Z" />
        <circle cx="620" cy="330" r="22" />
        {/* glass tower cluster */}
        <path d="M880 760 V330 l70 -40 v470 Z" />
        <path d="M960 760 V270 h90 v490 Z" />
        <path d="M1060 760 V380 l60 -30 v410 Z" />
        <path d="M1130 760 V440 h50 v320 Z" />
        <path d="M1300 760 V470 h80 v-60 h50 v350 Z" />
        <path d="M1450 760 V520 h90 v240 Z" />
        {/* far dome */}
        <path d="M380 760 V620 q60 -90 120 0 v140 Z" />
        <path d="M440 530 q0 -20 0 -40 M424 545 q16 -40 32 0" fill="none" />
      </g>
      {/* windows on glass towers (stripes) */}
      <g data-city-layer="far" stroke={p.farLine} strokeWidth="3" opacity="0.7">
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M975 ${300 + i * 44} h60`} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={`b${i}`} d={`M1310 ${500 + i * 40} h60`} />
        ))}
      </g>

      {/* ---------- mid layer ---------- */}
      <g data-city-layer="mid">
        {/* crane */}
        {!lite && (
          <g stroke={p.midLine} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M1240 760 V400 M1220 400 h260 M1240 420 l-16 -20 M1480 400 v40 M1400 400 v90" />
            <path d="M1240 400 l20 20 l-20 20 l20 20 l-20 20 l20 20 l-20 20" />
            <rect x="1392" y="490" width="16" height="22" fill="#ff6b2c" />
          </g>
        )}
        {mid.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={midBase - b.h} width={b.w} height={b.h} fill={b.color} stroke={p.midLine} strokeWidth="3.5" />
            <Windows b={b} baseY={midBase} p={p} lite={lite} />
            <Roof b={b} baseY={midBase} p={p} />
          </g>
        ))}
      </g>

      {/* ---------- near layer: rooftops ---------- */}
      <g data-city-layer="near">
        {near.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={nearBase - b.h} width={b.w} height={b.h} fill={b.color} stroke={p.nearLine} strokeWidth="4" />
            <Windows b={b} baseY={nearBase} p={p} lite={lite} />
            <Roof b={b} baseY={nearBase} p={p} />
          </g>
        ))}
        {/* balcony with a neighbour and a plant */}
        {!lite && (
          <g transform="translate(560 760)">
            <rect x="0" y="0" width="110" height="34" rx="4" fill={night ? "#26346b" : "#eadfcb"} stroke={p.nearLine} strokeWidth="4" />
            <path d="M8 0 v-40 M104 0 v-40 M8 -40 h96 M30 0 v-30 M56 0 v-30 M82 0 v-30" stroke={p.nearLine} strokeWidth="3" />
            {/* neighbour: a head with a mug */}
            <circle cx="40" cy="-56" r="14" fill="#ffd2ad" stroke={p.nearLine} strokeWidth="3" />
            <path d="M28 -66 q12 -12 24 0" fill="#3a4152" stroke={p.nearLine} strokeWidth="3" />
            <rect x="64" y="-56" width="12" height="14" rx="3" fill="#ff6b2c" stroke={p.nearLine} strokeWidth="3" />
            {/* plant */}
            <rect x="86" y="-12" width="16" height="12" fill="#e9b8a4" stroke={p.nearLine} strokeWidth="3" />
            <path d="M94 -12 v-14 M94 -20 l-8 -8 M94 -18 l8 -8" stroke="#1fb6a6" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
        {/* pigeons on a wire */}
        {!lite && (
          <g transform="translate(1050 730)">
            <path d="M0 0 q90 20 180 0" stroke={p.nearLine} strokeWidth="3" fill="none" />
            <Pigeon x={50} y={8} line={p.nearLine} />
            <Pigeon x={110} y={10} line={p.nearLine} />
          </g>
        )}
      </g>
    </svg>
  );
}

function Cloud({ x, y, s, fill, line }: { x: number; y: number; s: number; fill: string; line: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 40 a30 30 0 0 1 30 -30 a36 36 0 0 1 64 -6 a28 28 0 0 1 44 20 a24 24 0 0 1 8 46 H10 a26 26 0 0 1 -10 -30Z"
      fill={fill}
      stroke={line}
      strokeWidth="4"
      strokeLinejoin="round"
    />
  );
}

export function Pigeon({ x, y, line = "#1b1f2a" }: { x: number; y: number; line?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="-10" rx="14" ry="10" fill="#b8bfcb" stroke={line} strokeWidth="3" />
      <circle cx="12" cy="-18" r="6" fill="#8e97a8" stroke={line} strokeWidth="3" />
      <path d="M18 -18 l6 2 l-6 2Z" fill="#ff6b2c" stroke={line} strokeWidth="1.5" />
      <circle cx="13.5" cy="-19" r="1.5" fill={line} />
      <path d="M-4 0 v4 M4 0 v4" stroke={line} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}
