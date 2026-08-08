---
id: production-ai-coverage
title: Production AI Coverage
---

# Production AI Coverage

| Production area | Coverage |
|---|---|
| model/provider abstraction | 040, 191, 193 |
| structured outputs and runtime validation | 041–050 + `zero-to-hero/production/production-application-security-reliability` |
| syntax/schema vs semantic/business/policy validation | `zero-to-hero/production/production-application-security-reliability` |
| authentication / session / token lifecycle | `zero-to-hero/production/production-application-security-reliability`, OAuth/MCP security |
| authorization / RBAC / ABAC / scopes / object-level access | `zero-to-hero/production/production-application-security-reliability`, 053–055, 180, 189 |
| tenant/resource ownership enforcement | production security lesson, privacy/tenant-isolation, 189–200 |
| function calling vs broader tool calling | 041–060 |
| least-privilege tool exposure + executor re-authorization | production security lesson, 041–060, 181–190 |
| CORS / CSRF / browser-session security | `zero-to-hero/production/production-application-security-reliability` |
| secure file/RAG/multimodal ingestion | production security lesson + prompt-injection defense + multimodal security |
| webhooks: signatures / freshness / replay / idempotency | production security lesson + LLM API background/webhooks |
| external API validation / unsafe API consumption | production security lesson |
| SSRF / URL validation / network egress | production security lesson, 190, prompt-injection defense |
| secrets / KMS / rotation / encryption in transit and at rest | production security lesson + privacy/PII-secrets |
| data lifecycle / deletion / derived embeddings and memory | production security lesson + privacy track |
| production orchestration | 191 |
| async jobs / queues / workers / progress | 192 |
| model routing / failover | 193 |
| caching / invalidation / tenant-safe keys | 194 |
| cost engineering | 195 |
| latency / TTFT / TPOT / streaming / parallelism | 196 + inference track |
| attention backends / SDPA / FlashAttention-style kernels | `zero-to-hero/inference/huggingface-transformers` |
| PagedAttention / continuous batching / KV pressure | inference track |
| quantization / self-hosted serving | inference track + Generative AI serving guide |
| SLI / SLO / error budgets | `zero-to-hero/inference/capacity-observability` |
| OpenTelemetry GenAI telemetry conventions | `zero-to-hero/inference/capacity-observability`, 186 |
| failure taxonomy / deadlines / backoff / jitter / circuit breaker / DLQ | production security lesson, 197 |
| bulkheads / backpressure / load shedding / concurrency limits | production security lesson, 192, 197 |
| idempotent writes and replay-safe side effects | production security lesson, 058, 151–152, 197 |
| backups / restore testing / RPO / RTO / disaster recovery | `zero-to-hero/production/production-application-security-reliability` |
| health checks / readiness / graceful degradation | production security lesson |
| CI/CD security / dependency and secret scanning / artifact provenance | production security lesson + privacy/supply-chain-governance |
| unit/integration/API/authorization/security/graph/contract tests vs evals | production security lesson, 198 |
| load / failure / recovery testing | production security lesson + inference capacity/load testing |
| offline vs sampled online AI evals | 181–190 |
| guardrails vs evals / runtime policy enforcement | 181–190, prompt-injection defense |
| computer-use / browser-agent production controls | 156–170 |
| agentic security / jailbreak / red-team containment evals | prompt-injection defense, 188–190 |
| deployment / migrations / feature flags / canary / rollback / kill switches | production security lesson, baseline, 148, 155, 191–200 |
| audit logs vs traces / telemetry redaction | production security lesson, 169–170, 186 |
| system design method | 199 |
| staff AI platform engineering | 200 |
| multi-tenancy | 189, 191–200, Project 15, capstone |
| monitoring/incident response | 186–187, 197, incident drills |
| production architectures | Projects 6–15, capstone |
| ChatGPT/RAG/support/coding/research/search/document/MCP/eval platform designs | Senior/Staff interview bank and exercises 212–226 |

The capstone is the integration proof: auth/tenancy, model gateway, streaming/structured output, RAG/hybrid/rerank, LangChain/LangGraph, checkpoints/HITL, tools/MCP/OAuth, queues/retries/cache, evals/observability, rate/cost/security/testing/deployment.

## Production-ready definition

For this handbook, “production ready” means the curriculum covers more than making the model return a good demo answer. A deployable AI system must address:

```text
validation + authentication + authorization + least privilege
+ quality + safety + reliability + latency + cost
+ privacy + encryption + tenant isolation
+ observability + auditability + evals
+ backups/recovery + rollback + incident response
```

A topic is not considered covered merely because a provider exposes a feature. The handbook should explain the application boundary, failure modes, security implications, evaluation/test method and operational trade-offs needed to use that feature responsibly.

## Full request-boundary invariant

```text
client
  ↓
TLS / gateway / request limits
  ↓
authentication
  ↓
runtime validation
  ↓
authorization + tenant/resource policy
  ↓
rate/quota/budget controls
  ↓
AI model / RAG / agent
  ↓
tool proposal
  ↓
re-validation + re-authorization + approval + idempotency
  ↓
side effect
  ↓
output validation/redaction
  ↓
response + trace + audit
```

The LLM cannot replace or bypass any deterministic control in this path.
