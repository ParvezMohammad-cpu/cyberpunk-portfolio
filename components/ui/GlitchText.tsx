import { createElement, type HTMLAttributes } from "react";

type GlitchTag = "span" | "h1" | "h2" | "p";

interface GlitchTextProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: GlitchTag;
  text: string;
}

/**
 * Renders `text` with a layered CSS glitch effect (see `.glitch` in
 * globals.css). The base element carries the real text for accessibility;
 * `::before`/`::after` duplicate it via `data-text` and jitter in neon
 * cyan/magenta. Animation is automatically disabled under
 * `prefers-reduced-motion` (handled in CSS).
 */
export function GlitchText({
  as = "span",
  text,
  className = "",
  ...rest
}: GlitchTextProps) {
  return createElement(
    as,
    {
      className: `glitch ${className}`,
      "data-text": text,
      "aria-label": text,
      ...rest,
    },
    text
  );
}
