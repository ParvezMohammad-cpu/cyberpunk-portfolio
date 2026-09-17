export type LabSector = "ai" | "build" | "visual" | "simulation";
export type LabStatus = "live" | "prototype" | "research" | "failed" | "abandoned";

export interface LabExperiment {
  id: string;
  slug: string;
  sector: LabSector;
  title: string;
  summary: string;
  status: LabStatus;
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  { id: "001", slug: "neural-system", sector: "ai", title: "Neural System", summary: "A local retrieval → context → generation teaching prototype.", status: "prototype" },
  { id: "002", slug: "parvez-arcade", sector: "build", title: "Parvez Arcade", summary: "Browser prototypes for Arrow Puzzle and Aim Trainer.", status: "live" },
  { id: "003", slug: "gear-system", sector: "visual", title: "Gear System", summary: "A procedural mechanical assembly inspection study.", status: "prototype" },
  { id: "004", slug: "physics-playground", sector: "simulation", title: "Physics Playground", summary: "Gravity drop and vacuum projectile visualisation.", status: "live" },
  { id: "005", slug: "distributed-system", sector: "simulation", title: "Distributed System", summary: "A deterministic, qualitative capacity model.", status: "prototype" },
  { id: "006", slug: "architecture-retrospective", sector: "simulation", title: "Architecture Retrospective", summary: "Illustrative sample retrospective — not a claim about shipped work.", status: "failed" },
  { id: "007", slug: "complexity-retrospective", sector: "build", title: "Complexity Retrospective", summary: "Illustrative sample retrospective — not a claim about shipped work.", status: "abandoned" },
];

export const LAB_SECTORS: LabSector[] = ["ai", "build", "visual", "simulation"];

export const STATUS_LABELS: Record<LabStatus, string> = {
  live: "LIVE",
  prototype: "PROTOTYPE",
  research: "RESEARCH",
  failed: "FAILED",
  abandoned: "ABANDONED",
};
