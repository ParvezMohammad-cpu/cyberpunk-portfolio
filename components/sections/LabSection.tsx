"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SECTIONS } from "@/lib/sections";
import { LAB_EXPERIMENTS, LAB_SECTORS, STATUS_LABELS, type LabSector } from "@/lib/data/lab-experiments";
import { SectionShell } from "./SectionShell";
import Link from "next/link";
import { useState } from "react";

/**
 * 04 — Lab (the EXPERIMENTER world). Structured, evolving experiments —
 * Architecture Simulator, System Design Playground, interactive demos,
 * terminal, 3D, and physics modules — each with launch/inspect states.
 */
export function LabSection() {
  const ref = useScrollReveal<HTMLElement>();
  const [sector, setSector] = useState<LabSector | "all">("all");
  const [egg, setEgg] = useState(false);
  const shown = LAB_EXPERIMENTS.filter((experiment) => sector === "all" || experiment.sector === sector);

  return (
    <SectionShell ref={ref} meta={SECTIONS[3]}>
      <p
        data-reveal
        className="font-mono text-fg-dim max-w-xl text-sm leading-relaxed"
      >
        Four connected sectors for local, working prototypes. Select an object
        or use the accessible catalog below — no access is required.
      </p>
      <div data-reveal className="mt-7 flex flex-wrap gap-2" aria-label="Lab sector navigator">
        <button onClick={() => setSector("all")} className={`border px-3 py-2 text-xs ${sector === "all" ? "border-neon-cyan text-neon-cyan" : "border-border-dim text-fg-dim"}`}>ALL</button>
        {LAB_SECTORS.map((item) => <button key={item} onClick={() => setSector(item)} className={`border px-3 py-2 text-xs uppercase ${sector === item ? "border-neon-cyan text-neon-cyan" : "border-border-dim text-fg-dim"}`}>{item}</button>)}
        <button aria-label="Discover experiment 000" onClick={() => setEgg(true)} className="border border-border-dim px-3 py-2 text-xs text-fg-dim">?</button>
      </div>
      <div data-reveal className="mt-6 grid w-full max-w-5xl gap-4 sm:grid-cols-2">
        {shown.map((experiment) => <Link key={experiment.id} href={`/lab/${experiment.slug}`} className="group relative min-h-36 overflow-hidden border border-border-dim bg-black-glass/70 p-5 hover:border-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"><span className="absolute -right-4 -top-7 text-8xl text-neon-cyan/10 group-hover:text-neon-cyan/20">{experiment.sector === "ai" ? "◌" : experiment.sector === "build" ? "▣" : experiment.sector === "visual" ? "⚙" : "△"}</span><p className="text-xs text-neon-cyan">{experiment.id} / {experiment.sector.toUpperCase()}</p><h3 className="mt-2 font-display tracking-widest">{experiment.title}</h3><p className="mt-2 max-w-md text-xs text-fg-dim">{experiment.summary}</p><p className="mt-3 text-xs">{STATUS_LABELS[experiment.status]}</p></Link>)}
      </div>
      <div data-reveal className="relative mt-16 w-full max-w-3xl overflow-hidden border border-border-dim bg-void/80 p-6 text-center font-mono text-xs leading-loose tracking-[.2em] text-fg-dim uppercase">
        <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" aria-hidden />
        <span>&gt; ALL EXPERIMENTS ARCHIVED</span><br/>
        <span>&gt; SYSTEM HISTORY REQUESTED...</span><br/>
        <span className="text-neon-cyan">&gt; LOADING JOURNEY</span><br/>
        <span className="text-fg">A THIN CIRCUIT PATH APPEARS</span><br/>
        <a href="#journey" className="relative text-neon-cyan underline underline-offset-4">CONTINUE TO JOURNEY</a>
      </div>
      {egg && <div role="dialog" aria-modal="true" aria-label="Experiment 000" className="fixed inset-0 z-50 grid place-items-center bg-void/95 p-6"><div className="max-w-md border border-neon-magenta p-6"><p className="text-neon-magenta">UNAUTHORIZED ACCESS / EXPERIMENT 000</p><p className="mt-4">DO YOU REALLY WANT TO CONTINUE?</p><div className="mt-5 flex gap-3"><button className="border border-neon-cyan p-2 text-neon-cyan" onClick={() => setEgg(false)}>YES — YOU FOUND THE EASTER EGG. THERE WAS NEVER AN EXPERIMENT 000.</button><button className="border border-border-dim p-2" onClick={() => setEgg(false)}>NO</button></div></div></div>}
    </SectionShell>
  );
}
