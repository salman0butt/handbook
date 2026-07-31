---
id: exercises-advanced-121-180
title: Exercises 121–180 — Advanced
---

# 60 Advanced Exercises

| # | Problem | Expected outcome | Hint | Related chapters |
|---:|---|---|---|---|
| 121 | Classify five AI flows as model call, workflow, graph, agent, or multi-agent. | Precise control-pattern reasoning. | Who chooses the next step? | 156–157 |
| 122 | Implement a bounded ReAct loop around two safe read tools. | Max steps, tool validation, terminal answer. | Model proposes; executor owns calls. | 158 |
| 123 | Add repeated-tool-call detection to the loop. | Loop exits/escalates on no progress. | Hash normalized call name+args. | 158, 170 |
| 124 | Build a planner/executor workflow for travel research without booking. | Typed plan, observations, bounded revision. | Keep actions read-only. | 159 |
| 125 | Turn a fixed planner flow into deterministic code and compare. | Evidence about when planning was unnecessary. | Measure quality/cost/latency. | 157, 159 |
| 126 | Build a router for support, sales, and technical requests. | Correct route plus fallback/uncertain state. | Hard authorization before routing. | 160 |
| 127 | Build a supervisor that delegates to two specialist workers. | Bounded delegation and typed outputs. | Supervisor owns budget. | 160, 162 |
| 128 | Add critique/revision with max two iterations. | Rubric-driven improvement without loop. | Stop on acceptance threshold. | 161 |
| 129 | Compare critique by same model vs separate judge model. | Bias/quality/cost discussion backed by eval. | Use identical cases. | 161, 184 |
| 130 | Fan out three research workers and synthesize results. | Parallel work with deduped evidence. | Separate worker state. | 162 |
| 131 | Add dynamic retrieval decisions to a RAG agent. | Agent retrieves only when needed and remains bounded. | Static RAG is baseline. | 163 |
| 132 | Evaluate agentic RAG vs fixed RAG. | Task success plus tool steps/cost/latency. | Final answer alone is insufficient. | 163, 185 |
| 133 | Propose a problem where multi-agent is worse than single-agent. | Cost/coordination rationale. | Avoid hype. | 164 |
| 134 | Compare one general agent to three specialists on a dataset. | Empirical specialization decision. | Same budget if possible. | 164 |
| 135 | Design shared vs isolated state for a multi-agent code review. | Minimal artifact sharing and provenance. | Avoid giant shared scratchpad. | 165 |
| 136 | Prevent cyclic supervisor delegation. | Max depth/delegations and visited-task detection. | Convergence must be explicit. | 166 |
| 137 | Define conflict resolution for two agents citing different policies. | Authoritative-source or escalation strategy. | Do not vote blindly. | 166 |
| 138 | Inventory “memory” in an existing chatbot. | Context/history/checkpoint/profile/db clearly separated. | Name mechanisms. | 167 |
| 139 | Design long-term preference memory with user controls. | Consent, source, expiry, edit/delete. | Persistence creates privacy obligations. | 168 |
| 140 | Implement memory retrieval scoped by user+tenant. | No cross-user personalization leakage. | Server-derived identity. | 168, 189 |
| 141 | Model an approval request table for HITL. | Action hash, actor, decision, expiry, timestamps. | Bind to exact action. | 169 |
| 142 | Recheck authorization after an approval wait. | Revoked permission blocks execution. | Time passes while interrupted. | 169–170 |
| 143 | Define agent budgets for steps, tokens, elapsed time, and cost. | Independent hard limits. | Budget is application state/policy. | 170 |
| 144 | Build a kill switch for all write tools. | Central deterministic disable path. | Incident control must bypass model. | 170, 190 |
| 145 | Explain MCP to someone who thinks it is an agent framework. | Protocol/connectivity vs orchestration distinction. | Host/client/server/primitives. | 171 |
| 146 | Draw host→client→server trust boundaries for three MCP servers. | One client/server relationship and local policy. | Connecting server is trust decision. | 172 |
| 147 | Decide whether capability should be MCP tool, resource, or prompt. | Semantic primitive choice. | Action vs data vs reusable prompt. | 173 |
| 148 | Configure stdio vs Streamable HTTP for local and remote integrations. | Correct transport rationale. | Remote needs HTTP security. | 174 |
| 149 | Explain why legacy HTTP+SSE should not be new default. | Streamable HTTP is modern stable transport. | Backward compatibility only. | 174 |
| 150 | Implement a stable-v1 MCP `get-order` server tool. | Zod validation and safe content result. | Use current stable baseline docs. | 176 |
| 151 | Build an MCP client that lists tools before exposing them. | Discovery intersected with local allowlist. | Discovery ≠ permission. | 177 |
| 152 | Simulate a malicious tool description requesting secrets. | Local policy prevents privilege expansion. | Treat metadata as untrusted. | 178 |
| 153 | Simulate prompt injection from an MCP resource. | Resource text cannot authorize tool use. | Context and capability are separate. | 178 |
| 154 | Design OAuth scopes for Gmail read vs send tools. | Least-privilege read/write separation. | One token need not have all scopes. | 179–180 |
| 155 | Explain PKCE and why public clients need it. | Code interception protection reasoning. | Challenge/verifier pair. | 179 |
| 156 | Define refresh-token storage controls. | Encryption, rotation/revocation, no logs/model context. | Long-lived credential is high value. | 179 |
| 157 | Prevent OAuth token passthrough to another service. | Audience/resource-specific token usage. | Token is not a universal credential. | 179 |
| 158 | Add per-tool permission metadata to a registry. | Permission, risk, scope, idempotency declared. | Executor consumes metadata. | 180 |
| 159 | Create a golden eval dataset from 20 production failures. | Redacted versioned cases with expected properties. | Failures are regression assets. | 181–182 |
| 160 | Choose deterministic vs LLM graders for ten criteria. | Objective checks stay deterministic. | Use judge only where subjective. | 183–184 |
| 161 | Build a pairwise LLM judge with randomized candidate order. | Bias-reduced rubric comparison. | Calibrate to human labels. | 184 |
| 162 | Add tool trajectory grading. | Right tool/args/order/budget assessed. | Final answer can hide bad actions. | 185 |
| 163 | Add agent no-progress metric. | Repeated calls/steps identified. | Trajectory is data. | 185 |
| 164 | Define a trace span model for RAG + tool agent. | Parent request with retrieval/model/tool/graph spans. | One trace ID. | 186 |
| 165 | Redact PII and secrets from trace payloads. | Useful metadata retained without raw sensitive values. | Log IDs/categories, not everything. | 186 |
| 166 | Convert thumbs-up/down into curated eval cases. | Feedback traced, reviewed, versioned. | Raw feedback is noisy. | 187 |
| 167 | Threat-model indirect prompt injection via retrieved web page. | Data-flow + capability controls identified. | Assume model is influenced. | 188 |
| 168 | Demonstrate confused deputy risk with an overprivileged email tool. | Actor/action/resource policy fix. | Model intent is not authority. | 189 |
| 169 | Write a cross-tenant retrieval penetration test. | Attacker query never sees other tenant chunks. | Test filters and caches. | 189 |
| 170 | Design SSRF defenses for a URL-fetch tool. | Scheme/host/IP/redirect/egress controls. | URL validation alone is not enough. | 190 |
| 171 | Design filesystem sandbox rules for a coding agent. | Workspace root, deny secrets, quotas, isolated process. | Least privilege. | 190 |
| 172 | Add shell-command allow/deny policy without relying on prompt. | Deterministic sandbox/executor restriction. | Parsing commands is hard; isolation matters. | 190 |
| 173 | Build an incident drill: tool called twice. | Stop writes, inspect trace/idempotency, remediate. | Preserve evidence. | 058, 185, 197 |
| 174 | Build an incident drill: poisoned RAG document. | Quarantine source, trace affected answers, reindex. | Injection is data supply-chain issue. | 188 |
| 175 | Build an incident drill: MCP server suddenly adds a write tool. | Discovery diff blocked pending policy/review. | New capability is not auto-approved. | 177–180 |
| 176 | Build an incident drill: eval quality drops after model update. | Freeze rollout, compare versions/cases, rollback. | Version everything. | 181–187 |
| 177 | Build an incident drill: cross-tenant cache leak. | Disable cache, scope keys, assess exposure, tests. | Tenant identity in cache key. | 189, 194 |
| 178 | Add model/tool/rag risk register to a design. | Explicit threats, mitigations, monitoring, owner. | Architecture includes operations. | 188–190 |
| 179 | Design secure capability onboarding for third-party MCP servers. | Trust review, allowlists, scopes, sandbox, audit. | Installation is supply-chain boundary. | 171–180, 190 |
| 180 | Build an agent demo that survives adversarial prompts and tool failures. | Bounded, authorized, observable, evaluated execution. | Reliability comes from system boundaries. | 156–190 |
