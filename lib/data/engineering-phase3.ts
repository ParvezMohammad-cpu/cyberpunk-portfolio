export type EngineeringModuleId =
  | "frontend"
  | "backend"
  | "cloud"
  | "data"
  | "architecture"
  | "automation";

export interface EngineeringModule {
  id: EngineeringModuleId;
  label: string;
  signal: string;
  summary: string;
  technologies: string[];
  detail: string;
}

export interface EngineeringTimelineEntry {
  id: string;
  role: string;
  organization: string;
  signal: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
}

export interface MetricStory {
  id: string;
  label: string;
  before: string;
  after: string;
  note: string;
}

export type MindsetId = "understand" | "design" | "measure";

export interface MindsetStage {
  id: MindsetId;
  label: string;
  summary: string;
  signals: string[];
}

export const ENGINEERING_MODULES: EngineeringModule[] = [
  {
    id: "frontend",
    label: "FRONTEND",
    signal: "INTERFACE LAYER",
    summary: "Responsive, accessible React and Angular control surfaces.",
    technologies: ["React", "Angular", "TypeScript", "JavaScript", "HTML", "CSS"],
    detail:
      "Turns complex workflows into clear component systems with keyboard-accessible states, responsive layouts, and predictable client behavior.",
  },
  {
    id: "backend",
    label: "BACKEND",
    signal: "API CORE",
    summary: "Service boundaries, APIs, background work, and authentication.",
    technologies: [".NET", "C#", "ASP.NET Core", "Node.js", "REST APIs", "Microservices"],
    detail:
      "Shapes request lifecycles, validation, auth, and service contracts so applications remain maintainable as requirements expand.",
  },
  {
    id: "cloud",
    label: "CLOUD",
    signal: "AZURE EDGE",
    summary: "Azure-native delivery paths with guarded public entry points.",
    technologies: [
      "Azure",
      "Front Door",
      "WAF",
      "Azure DevOps",
      "CI/CD",
      "Application Services",
      "SQL",
      "Blob Storage",
    ],
    detail:
      "Models traffic from edge to application and data layers: Front Door, WAF policy, deployment automation, application hosting, SQL persistence, and Blob-backed assets.",
  },
  {
    id: "data",
    label: "DATA",
    signal: "STATE GRID",
    summary: "Schemas, integrations, reporting, and performance-aware queries.",
    technologies: ["SQL Server", "Entity Framework", "Data Modeling", "Caching", "Reporting"],
    detail:
      "Keeps data flows explicit: model the source of truth first, then tune query paths, cache boundaries, and integration contracts.",
  },
  {
    id: "architecture",
    label: "ARCHITECTURE",
    signal: "SYSTEM MAP",
    summary: "Requirements translated into reliable system shape.",
    technologies: ["System Design", "Clean Architecture", "Scalability", "Security"],
    detail:
      "Connects users, APIs, data, failure modes, deployment paths, and observability into a design that can be reasoned about before code is written.",
  },
  {
    id: "automation",
    label: "AUTOMATION",
    signal: "PIPELINE BUS",
    summary: "Repeatable delivery, verification, and operational feedback loops.",
    technologies: ["Azure DevOps", "CI/CD", "Testing", "Deployment Automation", "Monitoring"],
    detail:
      "Reduces manual handoffs with pipelines, checks, and deterministic release steps that keep teams focused on shipping safely.",
  },
];

export const ENGINEERING_TIMELINE: EngineeringTimelineEntry[] = [
  {
    id: "desi-qna",
    role: "SDE INTERN",
    organization: "DESI QnA",
    signal: "EARLY PRODUCTION SIGNAL",
    summary:
      "Source-limited role detail: internship experience represented as application engineering responsibility, not quantified production impact.",
    responsibilities: [
      "Worked across user-facing application behavior and implementation details.",
      "Translated product requirements into software tasks and testable UI/API flows.",
      "Practiced delivery discipline across debugging, review, and iteration loops.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "SQL", "Application Logic"],
  },
  {
    id: "maq-software",
    role: "SOFTWARE ENGINEERING",
    organization: "MAQ SOFTWARE",
    signal: "ENTERPRISE SYSTEM SIGNAL",
    summary:
      "Source-limited role detail: enterprise software experience represented through the repository's existing Azure, .NET, data, and DevOps capability themes.",
    responsibilities: [
      "Built and maintained enterprise application surfaces across frontend, backend, and data concerns.",
      "Reasoned about cloud deployment paths, SQL-backed workflows, and operational constraints.",
      "Supported implementation choices with documentation, review, and measurable quality checks.",
    ],
    technologies: ["React", "TypeScript", ".NET", "Azure", "SQL Server", "Azure DevOps"],
  },
];

export const METRIC_STORIES: MetricStory[] = [
  {
    id: "deployment",
    label: "DEPLOYMENT",
    before: "Manual handoff",
    after: "Pipeline-gated release",
    note: "Illustrative delivery story — exact deployment metrics are not verified in this repository.",
  },
  {
    id: "content",
    label: "CONTENT UPDATES",
    before: "Code-only edits",
    after: "Structured data swap",
    note: "Architecture metric — this portfolio already stores portfolio content in typed data modules.",
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    before: "Unknown usage",
    after: "Instrumented feedback loop",
    note: "Demo target — analytics are framed as a measurement pattern, not a current production claim.",
  },
];

export const MINDSET_STAGES: MindsetStage[] = [
  {
    id: "understand",
    label: "UNDERSTAND THE PROBLEM",
    summary: "Map the real operating environment before choosing tools.",
    signals: ["Requirements", "Constraints", "Users", "Traffic", "Failure modes"],
  },
  {
    id: "design",
    label: "DESIGN THE SYSTEM",
    summary: "Choose boundaries that make behavior predictable under change.",
    signals: ["Architecture", "APIs", "Data", "Security", "Scalability"],
  },
  {
    id: "measure",
    label: "MEASURE THE RESULT",
    summary: "Close the loop with observable outcomes and release feedback.",
    signals: ["Latency", "Availability", "Deployment time", "Usage", "Errors"],
  },
];
