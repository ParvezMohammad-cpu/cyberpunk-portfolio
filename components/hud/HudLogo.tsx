import Link from "next/link";

/**
 * Top-left fixed wordmark. Deliberately tiny — this is a HUD, not a navbar.
 */
export function HudLogo() {
  return (
    <Link
      href="#intro"
      className="pointer-events-auto font-mono text-xs font-bold tracking-[0.35em] text-glow-cyan"
    >
      PARVEZ
    </Link>
  );
}
