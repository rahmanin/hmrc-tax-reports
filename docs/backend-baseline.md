## Node.js Version Baseline

### Decision
The backend targets **Node.js LTS >= 20.x**.

### Rationale
- Node 20 is the current stable LTS with full ES Modules support.
- Provides consistent behavior across local development, CI, and production.
- Avoids legacy constraints required for older Node versions.

### Constraints
- Older Node versions (<=18) are not supported.
- All backend dependencies must be compatible with Node 20.

### Enforcement
- Node version is pinned via `.nvmrc` (or equivalent).
- `package.json` includes an `engines.node` constraint.

---

## Module System

### Decision
The backend application (`apps/api`) uses **ES Modules (ESM)**.

Rationale

- ESM is the standard module system in modern Node.js.
- Aligns backend code with the broader JavaScript ecosystem.
- Enables explicit and predictable dependency boundaries using import/export.

Constraints and Rules

- CommonJS (require) must not be used inside backend source files.
- CommonJS-only dependencies are imported via Node ESM interoperability:
- default ESM import where supported
- dynamic import() or createRequire only when unavoidable
- __dirname and __filename are not available:
- file paths are resolved via import.meta.url and fileURLToPath.

## Backend Application Structure

Conventions

- HTTP layer does not access the database directly.
- Environment variables are accessed only through the config layer.
- Business logic is isolated from transport and persistence concerns.
- Error handling follows a single, consistent contract.
