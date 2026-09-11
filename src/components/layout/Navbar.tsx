"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { navItems, cta } from "@/data/nav";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || open
            ? "bg-paper/95 border-b-[3px] border-ink shadow-[0_10px_30px_-20px_rgba(27,31,42,0.4)]"
            : "border-b-[3px] border-transparent bg-transparent",
        )}
        initial={false}
        animate={{ height: scrolled ? 62 : 76 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Основная навигация"
          className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10"
        >
          <a href="#top" className="rounded-md" aria-label="БЛИК — на главную" data-cursor="button">
            <Logo compact={scrolled} />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-cursor="button"
                  className="group relative inline-flex h-10 items-center rounded-full px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/6"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-4 bottom-1.5 h-[3px] origin-left scale-x-0 rounded-full bg-tangerine transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button href={cta.primary.href} size="sm">
                {cta.primary.label}
              </Button>
            </div>
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full ink-border bg-cream lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setOpen((v) => !v)}
              data-cursor="button"
            >
              <span
                className={cn(
                  "absolute h-[3px] w-5 rounded-full bg-ink transition-transform duration-300",
                  open ? "translate-y-0 rotate-45" : "-translate-y-[6px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[3px] w-5 rounded-full bg-ink transition-opacity duration-200",
                  open ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute h-[3px] w-5 rounded-full bg-ink transition-transform duration-300",
                  open ? "translate-y-0 -rotate-45" : "translate-y-[6px]",
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
