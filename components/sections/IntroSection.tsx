"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS, WORLDS } from "@/lib/sections";
import { GlitchText } from "@/components/ui/GlitchText";
import { SectionShell } from "./SectionShell";

/**
 * The opening in-page section (distinct from the boot sequence overlay).
 * Restates the core identity and the three-worlds structural model that
 * the rest of the site's navigation is built around.
 */
export function IntroSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <SectionShell ref={ref} meta={SECTIONS[0]}>
      <GlitchText
        as="h1"
        text="PARVEZ"
        data-reveal
        className="font-display text-glow-cyan text-4xl font-bold tracking-widest sm:text-6xl"
      />
      <div
        data-reveal
        className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3"
      >
        {WORLDS.map((world) => (
          <div
            key={world.number}
            className="border-border-dim bg-surface/60 flex flex-col gap-2 border p-4 text-left"
          >
            <span className="font-mono text-neon-cyan text-xs tracking-[0.3em]">
              {world.number}
            </span>
            <span className="font-display text-fg text-lg font-bold tracking-wide">
              {world.name}
            </span>
            <span className="font-mono text-fg-dim text-xs leading-relaxed">
              {world.description}
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
