---
id: production-ai-coverage
title: Production AI Coverage
---

# Production AI Coverage

| Production area | Coverage |
|---|---|
| model/provider abstraction | 040, 191, 193 |
| structured outputs and runtime validation | 041–050 |
| function calling vs broader tool calling | 041–060 |
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
| failure taxonomy / backoff / jitter / circuit breaker / DLQ | 197 |
| unit/integration/graph/contract tests vs evals | 198 |
| offline vs sampled online AI evals | 181–190 |
| guardrails vs evals / runtime policy enforcement | 181–190, prompt-injection defense |
| computer-use / browser-agent production controls | 156–170 |
| agentic security / jailbreak / red-team containment evals | prompt-injection defense, 188–190 |
| system design method | 199 |
| staff AI platform engineering | 200 |
| multi-tenancy | 189, 191–200, Project 15, capstone |
| deployment/version evolution | baseline, 148, 155, 191–200 |
| monitoring/incident response | 186–187, 197, incident drills |
| production architectures | Projects 6–15, capstone |
| ChatGPT/RAG/support/coding/research/search/document/MCP/eval platform designs | Senior/Staff interview bank and exercises 212–226 |

The capstone is the integration proof: auth/tenancy, model gateway, streaming/structured output, RAG/hybrid/rerank, LangChain/LangGraph, checkpoints/HITL, tools/MCP/OAuth, queues/retries/cache, evals/observability, rate/cost/security/testing/deployment.

## Production-ready definition

For this handbook, “production ready” means the curriculum covers more than making the model return a good demo answer. A deployable AI system must address:

```text
quality + safety + authorization + reliability + latency + cost
+ observability + evals + data/privacy + rollback + incident response
```

A topic is not considered covered merely because a provider exposes a feature. The handbook should explain the application boundary, failure modes, security implications, evaluation method and operational trade-offs needed to use that feature responsibly.
