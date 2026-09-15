"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  /** Milliseconds per character. Default 45. */
  speed?: number;
  onComplete?: () => void;
}

/**
 * Reveals `text` one character at a time, monospace-terminal style. Under
 * `prefers-reduced-motion`, renders the full text immediately.
 */
export function TypewriterText({
  text,
  className = "",
  speed = 45,
  onComplete,
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visibleChars, setVisibleChars] = useState(
    prefersReducedMotion ? text.length : 0
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    if (visibleChars >= text.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setVisibleChars((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleChars, text, speed, prefersReducedMotion]);

  return (
    <span className={`terminal-cursor ${className}`}>
      {text.slice(0, visibleChars)}
    </span>
  );
}
