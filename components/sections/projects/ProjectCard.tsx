import type { Project } from "@/lib/data/types";

interface ProjectCardProps {
  project: Project;
  onInspect: (project: Project) => void;
}

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "ONLINE",
  archived: "ARCHIVED",
  experimental: "EXPERIMENTAL",
  "in-progress": "IN PROGRESS",
};

/**
 * A single project card. "VIEW PROJECT" opens the accessible detail
 * overlay (`onInspect`); live/source links (when present) are separate,
 * directly-focusable anchors rather than being buried inside a hover-only
 * preview.
 */
export function ProjectCard({ project, onInspect }: ProjectCardProps) {
  return (
    <article className="border-border-dim bg-surface/60 hover:border-neon-cyan/50 focus-within:border-neon-cyan/50 flex flex-col gap-3 border p-5 text-left transition-colors">
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.2em]">
        <span className="text-fg-dim uppercase">{project.id}</span>
        <span className="text-glow-cyan uppercase">
          {STATUS_LABEL[project.status]}
        </span>
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

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
        <dt className="text-fg-dim uppercase">Type</dt>
        <dd className="text-fg uppercase">{project.category}</dd>
        {project.role && (
          <>
            <dt className="text-fg-dim uppercase">Role</dt>
            <dd className="text-fg">{project.role}</dd>
          </>
        )}
        {project.year && (
          <>
            <dt className="text-fg-dim uppercase">Year</dt>
            <dd className="text-fg">{project.year}</dd>
          </>
        )}
      </dl>

      <ul className="flex flex-wrap gap-1.5" aria-label={`${project.title} technologies`}>
        {project.technologies.map((tech) => (
          <li
            key={tech}
            className="border-border-dim text-fg-dim border px-2 py-0.5 font-mono text-[0.6rem] tracking-wide"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onInspect(project)}
          className="border-neon-cyan/60 text-glow-cyan focus-visible:outline-neon-cyan hover:border-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Inspect System
        </button>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-dim hover:text-fg focus-visible:outline-neon-cyan font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
          >
            Live Demo
          </a>
        )}
        {project.sourceUrl ? (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-dim hover:text-fg focus-visible:outline-neon-cyan font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
          >
            Source Code
          </a>
        ) : (
          <span className="text-fg-dim/60 font-mono text-xs tracking-[0.2em] uppercase">
            Source unavailable
          </span>
        )}
      </div>
    </article>
  );
}
