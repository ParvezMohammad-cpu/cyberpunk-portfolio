"use client";

import { useState } from "react";
import { GROWTH_STAGES } from "@/lib/data/journey";

export function GrowthArchitecture() {
  const [activeStageId, setActiveStageId] = useState(GROWTH_STAGES[0].id);
  const activeStage =
    GROWTH_STAGES.find((stage) => stage.id === activeStageId) ?? GROWTH_STAGES[0];

  return (
    <section
      className="border-border-dim bg-black-glass/70 mt-12 w-full max-w-5xl border p-5 text-left"
      aria-labelledby="growth-architecture-title"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-neon-magenta font-mono text-xs tracking-[0.3em] uppercase">
            Growth architecture
          </p>
          <h3
            id="growth-architecture-title"
            className="font-display mt-2 text-xl tracking-[0.2em] uppercase"
          >
            Responsibilities as an evolving system
          </h3>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Growth architecture stages"
        >
          {GROWTH_STAGES.map((stage) => (
            <button
              key={stage.id}
              id={`growth-tab-${stage.id}`}
              type="button"
              role="tab"
              aria-selected={stage.id === activeStage.id}
              aria-controls={`growth-panel-${stage.id}`}
              onClick={() => setActiveStageId(stage.id)}
              className={`border px-3 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan ${
                stage.id === activeStage.id
                  ? "border-neon-cyan text-neon-cyan"
                  : "border-border-dim text-fg-dim hover:border-fg-dim"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`growth-panel-${activeStage.id}`}
        role="tabpanel"
        aria-labelledby={`growth-tab-${activeStage.id}`}
        className="mt-6"
      >
        <p className="max-w-3xl text-sm leading-relaxed text-fg-dim">
          {activeStage.summary}
        </p>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {activeStage.flow.map((item, index) => (
            <li
              key={`${activeStage.id}-${item}`}
              className="border-border-dim bg-void/60 relative border p-4"
            >
              <span className="text-neon-cyan font-mono text-[0.65rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-display mt-2 text-sm tracking-[0.16em] uppercase">
                {item}
              </p>
              {index < activeStage.flow.length - 1 && (
                <span
                  aria-hidden
                  className="text-neon-cyan absolute top-1/2 -right-2 hidden -translate-y-1/2 md:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-fg-dim">{activeStage.note}</p>
      </div>

      <div className="sr-only">
        Static fallback: early stage is CODE to APPLICATION. Later stage is USERS
        to CLOUD/CDN to FRONTEND to API to DATA to OBSERVABILITY.
      </div>
    </section>
  );
}
