"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { springSnap } from "@/lib/motion";

type SpeechBubbleProps = {
  children: ReactNode;
  tail?: "left" | "right" | "bottom-left" | "bottom-right" | "top-left";
  show?: boolean;
  className?: string;
  night?: boolean;
  size?: "sm" | "md" | "lg";
  role?: string;
};

const tails: Record<NonNullable<SpeechBubbleProps["tail"]>, string> = {
  left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-bl-[3px]",
  right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tr-[3px]",
  "bottom-left": "left-6 bottom-0 translate-y-1/2 rotate-45 rounded-br-[3px]",
  "bottom-right": "right-6 bottom-0 translate-y-1/2 rotate-45 rounded-br-[3px]",
  "top-left": "left-6 top-0 -translate-y-1/2 rotate-45 rounded-tl-[3px]",
};

const sizes = { sm: "text-base px-3 py-1.5", md: "text-lg px-4 py-2", lg: "text-2xl px-5 py-3" };

/** Hand-lettered cartoon speech bubble with an ink outline and a pointed tail. */
export function SpeechBubble({
  children,
  tail = "left",
  show = true,
  className,
  night = false,
  size = "md",
  role = "status",
}: SpeechBubbleProps) {
  const bg = night ? "bg-cream text-ink" : "bg-cream text-ink";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role={role}
          initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
          transition={springSnap}
          className={cn(
            "relative inline-block rounded-[18px] rounded-bl-[6px] font-hand leading-tight ink-border shadow-[0_3px_0_0_#1b1f2a]",
            bg,
            sizes[size],
            className,
          )}
          style={{ transformOrigin: tail.includes("left") ? "0% 100%" : "100% 100%" }}
        >
          <span
            aria-hidden
            className={cn(
              "absolute h-4 w-4 border-ink bg-cream",
              tails[tail],
              tail === "left" && "border-b-[3px] border-l-[3px]",
              tail === "right" && "border-t-[3px] border-r-[3px]",
              tail.startsWith("bottom") && "border-b-[3px] border-r-[3px]",
              tail === "top-left" && "border-t-[3px] border-l-[3px]",
            )}
          />
          <span className="relative">{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
