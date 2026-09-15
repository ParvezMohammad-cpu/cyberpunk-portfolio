"use client";

import { useState } from "react";
import type { Experience } from "@/lib/data/types";

interface ExperienceCardProps {
  experience: Experience;
}

/**
 * A single timeline entry. Details are collapsed by default and expanded
 * via a real `<button>` with `aria-expanded`, so screen readers and
 * keyboard users get the same progressive disclosure as mouse users.
 */
export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `experience-details-${experience.id}`;
  const range = experience.endDate
    ? `${experience.startDate} — ${experience.endDate}`
    : `${experience.startDate} — PRESENT`;

  return (
    <li className="border-neon-cyan/40 relative border-l-2 py-2 pl-6">
      <span
        aria-hidden
        className="bg-neon-cyan absolute top-3 -left-[5px] h-2 w-2 rounded-full"
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-neon-cyan text-xs tracking-[0.2em]">
          {range}
        </span>
        {experience.isPlaceholder && (
          <span className="border-neon-magenta/60 text-glow-magenta border px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase">
            Placeholder
          </span>
        )}
      </div>
      <h3 className="font-display text-fg mt-1 text-lg font-bold">
        {experience.role}
      </h3>
      <p className="font-mono text-fg-dim text-sm">
        {experience.organization}
        {experience.location ? ` · ${experience.location}` : ""}
      </p>
      <p className="font-mono text-fg-dim mt-2 max-w-xl text-sm leading-relaxed">
        {experience.summary}
      </p>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
        className="text-glow-cyan focus-visible:outline-neon-cyan mt-2 font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
      >
        {expanded ? "Collapse Role" : "Expand Role"}
      </button>

      {expanded && (
        <div id={panelId} className="mt-3 max-w-xl">
          <h4 className="font-mono text-fg-dim text-xs tracking-[0.2em] uppercase">
            Key Contributions
          </h4>
          <ul className="mt-1 list-inside list-disc space-y-1 font-mono text-fg text-sm">
            {experience.contributions.map((contribution) => (
              <li key={contribution}>{contribution}</li>
            ))}
          </ul>
          <ul
            className="mt-3 flex flex-wrap gap-1.5"
            aria-label={`${experience.role} technologies`}
          >
            {experience.technologies.map((tech) => (
              <li
                key={tech}
                className="border-border-dim text-fg-dim border px-2 py-0.5 font-mono text-[0.6rem] tracking-wide"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
