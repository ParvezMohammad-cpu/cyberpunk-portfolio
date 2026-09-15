# THEME.md — Cyberpunk Visual Language

This document is the source of truth for the site's visual language. Later
phases (content, new components) should reuse these tokens/utilities instead
of introducing new one-off colors, fonts, or effects.

Implementation lives in [`app/globals.css`](./app/globals.css) (Tailwind v4
CSS-based `@theme` config) and the shared components in `components/ui/`.

## Color palette

| Token                  | Hex       | Usage                                          |
| ----------------------- | --------- | ----------------------------------------------- |
| `--void` (`bg-void`)     | `#050507` | Base page background — near-black               |
| `--black-glass`          | `#0a0a0f` | Slightly lighter panel/overlay background        |
| `--surface`              | `#111117` | Card/panel surfaces (e.g. world cards)           |
| `--border-dim`           | `#22222c` | Subtle borders on dark surfaces                  |
| `--neon-cyan`            | `#00fff5` | Primary accent — links, glow text, borders       |
| `--neon-magenta`         | `#ff2ea6` | Secondary accent — glitch layer, resume CTA      |
| `--neon-purple`          | `#b026ff` | Tertiary accent, reserved for future emphasis    |
| `--neon-yellow`          | `#f5ff2e` | Tertiary accent, reserved for future emphasis    |
| `--fg`                   | `#e8e8f0` | Primary foreground text                          |
| `--fg-dim`               | `#7a7a8c` | Secondary/muted text (taglines, dim labels)      |

All colors are exposed as Tailwind utilities via `@theme` in `globals.css`,
e.g. `bg-void`, `text-neon-cyan`, `border-border-dim`.

## Typography

- **UI / HUD / body text**: monospace, via `font-mono` &rarr;
  `"JetBrains Mono", ui-monospace, "Space Mono", monospace`.
- **Large display headings** (name reveal, section labels): `font-display`
  &rarr; `"Orbitron", "JetBrains Mono", ui-monospace, monospace`.

These are declared as plain CSS font stacks rather than `next/font/google`
so the project builds reliably without outbound network access. If your
build environment can reach Google Fonts, swap in `next/font/google`
(`JetBrains_Mono`, `Orbitron`) in `app/layout.tsx` and wire the generated
`--font-*` variables into the `@theme` block — no other changes required.

## Effects

Defined once in `app/globals.css`, reused everywhere:

- **`.text-glow-cyan` / `.text-glow-magenta`** — neon text-shadow glow.
- **`.border-glow-cyan`** — neon box-shadow border glow (used by `NeonButton`).
- **`.scanline-overlay`** — fullscreen repeating-gradient scanlines
  (`<ScanlineOverlay />` component).
- **`.bg-circuit-grid`** — CSS-gradient grid/circuit background texture, no
  image assets.
- **`.glitch`** — layered, clipped `::before`/`::after` duplicates that jitter
  in cyan/magenta (`<GlitchText />` component). Disabled entirely under
  `prefers-reduced-motion`.
- **`.terminal-cursor`** — blinking block cursor for terminal-style text.
- **`.boot-point-pulse`** — the boot sequence's opening point animation.

## Shared components

- **`<GlitchText as="h1" text="PARVEZ" />`** (`components/ui/GlitchText.tsx`)
- **`<NeonButton variant="cyan|magenta">...</NeonButton>`** (`components/ui/NeonButton.tsx`)
- **`<ScanlineOverlay />`** (`components/ui/ScanlineOverlay.tsx`)

## Motion principles

- Prefer GSAP timelines/`ScrollTrigger` over ad-hoc CSS transitions for
  anything scroll-driven; see `hooks/useScrollReveal.ts` for the shared
  fade/slide-in pattern sections should reuse.
- Every animated hook/component should check `useReducedMotion()`
  (`hooks/useReducedMotion.ts`) and skip or shorten motion when it's `true`.
  Full site-wide reduced-motion compliance is a Phase 5 goal, but new
  animations added in the meantime should still respect this hook.
- Smooth scrolling is handled by Lenis (`hooks/useLenis.ts`), kept in sync
  with GSAP's `ScrollTrigger` via `gsap.ticker`. Use the returned `lenisRef`
  to drive `lenis.scrollTo(...)` rather than native `scrollIntoView`.
