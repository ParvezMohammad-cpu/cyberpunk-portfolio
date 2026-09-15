"use client";

import { useState } from "react";
import type { LabModule } from "@/lib/data/types";

interface LabModuleCardProps {
  module: LabModule;
}

const STATUS_LABEL: Record<LabModule["status"], string> = {
  active: "ACTIVE",
  prototype: "PROTOTYPE",
  planned: "PLANNED",
};

/**
 * Lab module card. "Inspect" toggles an inline console-output panel
 * (keyboard/touch friendly via a real button + `aria-expanded`); "Launch"
 * opens `launchUrl` when present, or renders a disabled "coming soon"
 * state instead of a dead link.
 */
export function LabModuleCard({ module }: LabModuleCardProps) {
  const [inspecting, setInspecting] = useState(false);
  const panelId = `lab-console-${module.id}`;

  return (
    <article className="border-border-dim bg-surface/60 hover:border-neon-magenta/50 flex flex-col gap-3 border p-5 text-left transition-colors">
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.2em]">
        <span className="text-fg-dim uppercase">{module.id}</span>
        <span className="text-glow-magenta uppercase">
          {STATUS_LABEL[module.status]}
        </span>
      </div>

      <h3 className="font-display text-fg text-lg font-bold tracking-wide">
        {module.title}
      </h3>
      <p className="font-mono text-fg-dim text-sm leading-relaxed">
        {module.description}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        {module.launchUrl ? (
          <a
            href={module.launchUrl}
            className="border-neon-magenta/60 text-glow-magenta focus-visible:outline-neon-cyan hover:border-neon-magenta border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2"
          >
            Launch Module
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="border-border-dim text-fg-dim/60 cursor-not-allowed border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase"
          >
            Coming Soon
          </span>
        )}
        <button
          type="button"
          aria-expanded={inspecting}
          aria-controls={panelId}
          onClick={() => setInspecting((value) => !value)}
          className="text-fg-dim hover:text-fg focus-visible:outline-neon-cyan font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
        >
          {inspecting ? "Hide Console" : "Inspect Module"}
        </button>
      </div>

      {inspecting && (
        <pre
          id={panelId}
          className="border-border-dim bg-black-glass mt-1 overflow-x-auto border p-3 font-mono text-[0.7rem] text-neon-cyan"
        >
          {module.consoleOutput.join("\n")}
        </pre>
      )}
    </article>
  );
}
