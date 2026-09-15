"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { CONTACT_LINKS } from "@/lib/data/contact";
import { SectionShell } from "./SectionShell";
import { ContactForm } from "./contact/ContactForm";

/**
 * 06 — Contact. Accessible form (see `ContactForm`) plus direct alternative
 * contact link slots (email / GitHub / LinkedIn / location).
 */
export function ContactSection() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <SectionShell ref={ref} meta={SECTIONS[5]}>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        Have a system to build, an idea to explore, or an interesting
        problem to solve? Let&apos;s connect.
      </p>

      <div data-reveal className="mt-8 flex justify-center">
        <ContactForm />
      </div>

      <ul
        data-reveal
        className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2"
        aria-label="Alternative contact methods"
      >
        {CONTACT_LINKS.map((link) => (
          <li key={link.id} className="flex flex-col items-center gap-1">
            <span className="font-mono text-fg-dim text-[0.6rem] tracking-[0.2em] uppercase">
              {link.label}
            </span>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-glow-cyan focus-visible:outline-neon-cyan font-mono text-xs underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2"
            >
              {link.value}
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
