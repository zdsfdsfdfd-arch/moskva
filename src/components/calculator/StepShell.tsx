"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  title: string;
  active?: boolean;
  done?: boolean;
  muted?: boolean;
  summary?: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
};

/**
 * One conversational step: a numbered drop, the question, and either the
 * controls (active) or a one-line summary with an "изменить" link.
 */
export function StepShell({ index, title, active = true, done = false, muted = false, summary, onEdit, children }: Props) {
  return (
    <section
      aria-labelledby={`step-${index}-title`}
      className={cn(
        "relative rounded-[14px] transition-[opacity,background-color] duration-300",
        active ? "bg-cream p-4 ink-border shadow-[0_4px_0_0_#1b1f2a] sm:p-5" : "p-4 ink-border-2 bg-paper sm:p-5",
        muted && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={`step-${index}-title`} className="flex items-center gap-3 font-display text-lg font-bold text-ink sm:text-xl">
          <span
            aria-hidden
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ink-border-2",
              done ? "bg-teal text-ink" : active ? "bg-sun text-ink" : "bg-cream text-ink-mute",
            )}
          >
            {done ? "✓" : String(index).padStart(2, "0")}
          </span>
          {title}
        </h3>
        {!active && onEdit && (
          <button type="button" onClick={onEdit} className="text-sm font-semibold text-teal-deep underline-offset-4 hover:underline" data-cursor="button">
            изменить
          </button>
        )}
      </div>
      {active ? <div className="mt-4">{children}</div> : summary ? <p className="mt-2 pl-11 text-ink-soft">{summary}</p> : null}
    </section>
  );
}
