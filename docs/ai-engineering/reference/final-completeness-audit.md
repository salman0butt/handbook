---
id: final-completeness-audit
title: Final AI Engineering Handbook Completeness Audit
---

# Final AI Engineering Handbook Completeness Audit

**Status: COMPLETE AGAINST THE AUGUST 8, 2026 TECHNICAL BASELINE**

**Current certification date:** August 8, 2026  
**Previous certification:** August 1, 2026

This audit records whether the AI Engineering handbook covers the major knowledge areas required to progress from Generative AI fundamentals to advanced and production-grade AI engineering.

“Complete” here does **not** mean every research paper, model release, vendor-specific API option, legal regime, or future technique is permanently documented. Generative AI changes too quickly for that claim to be meaningful. It means the handbook covers the current core concepts, engineering patterns, security boundaries, evaluation methods and production concerns expected of a production AI engineer, with explicit coverage audits that can be updated as the field changes.

## August 8, 2026 supplemental gap audit

The previous certification was independently re-checked instead of being trusted as proof of its own completeness. That review found several advanced production topics that were implicit or missing and added them to existing lessons:

- **Guardrails vs evaluations:** runtime controls vs measurement, deterministic policy enforcement, LangChain/LangGraph TypeScript examples, HITL, Jest/Vitest vs AI eval suites, offline vs sampled online evaluation, LangSmith/OpenEvals patterns and interpretation of correctness/relevance/groundedness scores.
- **Function calling vs tool calling:** function calling as the narrower structured-function mechanism; tool calling as the broader capability abstraction; in both cases the model proposes and trusted application code executes.
- **Jailbreak, prompt injection and red teaming:** direct/indirect injection distinction, security-outcome grading, containment metrics, false-positive measurement and OWASP LLM/Agentic threat-model alignment.
- **Computer/browser-use agents:** screenshot/DOM observation loops, typed UI actions, origin/egress policies, credential isolation, downloads/uploads, human approval, sandboxing, no-progress limits and external-state/trajectory evals.
- **Attention kernels and inference backends:** eager attention, PyTorch SDPA, FlashAttention-style fused kernels, fallback/compatibility, benchmarking and interaction with KV cache, batching, quantization and parallelism.
- **GenAI reliability objectives:** SLIs, SLOs, error budgets, quality/safety/latency separation, budget burn and release/rollback decisions.
- **OpenTelemetry GenAI observability:** vendor-neutral trace structure, GenAI semantic conventions, token/model/workflow telemetry and privacy-aware prompt/completion capture.

These additions close the concrete gaps found during the August 8 audit rather than merely updating the status label.

## Basic-to-advanced curriculum coverage

### Foundations

The curriculum covers:

- AI, ML, deep learning and Generative AI distinctions;
- neural networks, vectors/matrices/tensors and training basics;
- foundation models, NLP and language modeling;
- LLM parameters, tokens, tokenization, embeddings and context windows;
- Transformer blocks, attention, Q/K/V, residuals, normalization, MLPs, RoPE, MHA/MQA/GQA, causal masking and MoE;
- autoregressive inference, logits, softmax, sampling, temperature, top-p/top-k, reasoning models, uncertainty and hallucinations;
- model selection, token economics, caching and latency/throughput fundamentals.

### Application engineering

The handbook covers:

- prompt engineering from zero/few-shot through decomposition, chaining, reasoning-model prompting, critique/revision, long context and multimodal prompts;
- context engineering, conversation trimming, semantic compression, memory vs state and context poisoning;
- structured outputs, JSON Schema/Zod, semantic validation and schema evolution;
- function/tool calling, argument validation, read/write risk, idempotency, approval boundaries and streaming;
- embeddings, vector search, hybrid search, reranking and advanced RAG;
- GraphRAG, SQL/code RAG, multimodal RAG, adaptive/corrective/self-reflective RAG and index migration;
- LangChain TypeScript and LangGraph TypeScript including state, control flow, persistence, interrupts and HITL;
- agents, ReAct, planner/executor, routers, supervisors, reflection, orchestrator/workers, agentic RAG, computer-use agents, multi-agent communication and memory;
- MCP, OAuth/scopes/permissions and Agent-to-Agent interoperability.

### Generative media and multimodality

Dedicated Generative AI tracks cover:

- autoregressive, VAE/latent, GAN, diffusion, DiT and flow-matching mental models;
- image generation/editing, inpainting/outpainting, structural/reference control and image LoRA;
- speech/audio generation, realtime voice, VAD, barge-in and voice-cloning consent;
- video generation/editing, temporal/identity consistency, camera/motion control and async job architecture;
- multimodal understanding/generation, documents, charts, audio/video understanding and multimodal RAG;
- 3D generation, world models, generative simulation/design and emerging scientific/media systems.

### Training and adaptation

Coverage includes:

- data curation, deduplication and train/validation/test boundaries;
- pretraining and supervised fine-tuning;
- preference data, DPO, RLHF, RLAIF and reinforcement fine-tuning;
- PEFT, LoRA, QLoRA, prompt/soft-prompt tuning and adapter lifecycle;
- synthetic data, teacher/student distillation, self-instruction, provenance and contamination;
- evaluation lineage and benchmark leakage.

### Self-hosted inference and optimization

Coverage includes:

- hosted vs self-hosted trade-offs;
- Hugging Face Transformers, llama.cpp/GGUF and vLLM;
- prefill/decode, TTFT/TPOT, KV cache, PagedAttention and continuous batching;
- quantization and low-precision inference;
- SDPA/FlashAttention-style attention backends and kernel compatibility;
- speculative/assisted decoding;
- tensor, pipeline, data, expert and context/sequence parallelism;
- GPU memory/capacity planning, admission control, autoscaling and realistic load testing.

### Evaluation, observability and security

Coverage includes:

- deterministic tests vs probabilistic AI evals;
- golden sets, regression suites, LLM-as-a-judge, human review and pairwise/rubric grading;
- correctness, relevance, groundedness/faithfulness, retrieval metrics, tool selection and trajectory evaluation;
- offline release evals and sampled online production evals;
- guardrail/adversarial/red-team suites and security containment metrics;
- traces/spans, LangSmith as one tool option, OpenTelemetry concepts and GenAI semantic conventions;
- SLIs/SLOs/error budgets, latency/token/cost metrics and feedback loops;
- prompt injection, jailbreaks, data exfiltration, confused deputy risks, tenant isolation, memory poisoning and malicious external content;
- OAuth, scopes, deterministic authorization, human approval, SSRF, sandboxing, filesystem/network/egress controls, rate limiting, audit logs and incident kill switches;
- browser/computer-use isolation and agentic security trust boundaries.

### Production and staff engineering

Production coverage includes:

```text
API/model gateway
+ auth and multi-tenancy
+ provider abstraction/routing/fallback
+ streaming and async jobs
+ queues/workers/backpressure
+ caching and idempotency
+ RAG/tool/agent orchestration
+ retries/circuit breakers/DLQs
+ rate limits and cost budgets
+ evals/guardrails/security
+ traces/metrics/SLOs
+ versioning/canary/rollback
+ incident response
```

The production projects, staff/senior interview material and multi-tenant capstone combine these topics into system-design exercises rather than leaving them as isolated definitions.

## Zero-to-hero expansion retained

The curriculum contains **107 focused lessons** under `docs/ai-engineering/zero-to-hero/`, covering neural-network training, tokenizers/chat internals, transformer internals, language modeling/decoding, context engineering, LLM API integration, multimodal understanding, training/post-training, self-hosted inference, advanced RAG, OpenAI Agents SDK TypeScript, MCP, Agent-to-Agent interoperability and privacy/governance.

Every zero-to-hero lesson contains a Mermaid diagram, a TypeScript/application code example and a Practice section. CI enforces those requirements instead of relying only on a manual content count.

## Current protocol and ecosystem baseline

MCP **2026-07-28** remains the handbook protocol baseline. The previous 2025-11-25 session-oriented architecture is migration material only.

The August 8 audit also cross-checked current technical areas against:

- Hugging Face Transformers/PEFT/Diffusers documentation for inference, attention backends, quantization, adaptation and generative media;
- PyTorch scaled-dot-product attention documentation for current fused attention backend behavior;
- OpenTelemetry semantic conventions and current GenAI telemetry guidance;
- OWASP GenAI Security Project resources, including the LLM Applications Top 10 and Agentic Applications security guidance;
- current LangChain/LangGraph/LangSmith JavaScript guidance used by the practical eval/guardrail examples.

Provider-specific APIs are examples, not the curriculum boundary. The architecture remains provider-neutral wherever possible.

## Original August 1 release evidence

| Release gate | Evidence |
|---|---|
| Expansion PR | ✅ PR #117 — `docs(ai): add zero-to-hero LLM engineering curriculum` |
| Exact validated expansion head | ✅ `c11f98ccd3b1d05fcb44273f8fe1189328703419` |
| Exact-head production CI | ✅ `Validate handbook build` run `30660249573` |
| Expansion merge | ✅ squash merge `a6dd0cd2d8ef95b47544b863a0311643ccb57658` |
| Merge-triggered Pages deployment | ✅ run `30660548236` |
| Deployment smoke PR | ✅ PR #118, closed without merge |
| Deployment smoke CI | ✅ run `30660636245` |
| Production Docusaurus rebuild | ✅ passed in smoke run |
| Search index | ✅ `15694` generated docs in the smoke build; representative zero-to-hero terms all found |
| Live routes | ✅ representative routes across every new major track returned expected deployed content |

PR #145 later added the practical production eval/guardrail guide after a separate review found that the earlier high-level eval content was not sufficiently implementation-oriented.

## Living completeness rule

This page is a **dated baseline**, not a permanent claim. Re-open the gap audit when any of the following materially changes:

- dominant model architecture or inference technique;
- agent/tool/computer-use capability model;
- MCP/A2A or related interoperability protocols;
- major evaluation/observability standards;
- OWASP/industry GenAI security guidance;
- production serving architecture or runtime behavior;
- significant new modality or adaptation method.

For each new gap:

```text
external/current source change
        ↓
coverage audit
        ↓
lesson/code/eval update
        ↓
exact-head CI
        ↓
merge + deployment
        ↓
new dated baseline
```

## Certification gate for this revision

This August 8 certification is externally valid only after the exact revision containing these gap-closure changes passes the repository's production CI and is merged to `main`. If CI finds a broken route, invalid docs build, or curriculum validation failure, the audit is not complete until that failure is fixed.
