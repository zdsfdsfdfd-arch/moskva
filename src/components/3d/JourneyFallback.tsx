"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { City } from "@/components/illustrations/City";
import { Dirt } from "@/components/illustrations/Dirt";
import { useIsMobile } from "@/lib/hooks";

type Props = { progress: MotionValue<number>; staticEnd?: boolean };

/**
 * 2.5D version of the glass journey: the frame flies past the camera while
 * the city scales up and the grime fades. Layered DOM + transforms only.
 */
export function JourneyFallback({ progress, staticEnd = false }: Props) {
  const p = staticEnd ? undefined : progress;
  const cityScale = useTransform(progress, [0, 1], [1, 1.55]);
  const cityY = useTransform(progress, [0, 1], ["0%", "6%"]);
  const frameScale = useTransform(progress, [0, 0.6, 1], [1, 1.9, 3.4]);
  const frameOpacity = useTransform(progress, [0.55, 0.75], [1, 0]);
  const dirtOpacity = useTransform(progress, [0.15, 0.5], [1, 0]);
  const glassOpacity = useTransform(progress, [0.5, 0.65], [0.35, 0]);
  const roomOpacity = useTransform(progress, [0.4, 0.7], [1, 0]);
  const mobile = useIsMobile();
  // window hole: wider and lower on phones so the intro copy sits above it
  const hole = mobile ? { w: "84%", h: "46%", x: "50%", y: "62%" } : { w: "64%", h: "58%", x: "50%", y: "46%" };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: "900px" }}>
      {/* the city, growing toward us */}
      <motion.div className="absolute inset-0" style={p ? { scale: cityScale, y: cityY } : { scale: 1.55 }}>
        <City variant="day" seed={13} lite />
      </motion.div>

      {/* grime on the glass */}
      <motion.div className="absolute inset-0" style={p ? { opacity: dirtOpacity } : { opacity: 0 }}>
        <Dirt texture="dirt-lite.svg" />
      </motion.div>
      <motion.div className="absolute inset-0 bg-sky-pale" style={p ? { opacity: glassOpacity } : { opacity: 0 }} />

      {/* room: dark wall with a window hole, flying past */}
      <motion.div
        className="absolute inset-0"
        style={p ? { scale: frameScale, opacity: frameOpacity } : { opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "#2b3140",
            // window hole cut with a mask
            WebkitMaskImage:
              "linear-gradient(#000, #000), linear-gradient(#000, #000)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            WebkitMaskSize: `100% 100%, ${hole.w} ${hole.h}`,
            WebkitMaskPosition: `0 0, ${hole.x} ${hole.y}`,
            WebkitMaskRepeat: "no-repeat",
            opacity: 1,
          }}
        >
          <motion.div className="absolute inset-0" style={p ? { opacity: roomOpacity } : {}} />
        </motion.div>
        {/* frame around the hole */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[6px] border-[clamp(10px,1.6vw,22px)] border-cream shadow-[0_0_0_3px_#1b1f2a,inset_0_0_0_3px_#1b1f2a]"
          style={{ top: hole.y, width: hole.w, height: hole.h }}
        >
          <div className="absolute inset-y-0 left-1/2 w-[clamp(8px,1.2vw,16px)] -translate-x-1/2 bg-cream shadow-[0_0_0_3px_#1b1f2a]" />
        </div>
        {/* sill */}
        <div
          aria-hidden
          className="absolute left-1/2 h-[4%] -translate-x-1/2 rounded-b-[6px] bg-cream shadow-[0_0_0_3px_#1b1f2a]"
          style={{ top: `calc(${hole.y} + ${hole.h} / 2)`, width: `calc(${hole.w} + 6%)` }}
        />
      </motion.div>
    </div>
  );
}
