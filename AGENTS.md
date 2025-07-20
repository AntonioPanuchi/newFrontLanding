---
name: "ROX VPN — development, testing & deployment"
description: "Comprehensive guide for the engineering team and OpenAI Codex: architecture, standards, CI/CD agents, commands, and quality gates."
category: "Web Application"
author: "Antonio Panuchi"
authorUrl: "https://github.com/AntonioPanuchi"
tags: ["nodejs","express","react","vite","tailwindcss","storybook","vpn"]
lastUpdated: "2025-07-20"
---

# ROX VPN API & Landing Page Developer Guide

**ROX VPN API** is an end‑to‑end solution for monitoring VPN servers and exposing their status through a modern web interface.

## Key Capabilities

- Real‑time server status monitoring with result caching.
- Centralized logging (Winston + DailyRotateFile).
- Rate limiting, CORS, optional JWT auth.
- Responsive React + TypeScript + Tailwind client.
- Storybook for visual UI documentation.
- SEO metadata (Open Graph, Twitter Card) per page.

---

## Global Rules

1. **Every pull request MUST pass**  
   `npm run validate` (ESLint + Prettier) **and** `npm test`.  
2. **Commit convention:** `[type] Scope: Short description`.  
3. **No outbound network calls** inside the Codex sandbox. All deps are vendored in the repo.  
4. **TypeScript strict:** no `any`; use `zod` for runtime validation.  
5. **Docs parity:** update documentation (including this AGENTS.md) alongside code changes.

---

## Quick Start

```bash
git clone https://github.com/AntonioPanuchi/newFrontLanding.git
cd newFrontLanding

# Backend
cd backend
npm run dev        # local development
npm run validate   # lint + format
npm test           # unit + integration

# Frontend
cd ../frontend
npm run dev        # vite dev server :5173
npm run validate   # eslint + prettier
npm run storybook  # UI docs :6006
```

---

## Tech Stack

| Layer        | Technologies / Tools                                                                 |
|--------------|---------------------------------------------------------------------------------------|
| Backend      | Node.js 18+, Express, `cors`, `express-rate-limit`, `node-fetch`, `ping`, Winston    |
| Frontend     | React 18+, TypeScript, Vite, React Router, Tailwind CSS, Framer Motion               |
| UI Docs      | Storybook 8.x                                                                        |
| SEO          | `react-helmet-async`, `<PageHead />`                                                 |
| CI/CD        | GitHub Actions + Appleboy SSH + PM2                                                  |
| Code Quality | ESLint, Prettier, strict TS                                                          |

---

## Project Structure

```bash
├── frontend/
│   ├── .storybook/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── server.js
│   └── env.example
├── docs/
├── tests/
├── deploy.sh
└── .github/workflows/
```

---

## Naming Conventions

| Pattern         | Usage                                  |
|-----------------|----------------------------------------|
| **PascalCase**  | React components, pages                |
| **camelCase**   | Vars, functions, hooks                 |
| **UPPER_SNAKE** | Env vars, constants                    |
| **kebab-case**  | Filenames, URL routes                  |

---

## Directory Rules

- **`/backend`** — entry `server.js`; services → `services/`; routes → `routes/`.
- **`/frontend`** — functional components only; styling → Tailwind; stories → `*.stories.tsx`.
- **`/docs`** — Markdown docs, SEO summaries.
- **`/tests`** — all unit & integration tests; run with a single `npm test`.

---

# Agents

> Codex reads this table to drive automation.

| id                | when to trigger               | run command                     | notes                          |
| ----------------- | ----------------------------- | ------------------------------- | ------------------------------ |
| **lint-backend**  | PR touches `/backend/**`      | `npm run validate -w backend`   | ESLint + Prettier              |
| **test-backend**  | after `lint-backend`          | `npm test       -w backend`     | jest + supertest               |
| **lint-frontend** | PR touches `/frontend/**`     | `npm run validate -w frontend`  | eslint‑plugin‑react + Prettier |
| **test-frontend** | after `lint-frontend`         | `npm test       -w frontend`    | vitest / RTL                   |
| **storybook**     | branch `feat/ui-*` or label … | `npm run storybook -w frontend` | UI preview                     |
| **deploy**        | after merge to `main`         | `./deploy.sh`                   | —                              |


---

## Agent Profiles

### 🟦 Frontend Agent (`lint-frontend`, `test-frontend`, `storybook`)
**Role:** Build UI components & SEO metadata.  
**Checkpoints:** render time < 100ms; Storybook coverage ≥ 90%.

### 🟥 Backend Agent (`lint-backend`, `test-backend`)
**Role:** Provide API, cache, logging.  
**Checkpoints:** API latency < 300ms; uptime ≥ 99.9%.

### 🟨 DevOps Agent (`deploy`)
**Role:** CI/CD & PM2 releases.  
**Checkpoints:** deploy time < 60s; build success ≥ 95%.

### 🟪 Test Agent (part of `test-*`)
**Role:** Run unit & integration suites.  
**Checkpoints:** code coverage ≥ 80%.

### 🟫 Quality & Security Agent (`audit`)
**Role:** lint, security scan, dependency freshness.  
**Checkpoints:** 0 critical vulns.

### 🟩 Docs & SEO Agent (manual trigger on content changes)
**Role:** README & SEO tagging.  
**Checkpoints:** Lighthouse SEO ≥ 90.

---

# CI/CD

- Workflow: `.github/workflows/ci.yml`.
- On push to `main` run: `lint-*`, `test-*`, then `deploy`.
- Required secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `DEPLOY_PATH`.

---

## Environment Variables & Secrets

| Variable            | Scope    | Description                       |
|---------------------|----------|-----------------------------------|
| `GERMANY_API_URL`   | Backend  | X‑UI panel (Germany)              |
| `USA_API_URL`       | Backend  | X‑UI panel (USA)                  |
| `FINLAND_API_URL`   | Backend  | X‑UI panel (Finland)              |
| `USERNAME`          | Backend  | X‑UI admin login                  |
| `PASSWORD`          | Backend  | X‑UI admin password               |
| `PORT`              | Backend  | Express port (default 3000)       |
| `JWT_SECRET`        | Backend  | Secret for auth tokens            |
| `SSH_HOST`          | CI/CD    | Server for deploy                 |
| `SSH_USER`          | CI/CD    | SSH username                      |
| `SSH_KEY`           | CI/CD    | Base64‑encoded SSH private key    |
| `DEPLOY_PATH`       | CI/CD    | Remote dir `/var/www/roxvpn`      |


> **Never commit real secrets.** Store them in CI secrets or a local `.env` ignored by Git.

## Codex Sandbox Guidelines

1. **No external network calls.** Rely only on repository‑vendored dependencies.
2. **No `npm install`.** All packages are pre‑installed in `node_modules` for sandbox execution.
3. **Relative paths only.** Sandbox root is the repository checkout folder.
4. **Restricted syscalls.** Avoid opening raw sockets or binding ports.
5. **Mandatory quality gates:** run `npm run validate && npm test` before committing code or opening a PR.

# Security Policy

- **Rate limit:** 3,000 r/min (change only with approval).
- Real secrets live in `.env` (git‑ignored); commit `.env.example` only.
- Mask tokens in logs via Winston custom formatter.

---

# FAQ

<details>
<summary>How do I add a new VPN server?</summary>

1. Add the server to `backend/src/config/servers.json`.  
2. Run `npm test` — `ping-integration` cases must pass.  
3. Update Storybook if new UI states are required.  
</details>

---

> **Living document.** Update sections when adding folders, agents, or workflows.
