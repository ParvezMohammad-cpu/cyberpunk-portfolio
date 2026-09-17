"use client";

import { Component } from "react";
import type { ReactNode } from "react";

/**
 * Shared client-only helpers for R3F/WebGL surfaces across the site
 * (ambient background layer + Step 4 project artifacts): feature-detect
 * WebGL before mounting a `<Canvas>`, and catch renderer errors so a
 * broken 3D scene degrades to a static fallback instead of crashing React.
 */
export function supportsWebGL() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export class ThreeErrorBoundary extends Component<
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
