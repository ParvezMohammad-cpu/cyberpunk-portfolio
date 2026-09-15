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
    <nav className="pointer-events-auto flex items-center gap-4 font-mono text-xs tracking-[0.2em]">
      {HUD_NAV_LINKS.map((link) => {
        const isActive = link.target === activeSection;
        return (
          <button
            key={link.label}
            onClick={() => handleClick(link.target)}
            className={`transition-colors duration-200 ${
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
