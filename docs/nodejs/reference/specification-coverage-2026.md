---
title: Node.js 2026 Specification Coverage
description: A traceable audit mapping the August 2, 2026 Node.js handbook specification to preserved and newly focused content.
---

# Node.js 2026 Specification Coverage

**Audit date:** August 2, 2026.

The repository already contained a complete 75-chapter Node.js path, 11 production projects, a 320-question bank and 15 mock interview rounds. This expansion preserves those routes and adds focused canonical pages, exact representative routes, ten specifically required capstones, dedicated validation and permanent deployment gates.

## Coverage Matrix

| Requirement | Coverage |
|---|---|
| Current Node, LTS, npm, TypeScript and stability baseline | `version-baseline.md` |
| Node vs browser, Deno and Bun; use cases | `start-here/` |
| V8, libuv, bindings, process and runtime lifecycle | `runtime/` and existing chapters 01–02, 23, 64 |
| Event loop phases, queues, thread pool, cancellation and async context | `event-loop/`, `async/`, existing chapters 05–08 |
| CommonJS, ESM, package resolution, npm and supply chain | `modules/`, existing chapters 03–04 and 68 |
| Strict TypeScript, NodeNext and native type stripping | `typescript/`, existing chapter 46 |
| Required Node core modules | `core-apis/` plus the existing API-specific chapters |
| Buffers, streams, files and EventEmitter | `buffers/`, `streams/`, `filesystem/`, `events/` |
| HTTP core, TLS, HTTP/2, sockets, SSE and realtime transport | `http/`, existing chapters 14–18 and 38 |
| Express, Fastify and NestJS | `frameworks/`, existing chapters 29–31 |
| API design and contracts | `api-design/`, existing chapters 28 and 55 |
| PostgreSQL, MongoDB, Redis and data libraries | `databases/`, existing chapters 32–35 |
| Authentication, authorization and security threat catalog | `security/`, existing chapters 39–42, 67–68 |
| Errors, health, retries, circuits and graceful degradation | `reliability/`, existing chapters 24, 51–53 |
| Workers, child processes and cluster | `parallelism/`, existing chapters 19–21 |
| Queues, schedulers and brokers | `queues/`, existing chapters 36–37 |
| Caching | `caching/`, existing chapter 35 |
| Testing and diagnostics | `testing/`, `debugging/`, existing chapters 43–45, 48, 71 |
| Logs, metrics, traces, SLOs and runbooks | `observability/`, existing chapters 25 and 50 |
| Performance, memory, GC and capacity | `performance/`, existing chapters 22, 49, 69–70 |
| Configuration and secrets | `configuration/`, existing chapters 26–27 |
| Docker, Kubernetes, CI/CD and production deployment | `deployment/`, existing chapters 60–63 |
| Modular, clean, hexagonal, microservice, BFF and serverless architecture | `architecture/`, existing chapters 55–59, 74–75 |
| Distributed systems | `distributed/`, existing chapter 54 |
| Realtime systems | `realtime/`, existing chapter 38 |
| Production integrations including AI APIs | `integrations/` and capstone 10 |
| V8, Node-API, libuv, permissions and advanced internals | `internals/`, existing chapters 64–67 |
| Upgrades and migrations | `migrations/` plus project and operations guidance |
| Interview levels, question bank, mock rounds and scoring | `interviews/` plus existing interview directories |
| Ten specifically required capstones | `capstones/` |
| Mermaid, sidebar, route, content and build validation | `scripts/validate-nodejs-handbook.mjs` and GitHub Actions |

## Route Compatibility

Existing public documents are preserved. The focused pages use new document IDs and do not overwrite the historical 75-chapter routes, projects, interviews or reference pages. No compatibility redirect is required for the preserved routes.

Canonical navigation now targets `/docs/nodejs/intro`. Representative exact routes are validated permanently.

## Quality Contract

Focused pages include the applicable concept, reason, mental model, runtime flow, executable code, production use, security, performance, mistakes, debugging, testing, alternatives and interview questions. Capstones include every architecture and operational section required by the specification.

## Publication Status

The content branch must pass:

```bash
npm install --no-audit --no-fund
npm run validate:nodejs
npm run validate:mermaid
npm run build
```

Deployment success is recorded only after the exact merged commit passes the permanent GitHub Pages workflow and public route/sitemap smoke tests.
