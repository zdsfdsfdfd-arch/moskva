"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/** SSR-safe media query. Returns `fallback` on the server / first paint. */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useIsCoarsePointer = () => useMediaQuery("(pointer: coarse)", false);
export const useIsFinePointer = () => useMediaQuery("(pointer: fine)", false);
export const useIsMobile = () => useMediaQuery("(max-width: 767px)", false);

/** SSR-safe reduced-motion flag: false on the server and first paint, then the real value. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/** Fires when the user scrolls very fast; used for the mascot's reactions. */
export const FAST_SCROLL_EVENT = "blik:fast-scroll";

export function useFastScroll(onFast: () => void) {
  useEffect(() => {
    const handler = () => onFast();
    window.addEventListener(FAST_SCROLL_EVENT, handler);
    return () => window.removeEventListener(FAST_SCROLL_EVENT, handler);
  }, [onFast]);
}

let webglCache: boolean | null = null;
function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    webglCache = Boolean(gl);
  } catch {
    webglCache = false;
  }
  return webglCache;
}
const noopSubscribe = () => () => {};

/** WebGL availability, detected once on the client; null during SSR. */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
}
