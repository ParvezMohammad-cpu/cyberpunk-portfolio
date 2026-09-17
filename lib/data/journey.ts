export type JourneyNodeKind = "foundation" | "internship" | "engineer" | "now";

export interface JourneyNode {
  id: string;
  kind: JourneyNodeKind;
  label: string;
  eyebrow: string;
  period: string;
  title: string;
  organization: string;
  summary: string;
  signals: string[];
  technologies: string[];
  verified: boolean;
  verificationNote?: string;
}

export interface GrowthStage {
  id: string;
  label: string;
  summary: string;
  flow: string[];
  note: string;
}

export interface JourneyReflection {
  id: string;
  label: string;
  principle: string;
}

export const JOURNEY_NODES: JourneyNode[] = [
  {
    id: "foundation-iiitp",
    kind: "foundation",
    label: "FOUNDATION",
    eyebrow: "WHERE THE JOURNEY STARTED",
    period: "GRADUATION 2024",
    title: "B.Tech",
    organization: "IIITP",
    summary:
      "A stylized university schematic for the fundamentals: algorithms, programming, computer science, and problem solving.",
    signals: ["Algorithms", "Programming", "Computer Science", "Problem Solving"],
    technologies: ["Data Structures", "Operating Systems", "DBMS", "Networks"],
    verified: true,
    verificationNote:
      "Owner brief specifies IIITP, B.Tech, and graduation year 2024; degree branch/name expansion still needs owner confirmation.",
  },
  {
    id: "desi-qna",
    kind: "internship",
    label: "LEARNING → BUILDING",
    eyebrow: "EARLY SHIPPING SIGNAL",
    period: "JAN 2024 → JUN 2024",
    title: "SDE Intern",
    organization: "DESI QnA",
    summary:
      "The transition from learning to shipping: frontend implementation, authentication surfaces, reCAPTCHA, and responsive UI.",
    signals: ["Frontend", "Authentication", "reCAPTCHA", "Responsive UI"],
    technologies: ["JavaScript", "HTML", "CSS", "Application Logic"],
    verified: true,
    verificationNote:
      "Owner brief supplies Jan 2024–Jun 2024; chronology intentionally allows overlap with 2024 graduation.",
  },
  {
    id: "maq-software",
    kind: "engineer",
    label: "SYSTEM SCALE",
    eyebrow: "ENTERPRISE ENGINEERING SIGNAL",
    period: "DATE NOT VERIFIED",
    title: "Software Engineer",
    organization: "MAQ SOFTWARE",
    summary:
      "A larger system branch across .NET, Azure, TypeScript, frontend, Power Apps, and data concerns, without inventing employment dates.",
    signals: [".NET", "Azure", "TypeScript", "Frontend", "Power Apps", "Data"],
    technologies: [".NET", "Azure", "TypeScript", "React", "SQL Server", "Power Apps"],
    verified: true,
    verificationNote:
      "Role and organization come from the owner brief; no employment dates are present in this repository, so none are rendered.",
  },
  {
    id: "current-state",
    kind: "now",
    label: "CURRENT STATE",
    eyebrow: "PROFILE CONTENT LAST VERIFIED",
    period: "NOW",
    title: "Software Engineer",
    organization: "PARVEZ",
    summary:
      "AI, data, cloud, systems, games, and 3D converge toward the work being explored and built now.",
    signals: ["Building production systems", "Exploring AI", "Learning system design", "Building experiments"],
    technologies: ["AI", "Data", "Cloud", "Systems", "Games", "3D"],
    verified: false,
    verificationNote:
      "Current-state interests are drawn from the supplied brief and existing repo themes; owner should keep this data updated as profile content changes.",
  },
];

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: "early",
    label: "EARLY",
    summary: "Code becomes an application when ideas meet users and constraints.",
    flow: ["CODE", "APPLICATION"],
    note: "Conceptual growth sketch, not a production topology.",
  },
  {
    id: "later",
    label: "LATER",
    summary:
      "Responsibilities expand into user paths, cloud delivery, APIs, data, and operational feedback.",
    flow: ["USERS", "CLOUD/CDN", "FRONTEND", "API", "DATA", "OBSERVABILITY"],
    note: "Illustrative system diagram — not a claim about a specific employer architecture.",
  },
];

export const JOURNEY_REFLECTIONS: JourneyReflection[] = [
  {
    id: "system-fit",
    label: "PRINCIPLE 01",
    principle: "Choosing the right system is harder than just writing code.",
  },
  {
    id: "shipping-loop",
    label: "PRINCIPLE 02",
    principle: "Shipping is not the finish line; observability decides what happens next.",
  },
  {
    id: "right-sized-tech",
    label: "PRINCIPLE 03",
    principle: "Technically impressive is not always the right thing to build.",
  },
];

export const EVOLUTION_STEPS = [
  "DEVELOPER",
  "BUILDER",
  "ENGINEER",
  "SYSTEM THINKER",
  "?",
] as const;

export const JOURNEY_CONTENT_NOTES = [
  "IIITP / B.Tech / Graduation 2024, DESI QnA SDE Intern Jan 2024–Jun 2024, and MAQ SOFTWARE Software Engineer are taken from the owner brief.",
  "MAQ SOFTWARE employment dates, exact B.Tech expansion/branch, personal reflections, verified email, LinkedIn URL, and final resume PDF still need owner confirmation.",
  "Growth architecture and current-state copy are conceptual portfolio narrative, not a verified production topology or future employment claim.",
] as const;
