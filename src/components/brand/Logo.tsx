import { brand } from "@/data/brand";
import { cn } from "@/lib/utils";

type LogoMarkProps = { className?: string; night?: boolean };

/** Window-with-a-gleam mark. Also used as favicon and OG badge. */
export function LogoMark({ className, night = false }: LogoMarkProps) {
  const glass = night ? "#22315f" : "#a9e4f7";
  const frame = night ? "#f6f1e7" : "#1b1f2a";
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <rect x="4" y="4" width="40" height="40" rx="9" fill={glass} stroke={frame} strokeWidth="4" />
      <path d="M24 4v40M4 24h40" stroke={frame} strokeWidth="4" />
      {/* diagonal gleam in the lower-left pane */}
      <path d="M9 39l10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      {/* sparkle in the upper-right pane */}
      <path
        d="M34 9c.7 4 2.3 5.6 6.3 6.3-4 .7-5.6 2.3-6.3 6.3-.7-4-2.3-5.6-6.3-6.3 4-.7 5.6-2.3 6.3-6.3Z"
        fill="#ffd23f"
        stroke={frame}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  night?: boolean;
  compact?: boolean;
};

export function Logo({ className, night = false, compact = false }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        night ? "text-cream" : "text-ink",
        className,
      )}
    >
      <LogoMark night={night} className={cn("shrink-0", compact ? "h-8 w-8" : "h-9 w-9")} />
      <span
        className={cn(
          "font-display font-black leading-none tracking-[-0.03em]",
          compact ? "text-xl" : "text-2xl",
        )}
      >
        {brand.name}
      </span>
    </span>
  );
}
