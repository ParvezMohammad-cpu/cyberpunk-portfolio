"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { SectionShell } from "./SectionShell";

// 04 -- EXPERIMENTER world: curiosity-driven work. Content arrives in Phase 2.

export function LabSection() {
  const ref = useScrollReveal<HTMLElement>();

  return <SectionShell ref={ref} meta={SECTIONS[3]} />;
}
