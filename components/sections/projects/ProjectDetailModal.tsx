import { Modal } from "@/components/ui/Modal";
import type { Project } from "@/lib/data/types";

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * Full project detail view, rendered inside the shared accessible `Modal`.
 * Structured as Problem / Approach / Implementation / Outcome so each
 * project reads as a case study, not just a tech-tag list.
 */
export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const titleId = `project-detail-${project.id}`;

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
            {project.id}
          </span>
          <h3 id={titleId} className="font-display text-glow-cyan text-2xl font-bold">
            {project.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-3 py-1.5 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
        >
          Close Module
        </button>
      </div>

      {project.isPlaceholder && (
        <p className="border-neon-magenta/60 text-glow-magenta mt-4 border-l-2 pl-3 font-mono text-xs leading-relaxed">
          Placeholder content — real project write-up not yet available.
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {project.problem && (
          <section>
            <h4 className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
              Problem
            </h4>
            <p className="font-mono text-fg mt-1 text-sm leading-relaxed">
              {project.problem}
            </p>
          </section>
        )}
        {project.approach && (
          <section>
            <h4 className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
              Approach
            </h4>
            <p className="font-mono text-fg mt-1 text-sm leading-relaxed">
              {project.approach}
            </p>
          </section>
        )}
        {project.outcome && (
          <section>
            <h4 className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
              Outcome
            </h4>
            <p className="font-mono text-fg mt-1 text-sm leading-relaxed">
              {project.outcome}
            </p>
          </section>
        )}
        <section>
          <h4 className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
            Technology Map
          </h4>
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="border-neon-cyan/40 text-glow-cyan border px-2 py-0.5 font-mono text-xs"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-glow-cyan text-glow-cyan focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
          >
            Live Demo
          </a>
        )}
        {project.sourceUrl && (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-neon-magenta/60 text-glow-magenta focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
          >
            Source Code
          </a>
        )}
      </div>
    </Modal>
  );
}
