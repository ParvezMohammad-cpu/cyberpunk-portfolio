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

/**
 * Step 4 "Proof Layer" top-level grouping: REAL (production/enterprise work),
 * BUILD (personal/playable projects), EXPERIMENT (Lab-adjacent prototypes).
 * This is distinct from `category`, which describes the kind of artifact.
 */
export type ProjectTier = "real" | "build" | "experiment";

/**
 * Only meaningful for `tier: "experiment"` entries. Deliberately separate
 * from `ProjectStatus` — the brief calls for LIVE / PROTOTYPE / RESEARCH /
 * ABANDONED as an explicit, text-labeled maturity signal for Lab-style work.
 */
export type LabExperimentStatus = "live" | "prototype" | "research" | "abandoned";

/** Optional interactive demo embedded in a project's case-study page. */
export type ProjectDemoKind =
  | "screenshot-vault"
  | "arrow-puzzle"
  | "aim-trainer";

export interface ProjectMetric {
  label: string;
  value: string;
  /** Extra context, e.g. "illustrative target — verify before publishing". */
  detail?: string;
}

/** One architecture-diagram node with recruiter-legible reasoning. */
export interface ArchitectureNode {
  id: string;
  label: string;
  purpose: string;
  why: string;
  result: string;
}

export interface DeploymentStage {
  id: string;
  label: string;
  description: string;
}

export interface TechDecision {
  question: string;
  answer: string;
}

/**
 * One axis of a project's "DNA" radar signature. `value` is a 0-100
 * qualitative design-emphasis score, NOT a benchmark measurement — axis
 * sets intentionally differ between project kinds (enterprise vs. game vs.
 * research), so scores should only ever be compared within the same axis
 * set, never across projects with different axes.
 */
export interface ProjectDnaAxis {
  axis: string;
  value: number;
}

/** The 8-part case-study schema every serious project is driven from. */
export interface CaseStudy {
  problem?: string;
  constraints?: string;
  approach?: string;
  architecture?: string;
  implementation?: string;
  challenges?: string;
  results?: string;
  learned?: string;
}

export interface Project {
  id: string;
  /** URL slug for the full-page case study at /projects/[slug]. */
  slug: string;
  title: string;
  category: ProjectCategory;
  tier: ProjectTier;
  description: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  technologies: string[];
  role?: string;
  year?: string;
  status: ProjectStatus;
  /** Only set for `tier: "experiment"` entries. */
  labStatus?: LabExperimentStatus;
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  /** Marks content that is a structural placeholder, not real project data. */
  isPlaceholder?: boolean;

  /** Headline metrics shown near the artifact + revealed cinematically. */
  metrics?: ProjectMetric[];
  /** 01-08 case-study schema content for the full-page detail route. */
  caseStudy?: CaseStudy;
  /** Rotate/zoom-able architecture diagram nodes (USERS -> ... -> stores). */
  architectureNodes?: ArchitectureNode[];
  /** CI/CD pipeline stages for the deployment simulation. */
  deploymentStages?: DeploymentStage[];
  /** "WHY X?" expandable technical-decision explanations. */
  techDecisions?: TechDecision[];
  /** Project DNA radar axes + qualitative scores. */
  dna?: ProjectDnaAxis[];
  /** Human-readable note on what the DNA scale/axes mean for this project. */
  dnaNote?: string;
  /** Which interactive BUILD demo (if any) this project embeds. */
  demo?: ProjectDemoKind;
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
