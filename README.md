# cyberpunk-portfolio

A cyberpunk-themed portfolio for **Parvez**, a Software Engineer, built around
the identity: **ENGINEER &rarr; BUILDER &rarr; EXPERIMENTER**.

This repo is being built in phases. **Phase 1 (Experience Design)** shipped
the boot sequence, HUD navigation, visual language, and animation/interaction
foundations. **Phase 2 (Core Portfolio)**, implemented here, fills in real
content and interaction for all six sections: Intro, Engineering, Projects,
Lab, Journey, and Contact — see `lib/data/` for the typed content models
backing them, and the "Notes on Phase 2 content" section below for what's
real vs. placeholder.

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
  hud/                     HUD nav (logo, bracket links + mobile menu, indicator, resume)
  sections/                The six sections (Intro..Contact) + per-section subcomponents
  three/                   Reusable React Three Fiber Canvas + particle field
  ui/                      Shared UI: GlitchText, NeonButton, ScanlineOverlay, Modal, SkipLink
hooks/                     useReducedMotion, useLenis, useActiveSection, useScrollReveal
lib/                       GSAP/ScrollTrigger registration, section/world constants
lib/data/                  Typed content models + data: projects, experience, capabilities,
                           architecture layers, lab modules, contact links
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

- **Phase 1 — Experience Design**: boot sequence, HUD nav, visual language,
  GSAP/Lenis/R3F foundations, six scaffolded sections.
- **Phase 2 — Core Portfolio** *(this PR)*: real content + interaction for
  Engineering (capability matrix, accessible architecture layer map),
  Projects (filters, cards, accessible detail overlay), Lab (module cards
  with launch/inspect states), Journey (about, expandable experience
  timeline, resume), Contact (validated form + alt contact links), plus a
  mobile nav menu and skip-to-content link.
- **Phase 3 — Depth**: richer 3D/ambient backgrounds, real Lab module
  builds (Architecture Simulator, System Design Playground, terminal).
- **Phase 4 — Polish**: micro-interactions, performance tuning, SEO/OG
  metadata, analytics.
- **Phase 5 — Accessibility & reduced motion**: full `prefers-reduced-motion`
  compliance audit across every animated surface.

## Notes on Phase 2 content

Real project write-ups, employment history, and contact details aren't in
this repository yet, so `lib/data/projects.ts`, `lib/data/experience.ts`, and
`lib/data/contact.ts` ship with structurally-real-but-placeholder content.
Placeholder projects/experience entries render a visible **PLACEHOLDER** tag
in the UI; swap the data files with verified content and the tag disappears
automatically (it's driven by an `isPlaceholder` flag, not hardcoded markup).

## Notes on this implementation

- Tailwind v4 uses CSS-based theming (`@theme` in `app/globals.css`) instead
  of a `tailwind.config.ts` file — that's expected for this Tailwind version.
- Fonts are declared as system/CSS font stacks (`--font-mono`, `--font-display`
  in `app/globals.css`) rather than `next/font/google`, since font fetching
  requires outbound network access at build time that isn't guaranteed in
  every environment. If your environment has access to Google Fonts, you can
  swap in `next/font/google` (e.g. JetBrains Mono / Orbitron, per `THEME.md`)
  with no other changes needed.
