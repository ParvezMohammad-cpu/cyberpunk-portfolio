import type { ContactLink } from "./types";

export interface ContactAction {
  id: "email" | "linkedin" | "github" | "resume";
  label: string;
  value: string;
  href?: string;
  download?: boolean;
  external?: boolean;
  unavailableReason?: string;
  ownerVerification?: string;
}

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
    value: "Unavailable until owner provides a verified address",
    isPlaceholder: true,
    unavailableReason:
      "The previous repository value was a placeholder, so Step 6 intentionally does not render it as a mailto link.",
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
    value: "Unavailable until owner provides the exact profile URL",
    isPlaceholder: true,
    unavailableReason:
      "The previous repository value was a placeholder, so Step 6 intentionally does not render it as an external link.",
  },
  {
    id: "location",
    label: "Location",
    value: "Unavailable until owner confirms availability/location copy",
    isPlaceholder: true,
    unavailableReason:
      "Availability is time-sensitive and has not been verified for this Step 6 implementation.",
  },
];

export const CONTACT_ACTIONS: ContactAction[] = [
  {
    id: "email",
    label: "EMAIL",
    value: "Unavailable until owner provides a verified address",
    unavailableReason:
      "The repository only contained a placeholder email, so no mailto link is rendered.",
    ownerVerification: "Provide the real email address to enable native mailto activation.",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    value: "Unavailable until owner provides the exact profile URL",
    unavailableReason:
      "The repository only contained a placeholder LinkedIn URL, so no external link is rendered.",
    ownerVerification: "Provide the real LinkedIn profile URL to enable this action.",
  },
  {
    id: "github",
    label: "GITHUB",
    value: "github.com/ParvezMohammad-cpu",
    href: "https://github.com/ParvezMohammad-cpu",
    external: true,
  },
  {
    id: "resume",
    label: "DOWNLOAD RESUME",
    value: "public/resume.pdf",
    href: "/resume.pdf",
    download: true,
    ownerVerification:
      "The repository asset is currently a placeholder resume file; replace it with the final resume PDF before publishing.",
  },
];
