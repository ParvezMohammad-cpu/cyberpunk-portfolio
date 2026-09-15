import { SECTIONS, type SectionId } from "@/lib/sections";

interface HudScrollIndicatorProps {
  activeSection: SectionId;
}

/**
 * Bottom-center `SCROLL TO EXPLORE` hint plus a live `01 / 06` counter that
 * tracks the currently active section.
 */
export function HudScrollIndicator({ activeSection }: HudScrollIndicatorProps) {
  const index = SECTIONS.findIndex((section) => section.id === activeSection);
  const current = SECTIONS[Math.max(index, 0)];

  return (
    <div className="pointer-events-none flex flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.3em] text-fg-dim uppercase">
      <span>Scroll to explore</span>
      <span className="text-glow-cyan text-xs">
        {current.number} / {SECTIONS.length.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
