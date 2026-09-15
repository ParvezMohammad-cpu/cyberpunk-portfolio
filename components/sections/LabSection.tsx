"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { LAB_MODULES } from "@/lib/data/lab-modules";
import { SectionShell } from "./SectionShell";
import { LabModuleCard } from "./lab/LabModuleCard";

/**
 * 04 — Lab (the EXPERIMENTER world). Structured, evolving experiments —
 * Architecture Simulator, System Design Playground, interactive demos,
 * terminal, 3D, and physics modules — each with launch/inspect states.
 */
export function LabSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <SectionShell ref={ref} meta={SECTIONS[3]}>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        A space for exploring AI, 3D, physics, simulations, game
        development, creative coding, and new interfaces.
      </p>

      <div
        data-reveal
        className="mt-8 grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {LAB_MODULES.map((module) => (
          <LabModuleCard key={module.id} module={module} />
        ))}
      </div>
    </SectionShell>
  );
}
