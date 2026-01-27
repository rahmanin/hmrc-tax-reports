# @hmrc-tax-reports/shared

Shared layer for the monorepo: domain types + stable shared utilities used by both backend and frontend.

This package is intentionally framework-agnostic (no Fastify/React/Nest/DB dependencies).

## What belongs here

### ✅ Public (used by apps)
- **Domain types** (`src/domain/*`)
  - `DraftReport`, `LineItem`, `DraftStatus`
  - `SubmissionState`
  - `Money` (minor units)
- **Stable errors** (`src/errors/*`)
  - `AppError`, `ValidationError`, `ExternalServiceError`
- Small “boring” pure utilities that are clearly reusable and not tied to any framework.

### ❌ Not public
- **Katas / learning code** (`src/katas/*`)
  - used only for tests and practice
  - **must not** be exported from `src/index.ts`
  - **must not** be imported by app code

## Folder structure

src/
domain/ # domain-first DTOs and unions (public)
errors/ # stable error shapes (public)
katas/ # practice/test-only code (NOT public)
index.ts # exports only public API


## Install & run tests

From repo root:

```bash
pnpm --filter ./packages/shared test

pnpm --filter ./packages/shared test:watch
```
## Public API

Public exports are defined in src/index.ts.

Example usage (apps/api or apps/web):
```bash
import type { DraftReport, Money } from '@hmrc-tax-reports/shared';
import { ValidationError, moneyFromMinor } from '@hmrc-tax-reports/shared';

const amount: Money = moneyFromMinor(1230n); // £12.30
throw new ValidationError('Invalid draft');
```

Design rules (contracts)
1) Domain types are the contract
Avoid any in domain and errors.
Prefer readonly and discriminated unions for state.
Example: discriminated union narrows safely:

```bash
if (draft.status.kind === 'INVALID') {
  draft.status.errors; // exists by type
}
```
2) Keep it pure and deterministic
- No network, no filesystem, no global mutable state in public utilities.
- Prefer immutable updates (...spread, map/filter) over mutation.

3) Runtime validation happens at boundaries
- TypeScript protects code inside the repo, but inputs can still be garbage:
- HTTP requests
- env vars
- external service responses
- Validate/normalize at the boundary (apps layer), then use domain types internally.

4) Money must not use floats
- Store money in minor units (bigint) via Money type.
- Convert at boundaries (parse/format) only.

5) Error shapes must be serializable and safe
- code is stable and can be used by logic.
- message must be safe for UI/clients.
- details is optional and intended for logs only.

# How to extend safely
Adding a new domain type

- Add file under src/domain/
- Use discriminated unions for state machines (avoid boolean flags).
- Export from src/index.ts
- Add tests if there is normalization/logic.

Adding a new shared utility

- Prefer a pure function with explicit inputs/outputs
- Write a behavioral unit test (avoid testing implementation details)
- Export from src/index.ts only if it is truly public and stable

Adding a new kata

- Add under src/katas/<topic>/
- Add *.test.ts next to it
- Do not export from src/index.ts
- Do not import from apps

Common pitfalls

- Exporting kata modules in src/index.ts (don’t)
- Putting framework-specific code in shared (don’t)
- Using number for money (don’t)
- Creating “clever” helpers without a real need (don’t)