---
id: mock-interview-rounds-01-05
title: "Mock Interview Rounds 1–5"
---

# Rounds 1–5

Each round is scored out of 100 using the [global rubric](./overview.md). Suggested interview format: 35 minutes questions, 10 minutes follow-ups, 5 minutes self-review.

## Round 1 — SQL Beginner

**Questions**

1. Explain database vs DBMS vs PostgreSQL vs SQL.
2. Write a query returning the 10 newest paid orders with deterministic ordering.
3. Explain `NULL`, `IS NULL`, and why `= NULL` fails.
4. Compare primary key, unique constraint, and foreign key.
5. Given customers and orders, return customers with no orders.

**Strong-answer checkpoints:** declarative SQL, three-valued logic, `ORDER BY created_at DESC,id DESC`, `NOT EXISTS`, keys as invariants rather than “indexes.”

**Scoring emphasis:** correctness 40, terminology/mental model 25, SQL readability 20, explanation 15.

**Fail conditions:** claims row order is automatic; uses `= NULL`; says FK is “just a join”; cannot distinguish database from DBMS.

**Follow-up:** Why should duplicate-email prevention use a unique constraint even if the API validates first?

---

## Round 2 — SQL Intermediate

**Questions**

1. `WHERE` vs `HAVING`; show one query using both.
2. INNER vs LEFT JOIN; explain ON-vs-WHERE outer-join trap.
3. Return top two orders per customer using a window function.
4. Compare `EXISTS`, `IN`, and `NOT EXISTS`; explain the `NOT IN` NULL trap.
5. Write keyset pagination for `(created_at,id)` and propose an index.

**Strong-answer checkpoints:** output grain/cardinality, `row_number`, null-safe anti-join reasoning, compound cursor, index aligned with equality + ordering.

**Scoring emphasis:** SQL correctness 35, result-grain reasoning 25, alternatives 20, performance awareness 20.

**Follow-up:** When might LATERAL beat the window solution for top-N-per-parent?

---

## Round 3 — SQL Advanced

**Questions**

1. Solve sessionization with a 30-minute inactivity gap.
2. Write monthly cohort retention and state denominator semantics.
3. Explain recursive CTE anchor/recursive term/cycle handling.
4. Compare CTE inlining, `MATERIALIZED`, and `NOT MATERIALIZED`.
5. Design an atomic inventory decrement and explain its concurrency behavior.

**Strong-answer checkpoints:** `lag` + cumulative session flag, distinct activity periods, recursion termination, plan-driven CTE choice, conditional UPDATE + affected-row result.

**Scoring emphasis:** correctness 30, advanced SQL mechanics 25, edge cases 20, concurrency/performance 25.

**Follow-up:** How would late-arriving events change a retention report?

---

## Round 4 — Joins + Aggregates

**Questions**

1. Why can joining orders→items→products make revenue totals wrong?
2. Return customer lifetime value including customers with zero orders.
3. Explain semi-join and anti-join use cases.
4. Compare `GROUP BY`, window aggregates, `ROLLUP`, and `GROUPING SETS`.
5. Given a 100× cardinality estimate error in a join plan, what do you inspect?

**Strong-answer checkpoints:** define result grain before aggregation, avoid DISTINCT-as-bandage, outer join + aggregate semantics, MCV/dependencies/statistics, join multiplicity.

**Scoring emphasis:** data correctness 35, relational reasoning 25, planner awareness 25, communication 15.

**Follow-up:** Why can a foreign key help data correctness without automatically making the join fast?

---

## Round 5 — Window Functions

**Questions**

1. `row_number` vs `rank` vs `dense_rank` with a salary tie example.
2. Explain PARTITION BY, window ORDER BY, and frame as separate concepts.
3. Why is `last_value` commonly wrong without an explicit frame?
4. Write a running balance with deterministic ties.
5. Compare ROWS, RANGE, and GROUPS; give a workload for each.

**Strong-answer checkpoints:** peer semantics, explicit `ROWS UNBOUNDED PRECEDING`, full-partition last-value frame, tie-breakers, distinction between row-count and value/peer-group frames.

**Scoring emphasis:** window semantics 45, query correctness 25, edge cases 20, communication 10.

**Follow-up:** Write top-three distinct salaries per department including ties.