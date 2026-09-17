"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ProjectMetric } from "@/lib/data/types";

const REVEAL_INTERVAL_MS = 2200;

/**
 * Step 4.5 — cinematic one-at-a-time metric reveal. Each number is tied to
 * an engineering decision via its `detail` text. Reduced motion shows every
 * metric at once instead of cycling, so the content is understandable
 * without relying on the timed animation.
 */
export function CinematicMetrics({ metrics }: { metrics: ProjectMetric[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || metrics.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % metrics.length);
    }, REVEAL_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [prefersReducedMotion, metrics.length]);

  if (metrics.length === 0) return null;

  if (prefersReducedMotion) {
    return (
      <section aria-labelledby="results-heading" className="grid gap-6 sm:grid-cols-2">
        <h4 id="results-heading" className="sr-only">
          Results
        </h4>
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="text-glow-cyan font-display text-4xl font-bold">
              {metric.value}
            </p>
            <p className="text-fg-dim mt-1 font-mono text-xs tracking-[0.2em] uppercase">
              {metric.label}
            </p>
            {metric.detail && (
              <p className="text-fg-dim/80 mt-2 font-mono text-[0.65rem] leading-relaxed">
                {metric.detail}
              </p>
            )}
          </div>
        ))}
      </section>
    );
  }

  const current = metrics[index];

  return (
    <section aria-labelledby="results-heading" className="flex flex-col items-center text-center">
      <h4 id="results-heading" className="sr-only">
        Results
      </h4>
      <p key={current.label} className="text-glow-cyan font-display text-6xl font-bold sm:text-7xl">
        {current.value}
      </p>
      <p className="text-fg-dim mt-2 font-mono text-sm tracking-[0.25em] uppercase">
        {current.label}
      </p>
      {current.detail && (
        <p className="text-fg-dim/80 mt-3 max-w-sm font-mono text-xs leading-relaxed">
          {current.detail}
        </p>
      )}
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {metrics.map((metric, dotIndex) => (
          <span
            key={metric.label}
            className={`h-1.5 w-1.5 rounded-full ${
              dotIndex === index ? "bg-neon-cyan" : "bg-border-dim"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
