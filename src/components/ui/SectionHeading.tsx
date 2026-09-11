import type { ReactNode } from "react";
import { Sparkle } from "@/components/brand/Sparkle";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  night?: boolean;
  align?: "left" | "center";
  className?: string;
  as?: "h2" | "h3";
};

/** Left-aligned by default: no giant centred headings between sections. */
export function SectionHeading({ eyebrow, title, lede, id, night = false, align = "left", className, as: Tag = "h2" }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ink-border-2",
            night ? "border-cream/40 bg-night text-cream" : "bg-cream text-ink",
          )}
        >
          <Sparkle className="h-3.5 w-3.5" />
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          "font-display text-balance text-[clamp(28px,4vw,56px)] font-black leading-[1.02] tracking-[-0.03em]",
          night ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p className={cn("mt-4 max-w-[52ch] text-[17px] leading-relaxed sm:text-lg", night ? "text-cream/75" : "text-ink-soft")}>
          {lede}
        </p>
      )}
    </div>
  );
}
