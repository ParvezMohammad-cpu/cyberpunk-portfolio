import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LAB_STATUS_LABEL, PROJECT_TIER_LABEL, PROJECTS, getProjectBySlug } from "@/lib/data/projects";
import {
  BackToProjects,
  CaseStudySections,
  SourceSection,
  TechDecisions,
} from "@/components/sections/projects/case-study/CaseStudySections";
import { ArchitectureExplorer } from "@/components/sections/projects/case-study/ArchitectureExplorer";
import { CinematicMetrics } from "@/components/sections/projects/case-study/CinematicMetrics";
import { DeploymentSimulation } from "@/components/sections/projects/case-study/DeploymentSimulation";
import { ProjectDnaChart } from "@/components/sections/projects/case-study/ProjectDnaChart";
import { ScreenshotVault } from "@/components/sections/projects/demos/ScreenshotVault";
import { ArrowPuzzle } from "@/components/sections/projects/demos/ArrowPuzzle";
import { AimTrainer } from "@/components/sections/projects/demos/AimTrainer";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found — Parvez" };
  }

  return {
    title: `${project.title} — Parvez`,
    description: project.description,
  };
}

function DemoBlock({ kind }: { kind: NonNullable<(typeof PROJECTS)[number]["demo"]> }) {
  if (kind === "screenshot-vault") return <ScreenshotVault />;
  if (kind === "arrow-puzzle") return <ArrowPuzzle />;
  if (kind === "aim-trainer") return <AimTrainer />;
  return null;
}

/**
 * Full-page case study route (Step 4.3), replacing the old modal flow.
 * Server-rendered text (case study, metrics list, source/decisions) stays
 * available even without JS/WebGL; interactive pieces (architecture 3D,
 * cinematic reveal, deployment sim, embedded demos) are client islands.
 * `generateStaticParams` + `notFound()` give real deep-link/reload/404
 * handling instead of an intercepted modal route.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-void min-h-screen px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-4xl">
        <BackToProjects tier={project.tier} />

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
            <span className="text-fg-dim">{project.id}</span>
            <span className="text-glow-cyan">{PROJECT_TIER_LABEL[project.tier]}</span>
            {project.tier === "experiment" && project.labStatus && (
              <span className="border-neon-magenta/60 text-glow-magenta border px-2 py-0.5">
                {LAB_STATUS_LABEL[project.labStatus]}
              </span>
            )}
            {project.isPlaceholder && (
              <span className="border-neon-magenta/60 text-glow-magenta border px-2 py-0.5">
                Placeholder content
              </span>
            )}
          </div>

          {project.tier === "experiment" && (
            <p className="text-fg-dim mt-4 font-mono text-xs tracking-[0.2em] uppercase">
              LAB EXPERIMENTS — NOT EVERYTHING HERE IS FINISHED. THAT&apos;S THE POINT.
            </p>
          )}

          <h1 className="font-display text-glow-cyan mt-3 text-3xl font-bold tracking-[0.1em] uppercase sm:text-5xl">
            {project.title}
          </h1>
          <p className="font-mono text-fg-dim mt-4 max-w-2xl text-sm leading-relaxed">
            {project.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="border-neon-cyan/40 text-glow-cyan border px-2 py-0.5 font-mono text-xs"
              >
                {tech}
              </li>
            ))}
          </ul>
        </header>

        {project.tier === "real" && project.metrics && (
          <div className="border-border-dim mt-12 border p-6 sm:p-10">
            <CinematicMetrics metrics={project.metrics} />
          </div>
        )}

        {project.architectureNodes && project.architectureNodes.length > 0 && (
          <div className="mt-12">
            <ArchitectureExplorer nodes={project.architectureNodes} />
          </div>
        )}

        {project.deploymentStages && project.deploymentStages.length > 0 && (
          <div className="mt-12">
            <DeploymentSimulation stages={project.deploymentStages} />
          </div>
        )}

        {project.demo && (
          <div className="mt-12">
            <h4 className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase">
              Try It
            </h4>
            <div className="mt-4">
              <DemoBlock kind={project.demo} />
            </div>
          </div>
        )}

        {project.caseStudy && (
          <div className="mt-12">
            <h4 className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase">
              Case Study
            </h4>
            <div className="mt-4">
              <CaseStudySections project={project} />
            </div>
          </div>
        )}

        {project.dna && project.dna.length >= 3 && (
          <div className="mt-12">
            <ProjectDnaChart axes={project.dna} note={project.dnaNote} />
          </div>
        )}

        <div className="mt-12">
          <TechDecisions project={project} />
        </div>

        <div className="mt-12">
          <SourceSection project={project} />
        </div>

        <div className="mt-16 border-t border-border-dim pt-6">
          <BackToProjects tier={project.tier} />
        </div>
      </div>
    </main>
  );
}
