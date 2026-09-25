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

### NEON BIOSPHERE demo

[`/biosphere`](http://localhost:3000/biosphere) is an isolated experimental
microsite; the existing portfolio remains at `/`. Its procedural React Three
Fiber scene uses a displaced low-poly terrain, emissive monolith, fog, lights,
and capped particle/star fields. GSAP ScrollTrigger synchronizes the three
HTML chapters with camera states, while Lenis handles smooth scrolling.

- Select **ENTER THE BIOSPHERE** to begin, scroll (or select the numbered
  chapter controls) to progress, and select the floating markers for details.
- The scanner cursor, camera parallax, and continuous particles are reduced
  when `prefers-reduced-motion` is enabled; readable chapter and marker content
  remains available.
- DPR is capped and particle counts are reduced for reduced-motion users; the
  compact mobile HUD hides nonessential coordinate/status detail.
- **RETURN TO PORTFOLIO** is always available in the demo HUD.

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

## Step 4 — Projects "Proof Layer"

The Projects section (`components/sections/ProjectsSection.tsx`) implements
the Step 4 brief: projects as artifacts, not a generic card grid.

- **REAL / BUILD / EXPERIMENT tiers** — `lib/data/projects.ts` tags every
  project with a `tier`; the filter bar in Projects switches between them
  with real, keyboard-operable buttons (no forced animation gate — normal
  scrolling and direct `/projects/[slug]` links work independently).
- **Featured REAL artifact** — the first `tier: "real"` project renders a
  lazy-loaded R3F "floating server" (`ServerArtifact3D.tsx`) with orbiting,
  pointer/keyboard/touch-highlightable component nodes, plus a static DOM
  fallback for reduced motion / no-WebGL / render-error paths.
- **Full-page case studies, not modals** — `app/projects/[slug]/page.tsx`
  replaces the old detail modal with real App Router routes: static params
  for every project, `generateMetadata`, `notFound()` + a custom
  `not-found.tsx`, deep links, reload support, and a visible back-to-database
  link.
- **Architecture explorer** — `ArchitectureExplorer.tsx` renders the
  USERS → AZURE FRONT DOOR → WAF → APPLICATION → SQL/BLOB/LOGS diagram in 3D
  (rotate via `OrbitControls`, click a node) *and* as an equivalent DOM node
  list with Purpose/Why/Result — the same content is available without
  WebGL, a mouse, or motion. Front Door and the WAF are described as
  distinct layers; neither is claimed to guarantee availability on its own.
- **Cinematic results + deployment simulation** — `CinematicMetrics.tsx`
  reveals metrics one at a time (all-at-once under reduced motion);
  `DeploymentSimulation.tsx` steps CODE → BUILD → TEST → DEV/QA/UAT → PROD
  with start/replay/reset and is explicitly labeled a simulation, not a live
  deployment or a measurement of this session.
- **BUILD demos** — `components/sections/projects/demos/`:
  - `ScreenshotVault.tsx` — a per-tab memory vault enforcing MAX OBJECTS 30 /
    MAX SIZE 10MB / MAX TABS 5, with deterministic oldest-first eviction, a
    visible eviction log, generated placeholder "screenshots" or optional
    local image uploads (type/size validated, object URLs released on
    evict/close/unmount), and a reset control.
  - `ArrowPuzzle.tsx` — a small, genuinely playable slide-until-blocked
    puzzle prototype (keyboard + on-screen buttons), explicitly framed as a
    web prototype of the mechanic, not a claim of Android feature parity.
  - `AimTrainer.tsx` — click/tap targets in a bounded area; reaction time,
    accuracy, and hit count are computed live from that session's input
    events (never hardcoded), plus a keyboard-only reaction-practice mode
    labeled as a distinct, non-comparable alternative.
- **EXPERIMENT tier** — rendered with a "LAB EXPERIMENTS — NOT EVERYTHING
  HERE IS FINISHED. THAT'S THE POINT." banner and text-labeled LIVE /
  PROTOTYPE / RESEARCH / ABANDONED status (not color alone).
- **Case-study schema** — every serious project renders the same 01–08
  schema (Problem, Constraints, Approach, Architecture, Implementation,
  Challenges, Results, What I Learned) driven from `project.caseStudy`
  instead of hardcoded per-project layouts.
- **Source & decisions** — `SourceSection`/`TechDecisions` render a real
  GitHub link when `sourceUrl` is set, otherwise an honest "not published"
  note (no fake `href`s), plus expandable `<details>` "WHY X?" trade-off
  explanations.
- **Project DNA** — `ProjectDnaChart.tsx` is a pure-SVG radar (no client JS
  required) with an equivalent `<table>`, explicitly labeled as qualitative
  0–100 design-emphasis scores, not benchmark numbers; axis sets differ by
  project kind (enterprise vs. game vs. research) and are documented as not
  cross-comparable.

**Content requiring verification before publishing:** the enterprise
project's metrics (30K+ daily users, 99.99% availability, 70% deployment
time reduction, 50% fewer manual updates), its problem/approach/outcome
prose, and its `sourceUrl` are illustrative placeholders — see the
`isPlaceholder` flags and metric `detail` text in `lib/data/projects.ts`.

**Known limitations:** there's no existing automated test runner in this
repo (no Jest/Vitest config), so the demos above were verified by manual
`npm run build` + `npm run start` exercises rather than an automated test
suite — see the PR description for exactly what was checked.

## Roadmap

- **Phase 1 — Experience Design**: boot sequence, HUD nav, visual language,
  GSAP/Lenis/R3F foundations, six scaffolded sections.
- **Phase 2 — Core Portfolio**: real content + interaction for
  Engineering (capability matrix, accessible architecture layer map),
  Projects (filters, cards, accessible detail overlay), Lab (module cards
  with launch/inspect states), Journey (about, expandable experience
  timeline, resume), Contact (validated form + alt contact links), plus a
  mobile nav menu and skip-to-content link.
- **Phase 3 — Depth**: richer 3D/ambient backgrounds, real Lab module
  builds (Architecture Simulator, System Design Playground, terminal).
- **Step 4 — Projects "Proof Layer"** *(this PR)*: REAL/BUILD/EXPERIMENT
  artifacts, full-page case studies, interactive architecture/deployment,
  playable BUILD demos, Project DNA — see above.
- **Phase 4 — Polish**: micro-interactions, performance tuning, SEO/OG
  metadata, analytics.
- **Phase 5 — Accessibility & reduced motion**: full `prefers-reduced-motion`
  compliance audit across every animated surface.

## Step 5 — The Lab

The LAB is a typed, routeable local experiment catalog. The Projects exit derives
its unregistered-module count from `LAB_EXPERIMENTS`; it is a playful entrance,
not authentication. The sector navigator and object-like catalog work with
keyboard/touch and link directly to `/lab/neural-system`, `/lab/parvez-arcade`,
`/lab/gear-system`, `/lab/physics-playground`, and `/lab/distributed-system`.
The final two catalog entries open illustrative sample retrospectives and are
explicitly not claims about real abandoned work.

- **Neural System** is a deterministic local retrieval → context → generation
  teaching mock; it performs no LLM inference and contacts no service.
- **Parvez Arcade** reuses the browser Arrow Puzzle and Aim Trainer prototypes.
  Their reported figures are session measurements, not portfolio metrics.
- **Gear System** is a procedural browser diagram, not a Blender-authored asset.
- **Physics Playground** uses constant surface-gravity presets and a simplified
  vacuum projectile equation: mass intentionally does not affect trajectory.
- **Distributed System** exposes qualitative/synthetic capacity, queue, latency,
  and error calculations. It is educational, not production benchmark evidence.

The immersive routes deliberately omit the global HUD and contain a browser-back
compatible **Return to Lab** link. No user data, analytics, accounts, uploads,
or external AI services are used by these Lab experiences.

## Step 6 — Journey and final Contact scene

The Journey and Contact sections now implement the Step 6 storyboard with typed,
owner-editable content in `lib/data/journey.ts` and `lib/data/contact.ts`.

- **Lab → Journey entrance** — the existing Lab exit now resolves into
  `> ALL EXPERIMENTS ARCHIVED`, `> SYSTEM HISTORY REQUESTED...`, and
  `> LOADING JOURNEY`, then exposes a normal `#journey` link. This is narrative
  copy only; it does not archive data, lock scroll, or require a timed gate.
- **Journey circuit path** — `components/sections/JourneySection.tsx` renders a
  semantic ordered narrative enhanced by a scoped GSAP/ScrollTrigger SVG path.
  The readable DOM content is available without animation, scripting effects, or
  WebGL, and reduced-motion users see the stable completed path.
- **Verified and unknown chronology** — the IIITP/B.Tech/graduation 2024,
  DESI QnA SDE Intern Jan 2024–Jun 2024, and MAQ SOFTWARE Software Engineer
  entries come from the owner brief. MAQ dates, exact degree expansion/branch,
  personal reflection wording, current-state freshness, verified email,
  LinkedIn URL, and the final résumé PDF still require owner confirmation.
- **Growth architecture** — `GrowthArchitecture.tsx` replaces skill bars with
  keyboard/touch-operable stage controls. The early `CODE → APPLICATION` and
  later `USERS → CLOUD/CDN → FRONTEND → API → DATA → OBSERVABILITY` diagrams
  are labeled conceptual illustrations, not verified production topology.
- **Reflections and evolution** — the three reflection cards are neutral
  engineering principles, not attributed autobiographical quotes. The
  `DEVELOPER → BUILDER → ENGINEER → SYSTEM THINKER → ?` centerpiece is a
  narrative growth model, not a promotion/title history.
- **Future path** — the Journey ends with `> FUTURE NODE NOT FOUND`, “Maybe
  that’s the point.” and `WHAT SHOULD BE BUILT NEXT?`, leading directly into
  Contact without a blank page or forced waiting state.
- **Final Contact scene** — `components/sections/ContactSection.tsx` is a quiet,
  near-empty final scene with `EMAIL`, `LINKEDIN`, `GITHUB`, and
  `DOWNLOAD RESUME` actions. GitHub and the existing `/resume.pdf` asset are
  functional; email and LinkedIn are intentionally rendered unavailable because
  the repository only had placeholder values. The old client-only contact form
  remains in the tree for historical Phase 2 code, but Step 6 does not render or
  submit a form.
- **Optional outro** — Contact includes an explicitly initiated, replayable local
  outro (`> SESSION ENDING` → `> CONNECTION REMAINS OPEN`). It never sends data,
  prevents contact links from activating, traps focus, steals scroll, or makes
  the portfolio inaccessible; Skip/Return restores the Contact scene.

## Notes on Phase 2 content

Real project write-ups, employment history, and contact details aren't in
this repository yet, so `lib/data/projects.ts`, `lib/data/experience.ts`, and
`lib/data/contact.ts` ship with structurally-real-but-placeholder content.
Placeholder projects/experience entries render a visible **PLACEHOLDER** tag
in the UI; swap the data files with verified content and the tag disappears
automatically (it's driven by an `isPlaceholder` flag, not hardcoded markup).
Step 6 additionally documents owner-verification notes in `lib/data/journey.ts`
and keeps unverified email/LinkedIn actions disabled rather than linking to fake
contact destinations.

## Notes on this implementation

- Tailwind v4 uses CSS-based theming (`@theme` in `app/globals.css`) instead
  of a `tailwind.config.ts` file — that's expected for this Tailwind version.
- Fonts are declared as system/CSS font stacks (`--font-mono`, `--font-display`
  in `app/globals.css`) rather than `next/font/google`, since font fetching
  requires outbound network access at build time that isn't guaranteed in
  every environment. If your environment has access to Google Fonts, you can
  swap in `next/font/google` (e.g. JetBrains Mono / Orbitron, per `THEME.md`)
  with no other changes needed.
