/**
 * Shared identity + navigation constants for the site.
 * See THEME.md for the full visual language documentation.
 */

export type SectionId =
  | "intro"
  | "engineering"
  | "projects"
  | "lab"
  | "journey"
  | "contact";

export interface SectionMeta {
  id: SectionId;
  number: string;
  label: string;
  tagline: string;
}

/** The six locked, ordered sections of the single-page experience. */
export const SECTIONS: SectionMeta[] = [
  {
    id: "intro",
    number: "01",
    label: "INTRO",
    tagline: "ENGINEER \u2192 BUILDER \u2192 EXPERIMENTER",
  },
  {
    id: "engineering",
    number: "02",
    label: "ENGINEERING",
    tagline: "SYSTEMS, PRODUCTS, AND THE ENGINEERING BEHIND THEM",
  },
  {
    id: "projects",
    number: "03",
    label: "PROJECTS",
    tagline: "THINGS I BUILT FROM IDEA TO EXECUTION",
  },
  {
    id: "lab",
    number: "04",
    label: "LAB",
    tagline: "EXPERIMENTS IN PROGRESS",
  },
  {
    id: "journey",
    number: "05",
    label: "JOURNEY",
    tagline: "THE PATH FROM CURIOSITY TO CRAFT",
  },
  {
    id: "contact",
    number: "06",
    label: "CONTACT",
    tagline: "OPEN A CHANNEL",
  },
];

/** The three worlds used as the conceptual model behind the HUD nav. */
export const WORLDS = [
  {
    number: "01",
    name: "ENGINEER",
    description:
      "Professional work \u2014 Enterprise Applications, Cloud, Architecture, Backend, Frontend, Data, DevOps.",
  },
  {
    number: "02",
    name: "BUILDER",
    description:
      "Things actually built \u2014 Projects, Games, Tools, Applications, Experiments.",
  },
  {
    number: "03",
    name: "EXPERIMENTER",
    description:
      "Curiosity-driven work \u2014 AI, 3D, Animation, Blender, Game Dev, Physics, System Simulations.",
  },
] as const;

/** Bracket-styled HUD nav links, mapped to the six sections / three worlds. */
export const HUD_NAV_LINKS: { label: string; target: SectionId }[] = [
  { label: "WORK", target: "engineering" },
  { label: "LAB", target: "lab" },
  { label: "ABOUT", target: "journey" },
];

export const RESUME_HREF = "/resume.pdf";
