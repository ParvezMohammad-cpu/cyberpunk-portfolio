import type { LabModule } from "./types";

/**
 * Structured Lab module data. Statuses intentionally lean toward
 * `planned`/`prototype` — the Lab is meant to read as exploratory and
 * evolving, not a polished feature list. `launchUrl` is left undefined for
 * modules that don't have a real interactive build yet; the Lab card
 * renders a disabled "COMING SOON" launch state in that case instead of a
 * dead link.
 */
export const LAB_MODULES: LabModule[] = [
  {
    id: "architecture-simulator",
    title: "Architecture Simulator",
    description:
      "Design a distributed system by connecting services, queues, caches, and databases, then trace the request path.",
    category: "simulation",
    status: "prototype",
    featured: true,
    consoleOutput: [
      "> LOADING EXPERIMENT",
      "> INITIALIZING COMPONENT GRAPH",
      "> 08 NODES AVAILABLE",
      "> CONNECTIONS READY",
      "> USER INPUT REQUIRED",
    ],
  },
  {
    id: "system-design-playground",
    title: "System Design Playground",
    description:
      "A sandbox for sketching system design tradeoffs — consistency, availability, throughput — before committing to a real build.",
    category: "simulation",
    status: "planned",
    consoleOutput: [
      "> MODULE QUEUED",
      "> AWAITING DESIGN SPEC",
    ],
  },
  {
    id: "interactive-demos",
    title: "Interactive Demos",
    description:
      "Small, focused interaction studies — animation timing, gesture handling, and UI micro-experiments.",
    category: "experiment",
    status: "prototype",
    consoleOutput: [
      "> LOADING DEMO INDEX",
      "> 00 DEMOS PUBLISHED",
    ],
  },
  {
    id: "terminal",
    title: "Terminal",
    description:
      "An in-browser terminal emulator for exploring command-driven interfaces as a portfolio interaction model.",
    category: "terminal",
    status: "planned",
    consoleOutput: [
      "> SHELL NOT YET INITIALIZED",
    ],
  },
  {
    id: "3d-experiments",
    title: "3D Experiments",
    description:
      "Three.js / React Three Fiber sketches — particle fields, scene composition, and camera interaction studies.",
    category: "3d",
    status: "active",
    consoleOutput: [
      "> SCENE GRAPH ACTIVE",
      "> RENDERER: WEBGL",
      "> PARTICLE FIELD ONLINE",
    ],
  },
  {
    id: "physics-experiments",
    title: "Physics Experiments",
    description:
      "Simple simulated physics — collisions, constraints, and force fields — as a testbed for interactive systems.",
    category: "physics",
    status: "planned",
    consoleOutput: [
      "> MODULE QUEUED",
      "> AWAITING PHYSICS ENGINE",
    ],
  },
];
