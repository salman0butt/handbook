---
id: interview-question-bank-overview
title: PostgreSQL Interview Question Bank — 400 Questions
---

# PostgreSQL Interview Question Bank — 400 Questions

This bank contains **exactly 400 questions** across five levels:

- [Beginner BQ001–BQ080](./beginner.md)
- [Intermediate IQ001–IQ080](./intermediate.md)
- [Advanced AQ001–AQ080](./advanced.md)
- [Senior SQ001–SQ080](./senior.md)
- [Staff / Database Architecture STQ001–STQ080](./staff-database-architecture.md)

Each row contains the six required parts: **question, expected answer, reasoning, common wrong answer, follow-up, related chapter**.

## How to practice

1. Hide every column except **Question** and answer aloud.
2. Compare with **Expected answer**.
3. Use **Reasoning** to explain the mechanism, not just the definition.
4. Say why the **Common wrong answer** is incomplete.
5. Answer the **Follow-up** without notes.
6. Revisit the **Related chapter** and reproduce one example in `psql`.

## Scoring

For each question, score 0–4:

- **0** — incorrect/no useful answer;
- **1** — definition only, major misconceptions;
- **2** — mostly correct fundamentals but weak mechanism/trade-off;
- **3** — correct mechanism + practical example;
- **4** — production nuance, trade-offs, failure/concurrency/performance implications.

A senior/staff candidate should not merely know syntax. Strong answers connect SQL semantics to constraints, concurrency, planner behavior, MVCC, WAL, operations, security, recovery, and organizational trade-offs.