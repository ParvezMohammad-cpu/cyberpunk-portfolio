import Link from "next/link";

/**
 * Shown when /projects/[slug] doesn't match any project — real 404 handling
 * instead of an intercepted-modal substitute for missing/renamed slugs.
 */
export default function ProjectNotFound() {
  return (
    <main className="bg-void flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-glow-magenta font-mono text-xs tracking-[0.3em] uppercase">
        404 — Artifact Not Found
      </p>
      <h1 className="font-display text-fg text-2xl font-bold tracking-[0.15em] uppercase">
        This project doesn&apos;t exist
      </h1>
      <p className="text-fg-dim max-w-md font-mono text-sm leading-relaxed">
        The project you&apos;re looking for may have been renamed, removed,
        or never existed at this address.
      </p>
      <Link
        href="/#projects"
        className="border-neon-cyan/60 text-glow-cyan hover:border-neon-cyan focus-visible:outline-neon-cyan mt-2 border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
      >
        ← Back to Project Database
      </Link>
    </main>
  );
}
