---
id: chapters-061-080
title: 061–080 — Embeddings, Semantic Search & Vector Databases
---

# 061 — Embedding Vectors

An embedding model maps an input into a fixed-dimensional vector. The coordinates are not human-assigned features; meaning emerges from the geometry learned during training.

```ts
type Embedding = readonly number[];
```

**Production lens.** Persist which embedding model/version produced every vector. Mixing incompatible embedding spaces makes similarity scores meaningless.

# 062 — Dimensions

Vector dimension is the number of numeric coordinates. Higher dimension can encode richer relationships but increases storage, transfer, index memory, and compute.

Do not choose an embedding model by dimension alone. Benchmark semantic quality on your queries/documents, then account for database/index cost.

# 063 — Cosine Similarity

Cosine similarity compares vector direction.

```ts
export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error("dimension mismatch");
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  const denom = Math.sqrt(aa) * Math.sqrt(bb);
  if (denom === 0) throw new Error("zero vector");
  return dot / denom;
}
```

Use the distance/similarity metric recommended by the embedding model and supported by the index.

# 064 — Dot Product & Euclidean Distance

Dot product combines direction and magnitude; Euclidean distance measures geometric distance. When vectors are normalized, cosine and dot-product ranking can become closely related.

**Production lens.** Metric choice must agree across embedding generation, index configuration, evaluation, and threshold logic. A threshold calibrated on cosine scores cannot be copied blindly to a different metric/model.

# 065 — Normalization

Normalization scales vectors, often to unit length. Some providers/models already return vectors suitable for a particular metric; some databases can normalize or use metric-specific operators.

Record the pipeline. Double-normalizing is usually harmless mathematically for unit normalization but hidden preprocessing makes migrations and debugging harder.

# 066 — Semantic Similarity Is Not Truth

Nearby vectors indicate learned similarity, not factual correctness, authorization, causal relationship, or exact duplicate identity.

A query about “termination policy” may retrieve “ending employment” even without shared keywords—that is the value. But similarity can also surface semantically related yet policy-incorrect documents.

**Production lens.** Combine metadata filters, lexical signals, rerankers, and source policy with embeddings.

# 067 — Similarity Thresholds

Thresholds decide whether a retrieved candidate is “similar enough,” but score distributions vary by model, corpus, query type, and index metric.

Calibrate using labeled query-document pairs. Plot success/error rates across thresholds and consider top-k plus confidence logic rather than one universal magic number.

# 068 — Document Embeddings

Document embeddings represent retrieval units: chunks, paragraphs, products, tickets, code symbols, or other meaningful records.

Embed the text users will conceptually search, while preserving original content and metadata separately. Avoid stuffing access-control metadata into natural language and hoping the embedding enforces it.

# 069 — Query Embeddings

The query is embedded in the same compatible space as the corpus. Some models distinguish query/document modes or recommend prefixes/instructions; follow model guidance.

Normalize user intent before embedding only when evaluation proves it helps. Over-aggressive query rewriting can remove crucial names, IDs, negation, or dates.

# 070 — Batch Embeddings

Batching improves throughput and reduces request overhead for ingestion. Respect provider batch/item/token limits, retry individual failures safely, and make ingestion idempotent.

```text
documents → chunk → batch → embed → upsert
                         ↘ failed items → retry queue
```

Store source checksum and embedding version so unchanged chunks need not be re-embedded.

# 071 — Re-Embedding & Versioning

Changing model, dimensions, normalization, chunk text, or preprocessing requires a migration strategy.

Use versioned indexes/columns and dual-read or shadow evaluation before cutover. Never overwrite the only working index before the replacement is fully built and validated.

# 072 — Multilingual Embeddings

Multilingual embedding models place semantically related content across languages into a shared space to varying degrees.

Evaluate language pairs that matter to the product. Retrieval quality for English benchmarks does not prove quality for Urdu, Arabic, German, or code-mixed queries. Preserve language metadata for routing and diagnostics.

# 073 — What a Vector Database Does

A vector database stores vectors plus identifiers/metadata and provides similarity search, filtering, updates/deletes, and scalable indexing.

```text
query text → embedding → vector index → candidate IDs → metadata/content → ranked results
```

It does not automatically implement good chunking, permissions, reranking, citations, or RAG evaluation.

# 074 — Exact vs Approximate Nearest Neighbor Search

Exact search compares against all eligible vectors and returns true nearest neighbors; approximate indexes trade some recall for major speed improvements at scale.

Measure recall and latency on your dataset. Small corpora may not need ANN complexity at all.

# 075 — HNSW

Hierarchical Navigable Small World indexes build graph connections that support fast approximate search with strong speed/recall characteristics.

**Trade-offs.** They typically consume significant memory and have tunable construction/query parameters. Index build/update cost matters for rapidly changing corpora.

pgvector, Qdrant, Weaviate, Redis, and other systems expose HNSW-style options with implementation-specific parameters—use official docs and benchmark rather than copying settings.

# 076 — IVFFlat

IVFFlat partitions vectors into lists/clusters and searches selected lists at query time. It can build faster/use less memory than HNSW in some environments but needs suitable data/training and tuning.

**Production lens.** Index choice depends on corpus size, update pattern, memory, latency target, and recall target. Preserve a brute-force benchmark subset to measure ANN recall.

# 077 — Metadata & Filtering

Metadata carries source, tenant, access labels, timestamps, language, document type, product category, or other deterministic constraints.

```text
semantic candidates
+ tenant_id = current tenant
+ access_group IN user groups
+ effective_at <= now
→ eligible results
```

Authorization must be enforced by trusted filters/query construction, not by asking the model to ignore forbidden chunks.

# 078 — Collections, Namespaces & Multi-Tenancy

Vector systems expose organization primitives such as collections, indexes, namespaces, or partitions. Choose isolation based on tenant count, data volume, lifecycle, compliance, and operational cost.

A namespace can reduce accidental cross-tenant retrieval but does not automatically replace database authorization. Test isolation explicitly.

# 079 — CRUD & Index Freshness

RAG quality depends on update/delete semantics. A deleted policy must disappear from retrieval; a changed source must invalidate old chunks; failed ingestion must not leave half-updated state.

Use source IDs, content hashes, version numbers, transactional metadata, and reconciliation jobs. Monitor “source updated → searchable” freshness separately from query latency.

# 080 — Vector Database Trade-Offs

**PostgreSQL + pgvector** is attractive when relational metadata/transactions and moderate vector workloads belong together. **Pinecone** offers managed vector infrastructure. **Qdrant** emphasizes vector search/filtering and hybrid/multi-stage queries. **Weaviate** combines vector, BM25/hybrid, filters, and reranking integrations. **Redis** can combine vector search with an existing low-latency data platform.

Choose from measured workload requirements:

```text
scale + recall + latency + update rate + filters + operations + cost + tenant model
```

Keep a `VectorStore` application interface so retrieval policy is portable even when provider-specific optimization remains inside adapters.
