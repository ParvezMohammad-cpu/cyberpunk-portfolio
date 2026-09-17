"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { ArchitectureNode } from "@/lib/data/types";

interface ServerArtifactSceneProps {
  nodes: ArchitectureNode[];
  activeId: string | null;
  defaultId: string | null;
  onActivate: (id: string) => void;
}

const RADIUS = 2.1;

function nodePosition(index: number, total: number): [number, number, number] {
  const angle = (index / total) * Math.PI * 2;
  return [Math.cos(angle) * RADIUS, Math.sin(angle) * 0.6, Math.sin(angle) * RADIUS];
}

function DataPacket({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() + delay) % 4) / 4;
    ref.current.position.set(
      Math.cos(t * Math.PI * 2) * RADIUS,
      Math.sin(t * Math.PI * 4) * 0.3,
      Math.sin(t * Math.PI * 2) * RADIUS
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#00fff5" />
    </mesh>
  );
}

/**
 * The REAL project's "floating transparent server/container" (Step 4.2).
 * A wireframe chassis with component nodes orbiting it; hovering OR
 * focusing a node's `<Html>` label highlights it — the labels are real
 * DOM buttons, so this works with mouse, keyboard, and touch alike.
 */
function ServerArtifactScene({ nodes, activeId, defaultId, onActivate }: ServerArtifactSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const packets = useMemo(() => [0, 1.3, 2.6], []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#00fff5" />
      <pointLight position={[-3, -2, -2]} intensity={0.5} color="#ff2ea6" />

      <group ref={groupRef}>
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[1.4, 2, 1.4]} />
          <meshBasicMaterial color="#00fff5" wireframe transparent opacity={0.35} />
        </mesh>

        {nodes.map((node, index) => {
          const position = nodePosition(index, nodes.length);
          const isActive = activeId === node.id;
          return (
            <group key={node.id} position={position}>
              <mesh
                onPointerOver={() => onActivate(node.id)}
                onPointerOut={() => {
                  if (defaultId) onActivate(defaultId);
                }}
                scale={isActive ? 1.35 : 1}
              >
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial
                  color={isActive ? "#ff2ea6" : "#00fff5"}
                  emissive={isActive ? "#ff2ea6" : "#00fff5"}
                  emissiveIntensity={isActive ? 0.9 : 0.35}
                />
              </mesh>
              <Html center distanceFactor={8} occlude={false}>
                <button
                  type="button"
                  onFocus={() => onActivate(node.id)}
                  onClick={() => onActivate(node.id)}
                  className={`pointer-events-auto whitespace-nowrap rounded-none border px-2 py-1 font-mono text-[0.55rem] tracking-[0.15em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
                    isActive
                      ? "border-neon-magenta bg-black-glass/90 text-glow-magenta"
                      : "border-neon-cyan/50 bg-black-glass/80 text-glow-cyan"
                  }`}
                >
                  {node.label}
                </button>
              </Html>
            </group>
          );
        })}

        {nodes.map((node, index) => (
          <Line
            key={`edge-${node.id}`}
            points={[[0, 0, 0], nodePosition(index, nodes.length)]}
            color="#00fff5"
            transparent
            opacity={0.25}
          />
        ))}
      </group>

      {packets.map((delay) => (
        <DataPacket key={delay} delay={delay} />
      ))}
    </>
  );
}

export default ServerArtifactScene;
