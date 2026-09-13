import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/basePath";
import type { DirtTextureName } from "@/lib/textures/dirt";

type DirtProps = {
  texture?: DirtTextureName;
  className?: string;
  style?: CSSProperties;
};

/** Grime texture as an image layer. Absolute-fill it over a city and clip it away to "wash". */
export function Dirt({ texture = "dirt.svg", className, style }: DirtProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath(`/textures/${texture}`)}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("pointer-events-none block h-full w-full select-none object-cover", className)}
      style={style}
    />
  );
}
