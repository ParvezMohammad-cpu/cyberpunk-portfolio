/**
 * Fixed, full-viewport scanline + vignette overlay. Purely decorative and
 * non-interactive (`pointer-events-none`), meant to sit above content near
 * the top of the DOM stack (e.g. in the root layout or boot screen).
 */
export function ScanlineOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`scanline-overlay pointer-events-none fixed inset-0 z-40 ${className}`}
    />
  );
}
