"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Database,
  GitBranch,
  RotateCcw,
  Server,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ENGINEERING_MODULES,
  ENGINEERING_TIMELINE,
  METRIC_STORIES,
  MINDSET_STAGES,
  type EngineeringModuleId,
  type MindsetId,
} from "@/lib/data/engineering-phase3";
import { NeonButton } from "@/components/ui/NeonButton";

type SimulatorMode = "stable" | "broken" | "cache" | "database" | "queue" | "servers";

const REQUEST_TICK_MS = 1200;
// Chosen to create visibly different demo traffic rates without implying real telemetry.
const STABLE_REQUEST_INCREMENT = 29;
const DEGRADED_REQUEST_INCREMENT = 73;

// Simulator values are illustrative client-side states, not measured production metrics.
const SIMULATOR_STATE: Record<
  SimulatorMode,
  { label: string; latency: string; errors: string; load: string; message: string }
> = {
  stable: {
    label: "NOMINAL",
    latency: "120ms",
    errors: "0.2%",
    load: "42%",
    message: "Traffic is flowing through edge, WAF, application, and database layers.",
  },
  broken: {
    label: "DEGRADED",
    latency: "890ms",
    errors: "9.8%",
    load: "96%",
    message: "A request spike overloaded the application/database path. Choose a mitigation.",
  },
  cache: {
    label: "CACHE INSERTED",
    latency: "240ms",
    errors: "2.1%",
    load: "63%",
    message: "ADD CACHE absorbs repeated reads and lowers database pressure.",
  },
  database: {
    label: "DATABASE SCALED",
    latency: "310ms",
    errors: "1.6%",
    load: "58%",
    message: "SCALE DATABASE improves write/read headroom but does not reduce every app bottleneck.",
  },
  queue: {
    label: "QUEUE ONLINE",
    latency: "420ms",
    errors: "1.1%",
    load: "55%",
    message: "ADD QUEUE protects downstream systems by smoothing bursty background work.",
  },
  servers: {
    label: "APP TIER SCALED",
    latency: "280ms",
    errors: "1.9%",
    load: "61%",
    message: "ADD MORE SERVERS distributes application load while the data tier remains watched.",
  },
};

const graphNodes = [
  { label: "USERS", x: 8, y: 50 },
  { label: "AZURE FRONT DOOR", x: 29, y: 24 },
  { label: ".NET API", x: 52, y: 20 },
  { label: "NODE.JS API", x: 52, y: 72 },
  { label: "DATABASE", x: 82, y: 50 },
];

const flowSteps = ["USER", "FRONT DOOR", "WAF", "APPLICATION", "DATABASE"];

function selectDistinct<T>(current: T, next: T) {
  return Object.is(current, next) ? current : next;
}

export function EngineeringWorld() {
  const prefersReducedMotion = useReducedMotion();
  const [activeModuleId, setActiveModuleId] =
    useState<EngineeringModuleId>("cloud");
  const [activeTimeline, setActiveTimeline] = useState(ENGINEERING_TIMELINE[0].id);
  const [activeMindset, setActiveMindset] = useState<MindsetId>("understand");
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>("stable");
  const [requests, setRequests] = useState(1280);

  const activeModule = useMemo(
    () =>
      ENGINEERING_MODULES.find((module) => module.id === activeModuleId) ??
      ENGINEERING_MODULES[0],
    [activeModuleId]
  );
  const timelineEntry =
    ENGINEERING_TIMELINE.find((entry) => entry.id === activeTimeline) ??
    ENGINEERING_TIMELINE[0];
  const mindset =
    MINDSET_STAGES.find((stage) => stage.id === activeMindset) ??
    MINDSET_STAGES[0];
  const simulator = SIMULATOR_STATE[simulatorMode];
  const selectModule = useCallback((moduleId: EngineeringModuleId) => {
    setActiveModuleId((current) => selectDistinct(current, moduleId));
  }, []);
  const selectTimeline = useCallback((timelineId: string) => {
    setActiveTimeline((current) => selectDistinct(current, timelineId));
  }, []);
  const selectMindset = useCallback((mindsetId: MindsetId) => {
    setActiveMindset((current) => selectDistinct(current, mindsetId));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Mitigation modes intentionally settle the counter so the chosen fix is readable.
    if (simulatorMode !== "stable" && simulatorMode !== "broken") return;

    const interval = window.setInterval(() => {
      setRequests(
        (value) =>
          value +
          (simulatorMode === "broken"
            ? DEGRADED_REQUEST_INCREMENT
            : STABLE_REQUEST_INCREMENT)
      );
    }, REQUEST_TICK_MS);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, simulatorMode]);

  return (
    <div className="mt-8 flex w-full max-w-6xl flex-col gap-10 text-left">
      <ArchitectureGraph />
      <ModuleConsole
        activeModuleId={activeModuleId}
        onSelect={selectModule}
        activeModule={activeModule}
      />
      <MetricsAndTimeline
        activeTimeline={activeTimeline}
        onSelectTimeline={selectTimeline}
        timelineEntry={timelineEntry}
      />
      <ArchitectureSimulator
        mode={simulatorMode}
        simulator={simulator}
        requests={requests}
        onBreak={() => setSimulatorMode("broken")}
        onReset={() => {
          setSimulatorMode("stable");
          setRequests(1280);
        }}
        onMitigate={setSimulatorMode}
      />
      <MindsetConsole
        activeMindset={activeMindset}
        onSelect={selectMindset}
        mindset={mindset}
      />
      <div
        data-reveal
        className="border-neon-cyan/40 bg-black-glass/70 relative overflow-hidden border p-5 text-center"
      >
        <div className="bg-circuit-grid pointer-events-none absolute inset-0 opacity-20" />
        <p className="font-mono text-neon-cyan text-xs tracking-[0.35em] uppercase">
          ENGINEERING MODULE COMPLETE
        </p>
        <h3 className="font-display text-fg mt-3 text-2xl font-bold tracking-[0.18em] uppercase">
          Systems mapped. Build logs ready.
        </h3>
        <p className="text-fg-dim mx-auto mt-3 max-w-2xl font-mono text-sm leading-relaxed">
          The next channel shifts from architecture thinking into selected
          projects — concrete builds, experiments, and proof-of-work.
        </p>
        <NeonButton href="#projects" className="mt-5">
          Bridge to Projects
        </NeonButton>
      </div>
    </div>
  );
}

function ArchitectureGraph() {
  return (
    <figure
      data-reveal
      className="border-border-dim bg-surface/50 relative overflow-hidden border p-4 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
            Alive Architecture Graph
          </p>
          <h3 className="font-display text-fg mt-2 text-xl font-bold tracking-[0.18em] uppercase">
            USERS → AZURE FRONT DOOR → APIs → DATABASE
          </h3>
        </div>
        <p className="text-fg-dim max-w-sm font-mono text-xs leading-relaxed">
          Animated packets are decorative; the labeled graph remains readable
          without motion.
        </p>
      </div>
      <svg
        viewBox="0 0 100 84"
        role="img"
        aria-labelledby="engineering-graph-title engineering-graph-desc"
        className="h-[22rem] w-full"
      >
        <title id="engineering-graph-title">Enterprise architecture flow</title>
        <desc id="engineering-graph-desc">
          Users route through Azure Front Door into .NET and Node.js APIs before
          reaching the database.
        </desc>
        <defs>
          <marker
            id="packet-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-neon-cyan)" />
          </marker>
        </defs>
        <path
          id="flow-main"
          d="M12 50 C20 48, 22 26, 29 24 C38 21, 43 20, 48 20"
          fill="none"
          stroke="rgba(0,255,245,.45)"
          strokeWidth="0.5"
          markerEnd="url(#packet-arrow)"
        />
        <path
          d="M33 25 C42 38, 43 63, 48 70"
          fill="none"
          stroke="rgba(0,255,245,.28)"
          strokeWidth="0.45"
          markerEnd="url(#packet-arrow)"
        />
        <path
          d="M56 20 C66 26, 72 42, 78 49"
          fill="none"
          stroke="rgba(0,255,245,.45)"
          strokeWidth="0.5"
          markerEnd="url(#packet-arrow)"
        />
        <path
          d="M56 72 C66 67, 72 58, 78 51"
          fill="none"
          stroke="rgba(0,255,245,.45)"
          strokeWidth="0.5"
          markerEnd="url(#packet-arrow)"
        />
        <circle className="data-packet packet-a" r="1.2" fill="var(--color-neon-yellow)" />
        <circle className="data-packet packet-b" r="1" fill="var(--color-neon-cyan)" />
        <circle className="data-packet packet-c" r="1" fill="var(--color-neon-magenta)" />
        {graphNodes.map((node) => (
          <g key={node.label}>
            <rect
              x={node.x - 8}
              y={node.y - 6}
              width="16"
              height="12"
              rx="1.5"
              fill="rgba(10,10,15,.9)"
              stroke="rgba(0,255,245,.55)"
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              className="fill-fg text-[2.4px] font-bold tracking-wider"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="text-fg-dim font-mono text-xs leading-relaxed">
        Control-room architecture model showing the representative edge, API,
        and persistence flow required for Phase 3.
      </figcaption>
    </figure>
  );
}

interface ModuleConsoleProps {
  activeModuleId: EngineeringModuleId;
  activeModule: (typeof ENGINEERING_MODULES)[number];
  onSelect: (moduleId: EngineeringModuleId) => void;
}

function ModuleConsole({
  activeModuleId,
  activeModule,
  onSelect,
}: ModuleConsoleProps) {
  return (
    <section
      data-reveal
      aria-labelledby="system-modules-heading"
      className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="border-border-dim bg-surface/50 border p-4 sm:p-6">
        <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
          Interactive System Modules
        </p>
        <h3
          id="system-modules-heading"
          className="font-display text-fg mt-2 text-xl font-bold tracking-[0.18em] uppercase"
        >
          Select a node to inspect its subsystem
        </h3>
        <p
          id="system-modules-instructions"
          className="text-fg-dim mt-2 font-mono text-xs leading-relaxed"
        >
          Click, tap, or tab to a module to preview its detail panel.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {ENGINEERING_MODULES.map((module) => {
            const isActive = module.id === activeModuleId;
            return (
              <button
                key={module.id}
                type="button"
                aria-pressed={isActive}
                aria-describedby="system-modules-instructions"
                onClick={() => onSelect(module.id)}
                onFocus={() => onSelect(module.id)}
                className={`group min-h-32 border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
                  isActive
                    ? "border-neon-cyan bg-black-glass/90"
                    : "border-border-dim bg-black-glass/50 hover:border-neon-cyan/50"
                }`}
              >
                <span className="font-mono text-neon-cyan text-[0.6rem] tracking-[0.25em] uppercase">
                  {module.signal}
                </span>
                <span className="font-display text-fg mt-2 block text-lg font-bold tracking-[0.18em]">
                  {module.label}
                </span>
                <span className="text-fg-dim mt-2 block font-mono text-xs leading-relaxed">
                  {module.summary}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <aside
        aria-live="polite"
        className="border-neon-cyan/40 bg-black-glass/80 border p-4 sm:p-6"
      >
        <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
          Detail Panel // {activeModule.signal}
        </p>
        <h4 className="font-display text-glow-cyan mt-3 text-2xl font-bold tracking-[0.2em]">
          {activeModule.label}
        </h4>
        <p className="text-fg mt-3 font-mono text-sm leading-relaxed">
          {activeModule.detail}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${activeModule.label} technologies`}>
          {activeModule.technologies.map((tech) => (
            <li
              key={tech}
              className="border-border-dim text-fg-dim border px-2 py-1 font-mono text-[0.65rem] tracking-wide"
            >
              {tech}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

interface MetricsAndTimelineProps {
  activeTimeline: string;
  timelineEntry: (typeof ENGINEERING_TIMELINE)[number];
  onSelectTimeline: (id: string) => void;
}

function MetricsAndTimeline({
  activeTimeline,
  timelineEntry,
  onSelectTimeline,
}: MetricsAndTimelineProps) {
  return (
    <section data-reveal className="grid gap-4 lg:grid-cols-2">
      <div className="border-border-dim bg-surface/50 border p-4 sm:p-6">
        <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
          Visual Metric Stories
        </p>
        <h3 className="font-display text-fg mt-2 text-xl font-bold tracking-[0.18em] uppercase">
          Before / After system outcomes
        </h3>
        <div className="mt-5 grid gap-3">
          {METRIC_STORIES.map((story) => (
            <article key={story.id} className="border-border-dim bg-black-glass/60 border p-4">
              <h4 className="font-display text-neon-cyan text-sm font-bold tracking-[0.2em]">
                {story.label}
              </h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <MetricBlock label="Before" value={story.before} />
                <MetricBlock label="After" value={story.after} active />
              </div>
              <p className="text-fg-dim mt-3 font-mono text-xs leading-relaxed">
                {story.note}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="border-border-dim bg-surface/50 border p-4 sm:p-6">
        <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
          System Evolution
        </p>
        <h3 className="font-display text-fg mt-2 text-xl font-bold tracking-[0.18em] uppercase">
          Professional signal timeline
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-[0.7fr_1fr]">
          <div className="flex flex-col gap-3" role="tablist" aria-label="Engineering timeline">
            {ENGINEERING_TIMELINE.map((entry) => {
              const isActive = entry.id === activeTimeline;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`timeline-panel-${entry.id}`}
                  onClick={() => onSelectTimeline(entry.id)}
                  className={`border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
                    isActive
                      ? "border-neon-cyan bg-black-glass/90"
                      : "border-border-dim bg-black-glass/50 hover:border-neon-cyan/50"
                  }`}
                >
                  <span className="font-mono text-neon-cyan text-[0.6rem] tracking-[0.25em] uppercase">
                    {entry.signal}
                  </span>
                  <span className="font-display text-fg mt-1 block text-sm font-bold tracking-[0.18em]">
                    {entry.organization}
                  </span>
                </button>
              );
            })}
          </div>
          <article
            id={`timeline-panel-${timelineEntry.id}`}
            role="tabpanel"
            className="border-neon-cyan/30 bg-black-glass/70 border-l-2 p-4"
          >
            <p className="font-mono text-neon-cyan text-xs tracking-[0.2em] uppercase">
              {timelineEntry.role}
            </p>
            <h4 className="font-display text-fg mt-1 text-xl font-bold">
              {timelineEntry.organization}
            </h4>
            <p className="text-fg-dim mt-3 font-mono text-sm leading-relaxed">
              {timelineEntry.summary}
            </p>
            <ul className="text-fg mt-4 list-inside list-disc space-y-2 font-mono text-sm">
              {timelineEntry.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${timelineEntry.organization} technologies`}>
              {timelineEntry.technologies.map((tech) => (
                <li key={tech} className="border-border-dim text-fg-dim border px-2 py-1 font-mono text-[0.65rem]">
                  {tech}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function MetricBlock({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={`border p-3 ${
        active ? "border-neon-cyan/60 bg-neon-cyan/5" : "border-border-dim bg-void/40"
      }`}
    >
      <p className="font-mono text-fg-dim text-[0.6rem] tracking-[0.25em] uppercase">
        {label}
      </p>
      <p className="font-display text-fg mt-1 text-sm font-bold tracking-wide">{value}</p>
    </div>
  );
}

interface ArchitectureSimulatorProps {
  mode: SimulatorMode;
  simulator: (typeof SIMULATOR_STATE)[SimulatorMode];
  requests: number;
  onBreak: () => void;
  onReset: () => void;
  onMitigate: (mode: SimulatorMode) => void;
}

function ArchitectureSimulator({
  mode,
  simulator,
  requests,
  onBreak,
  onReset,
  onMitigate,
}: ArchitectureSimulatorProps) {
  const mitigations: { label: string; mode: SimulatorMode }[] = [
    { label: "ADD CACHE", mode: "cache" },
    { label: "SCALE DATABASE", mode: "database" },
    { label: "ADD QUEUE", mode: "queue" },
    { label: "ADD MORE SERVERS", mode: "servers" },
  ];
  const statusTone = mode === "broken" ? "text-glow-magenta" : "text-glow-cyan";

  return (
    <section
      data-reveal
      aria-labelledby="architecture-simulator-heading"
      className="border-border-dim bg-surface/50 border p-4 sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
            Interactive Architecture Simulator
          </p>
          <h3
            id="architecture-simulator-heading"
            className="font-display text-fg mt-2 text-xl font-bold tracking-[0.18em] uppercase"
          >
            Enterprise traffic under pressure
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeonButton type="button" variant="magenta" onClick={onBreak}>
            Break the System
          </NeonButton>
          <NeonButton type="button" onClick={onReset}>
            <RotateCcw size={16} aria-hidden />
            Reset
          </NeonButton>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border-border-dim bg-black-glass/70 border p-4">
          <ol className="grid gap-3 sm:grid-cols-5" aria-label="Simulated request path">
            {flowSteps.map((step, index) => (
              <li key={step} className="relative">
                <div
                  className={`border p-3 text-center ${
                    mode === "broken" && index >= 3
                      ? "border-neon-magenta/70 bg-neon-magenta/10"
                      : "border-neon-cyan/50 bg-neon-cyan/5"
                  }`}
                >
                  <StepIcon step={step} />
                  <p className="font-mono text-fg mt-2 text-[0.62rem] tracking-[0.18em]">
                    {step}
                  </p>
                </div>
                {index < flowSteps.length - 1 && (
                  <span
                    aria-hidden
                    className="bg-neon-cyan/50 absolute top-1/2 -right-2 hidden h-px w-4 sm:block"
                  />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <MetricBlock label="Requests" value={requests.toLocaleString()} active />
            <MetricBlock label="Latency" value={simulator.latency} />
            <MetricBlock label="Errors" value={simulator.errors} />
            <MetricBlock label="Load" value={simulator.load} />
          </div>
        </div>
        <aside aria-live="polite" className="border-neon-cyan/30 bg-black-glass/70 border p-4">
          <p className={`font-display text-xl font-bold tracking-[0.2em] ${statusTone}`}>
            {simulator.label}
          </p>
          <p className="text-fg mt-3 font-mono text-sm leading-relaxed">{simulator.message}</p>
          <div className="mt-5 grid gap-2">
            {mitigations.map((mitigation) => (
              <button
                key={mitigation.mode}
                type="button"
                disabled={mode !== "broken"}
                onClick={() => onMitigate(mitigation.mode)}
                className="border-border-dim text-fg-dim border px-3 py-2 text-left font-mono text-xs tracking-[0.18em] uppercase transition hover:border-neon-cyan hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                {mitigation.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function StepIcon({ step }: { step: string }) {
  const className = "mx-auto text-neon-cyan";
  if (step === "USER") return <Users className={className} size={20} aria-hidden />;
  if (step === "FRONT DOOR") return <GitBranch className={className} size={20} aria-hidden />;
  if (step === "WAF") return <Shield className={className} size={20} aria-hidden />;
  if (step === "APPLICATION") return <Server className={className} size={20} aria-hidden />;
  return <Database className={className} size={20} aria-hidden />;
}

interface MindsetConsoleProps {
  activeMindset: MindsetId;
  mindset: (typeof MINDSET_STAGES)[number];
  onSelect: (id: MindsetId) => void;
}

function MindsetConsole({
  activeMindset,
  mindset,
  onSelect,
}: MindsetConsoleProps) {
  return (
    <section
      data-reveal
      aria-labelledby="engineering-mindset-heading"
      className="border-border-dim bg-surface/50 border p-4 sm:p-6"
    >
      <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase">
        Engineering Mindset
      </p>
      <h3
        id="engineering-mindset-heading"
        className="font-display text-fg mt-2 text-xl font-bold tracking-[0.18em] uppercase"
      >
        Scanner loop: understand, design, measure
      </h3>
      <p
        id="engineering-mindset-instructions"
        className="text-fg-dim mt-2 font-mono text-xs leading-relaxed"
      >
        Hover, focus, or click a scanner stage to expand the active operating
        signals.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {MINDSET_STAGES.map((stage) => {
            const isActive = stage.id === activeMindset;
            return (
              <button
                key={stage.id}
                type="button"
                aria-pressed={isActive}
                aria-describedby="engineering-mindset-instructions"
                onClick={() => onSelect(stage.id)}
                onFocus={() => onSelect(stage.id)}
                onMouseEnter={() => onSelect(stage.id)}
                className={`border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
                  isActive
                    ? "border-neon-cyan bg-black-glass/90"
                    : "border-border-dim bg-black-glass/50 hover:border-neon-cyan/50"
                }`}
              >
                <span className="flex items-center gap-2 font-display text-fg text-sm font-bold tracking-[0.16em]">
                  {stage.id === "measure" ? (
                    <Activity size={16} aria-hidden />
                  ) : (
                    <Zap size={16} aria-hidden />
                  )}
                  {stage.label}
                </span>
                <span className="text-fg-dim mt-2 block font-mono text-xs leading-relaxed">
                  {stage.summary}
                </span>
              </button>
            );
          })}
        </div>
        <aside aria-live="polite" className="border-neon-cyan/30 bg-black-glass/70 border p-4">
          <h4 className="font-display text-glow-cyan text-xl font-bold tracking-[0.18em]">
            {mindset.label}
          </h4>
          <p className="text-fg mt-3 font-mono text-sm leading-relaxed">{mindset.summary}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label={`${mindset.label} signals`}>
            {mindset.signals.map((signal) => (
              <li
                key={signal}
                className="border-border-dim bg-void/40 border px-3 py-2 font-mono text-xs text-fg-dim"
              >
                {signal}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
