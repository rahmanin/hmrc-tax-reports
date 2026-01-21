├── apps/
├── packages/
├── docs/
├── infra/
├── pnpm-workspace.yaml
├── package.json

### Root responsibilities

- Dependency management
- Dev scripts (`pnpm dev`, `pnpm test`)
- Tooling (ESLint, Prettier)
- Orchestration only (no runtime code)

---

## apps/

Runnable applications.

### apps/api

Backend HTTP API (Fastify).

Responsibilities:

- HTTP server
- Routing
- Runtime config (env)
- No frontend or UI logic

### apps/web

Frontend application (React + Vite).

Responsibilities:

- UI rendering
- Calling backend API
- No backend logic

---

## packages/

Shared code

No apps should live here.

---

## docs/

Documentation.

No code.

---

## infra/

Infrastructure-related files

---

## Architectural rules (important)

- apps **do not import from each other**
- apps may import from `packages/*`
- root has **no business logic**
- env config is per-app
