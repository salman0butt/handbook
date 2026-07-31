---
id: projects-11-15
title: Guided Projects 11–15
---

# Project 11 — Human-Approved Tool-Using Agent

**Requirements.** Build an account agent that can read profile/subscription data and propose plan changes, refunds, or outbound email, with risk-based approval.

**Architecture.** `agent loop → proposed tool → validation → auth → risk classifier → interrupt/approval → idempotent executor → observation`.

**Structure/setup.** `src/agent/`, `tools/read/`, `tools/write/`, `policy/`, `approvals/`, `audit/`. PostgreSQL stores runs, approvals, idempotency records.

**API/schema.** `POST /runs`, `GET /runs/:id`, `POST /runs/:id/decision`. Approval payload includes immutable action hash and normalized parameters.

**Storage/errors/security.** Least-privilege tool scopes; refresh auth at execution; expire approvals; redact PII in traces. Handle duplicate resume, revoked permission, partial external failure, and conflicting write state.

**Tests/evals/obs/perf/cost.** Adversarial prompt-injection tests, unauthorized tool attempts, replay tests, human edit/reject tests, trajectory evals, audit trace integrity. Track approval wait separately from active latency.

**Acceptance.** No high-risk side effect without a valid matching approval and current authorization. **Senior review.** What should happen if the external API succeeded but the graph crashed before recording success?

# Project 12 — Research Agent

**Requirements.** Research a question across approved web/internal sources, plan bounded searches, collect evidence, deduplicate, synthesize with citations, and stop when evidence is sufficient or budget expires.

**Architecture.** `scope → planner → search/retrieve workers → evidence store → evaluator → more research? → synthesis`.

**Structure/setup.** `src/research/planner`, `sources`, `evidence`, `dedupe`, `synthesis`, `evals`. Use a graph runtime for explicit loops/budgets.

**API/schema.** Async `POST /research` returns job ID; status includes current phase and source count; final result contains claims with citation IDs and limitations.

**Storage/errors/security.** Source allowlist/egress policy; fetched page content is untrusted; strip credentials; cap response size; store provenance and fetch time. Handle blocked pages, contradictory sources, provider outages, and budget exhaustion.

**Tests/evals/obs/perf/cost.** Evaluate source quality, citation support, coverage, contradiction handling, search/tool efficiency, cost, latency. Trace plan changes and evidence used per claim.

**Acceptance.** Every material claim maps to collected evidence; agent stops within configured tool/token/time budget. **Senior review.** How do you prevent a malicious web page from steering subsequent tool use?

# Project 13 — Multi-Agent Workflow

**Requirements.** Build a software-change review workflow with specialist research, implementation-analysis, security, and reviewer agents coordinated by a supervisor.

**Architecture.** `supervisor → parallel specialists → typed findings → conflict resolver → final reviewer`; no specialist can directly write production systems.

**Structure/setup.** `src/multi/supervisor`, `workers/`, `contracts/`, `aggregation/`, `budgets/`. Each worker gets minimal tools/context.

**API/schema.** Worker output is `{finding,severity,evidence,confidence}` with source/code references. Supervisor has max delegation count and deadline.

**Storage/errors/security.** Isolated state by default; share only typed artifacts; enforce tool policy per worker. Recover from one worker failure with partial result or retry; detect cyclic delegation.

**Tests/evals/obs/perf/cost.** Compare against single-agent baseline. Measure finding recall/precision, false positives, agreement/conflict, total calls/tokens/latency. Trace delegation graph.

**Acceptance.** Multi-agent design must beat the single-agent baseline on predefined quality enough to justify added cost. **Senior review.** Which specialist can be replaced by deterministic static analysis?

# Project 14 — MCP Server + MCP Client

**Requirements.** Build a TypeScript MCP server exposing read-only issue search/resource and a guarded create-comment tool; build a client that discovers capabilities and applies a local allowlist before exposing tools to a model.

**Architecture.** `host → MCP client → stdio/local or Streamable HTTP/remote → MCP server → Git service`; policy remains on both host and backing service.

**Structure/setup.** `server/src/server.ts`, `server/tools/`, `server/resources/`, `client/src/`, `shared/schema/`. Stable production baseline uses MCP 2025-11-25-era v1 SDK guidance; draft 2026 behavior is not required.

**API/schema.** Tool inputs use Zod; structured outputs contain issue/comment IDs, not arbitrary rendered HTML. Client performs `listTools` then intersects with configured permissions.

**Storage/errors/security.** OAuth/scoped credentials for remote service, no token passthrough, host/origin checks for HTTP, stderr logs for stdio, tool risk labels, approval for comment write, audit trail.

**Tests/evals/obs/perf/cost.** Inspector/client integration tests, malicious tool/resource content, bad schema, expired token, unavailable server, unauthorized write. Trace server/tool identity and duration without secrets.

**Acceptance.** Unapproved/disallowed discovered tool cannot execute; remote token audience/scope enforced; local stdio protocol output is not polluted by logs. **Senior review.** What trust changes when a user installs a third-party MCP server?

# Project 15 — Production AI Agent SaaS

**Requirements.** Build a multi-tenant SaaS where workspaces create assistants with prompts, permitted tools, knowledge bases, model policy, budgets, and evaluation suites.

**Architecture.** `client → auth/tenant API → AI gateway → model router + RAG + graph runtime + tool policy → providers`; queue long tasks; central traces/evals/cost.

**Structure/setup.** Monorepo: `apps/web`, `apps/api`, `workers/`, `packages/ai-gateway`, `rag`, `agents`, `policy`, `evals`, `telemetry`, `db`.

**API/schema.** CRUD assistant/knowledge source; create run; stream events; resume approval; get usage/evals. Every resource row has workspace ownership; server derives tenant from session.

**Storage/errors/security.** PostgreSQL + pgvector, Redis/queue, object storage. Row/query tenant enforcement, OAuth tokens encrypted, per-workspace rate/cost budgets, idempotent writes, audit logs, prompt-injection controls.

**Tests/evals/obs/perf/cost.** Tenant-isolation tests, model/tool/RAG contracts, graph restart/approval, load/queue tests, eval gates per assistant, cost attribution, SLO dashboards.

**Acceptance.** Demonstrate two tenants with isolated data/tools, RAG, a human-approved action, model fallback, eval run, trace, usage budget, and safe failure recovery. **Senior review.** Where should platform policy end and product-specific policy begin?
