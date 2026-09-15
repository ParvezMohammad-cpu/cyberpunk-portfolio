import type { ArchitectureLayer, CapabilityGroup, MetricLabel } from "./types";

/**
 * Engineering capability matrix, organized as system layers rather than a
 * flat skills list. See THEME.md / lib/sections.ts for the shared identity
 * model this content supports.
 */
export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "React",
      "Angular",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Responsive Interfaces",
      "Component Architecture",
      "State Management",
      "Accessibility",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      ".NET",
      "C#",
      "ASP.NET Core",
      "REST APIs",
      "Microservices",
      "Authentication",
      "Background Services",
      "Distributed Systems",
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Infrastructure",
    items: [
      "Microsoft Azure",
      "Azure Functions",
      "App Services",
      "Azure DevOps",
      "CI/CD",
      "Cloud Architecture",
      "Monitoring",
      "Deployment Automation",
    ],
  },
  {
    id: "data",
    label: "Data & Integration",
    items: [
      "SQL Server",
      "Entity Framework",
      "Data Modeling",
      "Query Optimization",
      "Caching",
      "Data Integration",
      "Reporting Systems",
    ],
  },
  {
    id: "practices",
    label: "Engineering Practices",
    items: [
      "System Design",
      "Clean Architecture",
      "Code Reviews",
      "Testing",
      "Performance Optimization",
      "Technical Documentation",
      "Agile Delivery",
    ],
  },
];

/**
 * The interactive layer map. Each layer is revealed via click/Enter/Space or
 * touch tap — never hover-only — so keyboard and touch users get the same
 * information as mouse users.
 */
export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "user",
    label: "User",
    description: "The entry point — every system decision traces back here.",
    technologies: ["UX Research", "Accessibility", "Design Systems"],
    experience:
      "Every layer below is shaped by how a real user reaches this application: what device, what network, what expectations.",
  },
  {
    id: "frontend",
    label: "Frontend Application",
    description: "React / Angular / TypeScript",
    technologies: ["React", "Angular", "TypeScript", "Component Architecture"],
    experience:
      "Builds responsive, accessible interfaces and manages client-side state without over-engineering the DOM.",
  },
  {
    id: "api",
    label: "API Layer",
    description: ".NET / REST / Services",
    technologies: [".NET", "ASP.NET Core", "REST APIs", "Microservices"],
    experience:
      "Designs authenticated, versioned REST APIs and background services that stay predictable under load.",
  },
  {
    id: "data",
    label: "Data & Services",
    description: "SQL / Azure / Integrations",
    technologies: ["SQL Server", "Entity Framework", "Microsoft Azure", "CI/CD"],
    experience:
      "Models data for correctness first, then performance — with cloud-native deployment and monitoring wired in from day one.",
  },
];

/**
 * Verified numeric metrics aren't available yet, so this section uses
 * capability labels instead, per the Phase 2 content guidance.
 */
export const ENGINEERING_METRICS: MetricLabel[] = [
  { label: "Full-Stack Delivery", value: "END-TO-END" },
  { label: "Cloud-Ready Systems", value: "AZURE-NATIVE" },
  { label: "Production Applications", value: "SHIPPED" },
  { label: "Interactive Experiences", value: "EXPLORATORY" },
];
