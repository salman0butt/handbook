---
title: Mock Interview Practice — Overview
---

# Mock Interview Practice

These **15 rounds** simulate real Node/backend interviews. Answer aloud, draw runtime diagrams, and force follow-ups until trade-offs become explicit.

## Scoring rubric

Score each dimension 0–4:

| Dimension | 0 | 2 | 4 |
|---|---|---|---|
| correctness | wrong | mostly correct | precise + caveats |
| runtime reasoning | slogans | names components | traces execution/resources |
| production reasoning | none | one concern | load/failure/ops/security |
| trade-offs | dogmatic | some alternatives | explicit decision criteria |
| communication | unclear | understandable | structured and concise |

**Strong-answer signals:** distinguishes guarantees from observations, asks for constraints, bounds resources, propagates cancellation, discusses failure/metrics/security, and changes recommendations when evidence changes.

**Warning signs:** “Node is single-threaded so no races,” “async creates a thread,” unlimited `Promise.all`, retries everything, JWT everywhere, `process.exit()` shutdown, microservices by default, or optimization without measurement.

## Practice rule

After every round, revisit any answer below 3/4 in the question bank and linked handbook chapter. Repeat the round later with different scenarios, not memorized wording.
