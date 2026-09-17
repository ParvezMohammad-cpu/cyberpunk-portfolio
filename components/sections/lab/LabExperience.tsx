"use client";

import Link from "next/link";
import { useState } from "react";
import { AimTrainer } from "@/components/sections/projects/demos/AimTrainer";
import { ArrowPuzzle } from "@/components/sections/projects/demos/ArrowPuzzle";
import { projectile, systemMetrics } from "@/lib/lab-engines";

const button = "border border-border-dim px-3 py-2 font-mono text-xs uppercase tracking-widest text-fg-dim hover:border-neon-cyan hover:text-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan";

export function LabExperience({ slug }: { slug: string }) {
  if (slug === "neural-system") return <NeuralSystem />;
  if (slug === "parvez-arcade") return <Arcade />;
  if (slug === "gear-system") return <GearSystem />;
  if (slug === "physics-playground") return <Physics />;
  if (slug === "distributed-system") return <Distributed />;
  return <Retrospective />;
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-void px-5 py-10 font-mono text-fg sm:px-10"><Link href="/#lab" className="text-xs text-neon-cyan underline">← RETURN TO LAB</Link><p className="mt-8 text-xs tracking-[.3em] text-fg-dim">EXPERIMENT LAB / IMMERSIVE PROTOTYPE</p><h1 className="mt-2 font-display text-3xl tracking-widest sm:text-5xl">{title}</h1><div className="mt-8 max-w-4xl">{children}</div></main>;
}

function NeuralSystem() {
  const corpus = ["Retrieval finds relevant information before an answer is composed.", "Context is a deliberately limited selection of retrieved material.", "Generation here is deterministic educational template output."];
  const [query, setQuery] = useState("How does retrieval inform context?");
  const matches = corpus.filter((item) => query.toLowerCase().split(/\W+/).some((word) => word.length > 3 && item.toLowerCase().includes(word))).slice(0, 2);
  const context = matches.length ? matches : [corpus[0]];
  return <Shell title="NEURAL SYSTEM"><p className="text-fg-dim">EXPERIMENT 01 / STATUS: PROTOTYPE. Educational local mock — no live model or external inference.</p><label className="mt-6 block text-xs">MODEL / INSPECT QUERY<input value={query} onChange={(e) => setQuery(e.target.value)} className="mt-2 w-full border border-border-dim bg-black-glass p-3 text-fg" /></label><div className="mt-6 grid gap-4 sm:grid-cols-3">{["RETRIEVAL", "CONTEXT", "GENERATION"].map((stage, index) => <section key={stage} className="border border-border-dim p-4"><h2 className="text-neon-cyan">{stage}</h2><p className="mt-3 text-xs leading-relaxed text-fg-dim">{index < 2 ? context.join(" ") : `A deterministic response uses the selected context: ${context[0]}`}</p></section>)}</div></Shell>;
}

function Arcade() { return <Shell title="PARVEZ ARCADE"><p className="text-fg-dim">Working browser prototypes. No portfolio HUD or pointer lock is used during play.</p><h2 className="mt-8 text-xl">ARROW PUZZLE / LEVEL 01</h2><p className="mt-2 text-xs text-fg-dim">Slide to the goal. Results are measured in this session.</p><ArrowPuzzle /><h2 className="mt-10 text-xl">AIM TRAINER</h2><AimTrainer /><p className="mt-8 border border-border-dim p-4 text-xs text-fg-dim">FUTURE GAMES / CLASSIFIED — unavailable by design.</p></Shell>; }

function GearSystem() {
  const [part, setPart] = useState("Gear"); const [speed, setSpeed] = useState(50); const [paused, setPaused] = useState(false);
  return <Shell title="OBJECT INSPECTION / GEAR SYSTEM"><p className="text-fg-dim">Procedural browser study, not a Blender-authored asset.</p><div className="mt-6 grid gap-5 sm:grid-cols-[1fr_220px]"><div className="relative flex aspect-video items-center justify-center overflow-hidden border border-border-dim bg-circuit-grid"><div className={`h-36 w-36 rounded-full border-8 border-neon-cyan ${paused ? "" : "animate-spin"}`} style={{ animationDuration: `${Math.max(1, 8 - speed / 8)}s` }} aria-label={`Selected ${part} diagram`}><div className="m-10 h-12 w-12 rounded-full border-4 border-neon-magenta" /></div><span className="absolute bottom-3 left-3 text-xs">STATIC LABELED DIAGRAM / {part.toUpperCase()}</span></div><div><div className="grid gap-2">{["Gear", "Shaft", "Bearing", "Housing"].map((item, index) => <button key={item} onClick={() => setPart(item)} className={`${button} ${part === item ? "border-neon-cyan text-neon-cyan" : ""}`}>0{index + 1} {item}</button>)}</div><label className="mt-4 block text-xs">SIMULATION SPEED: {speed}%<input aria-label="Simulation speed" type="range" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="mt-2 w-full" /></label><button onClick={() => setPaused(!paused)} className={`${button} mt-3`}>{paused ? "Play" : "Pause"}</button></div></div><p className="mt-5 text-sm text-fg-dim">{part}: selectable component highlight and explanatory inspection target. Reset view is represented by selecting Gear.</p></Shell>;
}

function Physics() {
  const [velocity, setVelocity] = useState(20); const [angle, setAngle] = useState(45); const [gravity, setGravity] = useState(9.81); const [mass, setMass] = useState(1);
  const result = projectile(velocity, angle, gravity);
  return <Shell title="PHYSICS PLAYGROUND"><p className="text-fg-dim">Educational no-air-resistance model. Mass does not change projectile trajectory in a vacuum.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Velocity (m/s)", velocity, setVelocity, 1, 100], ["Angle (degrees)", angle, setAngle, 1, 89], ["Gravity (m/s²)", gravity, setGravity, 0.5, 30], ["Mass (kg)", mass, setMass, 0.1, 100]].map(([label, value, setter, min, max]) => <label key={String(label)} className="text-xs">{String(label)}<input type="number" min={Number(min)} max={Number(max)} value={Number(value)} onChange={(e) => (setter as (v:number)=>void)(Math.min(Number(max), Math.max(Number(min), Number(e.target.value) || Number(min))))} className="ml-3 border border-border-dim bg-black-glass p-2" /></label>)}</div><div className="mt-5 flex flex-wrap gap-2">{[["Earth",9.81],["Moon",1.62],["Mars",3.71],["Jupiter",24.79]].map(([name,g]) => <button key={String(name)} className={button} onClick={() => setGravity(Number(g))}>{String(name)}</button>)}</div><div className="mt-8 border border-border-dim p-5">PROJECTILE / time {result.time.toFixed(2)} s · range {result.range.toFixed(1)} m · max height {result.height.toFixed(1)} m<br/><span className="text-xs text-fg-dim">Gravity drop: distance after one second is {(gravity / 2).toFixed(2)} m (from rest).</span></div></Shell>;
}

function Distributed() {
  const [traffic, setTraffic] = useState(100); const [model, setModel] = useState({ apis: 2, cache: false, replicas: 0, queue: false }); const metrics = systemMetrics(traffic, model);
  const change = (next: Partial<typeof model>) => setModel({ ...model, ...next });
  return <Shell title="DISTRIBUTED SYSTEM"><p className="text-fg-dim">Synthetic qualitative model, not a production benchmark. CLIENTS → LOAD BALANCER → API → CACHE → DATABASE.</p><div className="mt-5 flex flex-wrap gap-2">{[10,100,1000,10000,100000,1000000].map((n) => <button className={button} key={n} onClick={() => setTraffic(n)}>{n >= 1000 ? `${n / 1000}K` : n} requests/sec</button>)}</div><div className="mt-5 flex flex-wrap gap-2"><button className={button} onClick={() => change({ cache: true })}>Add cache</button><button className={button} onClick={() => change({ replicas: model.replicas + 1 })}>Add replica</button><button className={button} onClick={() => change({ queue: true })}>Add queue</button><button className={button} onClick={() => change({ apis: model.apis + 1 })}>Scale horizontally</button><button className={button} onClick={() => setModel({ apis: 2, cache: false, replicas: 0, queue: false })}>Reset</button></div><p role="status" className="mt-6 border border-border-dim p-5">{metrics.overloaded ? "OVERLOAD" : "WITHIN CAPACITY"} / capacity {metrics.capacity} rps / queue {metrics.queue} rps / latency {metrics.latency} ms / errors {metrics.errors} rps</p><p className="mt-4 text-xs text-fg-dim">Cache reduces database demand; replicas increase read capacity only in this simplified model; queues defer excess work and add latency; APIs cannot remove database bottlenecks.</p></Shell>;
}

function Retrospective() { return <Shell title="FAILED EXPERIMENTS"><p className="text-fg-dim">Illustrative sample retrospectives, not autobiographical project history.</p><div className="mt-6 space-y-4"><p className="border border-border-dim p-4">EXPERIMENT 004 / FAILED — Architecture did not scale. Lesson: don&apos;t optimize the wrong bottleneck.</p><p className="border border-border-dim p-4">EXPERIMENT 007 / ABANDONED — Complexity exceeded value. Lesson: not every technically interesting idea should become a product.</p></div></Shell>; }
