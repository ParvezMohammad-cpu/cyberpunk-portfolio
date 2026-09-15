"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  /** Radius of the spawn volume. Default 4.5. */
  radius?: number;
  /** How strongly particles react to the pointer. 0 disables the effect. */
  pointerStrength?: number;
}

/**
 * A GPU-friendly point cloud that drifts slowly and subtly reacts to the
 * pointer position (mild repulsion), used as the boot sequence's ambient
 * particle system. Designed to be reusable for future background
 * ambiance — just drop it inside a `<SceneCanvas>`.
 */
export function ParticleField({
  count = 900,
  color = "#00fff5",
  radius = 4.5,
  pointerStrength = 0.6,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const prefersReducedMotion = useReducedMotion();
  const { viewport } = useThree();

  const { positions, basePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute inside a sphere for a volumetric, converging feel.
      // Math.random() here is intentional: particle placement is purely
      // decorative and only needs to be (re-)computed once per
      // count/radius change via this useMemo, not deterministic per render.
      // eslint-disable-next-line react-hooks/purity -- see comment above
      const r = radius * Math.cbrt(Math.random());
      // eslint-disable-next-line react-hooks/purity -- see comment above
      const theta = Math.random() * Math.PI * 2;
      // eslint-disable-next-line react-hooks/purity -- see comment above
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);
      basePositions.set([x, y, z], i * 3);
    }

    return { positions, basePositions };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!pointsRef.current || prefersReducedMotion) return;

    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const pointer = state.pointer; // normalized [-1, 1]
    const px = (pointer.x * viewport.width) / 2;
    const py = (pointer.y * viewport.height) / 2;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const bx = basePositions[idx];
      const by = basePositions[idx + 1];
      const bz = basePositions[idx + 2];

      // Gentle ambient drift around the base position.
      const driftX = Math.sin(t * 0.3 + i) * 0.05;
      const driftY = Math.cos(t * 0.25 + i * 1.3) * 0.05;

      let x = bx + driftX;
      let y = by + driftY;
      const z = bz;

      if (pointerStrength > 0) {
        const dx = x - px;
        const dy = y - py;
        const distSq = dx * dx + dy * dy;
        const influence = Math.exp(-distSq / 2) * pointerStrength;
        x += dx * influence;
        y += dy * influence;
      }

      array[idx] = x;
      array[idx + 1] = y;
      array[idx + 2] = z;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
