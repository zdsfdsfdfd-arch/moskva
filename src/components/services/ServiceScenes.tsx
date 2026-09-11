"use client";

import { City } from "@/components/illustrations/City";
import { Dirt } from "@/components/illustrations/Dirt";
import { Klir } from "@/components/illustrations/Klir";
import type { ServiceId } from "@/data/services";
import { cn } from "@/lib/utils";

const INK = "#1b1f2a";
const frame = "ink-border-2 bg-cream";

/* Each scene lives inside a `group` card; hover/focus states come from the parent. */

function ApartmentScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f3e2a2]">
      {/* wallpaper */}
      <div aria-hidden className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(90deg,transparent_0_22px,rgba(27,31,42,0.12)_22px_24px)]" />
      {/* window */}
      <div className={cn("absolute inset-x-[16%] top-[12%] bottom-[22%] rounded-[6px] p-[6px]", frame)} style={{ perspective: "500px" }}>
        <div className="relative h-full w-full overflow-hidden rounded-[3px] ink-border-2 bg-sky">
          <City lite seed={31} celestial={false} />
          {/* right sash swings open */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 w-1/2 origin-left border-l-2 border-ink bg-sky-pale/40 shadow-[inset_0_0_0_3px_#fff9ee] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(-62deg)] group-focus-within:[transform:rotateY(-62deg)]"
          >
            <span className="absolute left-1.5 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-[#d5dde6] ring-2 ring-ink" />
          </div>
        </div>
      </div>
      {/* sill + cat that ducks */}
      <div aria-hidden className="absolute inset-x-[10%] bottom-[16%] h-[7%] rounded-[3px] ink-border-2 bg-cream" />
      <svg aria-hidden viewBox="0 0 60 40" className="absolute bottom-[22%] right-[20%] w-[18%] transition-transform duration-500 group-hover:translate-y-[120%] group-focus-within:translate-y-[120%]">
        <ellipse cx="30" cy="32" rx="22" ry="8" fill="#3a4152" stroke={INK} strokeWidth="2.5" />
        <circle cx="44" cy="20" r="10" fill="#3a4152" stroke={INK} strokeWidth="2.5" />
        <path d="M37 12 l2 -8 l6 6 M51 12 l-2 -8 l-6 6" fill="#3a4152" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="41" cy="20" r="1.5" fill="#ffd23f" />
        <circle cx="47" cy="20" r="1.5" fill="#ffd23f" />
        <path d="M10 30 q-10 -14 2 -20" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </svg>
      {/* curtain */}
      <div aria-hidden className="absolute left-[8%] top-[4%] h-[62%] w-[12%] rounded-b-[40%] bg-tangerine ink-border-2" />
    </div>
  );
}

function PanoramicScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-night-deep">
      <div className="absolute inset-[6%] overflow-hidden rounded-[4px] ink-border-2 bg-sky">
        <div className="h-full w-full origin-center scale-[1.28] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-focus-within:scale-100">
          <City seed={19} />
        </div>
        {/* thin mullions */}
        <div aria-hidden className="absolute inset-y-0 left-1/3 w-[3px] bg-ink" />
        <div aria-hidden className="absolute inset-y-0 left-2/3 w-[3px] bg-ink" />
      </div>
      {/* floor lamp silhouette inside */}
      <svg aria-hidden viewBox="0 0 40 120" className="absolute bottom-[6%] left-[10%] w-[9%]">
        <path d="M20 118 V30" stroke={INK} strokeWidth="4" />
        <path d="M4 32 L36 32 L30 6 L10 6 Z" fill="#ffd23f" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="20" cy="118" rx="14" ry="4" fill={INK} />
      </svg>
    </div>
  );
}

function BalconyScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#bfe3d6]">
      {/* glazing: four narrow sashes */}
      <div className={cn("absolute inset-x-[6%] top-[8%] h-[52%] rounded-[5px] p-[5px]", frame)}>
        <div className="grid h-full grid-cols-4 gap-[4px]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-[2px] ink-border-2 bg-sky">
              <div className="absolute inset-0" style={{ transform: `translateX(${-i * 25}%)`, width: "400%" }}>
                <City lite seed={41} celestial={i === 3} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* railing */}
      <div aria-hidden className="absolute inset-x-[6%] top-[60%] h-[22%] rounded-[3px] ink-border-2 bg-cream [background-image:repeating-linear-gradient(90deg,transparent_0_14px,#1b1f2a_14px_17px)]" />
      <div aria-hidden className="absolute inset-x-[4%] top-[58%] h-[6px] rounded-full bg-ink" />
      {/* laundry line that sways */}
      <svg aria-hidden viewBox="0 0 200 60" className="absolute inset-x-[8%] top-[40%] w-[84%]">
        <path d="M0 8 Q100 26 200 8" fill="none" stroke={INK} strokeWidth="2.5" />
        {[40, 95, 150].map((x, i) => (
          <g key={x} className="origin-top transition-transform duration-700 group-hover:animate-[bob_1.2s_ease-in-out_infinite]" style={{ transformOrigin: `${x}px 14px`, animationDelay: `${i * 0.15}s` }}>
            <path d={`M${x - 12} 16 h24 l4 10 l-6 2 v22 h-20 v-22 l-6 -2 Z`} fill={["#ff6b2c", "#fff9ee", "#1fb6a6"][i]} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            <rect x={x - 3} y="10" width="6" height="10" rx="2" fill="#ffd23f" stroke={INK} strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function StorefrontScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e9b8a4]">
      {/* sign */}
      <div aria-hidden className="absolute inset-x-[8%] top-[6%] flex h-[16%] items-center justify-center rounded-[4px] ink-border-2 bg-ink font-display text-[clamp(10px,1.1vw,16px)] font-bold uppercase tracking-[0.2em] text-sun">
        пекарня
      </div>
      {/* glass */}
      <div className="absolute inset-x-[8%] top-[26%] bottom-[10%] overflow-hidden rounded-[4px] ink-border-2 bg-sky-pale">
        {/* display with pastries */}
        <svg aria-hidden viewBox="0 0 200 100" className="absolute inset-x-0 bottom-0 w-full">
          <rect x="0" y="60" width="200" height="40" fill="#d9a066" stroke={INK} strokeWidth="3" />
          <rect x="0" y="34" width="200" height="6" fill="#d9a066" stroke={INK} strokeWidth="3" />
          {[24, 74, 124, 170].map((x) => (
            <path key={x} d={`M${x - 16} 60 q16 -26 32 0 Z`} fill="#f2b90d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          ))}
          {[40, 100, 150].map((x) => (
            <ellipse key={x} cx={x} cy="30" rx="16" ry="7" fill="#ff9a6a" stroke={INK} strokeWidth="2.5" />
          ))}
        </svg>
        {/* grime that clears */}
        <div className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0 group-focus-within:opacity-0">
          <Dirt texture="dirt-lite.svg" />
        </div>
      </div>
      <div aria-hidden className="absolute bottom-[10%] left-[8%] right-[8%] h-2 bg-ink" />
    </div>
  );
}

function OfficeScene() {
  const cells = Array.from({ length: 12 });
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#d5dde6]">
      <div className="absolute inset-[7%] grid grid-cols-4 grid-rows-3 gap-[4%]">
        {cells.map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[3px] ink-border-2 bg-[#2a3a72] transition-colors duration-300 group-hover:bg-sun group-focus-within:bg-sun"
            style={{ transitionDelay: `${(i % 4) * 90 + Math.floor(i / 4) * 40}ms` }}
          >
            {/* tiny desk + monitor */}
            <svg aria-hidden viewBox="0 0 40 30" className="absolute inset-x-0 bottom-0 w-full">
              <rect x="6" y="20" width="28" height="4" fill={INK} />
              <rect x="14" y="8" width="12" height="10" rx="1" fill="#a9e4f7" stroke={INK} strokeWidth="2" />
              <path d="M20 18 v3" stroke={INK} strokeWidth="2" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenovationScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eadfcb]">
      <div aria-hidden className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,transparent_0_18px,rgba(27,31,42,0.2)_18px_20px)]" />
      <div className={cn("absolute inset-x-[14%] top-[10%] bottom-[26%] rounded-[6px] p-[6px]", frame)}>
        <div className="relative h-full w-full overflow-hidden rounded-[3px] ink-border-2 bg-sky">
          <City lite seed={53} celestial={false} />
          <div className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(100%_0_0_0)] group-focus-within:[clip-path:inset(100%_0_0_0)]">
            <Dirt texture="dirt-renovation.svg" />
          </div>
        </div>
      </div>
      {/* paint bucket & roller on the floor */}
      <svg aria-hidden viewBox="0 0 120 50" className="absolute bottom-[4%] left-[8%] w-[40%]">
        <path d="M10 14 h34 l-3 32 h-28 Z" fill="#fff9ee" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="27" cy="14" rx="17" ry="5" fill="#1fb6a6" stroke={INK} strokeWidth="3" />
        <path d="M60 40 l30 -22" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <rect x="84" y="6" width="30" height="14" rx="6" fill="#1fb6a6" stroke={INK} strokeWidth="3" transform="rotate(-36 99 13)" />
      </svg>
    </div>
  );
}

function HighAccessScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#c3dbe8]">
      {/* tall glazed strip */}
      <div className={cn("absolute inset-x-[30%] top-0 bottom-0 border-x-2 border-ink bg-sky")}>
        <City lite seed={61} celestial={false} />
        <div aria-hidden className="absolute inset-x-0 top-1/3 h-[3px] bg-ink" />
        <div aria-hidden className="absolute inset-x-0 top-2/3 h-[3px] bg-ink" />
      </div>
      {/* cradle drops in from above with a tiny Klir */}
      <div className="absolute left-[18%] right-[18%] top-0 -translate-y-[85%] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-[18%] group-focus-within:translate-y-[18%]">
        <svg aria-hidden viewBox="0 0 200 60" overflow="visible" className="w-full">
          <path d="M20 40 V-400 M180 40 V-400" stroke={INK} strokeWidth="4" />
          <rect x="4" y="36" width="192" height="18" rx="6" fill="#178f83" stroke={INK} strokeWidth="3" />
        </svg>
        <div className="absolute bottom-[14%] left-1/2 w-[38%] -translate-x-1/2">
          <Klir pose="wipe" expression="focused" idle={false} className="w-full" />
        </div>
      </div>
      <p aria-hidden className="absolute bottom-2 right-2 rounded-md ink-border-2 bg-cream px-1.5 py-0.5 font-hand text-xs">
        23 этаж
      </p>
    </div>
  );
}

function MosquitoScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f0c8c0]">
      <div className={cn("absolute inset-[10%] rounded-[6px] p-[6px]", frame)}>
        <div className="relative h-full w-full overflow-hidden rounded-[3px] ink-border-2 bg-sky">
          <City lite seed={71} />
          {/* the mesh slides out */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(27,31,42,0.35)_0_1px,transparent_1px_5px),repeating-linear-gradient(90deg,rgba(27,31,42,0.35)_0_1px,transparent_1px_5px)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-full group-focus-within:translate-x-full"
          />
          {/* a fly, leaving */}
          <svg aria-hidden viewBox="0 0 20 14" className="absolute left-[40%] top-[40%] w-[10%] transition-transform duration-700 group-hover:translate-x-[300%] group-hover:-translate-y-[200%] group-focus-within:translate-x-[300%]">
            <ellipse cx="10" cy="9" rx="5" ry="3.5" fill={INK} />
            <ellipse cx="6" cy="4" rx="4" ry="2.5" fill="#d5dde6" stroke={INK} strokeWidth="1" />
            <ellipse cx="14" cy="4" rx="4" ry="2.5" fill="#d5dde6" stroke={INK} strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ServiceScene({ id }: { id: ServiceId }) {
  switch (id) {
    case "apartment":
      return <ApartmentScene />;
    case "panoramic":
      return <PanoramicScene />;
    case "balcony":
      return <BalconyScene />;
    case "storefront":
      return <StorefrontScene />;
    case "office":
      return <OfficeScene />;
    case "renovation":
      return <RenovationScene />;
    case "high-access":
      return <HighAccessScene />;
    case "mosquito":
      return <MosquitoScene />;
  }
}
