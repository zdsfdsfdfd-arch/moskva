"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSnap } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "night" | "ghost-night";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<HTMLMotionProps<"a">, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 font-semibold tracking-tight whitespace-nowrap rounded-full ink-border transition-[box-shadow,background-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-tangerine text-ink shadow-[0_4px_0_0_#1b1f2a] hover:bg-[#ff7c45] hover:shadow-[0_6px_0_0_#1b1f2a] active:shadow-[0_2px_0_0_#1b1f2a]",
  secondary:
    "bg-cream text-ink shadow-[0_4px_0_0_#1b1f2a] hover:bg-white hover:shadow-[0_6px_0_0_#1b1f2a] active:shadow-[0_2px_0_0_#1b1f2a]",
  ghost:
    "bg-transparent text-ink border-ink/70 hover:bg-ink/5 shadow-none",
  night:
    "bg-sun text-ink border-sun shadow-[0_4px_0_0_rgba(0,0,0,0.5)] hover:bg-[#ffdb63] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.5)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.5)]",
  "ghost-night":
    "bg-transparent text-cream border-cream/60 hover:bg-cream/10 hover:border-cream shadow-none",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base sm:text-lg",
};

/** The little cartoon highlight that lives on every sticker-button. */
function Gleam() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-3 top-1.5 h-1.5 w-4 rounded-full bg-white/80 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-x-125"
    />
  );
}

function DropSpinner() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-bounce"
      fill="none"
    >
      <path
        d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 2.5-6.5 6-11Z"
        fill="#a9e4f7"
        stroke="#1b1f2a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="14" r="1.2" fill="#fff" />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      className,
      children,
      ...rest
    } = props;

    const classes = cn(base, variants[variant], sizes[size], className);
    const content = (
      <>
        <Gleam />
        {loading ? <DropSpinner /> : icon}
        <span className={cn(loading && "opacity-70")}>{children}</span>
        {!loading && iconRight}
      </>
    );

    const motionProps = {
      whileHover: { y: -2, rotate: -0.6 },
      whileTap: { scale: 0.96, y: 1, rotate: 0 },
      transition: springSnap,
    };

    if ("href" in props && props.href) {
      const { href, ...linkRest } = rest as ButtonAsLink;
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          data-cursor="button"
          {...motionProps}
          {...linkRest}
        >
          {content}
        </motion.a>
      );
    }

    const { disabled, type = "button", ...buttonRest } = rest as ButtonAsButton;
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        data-cursor="button"
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...(disabled || loading ? {} : motionProps)}
        {...(buttonRest as HTMLMotionProps<"button">)}
      >
        {content}
      </motion.button>
    );
  },
);
