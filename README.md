# HMRC Tax Reports (POC)

Monorepo proof-of-concept for HMRC tax reporting tools.

Stack:

- Backend: Fastify (Node.js, TypeScript)
- Frontend: React + Vite
- Package manager: pnpm (workspaces)

---

## Requirements

- Node.js v24.13.0
- pnpm v10.28.1

Check versions:

### Run localy

1. Install dependencies (from repo root)

```bash
pnpm install
```

2. Create .env in apps/api and apps/web
3. Run backend + frontend together from repo root

```bash
pnpm dev
```

Frontend should display API is OK 4. Run tests

```bash
pnpm test
```

### Project sturcture described here:

docs/structure.md
