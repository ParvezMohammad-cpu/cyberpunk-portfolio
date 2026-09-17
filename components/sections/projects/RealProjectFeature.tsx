"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { supportsWebGL, ThreeErrorBoundary } from "@/components/three/webgl-utils";
import { ArchitectureNodeList } from "./case-study/ArchitectureNodeList";
import type { Project } from "@/lib/data/types";

const ServerArtifactScene = dynamic(() => import("./ServerArtifact3D"), {
  ssr: false,
  loading: () => null,
});

function StaticServerFallback() {
  return (
    <div
      aria-hidden
      className="border-neon-cyan/30 bg-black-glass/60 relative flex h-64 w-full items-center justify-center border sm:h-80"
    >
      <div className="border-neon-cyan/50 flex h-32 w-24 flex-col items-center justify-center gap-2 border">
        <span className="text-glow-cyan font-mono text-[0.6rem] tracking-[0.2em]">
          SERVER
        </span>
        <span className="bg-neon-cyan/40 h-1 w-12" />
        <span className="bg-neon-cyan/40 h-1 w-12" />
        <span className="bg-neon-cyan/40 h-1 w-12" />
      </div>
    </div>
  );
}

interface RealProjectFeatureProps {
  project: Project;
}

/**
 * Step 4.2/4.3 — REAL production artifact feature: floating 3D "server"
 * with architecture reveal on pointer/keyboard/touch, plus the adjacent
 * enterprise title/tags/metrics/"EXPLORE SYSTEM" CTA. The architecture node
 * list beneath the canvas mirrors the 3D hotspots so the same information
 * is reachable without WebGL, a mouse, or motion.
 */
export function RealProjectFeature({ project }: RealProjectFeatureProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(
    project.architectureNodes?.[0]?.id ?? null
  );
  const canRender3D =
    !prefersReducedMotion && typeof window !== "undefined" && supportsWebGL();

  const nodes = project.architectureNodes ?? [];

  return (
    <div className="border-border-dim bg-surface/40 grid gap-8 border p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        {canRender3D ? (
          <ThreeErrorBoundary fallback={<StaticServerFallback />}>
            <div className="h-64 w-full sm:h-80">
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 1.4, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
              >
                {nodes.length > 0 && (
                  <ServerArtifactScene
                    nodes={nodes}
                    activeId={activeId}
                    onActivate={setActiveId}
                  />
                )}
              </Canvas>
            </div>
          </ThreeErrorBoundary>
        ) : (
          <StaticServerFallback />
        )}

        {nodes.length > 0 && (
          <div className="mt-4">
            <ArchitectureNodeList
              nodes={nodes}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 text-left">
        <span className="text-fg-dim font-mono text-[0.65rem] tracking-[0.2em] uppercase">
          {project.id} · REAL
        </span>
        <h4 className="font-display text-glow-cyan text-2xl font-bold tracking-wide uppercase">
          {project.title}
        </h4>

        {project.metrics && (
          <dl className="grid grid-cols-2 gap-4 font-mono text-sm">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dd className="text-glow-cyan text-xl font-bold">{metric.value}</dd>
                <dt className="text-fg-dim text-[0.65rem] tracking-[0.15em] uppercase">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>
        )}

        <ul className="flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="border-neon-cyan/40 text-glow-cyan border px-2 py-0.5 font-mono text-[0.65rem] tracking-wide"
            >
              {tech}
            </li>
          ))}
        </ul>

        <Link
          href={`/projects/${project.slug}`}
          className="border-neon-cyan/60 text-glow-cyan hover:border-neon-cyan focus-visible:outline-neon-cyan mt-2 inline-flex w-fit items-center gap-2 border px-5 py-2.5 font-mono text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Explore System →
        </Link>
      </div>
    </div>
  );
}
