import Link from "next/link";
import type { Project } from "@/lib/data/types";

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "ONLINE",
  archived: "ARCHIVED",
  experimental: "EXPERIMENTAL",
  "in-progress": "IN PROGRESS",
};

const LAB_STATUS_LABEL: Record<NonNullable<Project["labStatus"]>, string> = {
  live: "LIVE",
  prototype: "PROTOTYPE",
  research: "RESEARCH",
  abandoned: "ABANDONED",
};

interface ProjectCardProps {
  project: Project;
}

/**
 * "Object" style project artifact (Step 4 / 4.10-4.11). Essential
 * information — id, title, status, short context, technologies — is always
 * visible; hover/focus only adds a scanning-line flourish and an extra
 * metrics row, it never hides required content. The whole card is a real
 * link to the full-page case study, so it's directly reachable by keyboard,
 * touch, or screen reader, not just on hover.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const statusLabel =
    project.tier === "experiment" && project.labStatus
      ? LAB_STATUS_LABEL[project.labStatus]
      : STATUS_LABEL[project.status];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-artifact-card border-border-dim bg-surface/60 hover:border-neon-cyan/50 focus-visible:border-neon-cyan/50 focus-visible:outline-neon-cyan group relative flex flex-col gap-3 border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        aria-hidden
        className="project-artifact-scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-neon-cyan/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.2em]">
        <span className="text-fg-dim uppercase">{project.id}</span>
        <span className="text-glow-cyan uppercase">{statusLabel}</span>
      </div>

      {project.isPlaceholder && (
        <span className="border-neon-magenta/60 text-glow-magenta w-fit border px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase">
          Placeholder
        </span>
      )}

      <h3 className="font-display text-fg text-lg font-bold tracking-wide">
        {project.title}
      </h3>
      <p className="font-mono text-fg-dim text-sm leading-relaxed">
        {project.description}
      </p>

      {project.metrics && project.metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-xs">
          {project.metrics.slice(0, 2).map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <dt className="text-fg-dim uppercase">{metric.label}</dt>
              <dd className="text-glow-cyan font-bold">{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul
        className="flex flex-wrap gap-1.5"
        aria-label={`${project.title} technologies`}
      >
        {project.technologies.map((tech) => (
          <li
            key={tech}
            className="border-border-dim text-fg-dim border px-2 py-0.5 font-mono text-[0.6rem] tracking-wide"
          >
            {tech}
          </li>
        ))}
      </ul>

      <span className="border-neon-cyan/60 text-glow-cyan mt-2 w-fit border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors group-hover:border-neon-cyan">
        Inspect →
      </span>
    </Link>
  );
}
