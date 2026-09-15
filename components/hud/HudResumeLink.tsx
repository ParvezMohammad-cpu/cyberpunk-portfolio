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
      className="pointer-events-auto border border-neon-magenta/50 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.25em] text-glow-magenta uppercase transition-colors hover:border-neon-magenta"
    >
      Resume
    </a>
  );
}
