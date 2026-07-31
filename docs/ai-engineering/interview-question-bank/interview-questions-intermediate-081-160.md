---
id: interview-questions-intermediate-081-160
title: Interview Questions 081–160 — Intermediate
---

# 80 Intermediate Interview Questions

| # | Question | Expected answer | Reasoning | Common wrong answer | Follow-up | Chapter |
|---:|---|---|---|---|---|---|
| Q081 | What is LangGraph? | Low-level runtime for long-running stateful workflows/agents with explicit graph control. | Distinguishes orchestration from model abstraction. | “Another LLM.” | Why use it over a chain? | 131–132 |
| Q082 | Why model an AI workflow as a graph? | Branches, loops, parallelism, checkpoints, HITL become explicit. | Control flow matters. | “Graphs make prompts better.” | When is a graph unnecessary? | 132 |
| Q083 | What belongs in graph state? | Durable data needed for control/continuation, not arbitrary clients/secrets. | Persistence boundary. | “Everything in memory.” | How version state? | 133, 148 |
| Q084 | What is `StateSchema`? | Modern schema-based way to define typed LangGraph state. | Current JS API knowledge. | “Legacy Annotation only.” | Why Zod/Standard Schema? | 134 |
| Q085 | What is a reducer in LangGraph state? | Rule for combining multiple updates to a field. | Parallel/accumulating correctness. | “A node that summarizes state.” | Example? | 135 |
| Q086 | What is a graph node? | Logical step reading state/services and returning updates/control. | Testable orchestration unit. | “One prompt only.” | Good node boundary? | 136 |
| Q087 | Static vs conditional edge? | Fixed transition vs route selected from state. | Graph control semantics. | “Sync vs async.” | Where should auth branching live? | 137–139 |
| Q088 | What are START and END? | Explicit graph entry/terminal sentinels. | Termination design. | “First/last message.” | Why test every END path? | 138 |
| Q089 | What is `Command`? | Primitive to update state/control routing or resume interrupts. | Current graph API. | “Shell command tool.” | How is `resume` used? | 140, 150 |
| Q090 | What does graph compilation do? | Builds/validates executable graph and attaches runtime/checkpointer config. | Construction vs execution. | “Compiles TypeScript.” | Why separate build from invoke? | 141 |
| Q091 | What is a thread ID? | Persistent pointer identifying graph workflow/conversation state. | Resume semantics. | “User authorization token.” | Security implication? | 147 |
| Q092 | What is a checkpoint? | Persisted graph state at execution boundaries for resume/fault tolerance. | Durable workflows. | “Model cache.” | In-memory vs durable? | 146 |
| Q093 | What is an interrupt? | Dynamic pause that persists state and waits for external input. | HITL primitive. | “Throwing app error.” | What payload can it expose? | 149 |
| Q094 | How do you resume an interrupt? | Same thread plus `Command({resume:value})`. | Correct continuation. | “Call node directly.” | What validates resume value? | 150 |
| Q095 | Why are side effects before `interrupt()` dangerous? | Resumed node restarts from beginning and may repeat them. | Replay/idempotency insight. | “Execution resumes at next line.” | Safe pattern? | 151 |
| Q096 | What is durable execution? | Persisted progress plus replay-safe steps across failures/restarts. | Operational definition. | “Long timeout.” | What makes a write replay-safe? | 152 |
| Q097 | What are subgraphs useful for? | Encapsulated reusable workflows with typed boundaries. | Complexity/ownership. | “Nested prompts only.” | What state should cross boundary? | 154 |
| Q098 | How do you stop infinite agent loops? | Step/time/token/cost budgets, repeated-action detection, terminal routes. | Reliability. | “Tell model to stop.” | Where store budgets? | 144, 170 |
| Q099 | What is parallel branching risk? | Merge semantics, partial failures, cancellation, conflicting side effects. | Concurrency correctness. | “Only faster.” | Which operations parallelize well? | 145 |
| Q100 | What makes a graph production-ready? | Durable checkpoints, auth, idempotency, errors, cancellation, migration, observability, tests. | Framework alone is insufficient. | “It compiles.” | What about old checkpoints? | 146–155 |
| Q101 | Define an agent. | Model-directed loop using state/tools/observations with bounded control. | Avoids hype. | “Any chatbot.” | Workflow vs agent? | 156–157 |
| Q102 | Workflow vs agent? | App defines flow vs model chooses more next actions/routes. | Complexity trade-off. | “Same thing.” | Which is easier to test? | 157 |
| Q103 | What is ReAct? | Interleave action selection/tool observations with continued model decisions. | Agent pattern. | “Reflection only.” | Production safeguards? | 158 |
| Q104 | Planner/executor pattern? | Planner decomposes; executor performs/observes; plan may revise. | Useful for variable tasks. | “Always two models.” | When overkill? | 159 |
| Q105 | Router vs supervisor? | Router picks path/capability; supervisor delegates/coordinates workers. | Agent architecture vocabulary. | “Same role.” | What controls supervisor recursion? | 160, 166 |
| Q106 | What is reflection/critique? | Evaluate a draft/trajectory against rubric then revise. | Quality loop. | “Expose chain-of-thought.” | Main trade-off? | 161 |
| Q107 | What is orchestrator/workers? | Central decomposer dispatches specialized subtasks, often parallel, then synthesizes. | Multi-task pattern. | “All workers share everything.” | Why typed worker output? | 162 |
| Q108 | What is agentic RAG? | Agent dynamically decides retrieval/tool retrieval strategy. | Advanced control. | “Any RAG chatbot.” | When fixed RAG is better? | 163 |
| Q109 | When do multiple agents help? | Real specialization/decomposition improves eval results enough to justify cost. | Evidence-based adoption. | “More agents = smarter.” | What metrics compare? | 164 |
| Q110 | Why can multi-agent be worse? | Coordination, latency, cost, conflict, loops, evaluation complexity. | Anti-hype reasoning. | “No downside.” | Simpler alternative? | 164 |
| Q111 | Shared vs isolated agent state? | Share minimal typed artifacts; isolate unnecessary context/secrets. | Privacy/coupling. | “One global transcript.” | How track provenance? | 165 |
| Q112 | What is convergence in multi-agent systems? | Explicit condition/budget for finishing/resolving disagreement. | Prevents loops. | “Agents eventually agree.” | Example stop rule? | 166 |
| Q113 | What does “memory” mean in AI apps? | Could mean context, history, checkpoint, profile, semantic/episodic DB. | Requires specificity. | “Vector DB.” | Which is short-term? | 167 |
| Q114 | What are risks of long-term memory? | Privacy, stale facts, conflicts, retention/deletion, user control. | Persistence obligations. | “Only storage cost.” | How expire memory? | 168 |
| Q115 | What is HITL? | Persisted pause/review/approve-modify-reject/resume workflow. | Approval as protocol. | “Human watches logs.” | Why re-auth after wait? | 169 |
| Q116 | Why bind approval to exact arguments? | Prevent action mutation after user reviewed different payload. | Integrity of consent. | “Approval is generic.” | What metadata bind? | 169 |
| Q117 | What belongs in an agent reliability budget? | Steps, tokens, time, cost, tool calls, retries. | Bounded autonomy. | “Temperature only.” | How enforce? | 170 |
| Q118 | Why need an agent kill switch? | Immediate deterministic capability shutdown during incident. | Operational containment. | “Prompt update is enough.” | Scope by tool/model? | 170 |
| Q119 | What is MCP? | Protocol standardizing AI app connections to tools/resources/prompts. | Correct protocol definition. | “Agent framework.” | What does it not solve? | 171 |
| Q120 | What are MCP host/client/server roles? | Host owns clients; client connects to one server; server exposes capabilities. | Architecture. | “Server is LLM.” | Where is trust boundary? | 172 |
| Q121 | MCP tool vs resource vs prompt? | Action vs readable context vs reusable prompt template. | Primitive semantics. | “All are functions.” | Give example of each. | 173 |
| Q122 | Stable MCP transports? | stdio local/process; Streamable HTTP remote; legacy SSE deprecated. | Current stable guidance. | “WebSocket required.” | Security for HTTP? | 174 |
| Q123 | What is capability discovery? | Client learns supported tools/resources/prompts/capabilities. | Interoperability. | “Auto-authorize everything.” | What should host do next? | 175, 177 |
| Q124 | Why label 2026-07-28 MCP behavior version-sensitive? | It is draft/migration behavior at this baseline, not stable default. | Docs-first discipline. | “Newest date means stable.” | Stable spec version? | baseline, 175 |
| Q125 | What does `McpServer.registerTool` do? | Registers typed tool definition/handler for clients. | TypeScript server basics. | “Calls model.” | Who authorizes handler? | 176 |
| Q126 | Why log to stderr for stdio MCP? | stdout carries protocol messages and must stay clean. | Transport correctness. | “stdout is normal logs.” | How test server? | 176 |
| Q127 | What should MCP client do with discovered tools? | Intersect with local permissions/allowlist/risk policy. | Discovery ≠ authority. | “Expose all.” | What if new tool appears? | 177 |
| Q128 | What is tool poisoning? | Malicious metadata/description influences model toward unsafe behavior. | Supply-chain/context threat. | “Corrupted JSON only.” | Main mitigation? | 178 |
| Q129 | Why are MCP resources injection vectors? | Untrusted content enters model context and can issue malicious instructions. | Indirect injection. | “Resources are trusted by protocol.” | How contain capability? | 178 |
| Q130 | Why use OAuth for remote tools? | Delegated scoped authorization without sharing user credentials. | Access-control model. | “Encrypt prompt.” | Which flow for user consent? | 179 |
| Q131 | What is authorization code + PKCE? | User consent flow with verifier/challenge protecting code exchange. | OAuth fundamentals. | “Refresh token flow.” | Why PKCE? | 179 |
| Q132 | Access token vs refresh token? | Short-lived API credential vs longer-lived token for new access tokens. | Token lifecycle. | “Same token.” | Storage difference? | 179 |
| Q133 | What are OAuth scopes? | Requested/granted capability boundaries. | Least privilege. | “User roles only.” | Read vs send example? | 179–180 |
| Q134 | What is token audience/resource validation? | Ensure token is intended for the resource receiving it. | Prevent token misuse. | “Any valid JWT works.” | What is token passthrough risk? | 179 |
| Q135 | Why separate read/write tool scopes? | Different risk and consent; least privilege. | Permission design. | “One broad scope simpler.” | Approval for which? | 180 |
| Q136 | What is per-tool authorization? | Check actor+resource+action before each execution. | Dynamic capability control. | “Authorize agent once forever.” | Why re-check? | 180 |
| Q137 | What is an eval dataset? | Versioned representative inputs with expected properties/judgments. | Quality engineering. | “Random prompts.” | Where source cases? | 181–182 |
| Q138 | Golden answer vs rubric? | Exact expected value for deterministic task; criteria for open-ended output. | Evaluator design. | “Always exact string.” | Example? | 182 |
| Q139 | Deterministic grader vs LLM judge? | Code for objective properties; model for subjective rubric dimensions. | Reliability. | “Judge everything with LLM.” | Why combine? | 183 |
| Q140 | Risks of LLM-as-judge? | Bias, variance, prompt/model drift, self-style preference. | Judge is probabilistic. | “It is objective.” | How calibrate? | 184 |
| Q141 | What is pairwise evaluation? | Judge/human compares candidate A vs B under rubric. | Useful for relative quality. | “Two independent scores only.” | Position bias mitigation? | 184 |
| Q142 | What is a trajectory eval? | Score agent path/tool selections/args/efficiency/safety, not only final answer. | Agents are processes. | “Answer score only.” | Example failure? | 185 |
| Q143 | What should an AI trace capture? | Model/retrieval/tool/graph spans, versions, latency, usage, errors. | Reconstruct behavior. | “Raw prompt only.” | What redact? | 186 |
| Q144 | Why record prompt/model version in traces? | Reproduce and segment regressions/rollouts. | Behavior changes by version. | “Version irrelevant after deployment.” | What about retriever version? | 186 |
| Q145 | What is a production feedback loop? | Connect outcomes/ratings/corrections to traces and curated eval cases. | Operational learning. | “Train on every rating.” | Why curate? | 187 |
| Q146 | Direct vs indirect prompt injection? | User prompt vs malicious instructions arriving through external content. | Threat paths. | “Only direct chat matters.” | Example indirect source? | 188 |
| Q147 | What is data exfiltration risk in agents? | Model/tool chain can send confidential data to unauthorized destination. | Capability security. | “Only hallucination.” | Which controls? | 188–190 |
| Q148 | What is confused deputy problem? | Privileged app acts on untrusted request without verifying requester/resource authority. | Agent-specific security. | “Model confusion.” | Example with email? | 189 |
| Q149 | How enforce tenant isolation in RAG? | Trusted server tenant/ACL filters at retrieval/storage/cache plus tests. | Model cannot enforce. | “Prompt says only tenant data.” | What about traces? | 189 |
| Q150 | What is SSRF risk for AI tools? | URL tool reaches internal/metadata/private network resources. | Tool security. | “Bad webpage content only.” | Controls? | 190 |
| Q151 | Why sandbox code execution? | Limit filesystem/network/process/resource damage from generated/untrusted code. | Capability containment. | “Generated code is trusted.” | What limits? | 190 |
| Q152 | Why rate-limit agents? | Prevent abuse, runaway loops, denial-of-wallet/capacity exhaustion. | Reliability/security/cost. | “Only provider rate limit matters.” | Per user or workspace? | 190, 195 |
| Q153 | What is a production AI orchestrator? | Layer coordinating model, prompt, graph, tools, RAG, policy, eval hooks. | Architecture separation. | “One giant prompt.” | Which parts async? | 191–192 |
| Q154 | Why use queues for long AI work? | Durability, retry/backpressure, decouple HTTP lifetime from execution. | Distributed-system design. | “Models require queues.” | How expose progress? | 192 |
| Q155 | What is model routing? | Select model/provider based on task, quality, latency, cost, capability/health. | Optimize task utility. | “Random load balancing.” | How evaluate routes? | 193 |
| Q156 | What makes a fallback safe? | Capability/quality/schema/tool semantics compatible and evaluated. | Resilience with correctness. | “Any available model.” | If no compatible fallback? | 193 |
| Q157 | What can AI systems cache? | Responses, prompt prefixes, embeddings, retrieval, reranking, safe tool results. | Performance/cost. | “Everything globally.” | Main security concern? | 194 |
| Q158 | What should cache keys include? | All semantic/security/version inputs including tenant scope. | Correctness/isolation. | “Prompt text only.” | How invalidate RAG cache? | 194 |
| Q159 | What is cost per successful task? | Total relevant platform spend divided by successful task completions. | Product metric. | “Cost per model call.” | Why better? | 195 |
| Q160 | What is time-to-first-token? | Delay until first generated token/event; one component of latency UX. | Performance vocabulary. | “Total latency.” | How reduce it? | 196 |
