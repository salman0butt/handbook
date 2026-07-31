---
id: pagedattention-continuous-batching
title: PagedAttention & Continuous Batching
---

# PagedAttention & Continuous Batching

LLM serving must manage many sequences whose KV caches grow at different rates. Paged KV-memory techniques allocate cache in blocks/pages rather than requiring one large contiguous region per sequence. **Continuous batching** lets the scheduler add and remove requests as sequences progress instead of waiting for a fixed batch to finish.

```mermaid
flowchart TD
  R1[Request A] --> S[Scheduler]
  R2[Request B] --> S
  R3[Request C] --> S
  S --> B1[Decode step batch]
  B1 --> DONE{Any sequence done?}
  DONE -->|Yes| FREE[Free KV pages + admit new request]
  DONE -->|No| B2[Next decode step]
  FREE --> B2
```

```ts
type KvBlock = { blockId: number; sequenceId: string; tokens: number };
```

## Why it improves utilization

Traditional static batching wastes time when short sequences finish early. Continuous scheduling keeps accelerator work populated while paged KV allocation reduces fragmentation.

## Practice

1. What memory problem does paged KV allocation address?
2. Why does continuous batching improve utilization?
3. How can aggressive batching hurt latency?
4. What admission-control signals should the scheduler consider?
