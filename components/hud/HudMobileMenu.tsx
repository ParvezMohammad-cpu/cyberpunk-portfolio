"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type Lenis from "lenis";
import { SECTIONS, HUD_NAV_LINKS, RESUME_HREF, type SectionId } from "@/lib/sections";

interface HudMobileMenuProps {
  activeSection: SectionId;
  lenisRef: RefObject<Lenis | null>;
}

/**
 * Full-screen mobile navigation panel. Hidden above `sm` (desktop uses
 * `HudNavLinks` instead). The trigger is a labeled hamburger button
 * (`aria-expanded`/`aria-controls`); the panel itself lists all six
 * sections plus the resume action, closes on `Escape`, and restores focus
 * to the trigger button when dismissed.
 */
export function HudMobileMenu({ activeSection, lenisRef }: HudMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleNavigate = (target: SectionId) => {
    setOpen(false);
    lenisRef.current?.scrollTo(`#${target}`, { duration: 1.4 });
  };

  return (
    <div className="pointer-events-auto sm:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
        className="border-neon-cyan/60 text-glow-cyan focus-visible:outline-neon-cyan flex h-11 w-11 items-center justify-center border font-mono text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className="bg-void/98 fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 p-8"
        >
          <nav aria-label="Section navigation" className="flex flex-col items-center gap-5">
            {SECTIONS.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavigate(section.id)}
                  className={`focus-visible:outline-neon-cyan font-display text-xl tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    isActive ? "text-glow-cyan" : "text-fg-dim"
                  }`}
                >
                  {section.number} {section.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col items-center gap-3">
            <span className="font-mono text-fg-dim text-[0.65rem] tracking-[0.2em] uppercase">
              {HUD_NAV_LINKS.map((link) => link.label).join(" / ")}
            </span>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Parvez's resume"
              className="border-neon-magenta/60 text-glow-magenta focus-visible:outline-neon-cyan min-h-11 border px-4 py-2 font-mono text-xs tracking-[0.25em] uppercase focus-visible:outline focus-visible:outline-2"
            >
              Resume ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
