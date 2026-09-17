"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, registerGsap } from "@/lib/gsap";
import { SECTIONS } from "@/lib/sections";
import {
  EVOLUTION_STEPS,
  JOURNEY_CONTENT_NOTES,
  JOURNEY_NODES,
  JOURNEY_REFLECTIONS,
} from "@/lib/data/journey";
import { SectionShell } from "./SectionShell";
import { GrowthArchitecture } from "./journey/GrowthArchitecture";

/**
 * 05 — Journey. About + experience timeline + globally-accessible resume
 * action. Every placeholder entry is visibly tagged so real employment
 * history can replace it later without a content audit.
 */
export function JourneySection() {
  const ref = useScrollReveal<HTMLElement>();
  const pathRef = useRef<SVGPathElement | null>(null);
  const [activeNodeId, setActiveNodeId] = useState(JOURNEY_NODES[0].id);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      if (!ref.current || !pathRef.current || prefersReducedMotion) {
        if (pathRef.current) {
          gsap.set(pathRef.current, { strokeDashoffset: 0 });
        }
        return;
      }

      const pathLength = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.35,
        },
      });

      ref.current
        .querySelectorAll<HTMLElement>("[data-journey-node]")
        .forEach((node) => {
          gsap.to(node, {
            y: -12,
            ease: "none",
            scrollTrigger: {
              trigger: node,
              start: "top 65%",
              end: "bottom 35%",
              scrub: 0.2,
              onToggle: (self) => {
                if (self.isActive) {
                  setActiveNodeId(node.dataset.journeyNode ?? JOURNEY_NODES[0].id);
                }
              },
              onEnterBack: () =>
                setActiveNodeId(node.dataset.journeyNode ?? JOURNEY_NODES[0].id),
            },
          });
        });
    },
    { scope: ref, dependencies: [prefersReducedMotion] }
  );

  return (
    <SectionShell ref={ref} meta={SECTIONS[4]}>
      <div data-reveal className="w-full max-w-6xl text-left">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-fg-dim text-sm leading-relaxed">
            This is not a generic job timeline. It is a readable circuit path
            through verified milestones, clearly marked unknowns, and the
            engineering principles that connect them.
          </p>
          <div
            className="border-border-dim bg-void/80 mt-6 inline-flex flex-wrap justify-center gap-x-4 gap-y-2 border px-4 py-3 font-mono text-[0.65rem] tracking-[0.22em] text-fg-dim uppercase"
            aria-label="Lab to Journey entrance messages"
          >
            <span>&gt; ALL EXPERIMENTS ARCHIVED</span>
            <span>&gt; SYSTEM HISTORY REQUESTED...</span>
            <span className="text-neon-cyan">&gt; LOADING JOURNEY</span>
          </div>
        </div>

        <div className="relative mt-14">
          {/*
            Hand-tuned decorative path for the current four-node vertical
            narrative. The ordered list below remains the source of truth and
            readable fallback if future content needs different path geometry.
          */}
          <svg
            aria-hidden
            viewBox="0 0 100 420"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-4 top-0 h-full w-12 overflow-visible md:left-1/2 md:-translate-x-1/2"
          >
            <path
              d="M50 5 C20 70 85 105 52 165 C20 230 88 275 50 345 C38 370 44 395 50 415"
              fill="none"
              stroke="rgba(0,255,245,0.18)"
              strokeWidth="3"
            />
            <path
              ref={pathRef}
              d="M50 5 C20 70 85 105 52 165 C20 230 88 275 50 345 C38 370 44 395 50 415"
              fill="none"
              stroke="var(--neon-cyan)"
              strokeLinecap="round"
              strokeWidth="2"
              className="drop-shadow-[0_0_12px_rgba(0,255,245,0.85)]"
            />
          </svg>

          <ol className="grid gap-8" aria-label="Parvez journey narrative path">
            {JOURNEY_NODES.map((node, index) => {
              const isActive = node.id === activeNodeId;
              const alignRight = index % 2 === 1;
              return (
                <li
                  key={node.id}
                  data-journey-node={node.id}
                  className={`relative ml-14 md:ml-0 md:grid md:grid-cols-[1fr_5rem_1fr] md:items-center md:gap-6 ${
                    isActive ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <div
                    className={`border bg-black-glass/80 p-5 transition-colors ${
                      isActive
                        ? "border-neon-cyan shadow-[0_0_30px_rgba(0,255,245,0.12)]"
                        : "border-border-dim"
                    } ${alignRight ? "md:col-start-3" : "md:col-start-1"}`}
                  >
                    <p className="font-mono text-[0.65rem] tracking-[0.28em] text-neon-magenta uppercase">
                      {node.eyebrow}
                    </p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-xl tracking-[0.18em] uppercase">
                        {node.label}
                      </h3>
                      <span className="font-mono text-xs text-fg-dim">{node.period}</span>
                    </div>
                    <p className="mt-2 font-mono text-sm text-neon-cyan">
                      {node.organization} / {node.title}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-fg-dim">
                      {node.summary}
                    </p>
                    {node.kind === "foundation" && (
                      <div
                        className="mt-5 grid grid-cols-3 gap-2 text-center"
                        aria-label="Stylized IIITP schematic illustration"
                      >
                        <span className="border-border-dim border p-3 text-neon-cyan">▱</span>
                        <span className="border-neon-cyan border p-3">IIITP</span>
                        <span className="border-border-dim border p-3 text-neon-cyan">▰</span>
                      </div>
                    )}
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {node.signals.map((signal) => (
                        <li
                          key={signal}
                          className="border-border-dim bg-void/80 border px-2 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-fg-dim uppercase"
                        >
                          {signal}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs leading-relaxed text-fg-dim">
                      {node.verificationNote}
                    </p>
                  </div>
                  <div className="absolute -left-12 top-8 md:static md:col-start-2 md:row-start-1 md:grid md:place-items-center">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-xs ${
                        isActive
                          ? "border-neon-cyan bg-neon-cyan text-void"
                          : "border-border-dim bg-void text-fg-dim"
                      }`}
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <GrowthArchitecture />

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-labelledby="journey-reflections-title">
          <div className="md:col-span-3">
            <p className="text-neon-magenta font-mono text-xs tracking-[0.3em] uppercase">
              Things learned
            </p>
            <h3
              id="journey-reflections-title"
              className="font-display mt-2 text-xl tracking-[0.2em] uppercase"
            >
              Engineering principles, pending owner wording
            </h3>
          </div>
          {JOURNEY_REFLECTIONS.map((reflection) => (
            <article
              key={reflection.id}
              className="border-border-dim bg-black-glass/70 border p-5"
            >
              <p className="text-neon-cyan font-mono text-xs tracking-[0.2em]">
                {reflection.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fg-dim">
                {reflection.principle}
              </p>
            </article>
          ))}
        </section>

        <section className="border-border-dim bg-void/80 mt-12 border p-6 text-center" aria-labelledby="evolution-title">
          <p className="text-neon-magenta font-mono text-xs tracking-[0.3em] uppercase">
            Evolution centerpiece
          </p>
          <h3 id="evolution-title" className="sr-only">
            Narrative evolution
          </h3>
          <ol className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {EVOLUTION_STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="font-display text-sm tracking-[0.2em] text-fg uppercase sm:text-lg">
                  {step}
                </span>
                {index < EVOLUTION_STEPS.length - 1 && (
                  <span aria-hidden className="text-neon-cyan">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-fg-dim">
            Narrative growth, not a sequence of invented job titles or promotions.
          </p>
        </section>

        <section className="mt-12 text-center" aria-labelledby="future-path-title">
          <p className="font-mono text-xs leading-loose tracking-[0.24em] text-fg-dim uppercase">
            ?<br />
            &gt; FUTURE NODE NOT FOUND
          </p>
          <h3
            id="future-path-title"
            className="font-display mt-4 text-2xl tracking-[0.2em] uppercase"
          >
            Maybe that&apos;s the point.
          </h3>
          <a
            href="#contact"
            className="focus-visible:outline-neon-cyan mt-5 inline-flex border border-neon-cyan px-5 py-3 font-mono text-xs tracking-[0.2em] text-neon-cyan uppercase hover:bg-neon-cyan/10 focus-visible:outline focus-visible:outline-2"
          >
            WHAT SHOULD BE BUILT NEXT?
          </a>
        </section>

        <aside
          className="border-border-dim mt-10 border-t pt-4 text-xs leading-relaxed text-fg-dim"
          aria-label="Journey content verification notes"
        >
          {JOURNEY_CONTENT_NOTES.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </aside>
      </div>
    </SectionShell>
  );
}
