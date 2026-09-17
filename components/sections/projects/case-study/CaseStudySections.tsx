import Link from "next/link";
import type { Project } from "@/lib/data/types";

const SCHEMA: { key: keyof NonNullable<Project["caseStudy"]>; number: string; label: string }[] = [
  { key: "problem", number: "01", label: "Problem" },
  { key: "constraints", number: "02", label: "Constraints" },
  { key: "approach", number: "03", label: "Approach" },
  { key: "architecture", number: "04", label: "Architecture" },
  { key: "implementation", number: "05", label: "Implementation" },
  { key: "challenges", number: "06", label: "Challenges" },
  { key: "results", number: "07", label: "Results" },
  { key: "learned", number: "08", label: "What I Learned" },
];

/**
 * Step 4.11/4.12 — the consistent 01-08 case-study schema, driven entirely
 * from typed data (`project.caseStudy`) instead of a hardcoded layout per
 * project. Sections without content are skipped rather than rendered empty,
 * and sections that only have placeholder text still render — that
 * transparency is the point, not something to hide.
 */
export function CaseStudySections({ project }: { project: Project }) {
  const caseStudy = project.caseStudy;
  if (!caseStudy) return null;

  return (
    <ol className="grid gap-8 sm:grid-cols-2">
      {SCHEMA.map(({ key, number, label }) => {
        const content = caseStudy[key];
        if (!content) return null;
        return (
          <li key={key} className="border-border-dim border-l-2 pl-4">
            <span className="text-fg-dim font-mono text-[0.65rem] tracking-[0.25em] uppercase">
              {number}
            </span>
            <h4 className="font-display text-glow-cyan mt-1 text-sm font-bold tracking-[0.15em] uppercase">
              {label}
            </h4>
            <p className="font-mono text-fg mt-2 text-sm leading-relaxed">
              {content}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function TechDecisions({ project }: { project: Project }) {
  if (!project.techDecisions || project.techDecisions.length === 0) return null;

  return (
    <section aria-labelledby="tech-decisions-heading">
      <h4
        id="tech-decisions-heading"
        className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase"
      >
        Technical Decisions
      </h4>
      <p className="text-fg-dim mt-1 font-mono text-xs leading-relaxed">
        Selected trade-offs, not a code dump. Expand any question below.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {project.techDecisions.map((decision) => (
          <details
            key={decision.question}
            className="border-border-dim group border p-3 open:border-neon-cyan/40"
          >
            <summary className="text-glow-cyan focus-visible:outline-neon-cyan cursor-pointer font-mono text-xs tracking-[0.15em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              {decision.question}
            </summary>
            <p className="font-mono text-fg-dim mt-2 text-sm leading-relaxed">
              {decision.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SourceSection({ project }: { project: Project }) {
  return (
    <section aria-labelledby="source-heading">
      <h4
        id="source-heading"
        className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase"
      >
        Source
      </h4>
      {project.sourceUrl ? (
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-neon-cyan/60 text-glow-cyan hover:border-neon-cyan focus-visible:outline-neon-cyan mt-3 inline-flex w-fit border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
        >
          Github →
        </a>
      ) : (
        <p className="text-fg-dim mt-3 font-mono text-xs tracking-[0.15em] uppercase">
          Source not published — private repository or pending release.
        </p>
      )}
    </section>
  );
}

export function BackToProjects({ tier }: { tier?: string }) {
  const href = tier ? `/#projects?tier=${tier}` : "/#projects";
  return (
    <Link
      href={href}
      className="text-fg-dim hover:text-fg focus-visible:outline-neon-cyan inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
    >
      ← Back to Project Database
    </Link>
  );
}
