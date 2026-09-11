"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSnap } from "@/lib/motion";
import { OptionIcon, type OptionIconId } from "./OptionIcons";

type Option<T extends string> = { id: T; label: string; hint?: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T | T[] | null;
  onChange: (id: T) => void;
  multi?: boolean;
  columns?: 2 | 3 | 4 | 5;
  name: string;
  icons?: boolean;
};

/** Illustrated toggle tiles; single or multi select; keyboard-native buttons. */
export function OptionTiles<T extends string>({ options, value, onChange, multi = false, columns = 4, name, icons = true }: Props<T>) {
  const isSelected = (id: T) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={name}
      className={cn(
        "grid gap-2.5 sm:gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
        columns === 5 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {options.map((o) => {
        const selected = isSelected(o.id);
        return (
          <motion.button
            key={o.id}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            data-cursor="button"
            whileTap={{ scale: 0.96 }}
            transition={springSnap}
            className={cn(
              "group/tile relative flex min-h-[64px] flex-col items-start justify-between gap-2 rounded-[10px] p-3 text-left ink-border-2 transition-[background-color,box-shadow,transform] duration-200",
              selected
                ? "bg-sun shadow-[0_4px_0_0_#1b1f2a] -translate-y-0.5"
                : "bg-cream hover:bg-white hover:shadow-[0_3px_0_0_#1b1f2a]",
            )}
          >
            {icons && <OptionIcon id={o.id as OptionIconId} selected={selected} className="h-9 w-9" />}
            <span>
              <span className="block font-display text-[13px] font-bold leading-tight text-ink sm:text-sm">{o.label}</span>
              {o.hint && <span className="mt-0.5 block text-[11px] leading-tight text-ink-mute sm:text-xs">{o.hint}</span>}
            </span>
            {/* check mark as a sparkle */}
            <span
              aria-hidden
              className={cn(
                "absolute right-2 top-2 h-4 w-4 rounded-full ink-border-2 transition-all duration-200",
                selected ? "scale-100 bg-ink" : "scale-90 bg-transparent opacity-40",
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
