---
id: chapters-181-190
title: 181–190 — Evals, Observability & Security
---

# 181 — Evals as an Engineering Discipline

AI behavior is probabilistic, so quality gates need datasets and graders in addition to ordinary tests.

```text
code / prompt / model change
        ↓
     eval suite
 ├─ task success
 ├─ groundedness
 ├─ tool accuracy
 ├─ safety
 ├─ latency
 └─ cost
        ↓
ship / reject / investigate
```

Treat eval results like test/performance evidence, not a marketing score.

# 182 — Evaluation Datasets & Golden Sets

Build cases from real requests, expected decisions/evidence, known failures, edge cases, and adversarial inputs. Version the dataset and protect private production samples through redaction/access controls.

A “golden answer” can be exact for extraction/classification but should be a rubric or required facts for open-ended generation. Keep train/prompt-development examples separate from held-out evaluation where possible.

# 183 — Deterministic, Semantic & Human Graders

Use deterministic graders for schemas, exact facts, citations, tool names/arguments, latency, token/cost ceilings, and policy violations. Use semantic/LLM graders for dimensions such as relevance or writing quality, with explicit rubrics. Human review remains necessary for ambiguous high-stakes quality and for calibrating automated graders.

Never let one judge model become unquestioned ground truth.

# 184 — LLM-as-a-Judge

A judge model can score outputs against a rubric or compare candidates pairwise. It scales subjective evaluation but has bias, variance, prompt sensitivity, and possible preference for its own style.

Calibrate against human labels, randomize candidate ordering when pairwise bias matters, hide irrelevant provider identity, and track judge version. Use deterministic evidence checks alongside judge scores.

# 185 — Tool & Agent Trajectory Evals

Final-answer correctness can hide bad trajectories. Evaluate whether the agent selected the right tool, supplied valid arguments, respected permissions, avoided unnecessary calls, recovered from failures, and stopped within budget.

Store/replay normalized trajectory events so framework upgrades can be compared. A correct refund answer after attempting the refund twice is a failed agent run.

# 186 — Tracing & Observability

A trace should connect request → retrieval → model calls → tool calls → graph transitions → result.

Capture run/span IDs, prompt/model version, latency, token usage, retrieval IDs/scores, tool names/status, retries, state transitions, errors, and cost. Redact secrets/PII and sample payloads according to policy.

OpenTelemetry concepts can integrate AI spans into existing distributed tracing; LangSmith/provider tracing can add AI-specific detail without replacing core observability principles.

# 187 — Production Feedback Loops

Production signals include explicit ratings, task completion, corrections, escalation, abandonment, tool outcomes, latency, and costs. Feedback is noisy and can be gamed.

Map signals back to trace/eval cases, curate representative failures, and add regression examples after incidents. Do not automatically train on raw user feedback without consent, privacy, and quality review.

# 188 — Prompt Injection & Data Exfiltration

Direct and indirect prompt injection attempt to make the model treat untrusted data as instructions. The dangerous outcome is not rude text; it is capability misuse or confidential data disclosure.

Separate trusted instructions, sanitize rendered context, minimize tool/data access, enforce egress/permission policy, and require approval for risky actions. Assume a sufficiently adversarial document can influence the model.

# 189 — Authorization, Tenant Isolation & the Confused Deputy

An AI agent can become a confused deputy when it holds privileges and acts on a user/content instruction without verifying authority.

```text
actor identity
  ↓
resource + action + tenant
  ↓
deterministic policy decision
  ↓
allowed capability only
```

Never trust model-produced `tenantId`, `userId`, SQL filters, URLs, or scopes as authorization. Derive security context from authenticated server-side state.

# 190 — Sandboxing, SSRF, Code & Tool Security

Tools that fetch URLs, read files, run shell/code, query databases, or call internal networks need narrow sandboxes and allowlists. Protect against SSRF, path traversal, arbitrary command execution, secret access, oversized payloads, and resource exhaustion.

Use network egress policy, filesystem roots, process isolation, time/memory limits, read-only defaults, parameterized database access, and audit logs. “The model was told not to do it” is not a control.
