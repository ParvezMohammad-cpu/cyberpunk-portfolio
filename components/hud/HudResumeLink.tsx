import { RESUME_HREF } from "@/lib/sections";

/**
 * Small persistent resume link/button. Placeholder target for now —
 * `/public/resume.pdf` is a stub until real content lands.
 */
export function HudResumeLink() {
  return (
    <a
      href={RESUME_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Parvez's resume"
      className="pointer-events-auto flex min-h-11 items-center border border-neon-magenta/50 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.25em] text-glow-magenta uppercase transition-colors hover:border-neon-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
    >
      Resume ↗
    </a>
  );
}
