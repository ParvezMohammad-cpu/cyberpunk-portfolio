import type { Project } from "./types";

/**
 * Placeholder-but-structured project data. These entries demonstrate the
 * full data shape (problem/approach/outcome, tech map, links) so the
 * Projects section renders real UI states (filters, detail overlay, missing
 * links) even before real project write-ups are dropped in. Replace with
 * verified project details when available — leave `isPlaceholder` in place
 * until then so the UI keeps labeling them clearly.
 */
export const PROJECTS: Project[] = [
  {
    id: "project-001",
    title: "System Console",
    category: "application",
    description:
      "A full-stack operations console for monitoring and managing distributed services.",
    problem:
      "Placeholder — describe the real operational problem this project solved.",
    approach:
      "Placeholder — describe how the system was designed and why.",
    outcome:
      "Placeholder — describe the measurable outcome once available.",
    technologies: ["React", "TypeScript", ".NET", "Azure", "SQL Server"],
    role: "Full-Stack Engineering",
    year: "2025",
    status: "in-progress",
    isPlaceholder: true,
  },
  {
    id: "project-002",
    title: "API Gateway Toolkit",
    category: "tool",
    description:
      "A reusable toolkit for authenticating, rate-limiting, and observing internal REST APIs.",
    problem: "Placeholder — describe the real problem this tool addressed.",
    approach: "Placeholder — describe the architecture and key decisions.",
    outcome: "Placeholder — describe the measurable outcome once available.",
    technologies: ["ASP.NET Core", "REST APIs", "Azure Functions", "CI/CD"],
    role: "Backend Engineering",
    year: "2024",
    status: "archived",
    sourceUrl: undefined,
    isPlaceholder: true,
  },
  {
    id: "project-003",
    title: "Architecture Simulator (prototype)",
    category: "experiment",
    description:
      "An early prototype for visually composing and stress-testing system architectures in the browser.",
    problem: "Placeholder — describe the exploratory question behind this experiment.",
    approach: "Placeholder — describe the interaction model being explored.",
    outcome: "Placeholder — this experiment is still evolving; no outcome yet.",
    technologies: ["React", "TypeScript", "Three.js"],
    role: "R&D / Personal Project",
    year: "2026",
    status: "experimental",
    isPlaceholder: true,
    featured: true,
  },
];

/** Distinct category labels present in the data, for the filter bar. */
export const PROJECT_CATEGORIES = Array.from(
  new Set(PROJECTS.map((project) => project.category))
);

/** Distinct status labels present in the data, for the filter bar. */
export const PROJECT_STATUSES = Array.from(
  new Set(PROJECTS.map((project) => project.status))
);
