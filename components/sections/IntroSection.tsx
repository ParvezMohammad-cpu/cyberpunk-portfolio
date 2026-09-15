"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS, WORLDS } from "@/lib/sections";
import { GlitchText } from "@/components/ui/GlitchText";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionShell } from "./SectionShell";

/**
 * The opening in-page section (distinct from the boot sequence overlay).
 * Restates the core identity and the three-worlds structural model that
 * the rest of the site's navigation is built around, then offers two
 * primary next actions into the rest of the portfolio.
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
      <p
        data-reveal
        className="font-mono text-fg-dim text-xs tracking-[0.3em] uppercase"
      >
        Software Engineer
      </p>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-md text-sm leading-relaxed"
      >
        I design and build reliable software systems, interactive products,
        and experimental technology.
      </p>

      <div data-reveal className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <NeonButton href="#engineering">Explore Engineering</NeonButton>
        <NeonButton href="#projects" variant="magenta">
          View Selected Work
        </NeonButton>
      </div>

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
