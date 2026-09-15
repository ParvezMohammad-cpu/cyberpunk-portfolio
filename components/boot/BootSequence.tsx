"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ParticleField } from "@/components/three/ParticleField";
import { GlitchText } from "@/components/ui/GlitchText";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScanlineOverlay } from "@/components/ui/ScanlineOverlay";
import { TypewriterText } from "./TypewriterText";

interface BootSequenceProps {
  onEnter: () => void;
}

type Phase = "point" | "initializing" | "construct" | "ready";

/**
 * The opening boot/intro experience: dark screen -> tiny point -> typewriter
 * "INITIALIZING..." -> particle field construction -> glitch name reveal ->
 * "> ENTER?" prompt -> "ENTER EXPERIENCE ->" CTA. Clicking the CTA plays a
 * GSAP wipe/glitch exit transition before handing off to `onEnter`.
 */
export function BootSequence({ onEnter }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>("point");
  const [exiting, setExiting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      if (phase !== "construct" || !revealRef.current) return;

      const targets = revealRef.current.querySelectorAll("[data-reveal]");

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        setPhase("ready");
        return;
      }

      gsap
        .timeline({ onComplete: () => setPhase("ready") })
        .fromTo(
          targets,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.25, ease: "power2.out" }
        );
    },
    { scope: rootRef, dependencies: [phase, prefersReducedMotion] }
  );

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    registerGsap();

    if (prefersReducedMotion || !rootRef.current) {
      onEnter();
      return;
    }

    gsap.timeline({ onComplete: onEnter }).to(rootRef.current, {
      opacity: 0,
      scale: 1.08,
      filter: "blur(6px)",
      duration: 0.6,
      ease: "power2.in",
    });
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-void"
    >
      <ScanlineOverlay />
      <div className="bg-circuit-grid pointer-events-none absolute inset-0 opacity-30" />

      {phase !== "point" && (
        <div className="absolute inset-0">
          <SceneCanvas>
            <ParticleField />
          </SceneCanvas>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {phase === "point" && (
          <span
            className="boot-point-pulse h-1.5 w-1.5 rounded-full bg-neon-cyan"
            style={{
              boxShadow: "0 0 8px #00fff5, 0 0 24px #00fff5",
            }}
            onAnimationEnd={() => setPhase("initializing")}
          />
        )}

        {phase === "initializing" && (
          <TypewriterText
            text="INITIALIZING..."
            className="font-mono text-sm tracking-[0.3em] text-neon-cyan uppercase"
            onComplete={() => setPhase("construct")}
          />
        )}

        {(phase === "construct" || phase === "ready") && (
          <div ref={revealRef} className="flex flex-col items-center gap-6">
            <GlitchText
              as="h1"
              text="PARVEZ"
              data-reveal
              className="font-display text-6xl font-bold tracking-widest text-glow-cyan sm:text-8xl"
            />
            <p
              data-reveal
              className="font-mono text-sm tracking-[0.4em] text-fg-dim uppercase"
            >
              SOFTWARE ENGINEER
            </p>
            <p
              data-reveal
              className="font-mono text-base text-neon-magenta terminal-cursor"
            >
              {"> ENTER?"}
            </p>
            <div data-reveal>
              <NeonButton onClick={handleEnter} disabled={exiting}>
                ENTER EXPERIENCE
                <span aria-hidden>&rarr;</span>
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
