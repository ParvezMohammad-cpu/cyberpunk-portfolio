"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { SectionShell } from "./SectionShell";

// 06 -- Contact section. Content arrives in Phase 2.

export function ContactSection() {
  const ref = useScrollReveal<HTMLElement>();

  return <SectionShell ref={ref} meta={SECTIONS[5]} />;
}
