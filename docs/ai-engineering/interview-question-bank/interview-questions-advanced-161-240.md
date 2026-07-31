---
id: interview-questions-advanced-161-240
title: Interview Questions 161–240 — Advanced
---

# 80 Advanced Interview Questions

| # | Question | Expected answer | Reasoning | Common wrong answer | Follow-up | Chapter |
|---:|---|---|---|---|---|---|
| Q161 | How would you debug a prompt regression? | Reproduce versioned case; compare model/prompt/context/tools; change one variable; run eval. | Evidence over superstition. | “Make prompt longer.” | What telemetry is required? | 035–037 |
| Q162 | How do you choose prompting vs fine-tuning? | Prompt first; fine-tune when behavior specialization is persistent and eval-backed. | Solve real failure. | “Fine-tune for current docs.” | Where does RAG fit? | 013, 081 |
| Q163 | How do you handle context overflow? | Budget, retrieve/summarize/drop low-value history while preserving critical instructions. | Finite working set. | “Use max window model always.” | How test summarization loss? | 017 |
| Q164 | How do you make structured output robust? | Native constraints/schema + runtime parse + semantic validation + bounded recovery. | Layered trust. | “Ask for JSON.” | What errors should not retry? | 041–050 |
| Q165 | How do you model AI uncertainty in an API? | Explicit terminal variants/nullable evidence/conflict state, not fabricated defaults. | Product states matter. | “Add confidence float only.” | When escalate? | 045–048, 108 |
| Q166 | Why can a schema-valid tool call still be dangerous? | Arguments can reference unauthorized resources/unsafe semantics. | Validation ≠ authorization. | “Schema makes it safe.” | What checks follow? | 052–055 |
| Q167 | How do you prevent duplicate writes from agent retries? | Idempotency key + external status/reconciliation + persisted result. | Distributed correctness. | “Disable retries.” | Timeout after possible success? | 058, 197 |
| Q168 | When should a tool require HITL? | Risk/irreversibility/external communication/compliance/user intent ambiguity. | Product risk, not model confidence alone. | “All tools” or “none.” | How bind approval? | 059, 169 |
| Q169 | How do you evaluate tool selection? | Dataset of expected tool/no-tool/args plus trajectory and policy checks. | Agents need process eval. | “Check final answer.” | Parallel calls? | 185 |
| Q170 | How would you secure a web-fetch tool? | URL normalization, allow/deny, DNS/IP/redirect checks, egress sandbox, time/size limits. | SSRF/prompt-injection surface. | “Validate https prefix.” | What about redirects? | 190 |
| Q171 | How do you migrate embedding models? | Build versioned parallel index, backfill, evaluate, shadow/dual read, cutover/rollback. | Vector spaces incompatible. | “Overwrite vectors in place.” | What metadata? | 071 |
| Q172 | HNSW vs IVFFlat? | Workload-specific trade-offs in recall/speed/memory/build/update/tuning. | No universal winner. | “HNSW always.” | How benchmark? | 075–076 |
| Q173 | How do ACL filters interact with ANN search? | Eligibility must remain security-correct; index/filter implementation affects recall/perf, not authorization semantics. | Security before relevance. | “Filter model output later.” | How test isolation? | 077–080, 189 |
| Q174 | How do you decide chunk size? | Labeled retrieval eval across query/document types + context/cost trade-offs. | Hyperparameter. | “500 tokens always.” | Overlap? | 086–091 |
| Q175 | How do you handle tables in RAG? | Preserve headers/structure, chunk/table representation deliberately, cite original location. | Plain text can destroy semantics. | “Split every N chars.” | How evaluate? | 084, 090 |
| Q176 | Why can RAG hallucinate even with correct retrieval? | Generator can misread/ignore/merge evidence or overgeneralize. | Retrieval and generation distinct. | “RAG guarantees truth.” | How grade groundedness? | 097, 110 |
| Q177 | Why can bad retrieval still yield correct answer? | Model may know answer from weights or guess, masking retriever failure. | Need component metrics. | “Retriever was good.” | How detect? | 109–110 |
| Q178 | When use hybrid search? | Corpus/query mix needs exact lexical + semantic meaning; prove with segmented eval. | Robust retrieval. | “Always hybrid.” | Fusion method? | 101–102 |
| Q179 | When use reranking? | Broad first-stage recall but ranking quality inadequate and latency/cost budget allows. | Multi-stage retrieval. | “Replace vector DB.” | How many candidates? | 103 |
| Q180 | Query rewriting risks? | Drift, loss of IDs/negation/dates, injection amplification, added cost. | Transformations need trace/eval. | “Always improves search.” | Safe design? | 104 |
| Q181 | How do you handle conflicting RAG sources? | Source authority/version/time policy, expose conflict or escalate instead of arbitrary synthesis. | Grounding includes source governance. | “Let model pick.” | How represent state? | 106, 108 |
| Q182 | How do you evaluate citation quality? | Citation exists, supports claim, maps to authoritative original location. | Three separate properties. | “Any URL.” | Automatable parts? | 098, 110 |
| Q183 | When is LangChain a bad fit? | Small simple provider call or abstraction obscures needed provider features/control. | Framework cost awareness. | “Never bad.” | When useful? | 111, 130 |
| Q184 | How do you keep domain logic framework-independent? | Domain services/types/policies underneath adapters/tools/nodes. | Upgrade/testability. | “Put everything in agent tool.” | Example boundary? | 118, 130 |
| Q185 | What does modern `createAgent` change architecturally? | High-level agent is graph-based on LangGraph with middleware/tools/state, but product policy still external. | Current framework model. | “It removes need for graph.” | When drop to LangGraph? | 120, 130 |
| Q186 | How do you design middleware safely? | Single-purpose, explicit ordering, traceable mutations, no hidden auth decisions. | Cross-cutting complexity. | “Put all logic in middleware.” | How test order? | 121 |
| Q187 | How do you expose LangGraph events to frontend? | Map runtime events/state to stable product event schema. | Decouple UI from framework. | “Forward raw event JSON.” | Resume UI? | 143 |
| Q188 | What reducer bugs appear in parallel graphs? | Non-associative/order-dependent merges, duplicate accumulation, mutable state. | Concurrency semantics. | “Reducers are just React reducers.” | Mitigation? | 135, 145 |
| Q189 | How do you handle state-schema evolution? | Version/default/migrate; test old checkpoints with new code; staged rollout. | Durable state outlives deploy. | “Delete checkpoints.” | Breaking change example? | 148, 155 |
| Q190 | Why must interrupt payload be serializable? | It is persisted/surfaced across process boundary/resume. | Durability. | “Because JSON is faster.” | What must not be included? | 149 |
| Q191 | Why re-check auth after resume? | Actor permissions/resource state may change during long pause. | Time-sensitive authorization. | “Approval locks permission forever.” | What if revoked? | 169 |
| Q192 | How do you make node side effects replay-safe? | Place after interrupt, idempotency keys, persisted outcome, reconcile ambiguous states. | Durable execution. | “Mark node once.” | External API lacks idempotency? | 151–152 |
| Q193 | How do you decide node granularity? | Observable logical responsibility with useful retry/checkpoint boundary, not every function call. | Graph clarity. | “One node per line.” | When combine nodes? | 136, 146 |
| Q194 | When should a graph use parallel branches? | Independent slow operations with safe merge/partial-failure semantics. | Latency benefit with correctness. | “Whenever possible.” | Writes? | 145 |
| Q195 | Agent vs deterministic graph for support refunds? | Deterministic risk/approval/write path; optional agent only for interpretation/retrieval. | Least probabilistic control. | “Agent handles everything.” | Draw flow. | 157, 169 |
| Q196 | How do you evaluate planner quality? | Plan validity/completeness plus executor success, replans, steps, cost. | Plan is intermediate artifact. | “Plan sounds sensible.” | Gold plans necessary? | 159, 185 |
| Q197 | How do you detect no-progress agents? | Repeated tool/action hashes, unchanged state, failed retries, token/step thresholds. | Prevent loops. | “Ask model if stuck.” | Recovery route? | 170, 185 |
| Q198 | What makes multi-agent specialization real? | Different tools/context/prompt/ownership improves eval outcome; not just different names. | Evidence over personas. | “Three roles = specialization.” | Baseline? | 164–165 |
| Q199 | How do you prevent multi-agent data leakage? | Isolated state, typed handoffs, per-worker tool/data permissions, audit. | Internal agents are still trust boundaries. | “Same application means safe.” | Shared source? | 165, 189 |
| Q200 | How do you resolve agent disagreement? | Authority/rubric/third evidence/escalation with bounded convergence. | Explicit policy. | “Majority vote always.” | High-stakes case? | 166 |
| Q201 | Why is memory a data-governance problem? | Persistence, provenance, consent, retention, edit/delete, stale/conflicting facts. | Long-term state affects users. | “Just vector embeddings.” | GDPR-style deletion path? | 167–168 |
| Q202 | How do you prevent memory hallucinations? | Store source/provenance, distinguish inferred vs confirmed, validate/update, allow user correction. | Model summaries are not facts. | “Higher temperature 0.” | Retrieval conflict? | 168 |
| Q203 | What is the MCP trust model? | Host owns policy; servers supply capabilities/content but are not automatically trusted/authorized. | Protocol ≠ trust. | “MCP servers are trusted by standard.” | Third-party install review? | 171–178 |
| Q204 | stdio vs Streamable HTTP? | Local child-process simplicity vs remote network transport needing auth/network controls. | Deployment model. | “HTTP is always better.” | Sessions? | 174 |
| Q205 | What changed conceptually in draft MCP 2026 revision? | Negotiation/session/server→client patterns evolve; treat as version-sensitive, not stable baseline. | Docs currency. | “Use draft automatically.” | Migration strategy? | baseline, 175 |
| Q206 | How do you secure MCP discovery? | Registry allowlist/trust/risk review before discovered capabilities reach model/executor. | Metadata can poison behavior. | “Discovery means approval.” | What if schema changes? | 177–178 |
| Q207 | MCP OAuth token passthrough problem? | Server must not forward client token to unrelated upstream; use intended resource audience/scopes/token exchange architecture. | Credential isolation. | “Bearer token works everywhere.” | Audience validation? | 179 |
| Q208 | How do you model per-tool scopes? | Tool declares required permission; execution resolves resource and checks actor token/policy. | Least privilege. | “One agent scope.” | Dynamic resource checks? | 180 |
| Q209 | Why is prompt injection not solved by prompt hardening? | Model remains susceptible; deterministic capability/data-flow controls are needed. | Security invariant. | “Strong system prompt fixes it.” | Defense layers? | 188–190 |
| Q210 | How do you prevent RAG poisoning? | Trusted ingestion/source governance, content classification, injection-aware context, capability isolation, monitoring/evals. | Supply chain. | “Remove phrase ignore instructions.” | Existing poisoned index? | 188 |
| Q211 | What is LLM-as-judge calibration? | Compare judge outputs with representative human labels/known cases and monitor drift. | Judge reliability. | “Judge is objective.” | Pairwise bias? | 184 |
| Q212 | Why evaluate by segment? | Aggregate score can hide regressions in language/query/risk classes. | Production diversity. | “One average is enough.” | Examples of segments? | 181–187 |
| Q213 | How do you handle stochastic eval variance? | Repeated trials where needed, stable seeds/settings when supported, thresholds/statistics and deterministic graders. | Avoid noisy decisions. | “One run.” | Which tasks need repeats? | 181–184 |
| Q214 | What makes telemetry unsafe? | Prompts/tool args/retrieved docs can contain PII/secrets/tokens. | Observability is data surface. | “Logs are internal.” | Redaction strategy? | 186 |
| Q215 | What is a useful AI SLO? | Component availability/latency plus task success/freshness where measurable. | AI quality and systems health. | “99.9% model accuracy.” | RAG freshness SLO? | 187, 191–196 |
| Q216 | Why asynchronous AI jobs? | Durability/backpressure/retry/progress for work exceeding request lifetime. | Operational scalability. | “Because agents are async by nature.” | Cancellation? | 192 |
| Q217 | How do you make queued jobs idempotent? | Stable job/action IDs, state transitions, dedupe/external idempotency. | At-least-once reality. | “Queue guarantees once.” | Worker crash after side effect? | 192, 197 |
| Q218 | How do you route models safely? | Deterministic task/risk policy + eval-qualified candidates; model router cannot weaken permissions. | Routing is product policy. | “Ask model which model.” | Cheap classifier risks? | 193 |
| Q219 | What is semantic cache risk? | Similar query may not have same intent, permissions, freshness, or answer. | Cache correctness/security. | “Embeddings make it safe.” | Key/threshold policy? | 194 |
| Q220 | How do you optimize cost without lowering quality? | Trace cost drivers; reduce context/loops, route, cache/batch; verify eval unchanged. | Measurement-driven. | “Use cheapest model everywhere.” | Cost per success? | 195 |
| Q221 | What dominates AI latency? | Varies: queue, retrieval/rerank, TTFT/generation, tools/loops; inspect spans. | No guesswork. | “Always model.” | TTFT vs total? | 196 |
| Q222 | Why can streaming worsen backend complexity? | Disconnect/cancel/partial state/tool events/reconnect need protocol/state handling. | UX trade-off. | “Streaming is just chunks.” | How persist result? | 060, 196 |
| Q223 | What is a circuit breaker? | Stop repeated calls to failing dependency, probe recovery, degrade/fallback. | Reliability pattern. | “Retry loop.” | Half-open state? | 197 |
| Q224 | Why jitter retries? | Prevent synchronized retry storms. | Distributed load control. | “Make retries faster.” | Combine with retry-after? | 197 |
| Q225 | What is a dead-letter queue for? | Isolate exhausted/poison jobs with context for remediation/replay. | Failure operations. | “Delete failed jobs.” | Alerting threshold? | 197 |
| Q226 | Unit tests vs evals? | Deterministic software correctness vs probabilistic task quality. | Both required. | “Evals replace tests.” | Graph route test? | 198 |
| Q227 | What is a model contract test? | Verify adapter’s expected structured/tools/errors/stream behavior against provider. | SDK/provider evolution. | “Prompt quality test.” | Run frequency? | 198 |
| Q228 | How do you system-design AI from requirements? | Identify task uncertainty, quality metric, data, actions/risk, scale/SLO/cost then add components. | Avoid architecture-first hype. | “Start with agents/vector DB.” | Simplest baseline? | 199 |
| Q229 | RAG vs tool for a customer balance? | Tool/database query for exact current structured value; RAG for supporting unstructured knowledge. | Technique fit. | “RAG everything.” | Combine both? | 099, 199 |
| Q230 | Fine-tuning vs RAG? | Fine-tuning behavior; RAG changing/external knowledge; may combine. | Problem separation. | “Fine-tune company docs monthly.” | When fine-tune? | 013, 081 |
| Q231 | What does staff AI platform engineering provide? | Shared model/RAG/tool/policy/eval/obs paved roads with safe defaults. | Organizational leverage. | “One agent for company.” | Avoid over-centralization? | 200 |
| Q232 | How do you prevent platform vendor lock-in? | Domain contracts/adapters, portable telemetry/evals, avoid lowest-common-denominator when harmful. | Evolution. | “Never use provider features.” | Where accept lock-in? | 040, 200 |
| Q233 | How do you manage AI dependency churn? | Version baselines, migration docs, contract tests, evals, canary/rollback. | Ecosystem changes quickly. | “Always latest.” | MCP draft handling? | baseline, 200 |
| Q234 | What is denial-of-wallet? | Abuse/runaway work generates excessive spend; use quotas/budgets/rate limits. | AI-specific economic risk. | “Provider bill issue only.” | Agent budget controls? | 170, 195 |
| Q235 | How do you design multi-tenant traces? | Tenant-scoped storage/access/redaction and no cross-tenant search/export. | Telemetry isolation. | “Central logs visible to all admins.” | Retention? | 186, 189 |
| Q236 | What is source freshness in RAG? | Time from authoritative update/delete to correct searchable state. | Knowledge correctness dimension. | “Vector DB uptime.” | Monitor how? | 079, 191 |
| Q237 | What is “lost in the middle”? | Models may underuse evidence positioned inside long contexts; ordering/retrieval still matters. | Context quality. | “Context max solves it.” | Mitigations? | 033, 107 |
| Q238 | What is model routing eval leakage risk? | Router and candidate evals tuned on same cases can overfit; preserve held-out/production segments. | Sound experimentation. | “More tuning always.” | Shadow test? | 193 |
| Q239 | How would you explain an AI incident to non-AI engineers? | Component timeline, deterministic/probabilistic boundary, impact/root cause/fix/prevention with evidence. | Operational communication. | “The model hallucinated.” | Example duplicate refund? | 197 |
| Q240 | What is the most important production agent principle? | Bound model discretion with typed state/tools, deterministic permissions, idempotency, evals, observability, safe termination. | Integrates handbook. | “Use strongest model.” | Which control first for money movement? | 156–200 |
