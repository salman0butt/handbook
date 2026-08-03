---
id: reference-functions-and-operators
title: "PostgreSQL 18 Functions & Operators Coverage Audit"
---

# PostgreSQL 18 Functions & Operators Coverage Audit

Authority: PostgreSQL 18 **Functions and Operators** documentation. Exact function overloads evolve; the handbook teaches each functional category, semantics, index implications, and production caveats while the official reference remains the exhaustive signature list.

| Official category / family | Representative constructs | Handbook coverage | Depth |
| --- | --- | --- | --- |
| Logical operators | `AND`, `OR`, `NOT` | 25–26, 19 | Core + NULL logic |
| Comparison | `=`, `<>`, `<`, `>`, `BETWEEN`, `IS DISTINCT FROM`, row comparisons | 19, 25–26 | Deep |
| Mathematical functions/operators | arithmetic, powers, rounding, random/statistical helpers | 10, 25, 28 | Core |
| String functions/operators | concatenation, length, substring, trim, case conversion, replace, split | 11, 25 | Core |
| Binary-string functions/operators | `bytea` functions/operators | 18, 25 | Reference |
| Bit-string functions/operators | bit operations, shifts, length | 18, 25 | Reference |
| Pattern matching | `LIKE`, `ILIKE`, SQL regex/SIMILAR-style and POSIX regex features | 25–26, 103 | Core |
| Data type formatting | `to_char`, `to_date`, `to_number`, formatting templates | 13, 25 | Core/Reference |
| Date/time functions/operators | current time, extraction, truncation, arithmetic, timezone conversion | 13 | Deep |
| Enum support | comparison/order/range helpers for enum values | 12 | Core/Reference |
| Geometric functions/operators | containment/intersection/distance for geometric types | 18, 54 | Reference |
| Network address functions/operators | containment, masks, host/network operations | 18 | Core/Reference |
| Text search functions/operators | `@@`, vector/query construction, ranking, headline, configs | 103 | Deep |
| UUID functions | UUID inspection/generation including PG18 `uuidv7()` | 14, 167 | Core |
| XML functions | XML construction/query/processing | 18 | Reference |
| JSON/JSONB operators/functions | extraction, containment, existence, construction, mutation, SQL/JSON path/functions | 16, 25, 53 | Deep |
| Sequence functions | `nextval`, `currval`, `setval`, sequence state | 41 | Deep |
| Conditional expressions | `CASE`, `COALESCE`, `NULLIF`, `GREATEST`, `LEAST` | 36 | Deep |
| Array functions/operators | containment/overlap, concatenation, dimensions, `unnest`, `ANY`/`ALL` interplay | 15, 25 | Deep |
| Range/multirange functions/operators | overlap, contains, adjacency, union/intersection/difference, bounds | 17, 25, 54 | Deep |
| Aggregate functions | count/sum/avg/min/max, arrays, strings, JSON, ordered/filter/distinct aggregates | 28–29 | Deep |
| Ordered-set / hypothetical-set aggregates | percentiles, ranking-like aggregates | 28, interview exercises | Advanced |
| Window functions | ranking, distribution, navigation, first/last/nth, aggregate windows | 37 | Deep |
| Set-returning functions | table-returning functions, `generate_series`, `unnest`, ordinality | 38, 98 | Core/Advanced |
| Row/array constructors and comparisons | `ROW(...)`, row comparison, arrays | 15, 38 | Core |
| Subquery expressions | `EXISTS`, `IN`, `ANY`, `ALL`, scalar/row subqueries | 31, 26 | Deep |
| System information | version/session/current database/schema/user/role/object identity functions | 05–07, 92–94, 106–108 | Core/Reference |
| System administration | config, cancellation/termination, backup/recovery, WAL, replication/admin helpers | 82–90, 108–138 | Advanced production |
| Statistics information | activity/statistics functions and views, sizes, blocking helpers, WAL LSN difference | 105–110, 133–138 | Deep production |
| Object-size helpers | relation/database/table/index size functions | 106–108, 138, production exercises | Core operations |
| Lock/blocking helpers | `pg_blocking_pids` and lock-state inspection | 109 | Deep production |
| WAL/LSN helpers | current LSN, LSN difference, recovery/replication positions | 82, 87–89, 137, 178 | Deep production |
| Trigger context | `NEW`, `OLD`, trigger metadata | 101 | Deep |
| Event-trigger context | DDL event metadata/functions | 102 | Reference/Advanced |
| PL/pgSQL and dynamic SQL helpers | routine expressions, `format`, `EXECUTE ... USING`, exceptions | 100 | Deep |

## Operator/index connection

Operators are not merely syntax. PostgreSQL index access methods support operator classes/families, so a query must use semantics the index knows how to accelerate. The handbook connects:

```text
query operator
   ↓
data type + collation
   ↓
operator class/family
   ↓
index access method
   ↓
planner cost/selectivity
```

This is why a JSONB GIN index, text B-tree, trigram GIN/GiST, range GiST, and BRIN do not serve interchangeable predicates.

## Coverage conclusion

All PostgreSQL 18 Chapter 9 functional/operator families are mapped. Frequently used application functions/operators are taught with runnable examples; specialized administration/internal families are covered in the production/internals chapters and referenced back to the official documentation for complete overload signatures.