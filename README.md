# cyberpunk-portfolio

A cyberpunk-themed portfolio for **Parvez**, a Software Engineer, built around
the identity: **ENGINEER &rarr; BUILDER &rarr; EXPERIMENTER**.

This repo is being built in phases. **Phase 1 (Experience Design)** is
implemented here: the boot sequence, HUD navigation, visual language,
animation/interaction foundations, and scaffolding for the six main sections.
Real section content lands in later phases.

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **Animation**: [GSAP](https://gsap.com/) (+ `ScrollTrigger`, `@gsap/react`)
- **3D**: Three.js via [`@react-three/fiber`](https://r3f.docs.pmnd.rs/) +
  [`@react-three/drei`](https://github.com/pmndrs/drei)
- **Smooth scrolling**: [`lenis`](https://lenis.darkroom.engineering/)
- **Styling**: Tailwind CSS v4 (CSS-based `@theme` config)
- **Icons**: [`lucide-react`](https://lucide.dev/)
- **Backend**: none — this is a static, client-driven experience for now

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The boot/intro sequence
plays once per browser session (tracked via `sessionStorage`). To replay it
for testing, either open a new incognito/private session, or append
`?boot=1` to the URL, e.g. `http://localhost:3000/?boot=1`.

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint (eslint-config-next + React Compiler rules)
```

## Project structure

```
app/                      Next.js App Router entry (layout, page, globals.css)
components/
  boot/                    Boot/intro sequence (particles, name reveal, CTA)
  hud/                     Minimal HUD nav (logo, bracket links, indicator, resume)
  sections/                The six scaffolded sections (Intro..Contact)
  three/                   Reusable React Three Fiber Canvas + particle field
  ui/                      Shared UI: GlitchText, NeonButton, ScanlineOverlay
hooks/                     useReducedMotion, useLenis, useActiveSection, useScrollReveal
lib/                       GSAP/ScrollTrigger registration, section/world constants
public/resume.pdf          Placeholder resume — swap with the real file later
```

## Identity & structure

The site is organized around three conceptual "worlds":

1. **01 — ENGINEER** — professional work (Cloud, Architecture, Backend, Frontend, Data, DevOps)
2. **02 — BUILDER** — things actually built (Projects, Games, Tools, Applications)
3. **03 — EXPERIMENTER** — curiosity-driven work (AI, 3D, Animation, Blender, Physics)

...expressed through six locked, ordered sections: `INTRO`, `ENGINEERING`,
`PROJECTS`, `LAB`, `JOURNEY`, `CONTACT`. The résumé is intentionally *not* a
section — it's a small persistent link in the HUD instead.

See [`THEME.md`](./THEME.md) for the full visual language (colors,
typography, effects) that later phases should reuse.

## Roadmap

- **Phase 1 — Experience Design** *(this PR)*: boot sequence, HUD nav,
  visual language, GSAP/Lenis/R3F foundations, six scaffolded sections.
- **Phase 2 — Content**: real content for Engineering, Projects, Lab,
  Journey, Contact.
- **Phase 3 — Depth**: richer 3D/ambient backgrounds, case-study detail
  views, project filtering.
- **Phase 4 — Polish**: micro-interactions, performance tuning, SEO/OG
  metadata, analytics.
- **Phase 5 — Accessibility & reduced motion**: full `prefers-reduced-motion`
  compliance across every animated surface, keyboard/focus audit.

## Notes on this implementation

- Tailwind v4 uses CSS-based theming (`@theme` in `app/globals.css`) instead
  of a `tailwind.config.ts` file — that's expected for this Tailwind version.
- Fonts are declared as system/CSS font stacks (`--font-mono`, `--font-display`
  in `app/globals.css`) rather than `next/font/google`, since font fetching
  requires outbound network access at build time that isn't guaranteed in
  every environment. If your environment has access to Google Fonts, you can
  swap in `next/font/google` (e.g. JetBrains Mono / Orbitron, per `THEME.md`)
  with no other changes needed.
