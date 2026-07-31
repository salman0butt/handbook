---
id: 00-start-here
title: 00 — Start Here
sidebar_position: 3
---

# 00 — Start Here

## The engineering mental model

An LLM is a component inside a software system, not the system itself.

```text
request
  ↓
deterministic application code
  ├── authentication / authorization
  ├── input validation
  ├── retrieval
  ├── model call
  ├── tool execution
  ├── state persistence
  └── observability / eval hooks
  ↓
response or side effect
```

The model produces probabilistic outputs. Everything around it should make uncertainty explicit and enforce deterministic invariants where the product requires them.

## Five questions to ask before adding AI

1. **What uncertainty is useful?** Classification, extraction, generation, semantic retrieval, planning, or natural-language interaction?
2. **What must remain deterministic?** Authorization, money movement, database integrity, compliance checks, rate limits, idempotency, and destructive writes are common examples.
3. **What evidence will prove quality?** Define datasets and metrics before relying on demos.
4. **What happens when the model/provider/tool fails?** Timeouts, retries, fallbacks, human escalation, and safe partial completion belong in the design.
5. **What does one successful task cost and how long does it take?** Token usage, retrieval, reranking, tools, loops, and queue time all contribute.

## Provider-neutral boundary

Keep provider SDK objects out of core domain code.

```ts
export type GenerateRequest = {
  system: string;
  user: string;
  signal?: AbortSignal;
};

export type GenerateResult = {
  text: string;
  inputTokens?: number;
  outputTokens?: number;
};

export interface ModelProvider {
  generate(request: GenerateRequest): Promise<GenerateResult>;
}
```

Provider adapters can expose richer capabilities, but application policy should not become inseparable from one vendor unless the product intentionally accepts that dependency.

## Security rule

Never implement this:

```text
LLM decides authorization → execute
```

Implement this:

```text
LLM proposes action
  ↓
parse + validate
  ↓
authorization / policy check
  ↓
optional human approval
  ↓
idempotent tool executor
  ↓
audit log
```

Prompt instructions are not an authorization system.

## Study expectations

Run examples, change inputs, deliberately break schemas and tools, inspect traces, create evaluation cases, and calculate cost. For RAG, evaluate retrieval separately from generation. For agents, inspect trajectories and stop conditions rather than judging only the final prose.

The target outcome is not “I know LangChain.” It is: **I can design, implement, evaluate, secure, operate, and explain production AI systems, and I know when a simpler non-agent architecture is better.**
