"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { SectionShell } from "./SectionShell";

// 02 -- ENGINEER world: professional work. Content arrives in Phase 2.

export function EngineeringSection() {
  const ref = useScrollReveal<HTMLElement>();

  return <SectionShell ref={ref} meta={SECTIONS[1]} />;
}
