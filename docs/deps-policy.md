# Dependency Policy (Monorepo)

This repo uses **pnpm workspaces** for reproducible installs and a deterministic lockfile.

## Goals
- Reproducible installs across machines/CI.
- Deterministic dependency graph (same lockfile → same tree).
- Clear boundaries: runtime vs dev tooling.
- Minimal risk from upgrades.

## Workspace tool & lockfile
- Workspace manager: **pnpm**
- Lockfile: `pnpm-lock.yaml` is committed.
- Do not commit `node_modules/`.
- Do not use `npm install` in this repo.

## Direct vs transitive dependencies
### Rule
- If a package imports something in code, it must be a **direct dependency** in that package’s `package.json`.
- Never rely on transitive dependencies (dependency of a dependency).

### Why
Transitive dependencies can change without any explicit change in our package.json, breaking builds unexpectedly.

## devDependencies boundaries
### devDependencies
Put in `devDependencies`:
- linters/formatters (eslint, prettier)
- test runners (vitest)
- type tooling (typescript, @types/*)
- build tooling (vite, tsx, tsup, etc.)

### dependencies
Put in `dependencies`:
- anything required at runtime (fastify, @fastify/*, zod, etc.)

### Workspace-level devDependencies
- Shared tooling used across the repo lives at the **root** (eslint, prettier, typescript).
- Runtime libs must live in the **package that runs them** (apps/api, apps/web).

## Version policy
- Prefer **pinned major versions** and allow minor/patch updates:
  - Use caret (`^`) for most libs unless stability requires pinning.
- For critical runtime integrations (DB drivers, auth clients), prefer tighter ranges or explicit pinning if needed.
- Use `workspace:*` for internal packages (e.g. `@hmrc-tax-reports/shared`).

## Adding dependencies (commands)
- Add runtime dependency to a package:
  - `pnpm --filter <pkg> add <name>`
- Add dev dependency to a package:
  - `pnpm --filter <pkg> add -D <name>`
- Add repo-wide tooling (root):
  - `pnpm add -D <name>`

## Upgrade policy
- Upgrades must be intentional and reviewable:
  - Prefer grouped upgrade PRs.
  - Read changelogs for major upgrades.
  - Run full test suite + lint after upgrades.
- Avoid “drive-by” upgrades mixed with feature code.

## Why upgrades become risky in production
- Breaking changes in major versions.
- Behavior changes in minor versions (yes, it happens).
- Supply chain risks (typosquatting, compromised packages).
- Transitive dependency shifts due to loosened ranges.
- Runtime-only issues not caught by unit tests (timing, I/O, edge cases).

## Reproducibility checklist
- `pnpm-lock.yaml` committed and up to date.
- `pnpm install` is the only install method.
- Node version baseline is documented (see docs/backend-baseline.md).
- No implicit reliance on globally installed tools.
