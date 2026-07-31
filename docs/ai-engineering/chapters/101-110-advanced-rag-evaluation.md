---
id: chapters-101-110
title: 101–110 — Advanced RAG & Retrieval Evaluation
---

# 101 — Hybrid Search

Semantic vectors recover meaning; lexical search recovers exact terms, names, identifiers, and rare phrases. Hybrid retrieval combines both candidate signals.

```text
query
 ├→ dense semantic search ─┐
 └→ BM25 / sparse search ─┼→ fuse → candidates
                          ┘
```

Fusion can use weighted normalized scores or rank-based methods such as reciprocal rank fusion. Evaluate weighting by query class rather than choosing one global constant without evidence.

# 102 — BM25 & Lexical Retrieval

BM25 ranks documents from term frequency, inverse document frequency, and length normalization. It remains valuable for code names, SKUs, error strings, legislation references, and domain vocabulary that embedding models may blur.

**Production lens.** Keep lexical fields clean and language-aware. Hybrid search is often more robust than treating vector retrieval as a universal replacement for inverted indexes.

# 103 — Reranking

Retrieve broadly with a fast first-stage index, then use a stronger reranker on a smaller candidate set.

```text
100 candidates → reranker → top 8 context chunks
```

Cross-encoder or model-based rerankers can evaluate query-document relevance more deeply because they process the pair jointly. They add latency/cost, so benchmark candidate count and cache where semantics allow it.

# 104 — Query Rewriting, Multi-Query & HyDE

Query rewriting clarifies intent or expands vocabulary. Multi-query retrieval generates alternative formulations and merges candidates. HyDE retrieves using an embedding of a hypothetical answer/document.

These techniques can improve recall but can also drift away from exact user constraints. Preserve the original query, trace transformations, cap expansions, and compare against a simple baseline.

# 105 — Contextual, Parent-Child & Hierarchical Retrieval

A small chunk may retrieve well but lack enough context to answer. Parent-child retrieval indexes small child units but returns a larger parent section. Hierarchical retrieval first locates a document/section, then searches within it.

This separates **retrieval granularity** from **generation context granularity** and often beats simply increasing chunk size.

# 106 — Metadata, Temporal & Source Routing

Route and filter before expensive semantic search when trusted metadata can narrow the domain.

```text
query → classify domain
      → tenant/ACL filter
      → time window
      → selected source/index
      → semantic + lexical retrieval
```

Use deterministic routing for hard policy constraints. Model-based routing can help interpret intent but may not grant access.

# 107 — Context Compression, Ordering & Deduplication

Compression removes irrelevant material while preserving evidence. Ordering should place highly relevant, authoritative, and mutually supporting chunks where the model can use them effectively.

Deduplicate overlapping/near-identical chunks and group evidence by source when useful. Measure whether compression drops facts required for difficult questions.

# 108 — Insufficient Context & Confidence Handling

A mature RAG system can decline to answer when retrieval does not support the claim.

Do not map one similarity score directly to “confidence in the final answer.” Retrieval score, reranker score, source authority, evidence agreement, and generation uncertainty are different signals.

Define product states such as `answered`, `insufficient_context`, `conflicting_sources`, and `requires_human` and test them.

# 109 — Retrieval Evaluation

Evaluate the retriever before blaming the model.

- **recall@k**: fraction of relevant items found within top-k;
- **precision@k**: fraction of top-k items that are relevant;
- **hit rate**: whether at least one expected item appears;
- **MRR**: rewards placing the first relevant result early;
- **nDCG**: handles graded relevance and ranking quality.

Build query→relevant-document judgments from real product tasks and adversarial edge cases.

# 110 — End-to-End RAG Evaluation

Separate retrieval quality from generation quality.

```text
golden dataset
   ↓
retriever ─→ recall / precision / rank metrics
   ↓
context builder
   ↓
generator ─→ groundedness / faithfulness / correctness / citation checks
   ↓
latency + tokens + cost + safety
   ↓
regression decision
```

A chatbot “feeling good” in manual testing is not an evaluation strategy. Ship retrieval/prompt/model changes only after comparing them against a versioned baseline and inspecting meaningful regressions by query class.
