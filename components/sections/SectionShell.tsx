import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { SectionMeta } from "@/lib/sections";

interface SectionShellProps {
  meta: SectionMeta;
  children?: ReactNode;
}

/**
 * Shared full-viewport section shell: large section number, placeholder
 * heading, and optional extra content. All six sections render this so the
 * visual language stays consistent; Phase 2 will fill in `children` with
 * real content per section.
 *
 * Forwards its ref to the root `<section>` so callers can attach the
 * `useScrollReveal` GSAP ScrollTrigger animation.
 */
export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(
  function SectionShell({ meta, children }, ref) {
    return (
      <section
        ref={ref}
        id={meta.id}
        className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-void/80 px-6 py-24 text-center"
      >
        <div className="bg-circuit-grid pointer-events-none absolute inset-0 opacity-20" />
        <span
          data-reveal
          className="font-display text-fg-dim/40 text-[8rem] leading-none font-bold sm:text-[12rem]"
          aria-hidden
        >
          {meta.number}
        </span>
        <h2
          data-reveal
          className="font-display text-glow-cyan -mt-16 text-3xl font-bold tracking-[0.2em] uppercase sm:text-5xl"
        >
          {meta.label}
        </h2>
        <p
          data-reveal
          className="font-mono text-fg-dim max-w-md text-sm tracking-wide"
        >
          {meta.tagline}
        </p>
        {children}
      </section>
    );
  }
);
