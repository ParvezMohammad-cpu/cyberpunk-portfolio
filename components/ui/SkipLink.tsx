/**
 * Visually-hidden-until-focused "Skip to main content" link, the first
 * focusable element on the page. Lets keyboard/screen-reader users bypass
 * the fixed HUD nav and jump straight to the section content.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:pointer-events-auto focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-neon-cyan focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.2em] focus:text-glow-cyan focus:uppercase"
    >
      Skip to main content
    </a>
  );
}
