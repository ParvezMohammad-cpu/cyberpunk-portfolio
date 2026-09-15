"use client";

import type { RefObject } from "react";
import type Lenis from "lenis";
import { HUD_NAV_LINKS, type SectionId } from "@/lib/sections";

interface HudNavLinksProps {
  activeSection: SectionId;
  lenisRef: RefObject<Lenis | null>;
}

/**
 * Top-right bracket-styled nav links, e.g. `[ WORK ]  [ LAB ]  [ ABOUT ]`.
 * Each link smooth-scrolls (via Lenis) to its mapped section and highlights
 * itself when that section is active.
 */
export function HudNavLinks({ activeSection, lenisRef }: HudNavLinksProps) {
  const handleClick = (target: SectionId) => {
    lenisRef.current?.scrollTo(`#${target}`, { duration: 1.4 });
  };

  return (
    <nav
      aria-label="Section groups"
      className="pointer-events-auto hidden items-center gap-4 font-mono text-xs tracking-[0.2em] sm:flex"
    >
      {HUD_NAV_LINKS.map((link) => {
        const isActive = link.target === activeSection;
        return (
          <button
            key={link.label}
            onClick={() => handleClick(link.target)}
            aria-current={isActive ? "true" : undefined}
            className={`transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
              isActive ? "text-glow-cyan" : "text-fg-dim hover:text-fg"
            }`}
          >
            [ {link.label} ]
          </button>
        );
      })}
    </nav>
  );
}
