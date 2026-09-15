"use client";

import { useState } from "react";
import { ARCHITECTURE_LAYERS } from "@/lib/data/capabilities";

/**
 * Interactive layer map for the Engineering section. Each layer is a real
 * `<button>` — activated by click, Enter/Space, or touch tap — so the
 * "reveal related technologies and experience" behavior never depends on
 * hover. The active layer's panel is rendered inline below the stack.
 */
export function ArchitectureMap() {
  const [activeId, setActiveId] = useState(ARCHITECTURE_LAYERS[0].id);
  const activeLayer =
    ARCHITECTURE_LAYERS.find((layer) => layer.id === activeId) ??
    ARCHITECTURE_LAYERS[0];

  return (
    <div
      data-reveal
      className="border-border-dim bg-surface/40 mt-4 w-full max-w-2xl border p-4 text-left sm:p-6"
    >
      <h3 className="font-mono text-fg-dim mb-4 text-xs tracking-[0.3em] uppercase">
        System Layer Map
      </h3>
      <div
        role="tablist"
        aria-label="Architecture layers"
        className="flex flex-col gap-2"
      >
        {ARCHITECTURE_LAYERS.map((layer) => {
          const isActive = layer.id === activeId;
          return (
            <button
              key={layer.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`layer-panel-${layer.id}`}
              id={`layer-tab-${layer.id}`}
              onClick={() => setActiveId(layer.id)}
              className={`w-full border px-4 py-3 text-left font-mono text-sm tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
                isActive
                  ? "border-neon-cyan text-glow-cyan bg-black-glass/80"
                  : "border-border-dim text-fg-dim hover:border-neon-cyan/40 hover:text-fg"
              }`}
            >
              {layer.label}
              <span className="text-fg-dim ml-2 text-xs normal-case">
                {layer.description}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`layer-panel-${activeLayer.id}`}
        aria-labelledby={`layer-tab-${activeLayer.id}`}
        className="border-neon-cyan/30 bg-black-glass/60 mt-4 border-t-2 p-4"
      >
        <p className="font-mono text-fg text-sm leading-relaxed">
          {activeLayer.experience}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Related technologies">
          {activeLayer.technologies.map((tech) => (
            <li
              key={tech}
              className="border-neon-cyan/40 text-glow-cyan border px-2 py-1 font-mono text-xs tracking-wide"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
