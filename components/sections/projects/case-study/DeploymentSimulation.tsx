"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { DeploymentStage } from "@/lib/data/types";

const STAGE_DURATION_MS = 900;

type RunState = "idle" | "running" | "done";

/**
 * Step 4.6 — deployment pipeline simulation. Advances a "packet" through
 * CODE -> BUILD -> TEST -> DEV/QA/UAT -> PROD with start/replay/reset
 * controls. This is explicitly a simulation, not a live deployment or a
 * measurement of any real production improvement — the copy below says so.
 * Timers are cleaned up on stop/unmount; reduced motion keeps the same
 * stepped logic but skips the pulsing-packet animation.
 */
export function DeploymentSimulation({ stages }: { stages: DeploymentStage[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(-1);
  const [runState, setRunState] = useState<RunState>("idle");
  const intervalRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const start = () => {
    clearTimer();
    setStageIndex(0);
    setRunState("running");

    intervalRef.current = window.setInterval(() => {
      setStageIndex((current) => {
        const next = current + 1;
        if (next >= stages.length - 1) {
          clearTimer();
          setRunState("done");
          return stages.length - 1;
        }
        return next;
      });
    }, STAGE_DURATION_MS);
  };

  const reset = () => {
    clearTimer();
    setStageIndex(-1);
    setRunState("idle");
  };

  if (stages.length === 0) return null;

  return (
    <section aria-labelledby="deployment-heading">
      <h4
        id="deployment-heading"
        className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase"
      >
        Deployment Simulation
      </h4>
      <p className="text-fg-dim mt-1 font-mono text-xs leading-relaxed">
        A simulation of the CI/CD pipeline shape used on this project — not a
        live deployment, and not a measurement of this session&apos;s
        performance.
      </p>

      <ol className="mt-4 flex flex-wrap items-center gap-2" aria-label="Pipeline stages">
        {stages.map((stage, index) => {
          const complete = index <= stageIndex;
          const current = index === stageIndex && runState === "running";
          return (
            <li key={stage.id} className="flex items-center gap-2">
              <div
                className={`border px-3 py-2 font-mono text-xs tracking-[0.15em] uppercase transition-colors ${
                  complete
                    ? "border-neon-cyan text-glow-cyan"
                    : "border-border-dim text-fg-dim"
                } ${current && !prefersReducedMotion ? "animate-pulse" : ""}`}
                aria-current={current ? "step" : undefined}
              >
                {stage.label} {complete ? "✓" : ""}
              </div>
              {index < stages.length - 1 && (
                <span aria-hidden className="text-fg-dim">
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <p role="status" className="text-fg-dim mt-3 font-mono text-xs">
        {runState === "idle" && "Simulation idle. Press Start to run it."}
        {runState === "running" &&
          `Deploying: ${stages[Math.max(stageIndex, 0)]?.label}. ${
            stages[Math.max(stageIndex, 0)]?.description ?? ""
          }`}
        {runState === "done" &&
          "All stages complete (simulated). Deployment-time reduction claims are illustrative — see Results."}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={start}
          disabled={runState === "running"}
          className="border-neon-cyan/60 text-glow-cyan hover:border-neon-cyan focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {runState === "done" ? "Replay" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
