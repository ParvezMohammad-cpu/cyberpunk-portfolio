"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollRevealOptions {
  /** Vertical offset (px) the element travels in from. Default 60. */
  y?: number;
  /** Animation duration in seconds. Default 1. */
  duration?: number;
  /** Stagger between direct children with `[data-reveal]`. Default 0.08. */
  stagger?: number;
}

/**
 * Reusable scroll-triggered reveal animation. Attach the returned ref to a
 * section's root element; any direct descendants marked `data-reveal` will
 * fade + slide in as the section enters the viewport.
 *
 * This is the shared pattern Phase 2 content sections should reuse instead
 * of hand-rolling their own ScrollTrigger setup.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { y = 60, duration = 1, stagger = 0.08 } = options;
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      if (!ref.current) return;

      const targets = ref.current.querySelectorAll<HTMLElement>(
        "[data-reveal]"
      );
      const els = targets.length > 0 ? targets : ref.current;

      if (prefersReducedMotion) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        els,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: ref, dependencies: [prefersReducedMotion] }
  );

  return ref;
}
