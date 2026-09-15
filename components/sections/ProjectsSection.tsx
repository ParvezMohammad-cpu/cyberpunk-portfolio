"use client";

import { useMemo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import {
  PROJECTS,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
} from "@/lib/data/projects";
import type { Project, ProjectCategory, ProjectStatus } from "@/lib/data/types";
import { SectionShell } from "./SectionShell";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectDetailModal } from "./projects/ProjectDetailModal";
import { ProjectFilterBar } from "./projects/ProjectFilterBar";

/**
 * 03 — Projects (the BUILDER world). Structured project data drives
 * category/status filters, cards, and an accessible detail overlay. Falls
 * back to a clear empty state when a filter combination matches nothing.
 */
export function ProjectsSection() {
  const ref = useScrollReveal<HTMLElement>();
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [inspecting, setInspecting] = useState<Project | null>(null);

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (project) =>
          (category === "all" || project.category === category) &&
          (status === "all" || project.status === status)
      ),
    [category, status]
  );

  return (
    <SectionShell ref={ref} meta={SECTIONS[2]}>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        A selection of applications, tools, experiments, and products built
        to solve problems or explore ideas.
      </p>

      <div data-reveal className="mt-6 flex flex-col gap-3">
        <ProjectFilterBar
          label="Category"
          options={PROJECT_CATEGORIES}
          active={category}
          onChange={setCategory}
        />
        <ProjectFilterBar
          label="Status"
          options={PROJECT_STATUSES}
          active={status}
          onChange={setStatus}
        />
      </div>

      {filtered.length > 0 ? (
        <div
          data-reveal
          className="mt-8 grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onInspect={setInspecting}
            />
          ))}
        </div>
      ) : (
        <div
          data-reveal
          role="status"
          className="border-border-dim text-fg-dim mt-8 max-w-md border border-dashed p-6 font-mono text-sm"
        >
          No projects match this filter combination yet. Try a different
          category or status.
        </div>
      )}

      {inspecting && (
        <ProjectDetailModal
          project={inspecting}
          onClose={() => setInspecting(null)}
        />
      )}
    </SectionShell>
  );
}
