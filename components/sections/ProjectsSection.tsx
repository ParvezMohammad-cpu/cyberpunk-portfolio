"use client";

import { useEffect, useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { PROJECTS, PROJECT_TIERS } from "@/lib/data/projects";
import type { ProjectTier } from "@/lib/data/types";
import { SectionShell } from "./SectionShell";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectFilterBar } from "./projects/ProjectFilterBar";
import { RealProjectFeature } from "./projects/RealProjectFeature";
import { LAB_EXPERIMENTS } from "@/lib/data/lab-experiments";

const TIER_ORDER: ProjectTier[] = [...PROJECT_TIERS];

function isProjectTier(value: string | null): value is ProjectTier {
  return !!value && (PROJECT_TIERS as readonly string[]).includes(value);
}

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

  // Restore the tier that was active when navigating away to a case study,
  // so "back to project database" returns to the same filtered view. This
  // reads a browser-only query param, so it must run post-mount rather than
  // during the initial (possibly server) render — the same pattern used in
  // useBootSequenceVisibility.ts.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tier");
    if (isProjectTier(requested)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTier(requested);
    }
  }, []);

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
          label="Tier"
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
        <p className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">&gt; SEARCHING FOR UNREGISTERED MODULES...</p>
        <p className="text-neon-yellow font-mono text-xs tracking-[0.18em] uppercase">{LAB_EXPERIMENTS.length} UNREGISTERED EXPERIMENTS FOUND</p>
        <a href="#lab" className="mt-3 border border-neon-magenta px-5 py-3 font-mono text-xs tracking-[.2em] text-neon-magenta hover:bg-neon-magenta/10">RESTRICTED / EXPERIMENT LAB / ACCESS REQUIRED / ENTER</a>
      </div>
    </SectionShell>
  );
}
