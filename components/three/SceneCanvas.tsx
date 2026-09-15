"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  /** Camera distance along Z. Default 6. */
  cameraZ?: number;
}

/**
 * Thin, reusable wrapper around `@react-three/fiber`'s `<Canvas>` with
 * sensible defaults (transparent background, capped DPR for performance,
 * fixed camera). Used by the boot sequence's particle field today, and
 * intended for future ambient backgrounds elsewhere on the site.
 */
export function SceneCanvas({
  children,
  className = "",
  cameraZ = 6,
}: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, cameraZ], fov: 50 }}
    >
      {children}
    </Canvas>
  );
}
