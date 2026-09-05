# Agent Instructions

## Stack & Versions

- **Next.js 16.2.9** (App Router) with React 19 — APIs differ from training data; check `node_modules/next/dist/docs/` if it exists, or the installed Next.js source for any unfamiliar API.
- **Tailwind CSS v4** — no `tailwind.config` file. Config lives in `app/globals.css` via `@theme inline`. Use standard Tailwind utility classes; custom theme tokens are CSS custom properties.
- **TypeScript** with `@/*` path alias → project root.
- ESLint 9 flat config (`eslint.config.mjs`), no Prettier.

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build (standalone output)
- `npm run lint` — ESLint only (no typecheck script exists; use `npx tsc --noEmit` if you need type checking)
- No test framework is configured. There are no tests to run.

## Architecture

Single-package Next.js app (not a monorepo). All routes live under `app/`:

| Route | Description |
|---|---|
| `/` | Landing page with product categories |
| `/home-iphone`, `/home-ipad`, `/home-drone`, `/home-juguetes` | Category showcase pages |
| `/productos-top`, `/productos-nuevos` | Product listing pages |
| `/cargadores` | Chargers listing |
| `/producto/[id]` | Product detail (dynamic, client-side) |
| `/contactanos` | Contact page |
| `/login` | Admin login (mock auth) |
| `/admin` | Admin dashboard (client-side, localStorage auth) |

Shared layout: `components/layout/Navbar.tsx` + `Footer.tsx`, rendered in `app/layout.tsx`.

## Critical: No Backend

- **All product data is hardcoded** in component files (arrays of objects). There is no database, API, or CMS.
- **Admin auth is mock**: localStorage `isAuthenticated`/`userRole` flags. Credentials: `admin@tecnostore.com` / `admin123`.
- **Purchases go through WhatsApp** links (`wa.me/573003256891`). No cart, no checkout flow, no payment integration.
- Prices are in **COP** (Colombian Pesos).

## Styling Conventions

- Dark theme is **hardcoded everywhere**: `bg-black`, `bg-[#08080a]`, `bg-[#050507]` on body and pages. Do not add light mode.
- UI language is **Spanish** (Colombian). All text, comments, and WhatsApp messages are in Spanish.
- Glassmorphism aesthetic: `backdrop-blur`, `bg-white/[0.02]`, `border border-white/10` patterns throughout.
- Heavy use of gradient glows, `animate-pulse`, rounded corners (`rounded-2xl`/`rounded-3xl`).

## Build & Deploy

- `next.config.ts` has `output: 'standalone'` — the Docker build copies `.next/standalone` into the final image.
- Docker: multi-stage build, Node 20 Alpine, `npm ci` → `npm run build` → standalone runner on port 3000.
- No CI/CD workflows are configured.
- `.env*` files are gitignored; none are committed.

## Gotchas

- The `next-env.d.ts` file is gitignored but referenced in `tsconfig.json` — it auto-regenerates on first build.
- `postcss.config.mjs` uses `@tailwindcss/postcss` plugin (Tailwind v4 style), not the old `tailwindcss` plugin.
- The Navbar links to `/recientes` ("Novedades") but **no such route exists** in `app/`. This is a broken link.
- The `producto/[id]` page uses a small hardcoded product DB and falls back to a default product for unknown IDs.
