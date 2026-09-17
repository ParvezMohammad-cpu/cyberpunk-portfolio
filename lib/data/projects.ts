import type { Project } from "./types";

/**
 * Step 4 "Proof Layer" project data. Every value that isn't independently
 * verified is explicitly marked `isPlaceholder` and/or carries a metric
 * `detail` calling it illustrative — none of the numbers here are invented
 * measured accomplishments. Replace with verified content and drop the
 * placeholder flags when real write-ups/metrics are available.
 */
export const PROJECTS: Project[] = [
  {
    id: "0x01",
    slug: "enterprise-platform",
    title: "Enterprise Platform",
    category: "system",
    tier: "real",
    description:
      "An enterprise web platform supporting a large daily user base with global edge delivery, a WAF-protected application tier, and a CI/CD pipeline through DEV/QA/UAT to PROD.",
    problem:
      "How do you build an enterprise platform capable of supporting 30,000+ daily users while keeping deployment and content management efficient?",
    approach:
      "Placeholder — describe the real design decisions once verified details are available.",
    outcome:
      "Placeholder — describe the measurable outcome once verified details are available.",
    technologies: [".NET", "TypeScript", "Azure"],
    role: "Full-Stack / Cloud Engineering",
    year: "2025",
    status: "live",
    isPlaceholder: true,
    featured: true,
    metrics: [
      {
        label: "DAILY USERS",
        value: "30K+",
        detail: "Illustrative target — verify against real usage data before publishing.",
      },
      {
        label: "AVAILABILITY",
        value: "99.99%",
        detail: "Illustrative target for the application tier — not an independently audited SLA figure.",
      },
      {
        label: "DEPLOYMENT TIME",
        value: "70% ↓",
        detail: "Illustrative — reduction relative to a prior manual release process, to verify.",
      },
      {
        label: "MANUAL UPDATES",
        value: "50% ↓",
        detail: "Illustrative — reduction in manual content/ops work, to verify.",
      },
    ],
    caseStudy: {
      problem:
        "How do you build an enterprise platform capable of supporting 30,000+ daily users while keeping deployment and content management efficient? [Illustrative target — verify against real usage data.]",
      constraints:
        "Placeholder — real constraints (budget, compliance, legacy systems, team size) to be filled in once verified.",
      approach:
        "Route traffic through a global edge layer in front of the application, enforce a web application firewall ahead of business logic, and keep persistence split across a relational store, blob storage, and centralized logs so each concern can scale independently.",
      architecture:
        "USERS → AZURE FRONT DOOR → WAF → APPLICATION → { SQL, BLOB, LOGS }. Front Door handles global routing and edge delivery; the WAF is a distinct policy layer in front of the application, not part of Front Door's routing function; SQL/Blob/Logs are separate concerns behind the application tier.",
      implementation:
        "Placeholder — describe real implementation details (services, APIs, data flows) once available.",
      challenges:
        "Placeholder — describe real engineering challenges and trade-offs encountered.",
      results:
        "Illustrative targets only: 30K+ daily users, 99.99% availability, 70% deployment-time reduction, 50% less manual update work. Treat as goals to verify with real telemetry before publishing as fact.",
      learned:
        "Placeholder — what you'd do differently or what this project taught you about building at this scale.",
    },
    architectureNodes: [
      {
        id: "users",
        label: "USERS",
        purpose: "Entry point for all client traffic.",
        why: "Represents the real-world load the system is designed to serve.",
        result: "N/A — traffic source, not a component being evaluated.",
      },
      {
        id: "front-door",
        label: "AZURE FRONT DOOR",
        purpose: "Global HTTP(S) load balancing, routing, and edge delivery.",
        why: "Improves latency and lets traffic be routed away from unhealthy backends. It does not, by itself, guarantee application availability — that also depends on the WAF, application, and data tiers behaving correctly.",
        result: "Contributes to the illustrative 99.99% availability target alongside the other tiers.",
      },
      {
        id: "waf",
        label: "WAF",
        purpose: "Inspects and filters requests for common web exploits before they reach the application.",
        why: "Separates edge routing from security policy enforcement — a distinct responsibility from Front Door's routing function.",
        result: "Reduces the application's exposure to malicious/malformed traffic.",
      },
      {
        id: "application",
        label: "APPLICATION",
        purpose: "Core business logic and API surface.",
        why: "Centralizes domain rules so the data tier can stay simple and swappable.",
        result: "Single place to reason about correctness and scaling of business logic.",
      },
      {
        id: "sql",
        label: "SQL",
        purpose: "Relational storage for structured, transactional data.",
        why: "Placeholder — document the real reasons this database was chosen (consistency needs, existing team skills, etc.).",
        result: "Placeholder — verified outcome once available.",
      },
      {
        id: "blob",
        label: "BLOB",
        purpose: "Object storage for large/unstructured assets.",
        why: "Keeps large binary content out of the relational database, which stays focused on structured data.",
        result: "Placeholder — verified outcome once available.",
      },
      {
        id: "logs",
        label: "LOGS",
        purpose: "Centralized application and infrastructure logging.",
        why: "Makes production issues diagnosable without direct server access.",
        result: "Placeholder — verified outcome once available.",
      },
    ],
    deploymentStages: [
      { id: "code", label: "CODE", description: "Changes are committed and pushed." },
      { id: "build", label: "BUILD", description: "The pipeline compiles and packages the application." },
      { id: "test", label: "TEST", description: "Automated checks run against the build artifact." },
      { id: "dev", label: "DEV", description: "Deployed to the development environment first." },
      { id: "qa", label: "QA", description: "Deployed to QA for verification." },
      { id: "uat", label: "UAT", description: "Deployed to user acceptance testing." },
      { id: "prod", label: "PROD", description: "Promoted to production once prior stages pass." },
    ],
    techDecisions: [
      {
        question: "WHY AZURE FRONT DOOR?",
        answer:
          "Global routing and edge delivery reduce latency for geographically distributed users and allow traffic to be steered away from unhealthy origins. It is one layer among several (WAF, application health) that together support overall availability — it does not guarantee availability on its own.",
      },
      {
        question: "WHY A SEPARATE WAF?",
        answer:
          "Security policy enforcement is a distinct concern from routing. Keeping it as its own layer means WAF rules can be tuned independently of routing configuration.",
      },
      {
        question: "WHY BLOB STORAGE?",
        answer:
          "Large or unstructured assets are cheaper and more efficient to serve from object storage than from a relational database, which stays focused on structured, transactional data.",
      },
      {
        question: "WHY THIS DATABASE?",
        answer:
          "Placeholder — document the real reasoning (consistency guarantees, existing operational experience, cost) once verified.",
      },
      {
        question: "WHY CI/CD THROUGH DEV/QA/UAT?",
        answer:
          "Promoting the same build artifact through progressively production-like environments catches issues earlier and reduces the risk of a change reaching production untested.",
      },
    ],
    dna: [
      { axis: "SCALABILITY", value: 85 },
      { axis: "SECURITY", value: 80 },
      { axis: "PERFORMANCE", value: 70 },
      { axis: "COMPLEXITY", value: 65 },
    ],
    dnaNote:
      "Scores are qualitative design-emphasis ratings (0-100) chosen for this write-up, not benchmark measurements. Only compare axes within this same project.",
  },
  {
    id: "0x02",
    slug: "api-gateway-toolkit",
    title: "API Gateway Toolkit",
    category: "tool",
    tier: "build",
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
    caseStudy: {
      problem: "Placeholder — describe the real problem this tool addressed.",
      approach: "Placeholder — describe the architecture and key decisions.",
      results: "Placeholder — describe the measurable outcome once available.",
    },
  },
  {
    id: "0x03",
    slug: "screenshot-scratchpad",
    title: "Screenshot Scratchpad",
    category: "tool",
    tier: "build",
    description:
      "A playable digital memory vault: drop screenshots in, watch deterministic oldest-first eviction kick in once the vault's limits are hit.",
    problem:
      "Personal screenshots pile up fast with no lightweight, local-only place to stage and prune them before filing them away.",
    approach:
      "Model the vault as a bounded per-tab store with hard MAX OBJECTS / MAX SIZE / MAX TABS limits, and evict the oldest item first whenever a new item would exceed a limit.",
    outcome:
      "A small, fully client-side demo that makes the eviction manager's behavior directly observable via a visible log and counters.",
    technologies: ["React", "TypeScript"],
    role: "Personal Project",
    year: "2026",
    status: "in-progress",
    demo: "screenshot-vault",
    caseStudy: {
      problem:
        "Demonstrate a bounded storage/eviction manager: MAX OBJECTS 30, MAX SIZE 10MB, MAX TABS 5, applied per tab.",
      constraints:
        "Client-only, no backend or persistent storage — everything lives in memory for the session and is reset on reload.",
      approach:
        "Each tab is an independent vault instance with its own object/size counters. Adding an item that would exceed MAX OBJECTS or MAX SIZE for that tab evicts the oldest item(s) first until it fits; MAX TABS caps how many tabs can exist at once.",
      implementation:
        "Generated placeholder thumbnails (no external uploads required) simulate 'screenshots'; users can optionally add their own images, which are validated for type/size locally and released via `URL.revokeObjectURL` when evicted or on unmount.",
      results:
        "Eviction order and vault state are visible live via counters and an eviction log, so the constraint-handling logic is directly demonstrable, not just described.",
      learned:
        "Placeholder — note anything learned building the eviction manager.",
    },
  },
  {
    id: "0x04",
    slug: "arrow-puzzle",
    title: "Arrow Puzzle",
    category: "game",
    tier: "build",
    description:
      "A small browser-playable prototype of the Arrow puzzle mechanic — not the full Android release, but a genuinely playable slice of it.",
    problem: "Placeholder — describe the original game's design goals.",
    approach:
      "A minimal directional-sliding puzzle: arrows move until they hit a wall or another arrow, and the level is solved when every arrow reaches its matching goal tile.",
    outcome:
      "A playable web prototype demonstrating core game logic (move validation, win detection, restart) with keyboard and touch support.",
    technologies: ["React", "TypeScript"],
    role: "Personal Project",
    year: "2026",
    status: "in-progress",
    demo: "arrow-puzzle",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "This is a web prototype of the Arrow puzzle mechanic, distinct from — and not claiming feature parity with — any existing Android release.",
      approach:
        "Directional sliding-block puzzle logic implemented from scratch for the browser: grid state, move validation, win condition, and restart.",
      results:
        "A genuinely playable small puzzle, not a placeholder CTA — solvable, restartable, and operable via keyboard or touch.",
    },
  },
  {
    id: "0x05",
    slug: "aim-trainer",
    title: "Aim Trainer",
    category: "game",
    tier: "build",
    description:
      "A click/tap reaction-time and accuracy trainer. Every result shown is computed live from your session's own input events — never hardcoded.",
    problem: "Placeholder — describe the motivation for building this.",
    approach:
      "Targets spawn at random positions inside a bounded play area; each hit/miss and its timestamp is recorded to compute reaction time, accuracy, and hit count at the end of a session.",
    outcome:
      "A short, replayable session that produces real per-session statistics, plus a keyboard-based practice mode for players who can't use a pointer.",
    technologies: ["React", "TypeScript"],
    role: "Personal Project",
    year: "2026",
    status: "in-progress",
    demo: "aim-trainer",
    isPlaceholder: true,
    caseStudy: {
      problem: "Demonstrate real-time input handling, timing, and stats computation in the browser.",
      approach:
        "Reaction time is measured from target spawn to the first valid hit on that target; accuracy is hits divided by total attempts (hits + misses) recorded during the session; target clicks are handled on the target element only to avoid double-counting with the play-area background.",
      results:
        "Displayed reaction time / accuracy / hit count are always computed from that session's actual events — example values like 187ms / 94% / 20/20 are illustrative only and never shown as real results.",
    },
  },
  {
    id: "0x06",
    slug: "architecture-simulator",
    title: "Architecture Simulator (prototype)",
    category: "experiment",
    tier: "experiment",
    description:
      "An early prototype for visually composing and stress-testing system architectures in the browser.",
    problem: "Placeholder — describe the exploratory question behind this experiment.",
    approach: "Placeholder — describe the interaction model being explored.",
    outcome: "Placeholder — this experiment is still evolving; no outcome yet.",
    technologies: ["React", "TypeScript", "Three.js"],
    role: "R&D / Personal Project",
    year: "2026",
    status: "experimental",
    labStatus: "prototype",
    isPlaceholder: true,
    featured: true,
    dna: [
      { axis: "EXPERIMENTATION", value: 90 },
      { axis: "COMPUTE", value: 55 },
      { axis: "UNCERTAINTY", value: 80 },
    ],
    dnaNote:
      "Research-project axes (experimentation/compute/uncertainty) are not directly comparable to the enterprise project's scalability/security/performance/complexity axes — different axis sets measure different things.",
  },
  {
    id: "0x07",
    slug: "physics-sandbox",
    title: "Physics Sandbox",
    category: "experiment",
    tier: "experiment",
    description:
      "An abandoned exploration of a browser-based rigid-body physics playground.",
    problem: "Placeholder — what question this experiment was exploring.",
    approach: "Placeholder — what was tried before it was set aside.",
    outcome: "Shelved before reaching a usable state; kept here as a record of the idea.",
    technologies: ["Three.js", "TypeScript"],
    role: "R&D / Personal Project",
    year: "2025",
    status: "experimental",
    labStatus: "abandoned",
    isPlaceholder: true,
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

/** The three Step 4 top-level tiers, in the order the brief presents them. */
export const PROJECT_TIERS = ["real", "build", "experiment"] as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
