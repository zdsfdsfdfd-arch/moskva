import { cn } from "@/lib/utils";

type SparkleProps = {
  className?: string;
  color?: string;
  outline?: boolean;
  /** CSS animation: pop once, or twinkle forever */
  animate?: "pop" | "twinkle" | "none";
  style?: React.CSSProperties;
};

/** The brand mark: a four-point cartoon gleam on clean glass. */
export function Sparkle({
  className,
  color = "#ffd23f",
  outline = true,
  animate = "none",
  style,
}: SparkleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(
        animate === "pop" && "sparkle-pop",
        animate === "twinkle" && "twinkle",
        className,
      )}
      style={style}
    >
      <path
        d="M12 0.8C13.2 8 16 10.8 23.2 12 16 13.2 13.2 16 12 23.2 10.8 16 8 13.2 0.8 12 8 10.8 10.8 8 12 0.8Z"
        fill={color}
        stroke={outline ? "#1b1f2a" : "none"}
        strokeWidth={outline ? 1.6 : 0}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Same glyph as a raw SVG path element, for use inside other SVGs. */
export function SparklePath({
  x,
  y,
  size = 24,
  color = "#ffd23f",
  outline = true,
  className,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  outline?: boolean;
  className?: string;
}) {
  const s = size / 24;
  return (
    <path
      className={className}
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}
      d="M12 0.8C13.2 8 16 10.8 23.2 12 16 13.2 13.2 16 12 23.2 10.8 16 8 13.2 0.8 12 8 10.8 10.8 8 12 0.8Z"
      fill={color}
      stroke={outline ? "#1b1f2a" : "none"}
      strokeWidth={outline ? 1.6 / s : 0}
      strokeLinejoin="round"
    />
  );
}
