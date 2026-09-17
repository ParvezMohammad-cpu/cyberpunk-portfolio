"use client";

import type { ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { supportsWebGL, ThreeErrorBoundary } from "@/components/three/webgl-utils";

interface ProjectCanvasProps {
  camera: CanvasProps["camera"];
  className: string;
  /** Shown when WebGL is unavailable, the scene errors, or reduced motion is on
   * (unless `reducedMotionFallback` is provided). */
  fallback: ReactNode;
  /** Optional distinct fallback for the reduced-motion case specifically. */
  reducedMotionFallback?: ReactNode;
  children: ReactNode;
}

/**
 * Shared reduced-motion/no-WebGL/error-boundary wrapper for the Projects R3F
 * scenes (the featured REAL artifact and the architecture explorer), so the
 * detection + `<Canvas>` boilerplate isn't duplicated across both call sites.
 */
export function ProjectCanvas({
  camera,
  className,
  fallback,
  reducedMotionFallback,
  children,
}: ProjectCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const canRender3D =
    !prefersReducedMotion && typeof window !== "undefined" && supportsWebGL();

  if (!canRender3D) {
    return <>{prefersReducedMotion ? (reducedMotionFallback ?? fallback) : fallback}</>;
  }

  return (
    <ThreeErrorBoundary fallback={fallback}>
      <div className={className}>
        <Canvas dpr={[1, 1.5]} camera={camera} gl={{ antialias: true, alpha: true }}>
          {children}
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  );
}
