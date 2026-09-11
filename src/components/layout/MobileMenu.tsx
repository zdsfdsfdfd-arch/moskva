"use client";

import { AnimatePresence, motion } from "framer-motion";
import { navItems, cta } from "@/data/nav";
import { Button } from "@/components/ui/Button";
import { Klir } from "@/components/illustrations/Klir";
import { brand } from "@/data/brand";

type Props = { open: boolean; onClose: () => void };

export function MobileMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
          className="fixed inset-0 z-40 flex flex-col bg-paper pt-[76px] lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* a window sash sliding open: the ink line moves down with the reveal */}
          <div aria-hidden className="absolute inset-x-0 top-[76px] h-[3px] bg-ink" />
          <nav className="flex flex-1 flex-col justify-between px-6 pb-8 pt-8">
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between border-b-2 border-ink/15 py-4 font-display text-3xl font-bold tracking-tight text-ink"
                  >
                    {item.label}
                    <span aria-hidden className="text-tangerine">
                      →
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="relative mt-8 flex items-end justify-between gap-4">
              <div className="space-y-3">
                <Button href={cta.primary.href} size="lg" onClick={onClose} className="w-full">
                  {cta.primary.label}
                </Button>
                <p className="text-sm text-ink-mute">{brand.city} • выезд по городу и области</p>
              </div>
              <Klir pose="wave" expression="happy" className="w-24 shrink-0" />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
