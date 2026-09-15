"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { SectionShell } from "./SectionShell";

// 03 -- BUILDER world: things actually built. Content arrives in Phase 2.

export function ProjectsSection() {
  const ref = useScrollReveal<HTMLElement>();

  return <SectionShell ref={ref} meta={SECTIONS[2]} />;
}
