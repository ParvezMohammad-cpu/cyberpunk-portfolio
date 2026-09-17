"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SECTIONS } from "@/lib/sections";
import { CONTACT_ACTIONS } from "@/lib/data/contact";

type OutroState = "idle" | "preview" | "playing" | "complete";

/**
 * 06 — Contact. A quiet final scene with direct, semantic actions only.
 * Unknown contact channels render as unavailable instead of fake links.
 */
export function ContactSection() {
  const ref = useScrollReveal<HTMLElement>();
  const [outroState, setOutroState] = useState<OutroState>("idle");
  const prefersReducedMotion = useReducedMotion();
  const sectionMeta = SECTIONS[5];
  const displayedOutroState =
    prefersReducedMotion && outroState === "playing" ? "complete" : outroState;
  const previewLines = ["ENGINEERING OFF", "PROJECTS OFF", "LAB OFF", "JOURNEY OFF"];
  const outroLines =
    displayedOutroState === "complete"
      ? ["> CONNECTION REMAINS OPEN", "PARVEZ", "▌"]
      : ["> SESSION ENDING", "ENGINEERING OFF", "PROJECTS OFF", "LAB OFF", "JOURNEY OFF"];

  useEffect(() => {
    if (outroState !== "playing") return;

    if (prefersReducedMotion) return;

    const timer = window.setTimeout(() => setOutroState("complete"), 1800);
    return () => window.clearTimeout(timer);
  }, [outroState, prefersReducedMotion]);

  const restoreContact = () => setOutroState("idle");
  const previewTriggerHandlers = (actionId: string) =>
    actionId === "email"
      ? {
          onFocus: () => setOutroState("preview"),
          onBlur: () => outroState === "preview" && setOutroState("idle"),
          onMouseEnter: () => setOutroState("preview"),
          onMouseLeave: () => outroState === "preview" && setOutroState("idle"),
        }
      : {};

  // Contact intentionally uses a custom near-empty section instead of
  // SectionShell so the final scene can quiet the HUD/background language while
  // still preserving the shared section id, reveal hook, and heading semantics.
  return (
    <section
      ref={ref}
      id={sectionMeta.id}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-void px-6 py-28 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,245,0.06),transparent_42%)]" />
      <div
        className="pointer-events-none absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
        aria-hidden
      />

      <div
        data-reveal
        className={`relative z-10 flex w-full max-w-4xl flex-col items-center transition-opacity duration-500 ${
          displayedOutroState === "playing" || displayedOutroState === "complete" ? "opacity-25" : "opacity-100"
        }`}
      >
        <p className="font-mono text-fg-dim text-xs tracking-[0.35em] uppercase">
          PARVEZ
        </p>
        <h2 className="font-display text-glow-cyan mt-6 text-4xl font-bold tracking-[0.18em] uppercase sm:text-6xl">
          Let&apos;s build something
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fg-dim sm:text-base">
          Have an interesting problem? A strange idea? A system that needs
          building? Let&apos;s talk.
        </p>

        <ul className="mt-10 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Contact actions">
          {CONTACT_ACTIONS.map((action) => (
            <li key={action.id}>
              {action.href ? (
                <a
                  href={action.href}
                  download={action.download || undefined}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  {...previewTriggerHandlers(action.id)}
                  className="border-border-dim bg-black-glass/70 focus-visible:outline-neon-cyan flex min-h-28 flex-col justify-between border p-4 text-left transition-colors hover:border-neon-cyan focus-visible:outline focus-visible:outline-2"
                >
                  <span className="font-mono text-xs tracking-[0.25em] text-neon-cyan">
                    {action.label}
                  </span>
                  <span className="mt-5 text-xs leading-relaxed text-fg-dim">
                    {action.value}
                    {action.external && <span aria-hidden> ↗</span>}
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  aria-disabled="true"
                  {...previewTriggerHandlers(action.id)}
                  className="border-border-dim bg-black-glass/40 focus-visible:outline-neon-cyan flex min-h-28 w-full flex-col justify-between border p-4 text-left opacity-70 focus-visible:outline focus-visible:outline-2"
                >
                  <span className="font-mono text-xs tracking-[0.25em] text-fg-dim">
                    {action.label}
                  </span>
                  <span className="mt-5 text-xs leading-relaxed text-fg-dim">
                    {action.value}
                  </span>
                </button>
              )}
              {(action.unavailableReason || action.ownerVerification) && (
                <p className="mt-2 text-left text-[0.65rem] leading-relaxed text-fg-dim">
                  {action.unavailableReason ?? action.ownerVerification}
                </p>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setOutroState("playing")}
            className="border-border-dim px-4 py-3 font-mono text-xs tracking-[0.2em] text-fg-dim uppercase hover:border-neon-cyan hover:text-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
          >
            Play optional outro
          </button>
          <button
            type="button"
            onClick={restoreContact}
            className="border-border-dim px-4 py-3 font-mono text-xs tracking-[0.2em] text-fg-dim uppercase hover:border-neon-cyan hover:text-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
          >
            Return / restore contact
          </button>
        </div>
      </div>

      {(displayedOutroState === "preview" || displayedOutroState === "playing" || displayedOutroState === "complete") && (
        <div
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-void/85 p-6"
          aria-hidden={displayedOutroState === "preview"}
        >
          <div className="border-border-dim bg-black-glass/90 w-full max-w-md border p-6 text-left">
            <p className="font-mono text-xs leading-loose tracking-[0.2em] text-fg-dim uppercase">
              {(displayedOutroState === "preview" ? previewLines : outroLines).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            {displayedOutroState !== "preview" && (
              <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={restoreContact}
                  className="border border-neon-cyan px-3 py-2 font-mono text-xs text-neon-cyan"
                >
                  Skip / Return
                </button>
                <button
                  type="button"
                  onClick={() => setOutroState("playing")}
                  className="border border-border-dim px-3 py-2 font-mono text-xs text-fg-dim"
                >
                  Replay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
