"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { supportsWebGL, ThreeErrorBoundary } from "@/components/three/webgl-utils";
import { ArchitectureNodeList } from "./ArchitectureNodeList";
import type { ArchitectureNode } from "@/lib/data/types";

const ServerArtifactScene = dynamic(() => import("../ServerArtifact3D"), {
  ssr: false,
  loading: () => null,
});

/**
 * Step 4.4 full architecture explorer: rotate/zoom the 3D diagram (via
 * OrbitControls) and select components for Purpose/Why/Result. The DOM node
 * list below is the same data and the same interaction, so nothing here is
 * exclusively behind WebGL, a mouse, or motion.
 */
export function ArchitectureExplorer({ nodes }: { nodes: ArchitectureNode[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(nodes[0]?.id ?? null);
  const canRender3D =
    !prefersReducedMotion && typeof window !== "undefined" && supportsWebGL();

  if (nodes.length === 0) return null;

  return (
    <section aria-labelledby="architecture-heading">
      <h4
        id="architecture-heading"
        className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase"
      >
        Architecture
      </h4>
      <p className="text-fg-dim mt-1 font-mono text-xs leading-relaxed">
        USERS → AZURE FRONT DOOR → WAF → APPLICATION → SQL / BLOB / LOGS.
        Drag to rotate, scroll to zoom, or use the component list below.
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {canRender3D ? (
          <ThreeErrorBoundary
            fallback={
              <div className="border-border-dim bg-black-glass/60 flex h-72 items-center justify-center border font-mono text-xs text-fg-dim">
                3D renderer unavailable — use the component list.
              </div>
            }
          >
            <div className="border-border-dim h-72 w-full border sm:h-96">
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 1.6, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ServerArtifactScene
                  nodes={nodes}
                  activeId={activeId}
                  onActivate={setActiveId}
                />
                <OrbitControls
                  enablePan={false}
                  minDistance={3}
                  maxDistance={9}
                />
              </Canvas>
            </div>
          </ThreeErrorBoundary>
        ) : (
          <div className="border-border-dim bg-black-glass/60 flex h-72 items-center justify-center border p-4 text-center font-mono text-xs text-fg-dim">
            {prefersReducedMotion
              ? "3D view skipped (reduced motion enabled). Use the component list."
              : "3D view unavailable in this browser. Use the component list."}
          </div>
        )}

        <ArchitectureNodeList
          nodes={nodes}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </div>
    </section>
  );
}
