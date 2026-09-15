"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Initializes Lenis smooth scrolling and keeps it in sync with GSAP's
 * ScrollTrigger via the shared `gsap.ticker`. Returns a ref to the Lenis
 * instance so callers (e.g. the HUD nav) can drive `lenis.scrollTo(...)`.
 *
 * Respects `prefers-reduced-motion` by skipping smooth-scroll easing.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    const lenis = new Lenis({
      autoRaf: false,
      duration: prefersReducedMotion ? 0.1 : 1.2,
      smoothWheel: !prefersReducedMotion,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return lenisRef;
}
