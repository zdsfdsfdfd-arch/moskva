import { cn } from "@/lib/utils";

type SqueegeeProps = {
  className?: string;
  style?: React.CSSProperties;
  /** Handle color: teal by default, orange for cursor/accents. */
  grip?: string;
};

/**
 * T-shaped window squeegee, handle up, rubber blade down.
 * viewBox 0 0 120 200 — the blade edge sits at y=152.
 */
export function Squeegee({ className, style, grip = "#1fb6a6" }: SqueegeeProps) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden className={cn(className)} style={style} overflow="visible">
      {/* handle */}
      <rect x="49" y="0" width="22" height="122" rx="9" fill={grip} stroke="#1b1f2a" strokeWidth="4" />
      <path d="M55 12v70" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M52 30h16M52 42h16M52 54h16" stroke="#1b1f2a" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      {/* metal head */}
      <rect x="8" y="118" width="104" height="22" rx="6" fill="#d5dde6" stroke="#1b1f2a" strokeWidth="4" />
      <path d="M16 124h30" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* rubber blade */}
      <rect x="4" y="138" width="112" height="14" rx="4" fill="#3a4152" stroke="#1b1f2a" strokeWidth="4" />
    </svg>
  );
}
