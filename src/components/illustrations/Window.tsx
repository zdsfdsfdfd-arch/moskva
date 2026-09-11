import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type WindowProps = {
  children: ReactNode;
  /** Vertical mullions: number of sashes across. */
  cols?: number;
  /** Horizontal transoms: number of sashes down. */
  rows?: number;
  sill?: boolean;
  handle?: boolean;
  /** Content placed on the windowsill (bucket, plants...). */
  sillContent?: ReactNode;
  frame?: "white" | "wood" | "dark" | "night";
  className?: string;
  glassClassName?: string;
  style?: CSSProperties;
  /** Frame thickness in CSS units. */
  frameWidth?: string;
  /** Extra layers rendered above the glass but inside the frame (labels, cursor drops...). */
  overlay?: ReactNode;
};

const frames = {
  white: { fill: "#fff9ee", edge: "#e8dfcf", line: "#1b1f2a" },
  wood: { fill: "#d9a066", edge: "#b8803f", line: "#1b1f2a" },
  dark: { fill: "#3a4152", edge: "#2b3140", line: "#1b1f2a" },
  night: { fill: "#22315f", edge: "#182552", line: "#0a1129" },
};

/**
 * A cartoon window frame that wraps any "outside" (city, dirt, previews).
 * Mullions are real DOM so they sit above the glass content.
 */
export function Window({
  children,
  cols = 2,
  rows = 1,
  sill = false,
  handle = false,
  sillContent,
  frame = "white",
  className,
  glassClassName,
  style,
  frameWidth = "clamp(10px, 1.6vw, 22px)",
  overlay,
}: WindowProps) {
  const f = frames[frame];
  const mullionsV = Array.from({ length: Math.max(0, cols - 1) }, (_, i) => ((i + 1) / cols) * 100);
  const mullionsH = Array.from({ length: Math.max(0, rows - 1) }, (_, i) => ((i + 1) / rows) * 100);

  return (
    <div className={cn("relative", className)} style={style}>
      <div
        className="relative h-full rounded-[10px]"
        style={{
          padding: frameWidth,
          background: f.fill,
          border: `3px solid ${f.line}`,
          boxShadow: `inset 0 -6px 0 0 ${f.edge}, 0 30px 50px -30px rgba(27,31,42,0.5)`,
        }}
      >
        <div
          className={cn("relative h-full w-full overflow-hidden rounded-[4px] bg-sky", glassClassName)}
          style={{ border: `3px solid ${f.line}` }}
        >
          {children}
          {/* mullions */}
          {mullionsV.map((x) => (
            <div
              key={`v${x}`}
              aria-hidden
              className="pointer-events-none absolute top-0 bottom-0 -translate-x-1/2"
              style={{
                left: `${x}%`,
                width: `calc(${frameWidth} * 0.8)`,
                background: f.fill,
                borderLeft: `3px solid ${f.line}`,
                borderRight: `3px solid ${f.line}`,
                boxShadow: `inset -4px 0 0 0 ${f.edge}`,
              }}
            />
          ))}
          {mullionsH.map((y) => (
            <div
              key={`h${y}`}
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 -translate-y-1/2"
              style={{
                top: `${y}%`,
                height: `calc(${frameWidth} * 0.8)`,
                background: f.fill,
                borderTop: `3px solid ${f.line}`,
                borderBottom: `3px solid ${f.line}`,
                boxShadow: `inset 0 -4px 0 0 ${f.edge}`,
              }}
            />
          ))}
          {/* glass gleam: one diagonal cartoon highlight, top-left */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[10%] top-0 h-full w-[14%] -skew-x-[18deg] bg-white/25"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8%] top-0 h-full w-[3%] -skew-x-[18deg] bg-white/25"
          />
          {overlay}
        </div>
        {handle && (
          <div
            aria-hidden
            className="absolute right-[calc(var(--fw)*0.15)] top-1/2 h-14 w-3.5 -translate-y-1/2 rounded-full"
            style={{ ["--fw" as string]: frameWidth, background: "#d5dde6", border: `3px solid ${f.line}`, right: `calc(${frameWidth} * 0.1)` }}
          />
        )}
      </div>
      {sill && (
        <div className="relative">
          <div
            aria-hidden
            className="relative -mx-[3%] h-[clamp(16px,2.2vw,30px)] rounded-b-[6px]"
            style={{
              background: f.fill,
              border: `3px solid ${f.line}`,
              borderTop: "none",
              boxShadow: `inset 0 -7px 0 0 ${f.edge}, 0 24px 30px -20px rgba(27,31,42,0.5)`,
            }}
          />
          {sillContent && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(14px,2vw,28px)]">{sillContent}</div>
          )}
        </div>
      )}
    </div>
  );
}
