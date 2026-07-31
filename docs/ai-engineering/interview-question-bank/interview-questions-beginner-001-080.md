---
id: interview-questions-beginner-001-080
title: Interview Questions 001–080 — Beginner
---

# 80 Beginner Interview Questions

| # | Question | Expected answer | Reasoning | Common wrong answer | Follow-up | Chapter |
|---:|---|---|---|---|---|---|
| Q001 | What is generative AI? | Models that generate outputs from learned distributions, e.g. text/images/audio. | Distinguishes generation from generic automation. | “Any AI system.” | How is an LLM a generative model? | 001–002 |
| Q002 | What does an LLM predict during text generation? | A distribution over the next token conditioned on context. | Core mental model. | “The final answer directly.” | What happens after a token is selected? | 002 |
| Q003 | What are model parameters? | Learned numeric weights used during inference. | Separates learned state from chat memory. | “Tokens in the prompt.” | Does a chat message update them? | 011 |
| Q004 | What is inference? | Running a trained model to produce outputs. | Serving vs training. | “Fine-tuning.” | Name two inference metrics. | 014 |
| Q005 | What is a token? | A tokenizer vocabulary unit represented by an ID. | APIs reason in tokens. | “Always one word.” | Why can code tokenize differently? | 008–009 |
| Q006 | What is a context window? | Finite input+generation working context available to a model. | Explains memory/cost constraints. | “Permanent memory.” | Why not fill it completely? | 017 |
| Q007 | What is an embedding? | Dense vector representing learned semantic features. | Basis of semantic retrieval. | “Encrypted text.” | What does vector similarity mean? | 010, 061 |
| Q008 | What is attention? | Mechanism weighting relationships among token representations. | Transformer foundation. | “Internet search.” | What is self-attention? | 005–006 |
| Q009 | Why is positional information needed? | Attention alone does not encode sequence order. | Order matters to meaning. | “For token IDs.” | Name one positional technique. | 007 |
| Q010 | What are logits? | Unnormalized scores for candidate output tokens. | Connects model output to sampling. | “Final probabilities.” | How become probabilities? | 015 |
| Q011 | What does temperature do? | Reshapes token probability distribution/sampling behavior. | Avoids “truth knob” misconception. | “Makes facts correct.” | What about top-p? | 016 |
| Q012 | What is pretraining? | Large-scale training for general representations/capabilities. | Distinguishes lifecycle stages. | “User prompt creation.” | How differs from fine-tuning? | 012–013 |
| Q013 | What is fine-tuning useful for? | Behavior/style/task specialization when justified. | Matches technique to problem. | “Keeping facts current.” | When prefer RAG? | 013, 081 |
| Q014 | What is a reasoning model? | Model optimized to allocate more deliberate computation to hard tasks. | Current model class concept. | “A model exposing all chain-of-thought.” | When route to it? | 019 |
| Q015 | What is a multimodal model? | Model that accepts/produces multiple modalities depending on capability. | Beyond text-only apps. | “A model with many prompts.” | Give a document use case. | 020 |
| Q016 | What makes a good prompt? | Clear task, context, constraints, examples if useful, output contract. | Prompt as interface. | “Long persona.” | How do you version prompts? | 021–024 |
| Q017 | Zero-shot vs few-shot? | Instructions only vs instructions plus several examples. | Basic prompting strategy. | “Zero vs many model calls.” | When can examples hurt? | 026 |
| Q018 | Why use delimiters? | Clarify boundaries between instruction and payload/context. | Reduces ambiguity. | “They prevent injection.” | What prevents unsafe actions? | 025, 034 |
| Q019 | What is prompt injection? | Untrusted content attempts to alter intended model behavior. | Security foundation. | “SQL injection into prompt.” | What is indirect injection? | 034 |
| Q020 | Why version prompts? | Reproduce/evaluate/roll back behavior changes. | Prompts are production artifacts. | “Only for Git history.” | What trace field do you add? | 037 |
| Q021 | Why keep API keys server-side? | Prevent client extraction/abuse and centralize policy. | Secret boundary. | “Because browsers cannot call APIs.” | Where store secrets? | 038 |
| Q022 | Why use timeouts on model calls? | Bound latency/resources and recover from hung dependencies. | Distributed-system hygiene. | “Models never time out.” | Retry every timeout? | 039 |
| Q023 | Why use a provider adapter? | Decouple domain policy from vendor SDK and enable testing/routing. | Portability and boundaries. | “All providers are identical.” | What remains provider-specific? | 040 |
| Q024 | Why isn’t JSON enough? | Syntax does not enforce types, required fields, semantics, or policy. | Typed boundary. | “JSON is always valid if parsed.” | What validates runtime shape? | 041–047 |
| Q025 | Why use Zod around model output? | Runtime validation and inferred TypeScript types. | TS types vanish at runtime. | “TypeScript validates API responses.” | What follows schema parse? | 043, 047 |
| Q026 | Optional vs nullable? | Missing field vs present field with null. | Domain precision. | “Same thing.” | When model missing evidence? | 045 |
| Q027 | What is a discriminated union? | Tagged variants with different valid shapes. | Models terminal states cleanly. | “Object with many optional fields.” | Give AI result variants. | 046 |
| Q028 | What is semantic validation? | Business invariant checks after structural validation. | Schema validity ≠ business validity. | “JSON parsing.” | Example with refund amount? | 047 |
| Q029 | Should invalid output always be retried? | No; classify malformed/transient vs missing evidence/policy/schema bugs. | Avoids waste/loops. | “Retry until valid.” | How bound retries? | 048 |
| Q030 | Why version schemas? | Downstream/queued consumers depend on contract. | AI output becomes API data. | “Models adapt automatically.” | Safe additive change? | 049 |
| Q031 | What is tool calling? | Model proposes structured function call; application executes. | Central boundary. | “Model runs the API.” | Who validates arguments? | 051 |
| Q032 | What is a tool schema? | Name/description/input contract for a capability. | Helps selection and validation. | “A prompt sentence only.” | What else enforces permission? | 052 |
| Q033 | Where does tool authorization belong? | Deterministic application policy immediately before execution. | Model cannot authorize. | “System prompt.” | What context supplies actor? | 053–055 |
| Q034 | Read vs write tools? | Reads expose data; writes create side effects and need stronger controls/idempotency/approval. | Risk classification. | “Reads are always safe.” | Name sensitive read risk. | 055 |
| Q035 | When can tools run in parallel? | Independent operations with safe merge semantics. | Latency vs dependency correctness. | “All model tool calls.” | What about writes? | 056 |
| Q036 | What is tool idempotency? | Repeating same logical write does not duplicate side effect. | Retry/replay safety. | “Tool is fast.” | How create a key? | 058 |
| Q037 | Why is HITL more than “ask first”? | It requires persisted proposal, interrupt, decision, bound resume/execution. | Prompt is not workflow enforcement. | “Model waits in memory.” | What if server restarts? | 059 |
| Q038 | Why stream responses? | Reduce perceived latency/show progress. | UX not necessarily compute reduction. | “It reduces token cost.” | What if stream breaks? | 060 |
| Q039 | What is cosine similarity? | Directional similarity between vectors normalized by magnitudes. | Common embedding metric. | “Euclidean distance.” | Range/interpretation? | 063 |
| Q040 | What is vector dimension? | Number of coordinates in embedding vector. | Storage/index implication. | “Number of documents.” | Does bigger mean better? | 062 |
| Q041 | What is semantic search? | Search by learned meaning rather than only term overlap. | Embedding use case. | “Keyword search with synonyms.” | Why keep lexical search? | 066, 101–102 |
| Q042 | What is a similarity threshold? | Score cutoff calibrated for a task/model/corpus. | Avoid magic values. | “0.8 always.” | How calibrate? | 067 |
| Q043 | Why store embedding model version? | Re-embedding/migration; vector spaces can be incompatible. | Operational correctness. | “Vectors are universal.” | What else version? | 071 |
| Q044 | Exact vs ANN search? | Exact true neighbors vs approximate faster search with recall trade-off. | Index fundamentals. | “ANN is always better.” | When use exact? | 074 |
| Q045 | What is HNSW? | Graph-based ANN index with strong speed/recall and memory/build trade-offs. | Understand index family. | “A vector distance metric.” | Compare IVFFlat. | 075–076 |
| Q046 | What is metadata filtering? | Deterministic constraints on eligible vector records. | Crucial for domain/ACL. | “Prompt tells model to ignore results.” | How use tenant filter? | 077 |
| Q047 | What does a vector database not do for you? | Chunking, authorization, RAG quality, citations/evals. | Prevents magical thinking. | “Everything needed for RAG.” | Name one missing layer. | 073, 080 |
| Q048 | What is RAG? | Retrieve external evidence at request time and provide it to generation. | Grounding/current/private data. | “Fine-tuning with documents.” | Why use it? | 081–082 |
| Q049 | Name RAG ingestion stages. | Load, parse, clean, chunk, embed, index. | Full pipeline. | “Embed PDF.” | Which stage preserves structure? | 082–090 |
| Q050 | Why chunk documents? | Create meaningful retrieval units within model/index constraints. | Retrieval granularity. | “To reduce file size.” | Too small vs too large? | 086–091 |
| Q051 | What is chunk overlap? | Repeated boundary content across chunks to reduce context loss. | Has cost/noise trade-off. | “Duplicate whole documents.” | Alternative first? | 091 |
| Q052 | Why keep chunk metadata? | Provenance, filters, citations, versions, source hierarchy. | Traceability/security. | “Only vector needed.” | Name five fields. | 092 |
| Q053 | What is top-k retrieval? | Return k highest-ranked eligible candidates. | Basic retriever parameter. | “Similarity threshold only.” | Why two-stage k? | 095 |
| Q054 | What is context construction? | Select/order/dedupe/label retrieved evidence within budget. | Retrieval output isn’t final prompt. | “Concatenate all hits.” | Lost-in-middle concern? | 096 |
| Q055 | What is grounding? | Basing factual answer on supplied authoritative evidence. | Reduces unsupported claims. | “Model sounds confident.” | How evaluate it? | 097, 110 |
| Q056 | How should citations work? | Model references provided IDs that map to original source locations; validate IDs. | Prevent invented sources. | “Let model generate URLs.” | What is citation correctness? | 098, 110 |
| Q057 | When should you not use RAG? | Direct DB query, pure supplied-input transform, tiny full context, etc. | Match solution to problem. | “Always for enterprise AI.” | When use tool instead? | 099 |
| Q058 | What is hybrid search? | Combine dense semantic and lexical/sparse retrieval. | Covers meaning + exact terms. | “Two vector models.” | How fuse ranks? | 101 |
| Q059 | What is BM25? | Lexical ranking using term frequency, rarity, length normalization. | Search fundamentals. | “Embedding metric.” | When does it shine? | 102 |
| Q060 | What is reranking? | Stronger second-stage relevance scoring of retrieved candidates. | Quality vs latency/cost. | “Same as embedding.” | Candidate count trade-off? | 103 |
| Q061 | What is query rewriting? | Transform query to improve retrieval while preserving intent. | Advanced RAG. | “Change user question arbitrarily.” | Risk? | 104 |
| Q062 | What is parent-child retrieval? | Index small units, return larger parent context. | Separates search vs context granularity. | “Two vector DBs.” | Why useful? | 105 |
| Q063 | What is recall@k? | Fraction of relevant items retrieved within top k. | Retrieval metric. | “Answer accuracy.” | Precision@k? | 109 |
| Q064 | What is MRR? | Mean reciprocal rank of first relevant result. | Rewards early relevant hit. | “Average similarity score.” | When limited? | 109 |
| Q065 | Why evaluate retrieval separately? | A generation failure and retrieval failure require different fixes. | Component diagnosis. | “Only final answer matters.” | What retrieval metrics? | 109–110 |
| Q066 | What is LangChain? | JS/TS framework abstractions for models/messages/tools/retrieval/agents etc. | Framework role. | “An LLM.” | When avoid it? | 111, 130 |
| Q067 | Why separate provider integrations? | Core abstractions stay decoupled; provider packages own vendor specifics. | Dependency boundary. | “All imports from one SDK.” | Example package? | 112 |
| Q068 | What are structured messages? | Role-aware model inputs rather than flat concatenated text. | Preserves semantics. | “Strings with labels only.” | Benefit for tools? | 113 |
| Q069 | What is a Runnable/chain conceptually? | Composable invocation pipeline of components. | Deterministic composition. | “Autonomous agent.” | Give a chain example. | 115–116 |
| Q070 | What is a LangChain tool? | Wrapped callable capability with schema/description. | Model integration adapter. | “Authorization policy.” | Where auth lives? | 118 |
| Q071 | What is `createAgent` used for? | Modern high-level LangChain graph-based agent construction. | Current API knowledge. | “Deprecated AgentExecutor only.” | What underlies it? | 120 |
| Q072 | What is middleware for? | Cross-cutting model/tool/agent hooks: routing, retries, guardrails, HITL, tracing. | Production extension. | “Prompt templates.” | Risk of too much hidden middleware? | 121 |
| Q073 | What is a retriever in LangChain? | Interface mapping a query to relevant documents. | Not necessarily vector-only. | “Vector DB itself.” | Could it be hybrid? | 122 |
| Q074 | Why not force every vector provider behind lowest common denominator? | Provider-specific features may be product-critical. | Portability vs capability. | “Abstraction means identical features.” | Where isolate specifics? | 123 |
| Q075 | What is a document loader? | Adapter that converts external source into document objects. | Ingestion first step. | “Complete RAG pipeline.” | What production layers missing? | 124 |
| Q076 | What is a text splitter? | Component dividing documents into retrieval units. | Chunking abstraction. | “Tokenizer only.” | How evaluate split strategy? | 125 |
| Q077 | Why normalize stream events? | Keep UI/API stable across provider/framework changes. | Boundary stability. | “Expose framework events directly.” | Name app events. | 127 |
| Q078 | What should AI traces contain? | Correlated model/retrieval/tool latency/versions/usage/errors without secrets. | Observability. | “Full raw prompts always.” | Why redact? | 128 |
| Q079 | When use plain SDK over LangChain? | Simple calls where framework adds little value. | Least-complex principle. | “Always use framework.” | When LangGraph instead? | 130 |
| Q080 | What is the core security rule for AI systems? | Model proposes; deterministic app validates/authorizes/optionally approves/executes. | Foundational invariant. | “System prompt enforces security.” | Apply it to refund tool. | 053–059, 189 |
