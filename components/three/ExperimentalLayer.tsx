"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type VisualWorld = "intro" | "engineer" | "builder" | "lab" | "outro";

const WORLD_LABEL: Record<VisualWorld, string> = {
  intro: "Ambient control-room layer",
  engineer: "Engineer system graph",
  builder: "Builder project artifact",
  lab: "Lab orbital simulation",
  outro: "Contact transmission layer",
};

const WORLD_CONFIG: Record<
  VisualWorld,
  {
    camera: THREE.Vector3Tuple;
    rotation: THREE.Vector3Tuple;
    particleOpacity: number;
    gridOpacity: number;
  }
> = {
  intro: {
    camera: [0, 0.4, 8],
    rotation: [0, 0, 0],
    particleOpacity: 0.42,
    gridOpacity: 0.18,
  },
  engineer: {
    camera: [-1.6, 0.7, 6.4],
    rotation: [0.1, -0.35, 0],
    particleOpacity: 0.5,
    gridOpacity: 0.36,
  },
  builder: {
    camera: [1.4, 0.45, 6],
    rotation: [-0.05, 0.38, 0],
    particleOpacity: 0.38,
    gridOpacity: 0.24,
  },
  lab: {
    camera: [0, 0.15, 5.5],
    rotation: [0.18, 0, 0.05],
    particleOpacity: 0.65,
    gridOpacity: 0.12,
  },
  outro: {
    camera: [0.8, 0.35, 7.2],
    rotation: [0, 0.18, 0],
    particleOpacity: 0.34,
    gridOpacity: 0.28,
  },
};

function getCapabilityProfile() {
  if (typeof window === "undefined") {
    return { particleCount: 140, dpr: [1, 1.25] as [number, number] };
  }

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  return {
    particleCount: coarsePointer || narrow ? 120 : 260,
    dpr: narrow ? ([1, 1.2] as [number, number]) : ([1, 1.5] as [number, number]),
  };
}

function supportsWebGL() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

function seededUnit(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function useGlobalPointer() {
  const pointer = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        active: event.pointerType !== "touch",
      };
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  return pointer;
}

class ThreeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function useScrollWorld(prefersReducedMotion: boolean) {
  const [world, setWorld] = useState<VisualWorld>("intro");
  const targetWorld = useRef<VisualWorld>("intro");

  useGSAP(
    () => {
      registerGsap();

      if (prefersReducedMotion) {
        setWorld("intro");
        return;
      }

      const activate = (nextWorld: VisualWorld) => {
        targetWorld.current = nextWorld;
        setWorld(nextWorld);
      };

      const triggers = [
        { id: "intro", world: "intro" },
        { id: "engineering", world: "engineer" },
        { id: "projects", world: "builder" },
        { id: "lab", world: "lab" },
        { id: "journey", world: "outro" },
        { id: "contact", world: "outro" },
      ] as const;

      triggers.forEach(({ id, world }) => {
        const trigger = document.getElementById(id);
        if (!trigger) return;

        ScrollTrigger.create({
          trigger,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => activate(world),
          onEnterBack: () => activate(world),
        });
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [prefersReducedMotion] }
  );

  return { world, targetWorld };
}

function AtmosphericParticles({
  count,
  opacityRef,
  pointer,
}: {
  count: number;
  opacityRef: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + seededUnit(i) * 7;
      const angle = seededUnit(i + 11) * Math.PI * 2;
      const height = (seededUnit(i + 23) - 0.5) * 5;

      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = height;
      values[i * 3 + 2] = Math.sin(angle) * radius - 2;
    }

    return values;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.018;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      pointer.current.y * 0.035,
      0.04
    );
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(
      pointsRef.current.rotation.z,
      pointer.current.x * -0.03,
      0.04
    );

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      opacityRef.current,
      0.05
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8ffcff"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  );
}

function WireGrid({ opacityRef }: { opacityRef: React.MutableRefObject<number> }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((_, delta) => {
    if (!gridRef.current) return;

    gridRef.current.position.z += delta * 0.22;
    if (gridRef.current.position.z > 1.2) gridRef.current.position.z = 0;

    const material = gridRef.current.material as THREE.Material & {
      opacity: number;
      transparent: boolean;
    };
    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      opacityRef.current,
      0.06
    );
    material.transparent = true;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[18, 28, "#00fff5", "#1a3e47"]}
      position={[0, -2.2, -1]}
      rotation={[0, 0, 0]}
    />
  );
}

function EngineerArtifact({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const packetRef = useRef<THREE.Mesh>(null);
  const nodes = useMemo<THREE.Vector3Tuple[]>(
    () => [
      [-2.4, -0.2, 0],
      [-1.1, 0.85, -0.3],
      [0.35, 0.2, 0.2],
      [1.55, 0.95, -0.45],
      [2.5, -0.25, 0],
      [0.7, -1, -0.2],
    ],
    []
  );
  const routes = useMemo(
    () => [
      [nodes[0], nodes[1], nodes[2], nodes[3], nodes[4]],
      [nodes[2], nodes[5], nodes[4]],
      [nodes[1], nodes[5]],
    ],
    [nodes]
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * (active ? 0.2 : 0.05);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, active ? 1 : 0.88, 0.06)
    );

    if (packetRef.current) {
      const t = (state.clock.elapsedTime * 0.3) % 1;
      const curve = new THREE.CatmullRomCurve3(
        routes[0].map((point) => new THREE.Vector3(...point))
      );
      packetRef.current.position.copy(curve.getPointAt(t));
    }
  });

  return (
    <group ref={groupRef} position={[-1.1, 0.25, -0.6]}>
      {routes.map((route, index) => (
        <Line
          key={`route-${index}`}
          points={route}
          color={index === 1 ? "#d2a552" : "#00fff5"}
          transparent
          opacity={active ? 0.48 : 0.18}
          lineWidth={1}
        />
      ))}
      {nodes.map((node, index) => (
        <mesh key={index} position={node}>
          <octahedronGeometry args={[index === 2 ? 0.18 : 0.12, 0]} />
          <meshStandardMaterial
            color={index === 5 ? "#d2a552" : "#9afcff"}
            emissive={index === 5 ? "#8c5b17" : "#006b73"}
            emissiveIntensity={active ? 0.8 : 0.25}
            wireframe={index % 2 === 0}
          />
        </mesh>
      ))}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#d2a552" />
      </mesh>
    </group>
  );
}

function BuilderArtifact({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * (active ? 0.22 : 0.08);
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, active ? 1 : 0.82, 0.055)
    );
  });

  return (
    <group ref={groupRef} position={[1.2, 0.15, -0.2]}>
      <mesh>
        <boxGeometry args={[1.15, 2, 0.48]} />
        <meshStandardMaterial
          color="#101820"
          emissive="#003b42"
          emissiveIntensity={active ? 0.28 : 0.08}
          roughness={0.45}
          metalness={0.72}
        />
      </mesh>
      <mesh position={[0, 0, 0.255]}>
        <boxGeometry args={[0.82, 1.35, 0.025]} />
        <meshBasicMaterial color="#00fff5" transparent opacity={active ? 0.18 : 0.08} />
      </mesh>
      <mesh position={[0, 0.76, 0.33]}>
        <boxGeometry args={[1.36, 0.08, 0.06]} />
        <meshBasicMaterial color="#d2a552" transparent opacity={0.72} />
      </mesh>
      {[-0.42, 0, 0.42].map((x, index) => (
        <mesh key={x} position={[x, -0.6 + index * 0.38, 0.35]}>
          <boxGeometry args={[0.22, 0.045, 0.045]} />
          <meshBasicMaterial color={index === 1 ? "#d2a552" : "#8ffcff"} />
        </mesh>
      ))}
      <Line
        points={[
          [-0.88, -1.22, 0.32],
          [0.88, -1.22, 0.32],
          [0.88, 1.22, 0.32],
          [-0.88, 1.22, 0.32],
          [-0.88, -1.22, 0.32],
        ]}
        color="#8ffcff"
        transparent
        opacity={active ? 0.42 : 0.14}
      />
    </group>
  );
}

function LabArtifact({
  active,
  paused,
  resetSignal,
  pointer,
}: {
  active: boolean;
  paused: boolean;
  resetSignal: number;
  pointer: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<Array<THREE.Mesh | null>>([]);

  const orbiters = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        radius: 0.8 + seededUnit(index + 41) * 1.25,
        speed: 0.28 + seededUnit(index + 52) * 0.42,
        phase: seededUnit(index + 63) * Math.PI * 2,
        y: (seededUnit(index + 74) - 0.5) * 1.25,
      })),
    []
  );

  useEffect(() => {
    particleRefs.current.forEach((mesh) => {
      if (mesh) mesh.position.set(0, 0, 0);
    });
  }, [resetSignal]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const motionDelta = paused ? 0 : delta;
    groupRef.current.rotation.y += motionDelta * (active ? 0.24 : 0.06);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, active ? 1 : 0.8, 0.06)
    );

    particleRefs.current.forEach((mesh, index) => {
      if (!mesh) return;

      const orbiter = orbiters[index];
      const angle = orbiter.phase + elapsed * orbiter.speed * (paused ? 0 : 1);
      const target = new THREE.Vector3(
        Math.cos(angle) * orbiter.radius,
        orbiter.y + Math.sin(angle * 1.7) * 0.18,
        Math.sin(angle) * orbiter.radius
      );

      if (pointer.current.active && active && !paused) {
        const pointerVector = new THREE.Vector3(
          pointer.current.x * 1.8,
          pointer.current.y * 1.1,
          0
        );
        const distance = target.distanceTo(pointerVector);
        if (distance < 1.2) {
          target.add(
            target
              .clone()
              .sub(pointerVector)
              .normalize()
              .multiplyScalar((1.2 - distance) * 0.9)
          );
        }
      }

      mesh.position.lerp(target, paused ? 0.08 : 0.18);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0.1]}>
      <mesh>
        <icosahedronGeometry args={[0.48, 2]} />
        <meshStandardMaterial
          color="#0d2024"
          emissive="#00fff5"
          emissiveIntensity={active ? 0.82 : 0.22}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshBasicMaterial
          color="#00fff5"
          transparent
          opacity={active ? 0.08 : 0.03}
          depthWrite={false}
        />
      </mesh>
      {orbiters.map((orbiter, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            particleRefs.current[index] = mesh;
          }}
          position={[orbiter.radius, orbiter.y, 0]}
        >
          <sphereGeometry args={[index % 5 === 0 ? 0.055 : 0.035, 10, 10]} />
          <meshBasicMaterial color={index % 5 === 0 ? "#d2a552" : "#8ffcff"} />
        </mesh>
      ))}
    </group>
  );
}

function ExperimentalScene({
  worldRef,
  world,
  paused,
  resetSignal,
  particleCount,
}: {
  worldRef: React.MutableRefObject<VisualWorld>;
  world: VisualWorld;
  paused: boolean;
  resetSignal: number;
  particleCount: number;
}) {
  const pointer = useGlobalPointer();
  const groupRef = useRef<THREE.Group>(null);
  const particleOpacity = useRef(WORLD_CONFIG.intro.particleOpacity);
  const gridOpacity = useRef(WORLD_CONFIG.intro.gridOpacity);

  useFrame((state) => {
    const config = WORLD_CONFIG[worldRef.current];
    particleOpacity.current = config.particleOpacity;
    gridOpacity.current = config.gridOpacity;

    state.camera.position.lerp(new THREE.Vector3(...config.camera), 0.04);
    state.camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        config.rotation[0] + pointer.current.y * 0.05,
        0.04
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        config.rotation[1] + pointer.current.x * 0.08,
        0.04
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        config.rotation[2],
        0.04
      );
    }
  });

  return (
    <>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 6, 16]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 4, 4]} intensity={1.2} color="#8ffcff" />
      <pointLight position={[-4, -1, 2]} intensity={0.45} color="#d2a552" />
      <AtmosphericParticles
        count={particleCount}
        opacityRef={particleOpacity}
        pointer={pointer}
      />
      <WireGrid opacityRef={gridOpacity} />
      <group ref={groupRef}>
        <EngineerArtifact active={world === "engineer"} />
        <BuilderArtifact active={world === "builder"} />
        <LabArtifact
          active={world === "lab"}
          paused={paused}
          resetSignal={resetSignal}
          pointer={pointer}
        />
      </group>
    </>
  );
}

function ExperimentalFallback({
  reason,
  world,
}: {
  reason: string;
  world: VisualWorld;
}) {
  return (
    <aside
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void"
      aria-label="Static experimental visual layer"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,245,0.14),transparent_35%),linear-gradient(115deg,rgba(210,165,82,0.08),transparent_30%)]" />
      <div className="bg-circuit-grid absolute inset-0 opacity-15" />
      <div className="border-neon-cyan/20 absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border" />
      <div className="border-neon-cyan/10 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border" />
      <div className="border-border-dim bg-black-glass/70 absolute bottom-5 left-5 max-w-xs border p-3 font-mono text-xs text-fg-dim">
        <p className="text-neon-cyan tracking-[0.25em] uppercase">
          Phase 4 fallback
        </p>
        <p className="mt-2 leading-relaxed">
          {reason}. Static channel: {WORLD_LABEL[world]}.
        </p>
      </div>
    </aside>
  );
}

function ExperimentalLayerClient() {
  const prefersReducedMotion = useReducedMotion();
  const [webGLState] = useState<"ready" | "failed">(
    () => (supportsWebGL() ? "ready" : "failed")
  );
  const [paused, setPaused] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [{ particleCount, dpr }] = useState(getCapabilityProfile);
  const { world, targetWorld } = useScrollWorld(prefersReducedMotion);

  if (prefersReducedMotion) {
    return (
      <ExperimentalFallback
        reason="Reduced motion is enabled"
        world={world}
      />
    );
  }

  if (webGLState === "failed") {
    return <ExperimentalFallback reason="WebGL is unavailable" world={world} />;
  }

  return (
    <ThreeErrorBoundary
      fallback={<ExperimentalFallback reason="The 3D renderer stopped" world={world} />}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-void"
        aria-hidden="true"
      >
        {webGLState === "ready" && (
          <Canvas
            dpr={dpr}
            camera={{ position: WORLD_CONFIG.intro.camera, fov: 48, near: 0.1, far: 80 }}
            gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          >
            <ExperimentalScene
              worldRef={targetWorld}
              world={world}
              paused={paused}
              resetSignal={resetSignal}
              particleCount={particleCount}
            />
          </Canvas>
        )}
      </div>
      <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-end gap-2">
        <div className="border-border-dim bg-black-glass/85 hidden border px-3 py-2 font-mono text-[0.65rem] tracking-[0.2em] text-fg-dim uppercase shadow-[0_0_24px_rgba(0,0,0,0.45)] sm:block">
          Visual channel: <span className="text-neon-cyan">{WORLD_LABEL[world]}</span>
        </div>
        <button
          type="button"
          aria-pressed={paused}
          aria-label={paused ? "Resume lab simulation" : "Pause lab simulation"}
          onClick={() => setPaused((value) => !value)}
          className="border-neon-cyan/50 bg-black-glass/90 text-neon-cyan focus-visible:outline-neon-cyan inline-flex items-center gap-2 border px-3 py-2 font-mono text-xs tracking-[0.18em] uppercase transition-colors hover:border-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
          {paused ? "Resume Lab" : "Pause Lab"}
        </button>
        <button
          type="button"
          aria-label="Reset lab simulation"
          onClick={() => setResetSignal((value) => value + 1)}
          className="border-border-dim bg-black-glass/90 text-fg-dim hover:text-fg focus-visible:outline-neon-cyan inline-flex items-center gap-2 border px-3 py-2 font-mono text-xs tracking-[0.18em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <RotateCcw size={14} aria-hidden />
          Reset
        </button>
      </div>
    </ThreeErrorBoundary>
  );
}

export const ExperimentalLayer = dynamic(
  () => Promise.resolve(ExperimentalLayerClient),
  {
    ssr: false,
  }
);
