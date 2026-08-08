---
id: evals-observability-coverage
title: Evals & Observability Coverage
---

# Evals & Observability Coverage

| Topic | Coverage |
|---|---|
| guardrails vs evals distinction | 181–190 |
| Jest/Vitest deterministic tests vs AI eval suites | 181–190, 198 |
| datasets / golden sets | 181–182 |
| regression tests | 181–183, 198 |
| deterministic graders | 183 |
| semantic / LLM graders | 183–184 |
| human evaluation | 183–184 |
| pairwise / rubric scoring | 184 |
| multiple metrics from one judge call | 181–190 |
| score interpretation / aggregate metrics | 181–190 |
| offline eval suites / release gates | 181–190, 198 |
| sampled online production evals | 181–190 |
| retrieval evals | 109–110 |
| groundedness / faithfulness / correctness | 110, 181–184 |
| relevance | 181–184 |
| tool-call evals | 185 |
| agent trajectory evals | 185 |
| guardrail/adversarial/jailbreak containment evals | prompt-injection defense, 181–190 |
| computer-use trajectory/external-state evals | 156–170 |
| latency / token / cost metrics | 186, 195–196 |
| SLI / SLO / error budgets | `zero-to-hero/inference/capacity-observability` |
| production feedback loops | 187 |
| traces / spans | 186 |
| model/tool/retrieval/state-transition telemetry | 186 |
| OpenTelemetry GenAI semantic conventions | `zero-to-hero/inference/capacity-observability`, 186 |
| prompt/model/schema/runtime versioning | 037, 049, 186, inference track |
| LangSmith as one tool option | 128, 186, 181–190 |
| custom/vendor-neutral observability | 128, 186, 191–200 |
| eval/observability platform design | senior/staff interview bank, capstone |

A production release should be explainable as a comparison of a versioned candidate against a versioned baseline, with task-quality, safety, latency and cost evidence—not “the chatbot seemed better in testing.”

## Runtime vs measurement

```text
guardrail = prevents/constrains behavior during execution

eval      = measures whether the model/agent/system behaved correctly
```

Full eval datasets belong in CI/release/nightly workflows, while production online evals should normally operate on selected traces outside the synchronous user-response path.
