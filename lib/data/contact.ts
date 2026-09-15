import type { ContactLink } from "./types";

/**
 * Placeholder contact link slots. No real email/social handles exist in
 * this repository yet (see `public/resume.pdf`, itself a placeholder), so
 * these values are structurally correct but clearly fake — swap them for
 * real details without touching any component markup.
 */
export const CONTACT_LINKS: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    value: "hello@parvez.dev",
    href: "mailto:hello@parvez.dev",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/ParvezMohammad-cpu",
    href: "https://github.com/ParvezMohammad-cpu",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/parvez",
    href: "https://www.linkedin.com/in/parvez",
  },
  {
    id: "location",
    label: "Location",
    value: "Remote / Available worldwide",
    href: "#contact",
  },
];
