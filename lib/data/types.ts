/**
 * Reusable Phase 2 content models. Sections read from these types + the
 * data files in this folder instead of hardcoding content in JSX, so future
 * updates (real project details, real employment history, etc.) only touch
 * data, never component markup.
 */

export type ProjectCategory =
  | "application"
  | "tool"
  | "experiment"
  | "game"
  | "system"
  | "open-source";

export type ProjectStatus = "live" | "archived" | "experimental" | "in-progress";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  technologies: string[];
  role?: string;
  year?: string;
  status: ProjectStatus;
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  /** Marks content that is a structural placeholder, not real project data. */
  isPlaceholder?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  contributions: string[];
  technologies: string[];
  /** Marks content that is a structural placeholder, not real work history. */
  isPlaceholder?: boolean;
}

export type LabModuleCategory =
  | "simulation"
  | "3d"
  | "ai"
  | "physics"
  | "terminal"
  | "experiment";

export type LabModuleStatus = "active" | "prototype" | "planned";

export interface LabModule {
  id: string;
  title: string;
  description: string;
  category: LabModuleCategory;
  status: LabModuleStatus;
  launchUrl?: string;
  featured?: boolean;
  /** Terminal-style console lines shown when the module is inspected. */
  consoleOutput: string[];
}

export interface CapabilityGroup {
  id: string;
  label: string;
  items: string[];
}

export interface ArchitectureLayer {
  id: string;
  label: string;
  description: string;
  technologies: string[];
  experience: string;
}

export interface MetricLabel {
  label: string;
  value: string;
}

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
}
