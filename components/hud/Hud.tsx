"use client";

import type { RefObject } from "react";
import type Lenis from "lenis";
import { useActiveSection } from "@/hooks/useActiveSection";
import { HudLogo } from "./HudLogo";
import { HudNavLinks } from "./HudNavLinks";
import { HudScrollIndicator } from "./HudScrollIndicator";
import { HudResumeLink } from "./HudResumeLink";
import { HudMobileMenu } from "./HudMobileMenu";

interface HudProps {
  lenisRef: RefObject<Lenis | null>;
}

/**
 * The minimal HUD navigation overlay: top-left wordmark, top-right bracket
 * nav (desktop) / hamburger menu (mobile), bottom scroll/section indicator,
 * and a persistent resume link. Fixed to the viewport, sitting above the
 * six scrollable sections.
 */
export function Hud({ lenisRef }: HudProps) {
  const activeSection = useActiveSection();

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <HudLogo />
        <div className="flex items-center gap-3">
          <HudNavLinks activeSection={activeSection} lenisRef={lenisRef} />
          <HudResumeLink />
          <HudMobileMenu activeSection={activeSection} lenisRef={lenisRef} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <HudScrollIndicator activeSection={activeSection} />
      </div>
    </div>
  );
}
