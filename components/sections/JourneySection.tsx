"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { SectionShell } from "./SectionShell";

// 05 -- Career/education journey timeline. Content arrives in Phase 2.

export function JourneySection() {
  const ref = useScrollReveal<HTMLElement>();

  return <SectionShell ref={ref} meta={SECTIONS[4]} />;
}
