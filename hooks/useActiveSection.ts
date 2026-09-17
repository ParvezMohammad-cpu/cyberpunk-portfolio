"use client";

import { useEffect, useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";

/**
 * Tracks which of the six locked sections is currently most visible in the
 * viewport, using an IntersectionObserver. Drives the HUD's active-link
 * highlighting and the `01 / 06` section indicator.
 */
export function useActiveSection(): SectionId {
  const [activeId, setActiveId] = useState<SectionId>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((section) =>
      document.getElementById(section.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const viewportCenter = window.innerHeight / 2;
        const distanceToViewportCenter = (rect: DOMRectReadOnly) => {
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            return 0;
          }
          return Math.min(
            Math.abs(rect.top - viewportCenter),
            Math.abs(rect.bottom - viewportCenter)
          );
        };

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aDistance = distanceToViewportCenter(a.boundingClientRect);
            const bDistance = distanceToViewportCenter(b.boundingClientRect);
            if (aDistance === bDistance) {
              return (
                Math.abs(a.boundingClientRect.top) -
                Math.abs(b.boundingClientRect.top)
              );
            }
            return aDistance - bDistance;
          })[0];

        if (visible) {
          setActiveId(visible.target.id as SectionId);
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: "-35% 0px -35% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
