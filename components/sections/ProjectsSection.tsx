"use client";

import { useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { PROJECTS, PROJECT_TIERS } from "@/lib/data/projects";
import type { ProjectTier } from "@/lib/data/types";
import { SectionShell } from "./SectionShell";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectFilterBar } from "./projects/ProjectFilterBar";
import { RealProjectFeature } from "./projects/RealProjectFeature";

const TIER_ORDER: ProjectTier[] = [...PROJECT_TIERS];

/**
 * 03 — Projects, the Step 4 "Proof Layer". Structured project data drives
 * REAL / BUILD / EXPERIMENT tier filtering, artifact-style cards linking to
 * full-page case studies at /projects/[slug], and a featured 3D "artifact"
 * for the strongest REAL project. Filtering/navigation works with plain
 * scrolling or a direct link — there's no forced animation gate.
 */
export function ProjectsSection() {
  const ref = useScrollReveal<HTMLElement>();
  const [tier, setTier] = useState<ProjectTier | "all">("all");

  const filtered = useMemo(
    () => PROJECTS.filter((project) => tier === "all" || project.tier === tier),
    [tier]
  );

  const featuredReal = useMemo(
    () => PROJECTS.find((project) => project.tier === "real" && project.featured),
    []
  );

  return (
    <SectionShell ref={ref} meta={SECTIONS[2]}>
      <h3
        data-reveal
        className="font-display text-fg mt-4 text-3xl font-bold tracking-[0.18em] uppercase sm:text-5xl"
      >
        PROJECT DATABASE
      </h3>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        Don&apos;t tell people what I can build. Let them experience it.
        Every artifact below links to a full case study, not a popup.
      </p>

      <div data-reveal className="mt-6">
        <ProjectFilterBar
          label="Category"
          options={TIER_ORDER}
          active={tier}
          onChange={setTier}
        />
      </div>

      {featuredReal && (tier === "all" || tier === "real") && (
        <div data-reveal className="mt-10 w-full max-w-5xl">
          <RealProjectFeature project={featuredReal} />
        </div>
      )}

      {filtered.length > 0 ? (
        <div
          data-reveal
          className="mt-8 grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div
          data-reveal
          role="status"
          className="border-border-dim text-fg-dim mt-8 max-w-md border border-dashed p-6 font-mono text-sm"
        >
          No projects match this filter yet. Try a different category.
        </div>
      )}

      <div data-reveal className="mt-16 flex flex-col items-center gap-2">
        <p className="font-mono text-fg text-sm tracking-[0.2em] uppercase">
          PROJECT DATABASE COMPLETE
        </p>
        <p className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
          BUT...
        </p>
        <p className="font-mono text-fg-dim max-w-md text-xs leading-relaxed tracking-[0.15em] uppercase">
          There are things I build that don&apos;t belong in a portfolio.
        </p>
        <p className="text-glow-magenta font-mono text-sm tracking-[0.25em] uppercase">
          Welcome to the lab.
        </p>
      </div>
    </SectionShell>
  );
}
