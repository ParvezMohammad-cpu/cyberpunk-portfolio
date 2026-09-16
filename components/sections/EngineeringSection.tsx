"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { SectionShell } from "./SectionShell";
import { EngineeringWorld } from "./engineering/EngineeringWorld";

/**
 * 02 — Engineering. Answers "what can Parvez build, and how does he think
 * about engineering problems?" via a capability matrix organized as system
 * layers, plus an interactive/keyboard-accessible architecture layer map.
 */
export function EngineeringSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <SectionShell ref={ref} meta={SECTIONS[1]}>
      <p
        data-reveal
        className="font-mono text-neon-cyan text-xs tracking-[0.35em] uppercase"
      >
        SYSTEM / ENGINEERING
      </p>
      <h3
        data-reveal
        className="font-display text-fg text-3xl font-bold tracking-[0.18em] uppercase sm:text-5xl"
      >
        I BUILD SYSTEMS.
      </h3>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        I turn complex requirements into scalable software: interfaces,
        APIs, cloud paths, data models, delivery pipelines, and measurable
        feedback loops that can survive real-world constraints.
      </p>

      <EngineeringWorld />
    </SectionShell>
  );
}
