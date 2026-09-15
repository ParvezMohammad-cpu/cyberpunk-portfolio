import type { Experience } from "./types";

/**
 * Placeholder-but-structured employment history. Real dates/employers are
 * not yet available in this repository, so every entry is marked
 * `isPlaceholder: true`; the Journey section renders a visible "PLACEHOLDER"
 * tag on any entry with that flag so nobody mistakes this for verified data.
 */
export const EXPERIENCE: Experience[] = [
  {
    id: "experience-current",
    role: "Software Engineer",
    organization: "Placeholder — Company / Organization",
    location: "Placeholder — Location",
    startDate: "2024",
    summary:
      "Building enterprise applications and cloud-enabled systems across frontend, backend, and data layers.",
    contributions: [
      "Placeholder — replace with a real, measurable contribution.",
      "Placeholder — replace with a real architecture or delivery decision.",
      "Placeholder — replace with a real cross-team outcome.",
    ],
    technologies: ["React", "TypeScript", ".NET", "Azure", "SQL Server"],
    isPlaceholder: true,
  },
  {
    id: "experience-foundation",
    role: "Engineering Foundation",
    organization: "Placeholder — Education / Early Roles",
    startDate: "2022",
    endDate: "2024",
    summary:
      "Built the practical foundation in software engineering, from core language fundamentals to shipping first production features.",
    contributions: [
      "Placeholder — replace with a real early-career milestone.",
      "Placeholder — replace with a real technology or project learned.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "SQL"],
    isPlaceholder: true,
  },
];
