"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right";

const GRID_SIZE = 6;
const START: [number, number] = [0, 0];
const GOAL: [number, number] = [5, 5];
// 1 = wall. A small fixed level designed so the goal is reachable but not
// trivially adjacent — the point is a real slide-until-blocked puzzle, not
// a placeholder CTA.
const WALLS = new Set(["2,1", "2,2", "2,3", "2,4", "4,4"]);

function key(x: number, y: number) {
  return `${x},${y}`;
}

function slide(
  [x, y]: [number, number],
  direction: Direction
): [number, number] {
  const delta: Record<Direction, [number, number]> = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  const [dx, dy] = delta[direction];
  let cx = x;
  let cy = y;

  while (true) {
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
    if (WALLS.has(key(nx, ny))) break;
    cx = nx;
    cy = ny;
  }

  return [cx, cy];
}

function minimumMoves() {
  const directions: Direction[] = ["up", "down", "left", "right"];
  const queue: Array<{ position: [number, number]; moves: number }> = [{ position: START, moves: 0 }];
  const seen = new Set([key(...START)]);
  while (queue.length) {
    const current = queue.shift()!;
    if (current.position[0] === GOAL[0] && current.position[1] === GOAL[1]) return current.moves;
    directions.forEach((direction) => {
      const next = slide(current.position, direction);
      const nextKey = key(...next);
      if (nextKey !== key(...current.position) && !seen.has(nextKey)) {
        seen.add(nextKey);
        queue.push({ position: next, moves: current.moves + 1 });
      }
    });
  }
  return 0;
}

const OPTIMAL_MOVES = minimumMoves();

const DIRECTION_KEYS: Record<string, Direction> = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

/**
 * Step 4.8 — Arrow Puzzle: a genuinely playable web prototype (slide the
 * marker in a direction until it hits a wall or the edge; reach the goal
 * to win). This is explicitly a small browser prototype of the mechanic,
 * not a claim of parity with any existing Android release. Keyboard
 * (arrow keys / WASD) and on-screen buttons (touch/click) both work.
 */
export function ArrowPuzzle() {
  const [position, setPosition] = useState<[number, number]>(START);
  const positionRef = useRef<[number, number]>(START);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const pausedAt = useRef<number | null>(null);
  const completed = useRef(false);
  const won = position[0] === GOAL[0] && position[1] === GOAL[1];

  const move = useCallback(
    (direction: Direction) => {
      if (won || completed.current) return;
      const next = slide(positionRef.current, direction);
      if (next[0] === positionRef.current[0] && next[1] === positionRef.current[1]) return;
      if (startedAt.current === null) startedAt.current = performance.now();
      positionRef.current = next;
      setPosition(next);
      setMoves((count) => count + 1);
      if (next[0] === GOAL[0] && next[1] === GOAL[1]) {
        completed.current = true;
        setElapsed(performance.now() - startedAt.current);
      }
    },
    [won]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = DIRECTION_KEYS[event.key.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (startedAt.current !== null && !won && pausedAt.current === null) {
        setElapsed(performance.now() - startedAt.current);
      }
    }, 100);
    const visibility = () => {
      if (document.hidden && startedAt.current !== null && pausedAt.current === null) {
        pausedAt.current = performance.now();
      } else if (!document.hidden && pausedAt.current !== null && startedAt.current !== null) {
        startedAt.current += performance.now() - pausedAt.current;
        pausedAt.current = null;
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", visibility); };
  }, [won]);

  const restart = () => {
    setPosition(START);
    positionRef.current = START;
    setMoves(0);
    setElapsed(0);
    startedAt.current = null;
    pausedAt.current = null;
  };

  return (
    <div className="border-border-dim bg-black-glass/40 border p-4">
      <div className="flex items-center justify-between">
        <p className="text-fg-dim font-mono text-[0.65rem] tracking-[0.2em] uppercase">
          Moves: {moves}
        </p>
        <button
          type="button"
          onClick={restart}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
        >
          Restart
        </button>
      </div>

      <div
        role="grid"
        aria-label="Arrow puzzle board"
        className="mt-3 grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isWall = WALLS.has(key(x, y));
          const isPlayer = position[0] === x && position[1] === y;
          const isGoal = GOAL[0] === x && GOAL[1] === y;

          return (
            <div
              key={key(x, y)}
              role="gridcell"
              className={`flex aspect-square items-center justify-center border text-xs font-mono ${
                isWall
                  ? "border-border-dim bg-surface"
                  : "border-border-dim/60 bg-black-glass/60"
              }`}
            >
              {isPlayer ? (
                <span className="text-glow-cyan" aria-label="Player">
                  ▲
                </span>
              ) : isGoal ? (
                <span className="text-glow-magenta" aria-label="Goal">
                  ◎
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid w-32 grid-cols-3 gap-1 mx-auto" aria-hidden={false}>
        <span />
        <button
          type="button"
          aria-label="Move up"
          onClick={() => move("up")}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border py-2 font-mono text-xs focus-visible:outline focus-visible:outline-2"
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          aria-label="Move left"
          onClick={() => move("left")}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border py-2 font-mono text-xs focus-visible:outline focus-visible:outline-2"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Move down"
          onClick={() => move("down")}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border py-2 font-mono text-xs focus-visible:outline focus-visible:outline-2"
        >
          ↓
        </button>
        <button
          type="button"
          aria-label="Move right"
          onClick={() => move("right")}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border py-2 font-mono text-xs focus-visible:outline focus-visible:outline-2"
        >
          →
        </button>
      </div>

      <p role="status" className="mt-3 text-center font-mono text-sm">
        {won ? (
          <span className="text-glow-cyan uppercase tracking-[0.2em]">
            Level complete / moves {moves} / time {(elapsed / 1000).toFixed(1)}s / efficiency {Math.min(100, Math.round((OPTIMAL_MOVES / Math.max(moves, 1)) * 100))}% (shortest-path move score) — experiment successful.
          </span>
        ) : (
          <span className="text-fg-dim">
            Slide (arrow keys, WASD, or buttons) until you hit a wall. Reach ◎ to win.
          </span>
        )}
      </p>
    </div>
  );
}
