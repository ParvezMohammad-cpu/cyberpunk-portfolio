"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { ENGINEERING_METRICS } from "@/lib/data/capabilities";
import { SectionShell } from "./SectionShell";
import { CapabilityGrid } from "./engineering/CapabilityGrid";
import { ArchitectureMap } from "./engineering/ArchitectureMap";

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
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        I build scalable applications and dependable systems across
        frontend, backend, cloud, data, and DevOps.
      </p>

      <CapabilityGrid />
      <ArchitectureMap />

      <dl
        data-reveal
        className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {ENGINEERING_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="border-border-dim flex flex-col gap-1 border-t pt-3 text-left"
          >
            <dt className="font-mono text-fg-dim text-[0.6rem] tracking-[0.2em] uppercase">
              {metric.label}
            </dt>
            <dd className="font-display text-glow-cyan text-sm font-bold tracking-wide">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
