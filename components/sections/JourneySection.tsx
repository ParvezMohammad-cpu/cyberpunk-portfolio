"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS, RESUME_HREF } from "@/lib/sections";
import { EXPERIENCE } from "@/lib/data/experience";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionShell } from "./SectionShell";
import { ExperienceCard } from "./journey/ExperienceCard";

/**
 * 05 — Journey. About + experience timeline + globally-accessible resume
 * action. Every placeholder entry is visibly tagged so real employment
 * history can replace it later without a content audit.
 */
export function JourneySection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <SectionShell ref={ref} meta={SECTIONS[4]}>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        I am a software engineer focused on building reliable systems,
        useful products, and meaningful digital experiences. My work
        combines practical engineering with curiosity about architecture,
        interaction, automation, and emerging technology.
      </p>

      <ol
        data-reveal
        className="mt-8 flex w-full max-w-xl flex-col gap-8 text-left"
        aria-label="Experience timeline"
      >
        {EXPERIENCE.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </ol>

      <div data-reveal className="mt-8 flex flex-col items-center gap-2">
        <NeonButton
          href={RESUME_HREF}
          target="_blank"
          rel="noopener noreferrer"
          variant="magenta"
          aria-label="Download Parvez's resume"
        >
          Resume
          <span aria-hidden>&#8599;</span>
        </NeonButton>
        <p className="font-mono text-fg-dim text-xs">
          If the document does not open, reach out via the contact section
          below.
        </p>
      </div>
    </SectionShell>
  );
}
