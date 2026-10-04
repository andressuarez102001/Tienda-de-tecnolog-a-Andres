# Agent Instructions

## Stack & Versions

- **Next.js 16.3.8** (App Router) with React 19 — APIs differ from training data; check `node_modules/next/dist/docs/` if it exists, or the installed Next.js source for any unfamiliar API.
- **Tailwind CSS v4** — no `tailwind.config` file. Config lives in `app/globals.css` via `@theme inline`. Use standard Tailwind utility classes; custom theme tokens are CSS custom properties.
- **TypeScript** with `@/*` path alias → project root.
- **Vitest 3** for unit tests (`environment: 'node'`, no DOM).
- ESLint 9 flat config (`eslint.config.mjs`) includes the React Compiler-aware `react-hooks` rules; no Prettier.

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build (standalone output)
- `npm run lint` — ESLint only
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` — single Vitest run
- `npm run test:watch` — Vitest in watch mode
- `npm run verify` — typecheck + lint + tests

## Architecture

Four-layer architecture, dependencies pointing inward only:

```
app/, components/   →  application/  →  domain/
                                ↘  infrastructure/
```

| Layer | Contents |
|---|---|
| `domain/` | Entities, value objects, enums, State pattern, repository **ports**. Zero framework imports. |
| `application/` | Use cases (services) + two composition roots. Depends on `domain/` ports only. |
| `infrastructure/` | JSON persistence, **PostgreSQL layer (`pg`)**, bcrypt/JWT, HTTP adapters, in-memory adapters for tests, catalog seed. |
| `presentation/` | React context + hooks that inject the services. |
| `app/`, `components/` | Routes and views. Never touch repositories directly. |

Key types live in `domain/catalog/` (`Product`, `ProductoFisico`, `ProductoDigital`, `ProductoFabric`, `ProductDraft`), `domain/orders/` (`Pedido`, `EstadoPedido`) and `domain/shared/` (`Dinero`, `Email`, `ProductId`, `enums`, `constantes`).

The single catalog lives in `infrastructure/catalog/CatalogoSemilla.ts` (35 products). All views read it through `CatalogoService`; no page declares its own product array.

## Backend: real, not a mock

There is a working backend. Do not describe it as missing.

- **Two composition roots.** `application/serverCompositionRoot.ts` resolves the ports with JSON persistence OR PostgreSQL (driven by `DATABASE_URL`), bcrypt and JWT. `application/compositionRoot.ts` resolves them with the HTTP adapters the browser uses. Both build the *same* use cases, which is the proof that the dependencies point at the abstractions. `serverCompositionRoot` memoizes the result per process; creating an `EstadoServidor`/pool per request would discard the cache.
- **Persistence is a JSON file** (`DATA_DIR/tienda.json`, default `.data`), written atomically (`.tmp` + `rename`) and serialized through a queue. `infrastructure/persistencia/EstadoServidor.ts` caches it per process, so a restart keeps the data.
- **PostgreSQL is optional.** Set `DATABASE_URL` → `serverCompositionRoot` composes `infrastructure/pg/` (`BasePg` + one `Pg*Repository` per port + `PgCredentialsGateway`). The DDL lives in `infrastructure/pg/Esquema.ts` as a TS string (the standalone build does not copy loose `.sql` files) and is applied idempotently at bootstrap; the first run seeds the same sample store as JSON, so both stores start identical. **`categorias.id` is `SERIAL` (int4), not `BIGSERIAL`**: node-postgres returns int8 as string and id validation fails. `tests/infrastructure/PgIntegracion.test.ts` runs only when `DATABASE_URL` is set, inside a throwaway schema (`search_path`) — it is skipped in `npm run verify` without a DB. **The schema carries 3NF + native engine logic, not just tables**: `pedidos.producto_id` is an FK to `productos` (the `producto` JSONB column is kept only as an audit snapshot), CHECKs keep `stock >= 0` and `cantidad > 0`, a PL/pgSQL procedure `registrar_pedido` validates inventory and inserts, and the `AFTER INSERT` trigger `trg_descontar_stock_en_pedido` discounts the sold stock in the same transaction (a negative-stock attempt aborts the whole insert). Consequence: the seed sells one unit of `drone-1`, leaving it at stock 0, so the public catalog (`CatalogoService`, `agotados: false`) shows 34 of the 35 products. `consultas_sustentacion.sql` at the repo root holds the INNER JOIN (5 tables) / LEFT JOIN / GROUP BY+HAVING queries used as evidence.
- **Auth is bcrypt + JWT** (HMAC-SHA256). The token travels in the `shz_sesion` cookie: `httpOnly`, `sameSite=lax`, `secure` in production. `HttpAuthenticationGateway` never sees a password and `SesionHttp` never sees a token.
- **The browser talks to the API.** `infrastructure/http/*` implements every port with `fetch`. The CRUD ports map to REST directly — `crear`→`POST /api/admin/productos`, `actualizar`→`PUT`/`PATCH /api/admin/:recurso/:id`, `eliminar`→`DELETE`. `HttpUserRepository.actualizar` only issues its `PATCH` when the state actually changed, because the server toggles (calling it twice would flip back). `HttpProductCatalogRepository.obtenerPorId` treats a 404 as `undefined`.
- **`proxy.ts` verifies, it does not authorize.** It rejects unsigned/expired tokens on `/admin` and `/api/admin`, and bounces authenticated users away from `/login`. Role checks live in `exigirAdministrador`, because only the server can tell whether an account is still active. A proxy test asserts this split on purpose.
- The in-memory adapters (`InMemory*`) are still there **for tests only**. Don't wire them back into `compositionRoot.ts`. The mock auth (localStorage session, `TextoPlanoKeyHasher`, sim token) was removed; don't recreate it.
- Purchases go through WhatsApp links (`wa.me/573003256891`). No cart, no checkout, no payment integration.
- Prices are in **COP** (Colombian Pesos). `Dinero` rounds and rejects negatives.

## Conventions

- Identifiers and all domain/naming text are in Spanish; entities use private Spanish field names with English getters.
- Domain types are immutable: every mutation returns a new instance.
- Views never build URLs from raw ids, compare stock with magic numbers, or cast strings to enums — they ask the domain (`pedido.cambiosDisponibles`, `producto.necesitaReposicion`, `estadoDe(...)`).
- `ProductoFabric` is the only place that chooses between `ProductoFisico` and `ProductoDigital`.
- Subclass selection is not possible from the entity, so `ProductoAdminService.actualizar` delegates to the factory when the draft changes `tipo`.

## Styling

- Dark theme is **hardcoded**: `bg-black`, `bg-[#08080a]`, `bg-[#050507]`. Do not add light mode.
- UI language is **Spanish** (Colombian), including comments and WhatsApp messages.
- Glassmorphism: `backdrop-blur`, `bg-white/[0.02]`, `border border-white/10`, gradient glows, `rounded-2xl`/`rounded-3xl`.

## Build & Deploy

- `next.config.ts` has `output: 'standalone'` — the Docker build copies `.next/standalone` into the final image.
- Docker: multi-stage build, Node 20 Alpine, `npm ci` → `npm run build` → standalone runner on port 3000.
- No CI/CD workflows are configured.
- `.env*` files are gitignored; none are committed.

## Gotchas

- `next-env.d.ts` is gitignored but referenced in `tsconfig.json` — it auto-regenerates on first build.
- `postcss.config.mjs` uses `@tailwindcss/postcss` (Tailwind v4 style), not the legacy `tailwindcss` plugin.
- TypeScript has no `final`. Invariants that must not be overridden (e.g. `totalPedido`) are documented and covered by tests instead.
- Reading a `ref.current` during render, or calling `setState` synchronously inside an `effect`, are lint errors under the current `react-hooks` config.
- **Never parse `JWT_EXPIRES_IN` with `parseInt`.** `parseInt('7d', 10)` is `7`, not `NaN`, so the token ended up lasting 7 ms and the proxy rejected the user as if the token were forged. `infrastructure/auth/DuracionToken.ts` exists because of that.
- A `Dinero` or `ProductId` that crosses the JSON boundary becomes `{monto}` / `{id}`: a plain object with no methods. `ProductoFabric.aPersisted`/`desdeDatos` is the only place that flattens and rehydrates; anything else rehydrating entities by hand will produce objects that throw on the first method call.
- `POST/PUT/PATCH` bodies go through `leerJson`, not `peticion.json()`: a `SyntaxError` from `json()` is not an `ErrorDePeticion` and would surface as a 500 for what is really client input.
- The standalone build needs `JWT_SECRET`, `JWT_EXPIRES_IN` and `DATA_DIR` as **real environment variables**. It does not read `.env.local`, because its app directory is `.next/standalone`. `next start` does not work with `output: 'standalone'`; run `node .next/standalone/server.js`.
- `npm audit` reports 7 dev-only vulnerabilities: **2 moderate** in `vitest`/`@tailwindcss/postcss` (fix for `vitest` is a major bump that conflicts with the rest of the toolchain, deferred) and **5 high in `braces`** (advisory flags every version, latest `3.0.3` has no fix upstream yet; it arrives through `eslint-config-next` → `fast-glob` → `micromatch`, not the `pg` dependency). Do not force-fix: `npm audit fix --force` would downgrade `eslint-config-next` to a breaking major.