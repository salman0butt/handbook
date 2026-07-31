---
id: langgraph-coverage
title: LangGraph TypeScript Coverage
---

# LangGraph TypeScript Coverage

**Baseline:** modern LangGraph JS with `StateSchema` as preferred state API; legacy Annotation patterns are migration knowledge.

| Topic | Coverage |
|---|---|
| purpose / why graphs | 131–132 |
| state / StateSchema / reducers | 133–135 |
| nodes / edges / conditional edges / START / END | 136–139 |
| Command / compilation / invoke | 140–142 |
| streaming | 143 |
| loops / termination / parallel branches | 144–145 |
| checkpoints / thread IDs / persistence | 146–148 |
| interrupts / resume | 149–150 |
| replay / idempotency | 151–152 |
| retries / error routing | 153 |
| subgraphs | 154 |
| long-running workflows / cancellation/versioning | 155 |
| guided support graph | Project 10 |
| production HITL agent | Project 11 |
| capstone agent runtime | capstone |
| exercises/interviews/live coding | exercises 101–120; Q081–Q100, Q187–Q194, Q257–Q260; live coding 11–12 |

The handbook treats LangGraph as orchestration infrastructure. Authentication, tenancy, authorization, queues, data durability, tool side-effect semantics, and incident response remain application/platform responsibilities.
