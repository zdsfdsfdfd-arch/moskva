import type { ExtraId, ObjectType, Sides, WindowType } from "@/data/calculator";

export type OptionIconId = ObjectType | WindowType | Sides | ExtraId;

const INK = "#1b1f2a";

/** Tiny line icons in the same ink-outline language as everything else. */
export function OptionIcon({ id, selected, className }: { id: OptionIconId; selected?: boolean; className?: string }) {
  const glass = selected ? "#fff9ee" : "#a9e4f7";
  const common = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const body = (() => {
    switch (id) {
      case "apartment":
        return (
          <>
            <rect x="6" y="8" width="28" height="26" rx="2" fill={glass} {...common} />
            <path d="M20 8v26M6 21h28" {...common} />
            <path d="M8 10 q4 8 0 16" fill="#ff6b2c" {...common} />
          </>
        );
      case "house":
        return (
          <>
            <path d="M6 20 L20 8 L34 20 V34 H6 Z" fill="#fff9ee" {...common} />
            <rect x="15" y="20" width="10" height="9" rx="1" fill={glass} {...common} />
            <path d="M25 11 v-4 h4 v8" fill="#e9b8a4" {...common} />
          </>
        );
      case "office":
        return (
          <>
            <rect x="8" y="6" width="24" height="30" rx="2" fill="#d5dde6" {...common} />
            {[11, 18, 25].map((y) => (
              <g key={y}>
                <rect x="12" y={y} width="5" height="4" fill={glass} {...common} strokeWidth={1.8} />
                <rect x="23" y={y} width="5" height="4" fill={glass} {...common} strokeWidth={1.8} />
              </g>
            ))}
          </>
        );
      case "shop":
        return (
          <>
            <path d="M6 14 h28 l-2 -6 h-24 Z" fill="#ff6b2c" {...common} />
            <rect x="8" y="14" width="24" height="20" rx="1" fill={glass} {...common} />
            <path d="M8 24 h24" {...common} strokeWidth={1.8} />
          </>
        );
      case "standard":
        return (
          <>
            <rect x="7" y="7" width="26" height="28" rx="2" fill={glass} {...common} />
            <path d="M20 7v28" {...common} />
          </>
        );
      case "panoramic":
        return (
          <>
            <rect x="3" y="8" width="34" height="26" rx="1" fill={glass} {...common} />
            <path d="M14 8v26M26 8v26" {...common} strokeWidth={1.8} />
            <path d="M6 30 l10 -8 l6 4 l12 -10" fill="none" {...common} strokeWidth={1.8} />
          </>
        );
      case "balcony":
        return (
          <>
            <rect x="4" y="6" width="32" height="18" rx="1" fill={glass} {...common} />
            <path d="M12 6v18M20 6v18M28 6v18" {...common} strokeWidth={1.8} />
            <rect x="4" y="26" width="32" height="8" fill="#fff9ee" {...common} />
            <path d="M10 26v8M16 26v8M22 26v8M28 26v8" {...common} strokeWidth={1.5} />
          </>
        );
      case "storefront":
        return (
          <>
            <path d="M4 12 h32 v-5 h-32 Z" fill="#1b1f2a" {...common} />
            <rect x="6" y="12" width="28" height="22" rx="1" fill={glass} {...common} />
            <circle cx="20" cy="24" r="4" fill="#ffd23f" {...common} strokeWidth={1.8} />
          </>
        );
      case "complex":
        return (
          <>
            <rect x="14" y="4" width="12" height="32" fill={glass} {...common} />
            <path d="M6 12 h8 M26 12 h8 M6 12 v-6 M34 12 v-6" {...common} strokeWidth={1.8} />
            <rect x="4" y="26" width="8" height="4" rx="1" fill="#178f83" {...common} strokeWidth={1.8} />
          </>
        );
      case "one":
        return (
          <>
            <rect x="8" y="8" width="24" height="24" rx="2" fill={glass} {...common} />
            <path d="M14 20 h12 M22 16 l4 4 l-4 4" fill="none" {...common} />
          </>
        );
      case "two":
        return (
          <>
            <rect x="8" y="8" width="24" height="24" rx="2" fill={glass} {...common} />
            <path d="M4 20 h10 M10 16 l4 4 l-4 4 M36 20 h-10 M30 16 l-4 4 l4 4" fill="none" {...common} />
          </>
        );
      case "frames":
        return (
          <>
            <rect x="6" y="6" width="28" height="28" rx="2" fill="#ff6b2c" {...common} />
            <rect x="12" y="12" width="16" height="16" rx="1" fill={glass} {...common} />
          </>
        );
      case "sills":
        return (
          <>
            <rect x="9" y="5" width="22" height="20" rx="1" fill={glass} {...common} />
            <rect x="4" y="25" width="32" height="6" rx="1" fill="#fff9ee" {...common} />
            <path d="M12 25 v-5 h4 v5" fill="#5fc08c" {...common} strokeWidth={1.8} />
          </>
        );
      case "mosquito":
        return (
          <>
            <rect x="7" y="7" width="26" height="26" rx="2" fill={glass} {...common} />
            <path d="M13 7v26M20 7v26M27 7v26M7 13h26M7 20h26M7 27h26" {...common} strokeWidth={1.2} />
          </>
        );
      case "renovation":
        return (
          <>
            <rect x="7" y="9" width="26" height="24" rx="2" fill="#eadfcb" {...common} />
            <path d="M10 14 l6 6 M22 12 l8 8 M12 26 l10 -4" {...common} strokeWidth={2} />
            <rect x="4" y="4" width="14" height="6" rx="1" fill="#1fb6a6" {...common} strokeWidth={1.8} />
          </>
        );
      case "high-access":
        return (
          <>
            <rect x="12" y="4" width="16" height="32" fill={glass} {...common} />
            <path d="M8 30 h24 M10 30 v-8 M30 30 v-8" {...common} />
            <circle cx="20" cy="18" r="3" fill="#ff6b2c" {...common} strokeWidth={1.8} />
          </>
        );
    }
  })();
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      {body}
    </svg>
  );
}
