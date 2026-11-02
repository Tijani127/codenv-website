# canvass

The website and documentation site for [codenv](https://github.com/Tijani127/codenv) — live at **https://codenv.netlify.app**. Built with [Bun](https://bun.sh), [Vite](https://vite.dev), React 19, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) and [Canvas UI](https://canvasui.dev).

## Dev

```bash
bun dev      # dev server on http://localhost:5173
bun run build
bun run lint
```

## Pages

- `/` — landing page: two-column hero with the Canvas UI `ParticleReveal` effect, stats strip, "Why shims" demo with `Glass`, five-step "how it works" pipeline, guarantees grid, verified section, CTA
- `/docs/*` — 12 documentation pages in 3 groups:
  - **Getting started** — Introduction, Install, Quick start
  - **Guides** — Configuration, Secrets, Services, Store modes & pinning, Commands & scripts, Generate & import
  - **Reference** — Guarantees, vs. devbox, Env vars & troubleshooting
- `/changelog` — ported from codenv's CHANGELOG.md

All doc content is sourced from codenv's `README.md` and `CHANGELOG.md`.

## Structure

- `src/components/site` — header, footer, `CodeBlock` (with copy button)
- `src/components/ui` — shadcn/ui components
- `src/components/canvasui` — Canvas UI components (source-owned, via the `@canvas-ui` registry)
- `src/pages` — `home.tsx`, `changelog.tsx`, `docs/` (layout with sidebar + `content.tsx` + `nav.ts`)
- Routing: `react-router-dom` (`BrowserRouter` under `/`, lazy-free for simplicity)

## Deploy (Netlify)

The site deploys automatically: `netlify.toml` in the repo root tells Netlify to
run `bun run build`, publish `dist` (package manager detected from `bun.lock`),
and serve a catch-all redirect (`/* → /index.html`, 200) so `BrowserRouter`
routes such as `/docs/store` work on direct visits and refreshes.

Live site: **https://codenv.netlify.app** (site name `codenv`). The Netlify
build badge can be enabled with the badge ID shown in
Site configuration → General → Status badges.

## Adding components

```bash
bunx shadcn add tooltip scroll-area           # shadcn/ui → src/components/ui
bunx shadcn add @canvas-ui/liquid-react       # Canvas UI → src/components/canvasui
```

> Tip for Canvas UI components: give the wrapper an explicit height (`min-h-screen`, `aspect-*`),
> otherwise the native html-in-canvas path renders a 0-height wrapper and the page looks blank.
