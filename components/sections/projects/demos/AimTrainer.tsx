"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL_TARGETS = 10;

type Phase = "idle" | "running" | "done";

interface Target {
  x: number;
  y: number;
  spawnedAt: number;
}

/**
 * Step 4.9 — Aim Trainer. Reaction time, accuracy, and hit count are always
 * computed from this session's real input events, never hardcoded (187ms /
 * 94% / 20/20 in the brief are illustrative examples only). Accuracy is
 * hits / (hits + misses) recorded during the session; reaction time is
 * spawn-to-hit per target, averaged. Target clicks stop propagation so a
 * hit is never double-counted as a background miss. A keyboard-only
 * "reaction practice" mode is offered as an accessible alternative, and is
 * explicitly not presented as equivalent to pointer-based aiming.
 */
export function AimTrainer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Target | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [mode, setMode] = useState<"pointer" | "keyboard">("pointer");
  const [keyboardArmed, setKeyboardArmed] = useState(false);
  const armTimeRef = useRef(0);
  const armTimeoutRef = useRef<number | null>(null);

  const clearArmTimeout = () => {
    if (armTimeoutRef.current !== null) {
      window.clearTimeout(armTimeoutRef.current);
      armTimeoutRef.current = null;
    }
  };

  useEffect(() => clearArmTimeout, []);


  const spawnTarget = useCallback(() => {
    setTarget({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      spawnedAt: performance.now(),
    });
  }, []);

  const start = () => {
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    setPhase("running");
    if (mode === "pointer") {
      spawnTarget();
    } else {
      setKeyboardArmed(false);
      armTimeRef.current = 0;
    }
  };

  const reset = () => {
    clearArmTimeout();
    setPhase("idle");
    setTarget(null);
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    setKeyboardArmed(false);
  };

  const handleTargetHit = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    if (!target || phase !== "running") return;

    const reaction = performance.now() - target.spawnedAt;
    const nextHits = hits + 1;
    setHits(nextHits);
    setReactionTimes((current) => [...current, reaction]);

    if (nextHits >= TOTAL_TARGETS) {
      setTarget(null);
      setPhase("done");
    } else {
      spawnTarget();
    }
  };

  const handleAreaMiss = () => {
    if (phase !== "running" || mode !== "pointer") return;
    setMisses((count) => count + 1);
  };

  // Keyboard mode: a prompt arms after a random delay; pressing Space
  // records the reaction time. Framed as reaction practice, not aim
  // accuracy, since it has no spatial targeting component.
  const armKeyboardRound = useCallback(() => {
    clearArmTimeout();
    const delay = 700 + Math.random() * 1500;
    armTimeoutRef.current = window.setTimeout(() => {
      armTimeRef.current = performance.now();
      setKeyboardArmed(true);
      armTimeoutRef.current = null;
    }, delay);
  }, []);

  const handleKeyboardPress = (event: React.KeyboardEvent) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (phase !== "running" || mode !== "keyboard") return;

    if (!keyboardArmed) {
      // Pressed too early.
      setMisses((count) => count + 1);
      return;
    }

    const reaction = performance.now() - armTimeRef.current;
    const nextHits = hits + 1;
    setHits(nextHits);
    setReactionTimes((current) => [...current, reaction]);
    setKeyboardArmed(false);

    if (nextHits >= TOTAL_TARGETS) {
      setPhase("done");
    } else {
      armKeyboardRound();
    }
  };

  const startKeyboardMode = () => {
    setMode("keyboard");
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    setPhase("running");
    armKeyboardRound();
  };

  const totalAttempts = hits + misses;
  const accuracy = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0;
  const avgReaction =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length)
      : 0;

  return (
    <div className="border-border-dim bg-black-glass/40 border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-fg-dim font-mono text-[0.65rem] tracking-[0.2em] uppercase">
          Targets: {hits}/{TOTAL_TARGETS}
        </p>
        <div className="flex gap-2">
          {phase === "idle" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setMode("pointer");
                  start();
                }}
                className="border-neon-cyan/60 text-glow-cyan hover:border-neon-cyan focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
              >
                Start
              </button>
              <button
                type="button"
                onClick={startKeyboardMode}
                className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
              >
                Keyboard Practice
              </button>
            </>
          )}
          {phase !== "idle" && (
            <button
              type="button"
              onClick={reset}
              className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {phase === "idle" && (
        <p className="text-fg-dim mt-3 font-mono text-xs leading-relaxed">
          Pointer mode: click/tap {TOTAL_TARGETS} targets as they appear.
          Keyboard Practice measures reaction time to a visual cue via
          Space/Enter — it&apos;s a reaction-time alternative, not a
          directly comparable measure of pointer aiming accuracy.
        </p>
      )}

      {phase === "running" && mode === "pointer" && (
        <div
          onClick={handleAreaMiss}
          className="border-border-dim relative mt-3 h-56 w-full cursor-crosshair border sm:h-64"
          role="application"
          aria-label="Aim trainer play area"
        >
          {target && (
            <button
              type="button"
              aria-label="Target"
              onClick={handleTargetHit}
              onTouchStart={handleTargetHit}
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              className="border-neon-magenta bg-neon-magenta/30 absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
            />
          )}
        </div>
      )}

      {phase === "running" && mode === "keyboard" && (
        <div
          tabIndex={0}
          onKeyDown={handleKeyboardPress}
          className="border-border-dim mt-3 flex h-40 w-full items-center justify-center border font-mono text-sm outline-none focus-visible:border-neon-cyan"
          role="application"
          aria-label="Keyboard reaction practice — press space when the cue appears"
        >
          {keyboardArmed ? (
            <span className="text-glow-cyan uppercase tracking-[0.2em]">
              PRESS SPACE NOW
            </span>
          ) : (
            <span className="text-fg-dim uppercase tracking-[0.2em]">
              WAIT FOR IT...
            </span>
          )}
        </div>
      )}

      {phase === "done" && (
        <div role="status" className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-glow-cyan font-display text-2xl font-bold">
              {avgReaction}ms
            </p>
            <p className="text-fg-dim font-mono text-[0.6rem] uppercase">Reaction Time</p>
          </div>
          <div>
            <p className="text-glow-cyan font-display text-2xl font-bold">{accuracy}%</p>
            <p className="text-fg-dim font-mono text-[0.6rem] uppercase">Accuracy</p>
          </div>
          <div>
            <p className="text-glow-cyan font-display text-2xl font-bold">
              {hits}/{TOTAL_TARGETS}
            </p>
            <p className="text-fg-dim font-mono text-[0.6rem] uppercase">Targets</p>
          </div>
        </div>
      )}
    </div>
  );
}
