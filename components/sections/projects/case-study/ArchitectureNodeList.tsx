"use client";

import type { ArchitectureNode } from "@/lib/data/types";

interface ArchitectureNodeListProps {
  nodes: ArchitectureNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * Accessible DOM list mirroring the 3D architecture hotspots. This is the
 * source of truth for "select a component -> see Purpose/Why/Result" — it
 * works identically without WebGL, a mouse, or motion, satisfying Step 4.4's
 * requirement that the information not be gated behind the 3D view.
 */
export function ArchitectureNodeList({
  nodes,
  activeId,
  onSelect,
}: ArchitectureNodeListProps) {
  const activeNode = nodes.find((node) => node.id === activeId) ?? null;

  return (
    <div>
      <h4 className="text-fg-dim font-mono text-[0.65rem] tracking-[0.2em] uppercase">
        Components — select to inspect
      </h4>
      <ul className="mt-2 flex flex-wrap gap-2" role="list">
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              aria-pressed={activeId === node.id}
              onClick={() => onSelect(node.id)}
              className={`border px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
                activeId === node.id
                  ? "border-neon-magenta text-glow-magenta"
                  : "border-border-dim text-fg-dim hover:border-neon-cyan/40"
              }`}
            >
              {node.label}
            </button>
          </li>
        ))}
      </ul>
      {activeNode && (
        <dl className="border-border-dim mt-3 grid gap-2 border-l-2 pl-3 font-mono text-xs">
          <div>
            <dt className="text-fg-dim uppercase">Purpose</dt>
            <dd className="text-fg mt-0.5">{activeNode.purpose}</dd>
          </div>
          <div>
            <dt className="text-fg-dim uppercase">Why</dt>
            <dd className="text-fg mt-0.5">{activeNode.why}</dd>
          </div>
          <div>
            <dt className="text-fg-dim uppercase">Result</dt>
            <dd className="text-fg mt-0.5">{activeNode.result}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
