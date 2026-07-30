---
id: reference-w3schools-coverage
title: W3Schools SQL Curriculum Coverage Audit
---

# W3Schools SQL Curriculum Coverage Audit

W3Schools is used only as a **curriculum checklist**, not as language authority. SQL:2023 and PostgreSQL 18 official documentation determine semantics. No W3Schools text is copied.

| W3Schools checklist topic | Handbook chapter(s) | Status / PostgreSQL note |
| --- | --- | --- |
| SQL Intro | 00, 03 | ✅ SQL vs DBMS/PostgreSQL distinguished |
| Syntax | 03 | ✅ identifiers, literals, comments, quoting, semicolons |
| SELECT | 24 | ✅ Deep |
| SELECT DISTINCT | 24 | ✅ semantics + performance |
| WHERE | 24, 26 | ✅ includes UNKNOWN/null behavior |
| ORDER BY | 27 | ✅ deterministic ordering |
| AND | 25–26 | ✅ three-valued logic |
| OR | 25–26 | ✅ precedence/logic |
| NOT | 25–26 | ✅ NULL interactions |
| INSERT INTO | 20 | ✅ multi-row/SELECT/RETURNING |
| NULL Values | 19 | ✅ Deep; never described as “empty” |
| UPDATE | 21 | ✅ FROM/RETURNING/concurrency |
| DELETE | 22 | ✅ USING/RETURNING/MVCC/TRUNCATE comparison |
| SELECT TOP / LIMIT equivalents | 24, 27 | ✅ PostgreSQL LIMIT/OFFSET/FETCH |
| Aggregate Functions | 28 | ✅ |
| MIN | 28 | ✅ |
| MAX | 28 | ✅ |
| COUNT | 28 | ✅ NULL and FILTER semantics |
| SUM | 28 | ✅ |
| AVG | 28 | ✅ |
| LIKE | 25–26 | ✅ patterns + indexes/extensions context |
| Wildcards | 25–26 | ✅ `%`, `_` concepts |
| IN | 26, 31 | ✅ subquery + null semantics |
| BETWEEN | 26 | ✅ inclusive endpoints |
| Aliases | 24, 30 | ✅ column/table aliases |
| Joins | 30 | ✅ one of deepest chapters |
| INNER JOIN | 30 | ✅ |
| LEFT JOIN | 30 | ✅ ON-vs-WHERE traps |
| RIGHT JOIN | 30 | ✅ |
| FULL JOIN | 30 | ✅ |
| Self Join | 30, 48 | ✅ hierarchy use cases |
| UNION | 33 | ✅ duplicate-removal cost |
| UNION ALL | 33 | ✅ preferred when dedupe not required |
| GROUP BY | 29 | ✅ |
| HAVING | 29 | ✅ |
| EXISTS | 26, 31 | ✅ semi-join reasoning |
| ANY | 15, 26, 31 | ✅ arrays/subqueries |
| ALL | 15, 26, 31 | ✅ NULL/universal semantics |
| CASE | 36 | ✅ |
| NULL functions | 36 | ✅ COALESCE/NULLIF and PG null-safe comparisons |
| Stored Procedures | 99–100 | ✅ PostgreSQL function/procedure distinction |
| Comments | 03 | ✅ SQL comments; COMMENT command mapped separately |
| Operators | 25 + functions/operators audit | ✅ broad PostgreSQL operator families |
| CREATE DATABASE concepts | 06 | ✅ ownership/templates/encoding/locale |
| CREATE TABLE | 08 | ✅ generated/identity/temp/unlogged/partitioned |
| DROP | 06, 08, 39–44 + command audit | ✅ object lifecycle and dependencies |
| ALTER | 06–08, 42, 125–128 + command audit | ✅ production lock/migration semantics |
| Constraints | 42 | ✅ Deep |
| NOT NULL | 42 | ✅ + online migration |
| UNIQUE | 42–43, 57 | ✅ null semantics/unique index |
| PRIMARY KEY | 43 | ✅ natural/surrogate/composite |
| FOREIGN KEY | 44 | ✅ actions/index/concurrency |
| CHECK | 42 | ✅ UNKNOWN/NOT VALID/validation |
| DEFAULT | 08 | ✅ default vs generated/identity |
| Indexes | 50–57 | ✅ Deep across B-tree/Hash/GIN/GiST/SP-GiST/BRIN |
| Generated/autoincrement concepts | 08, 10, 41 | ✅ identity preferred over serial for new design |
| Dates | 13 | ✅ timezone/DST/timestamptz deep coverage |
| Views | 39–40 | ✅ views + materialized views |
| SQL Injection | 97 | ✅ parameters, dynamic identifiers, ORMs, routines |

## Coverage beyond the tutorial checklist

The handbook intentionally goes far beyond beginner tutorial material: SQL:2023 distinctions, advanced joins/subqueries/LATERAL/recursive CTE/window frames, relational modelling/normalization, PostgreSQL types, six index families, planner/statistics/EXPLAIN, MVCC/locks/isolation/SSI, VACUUM/autovacuum/storage/WAL, backup/PITR/replication/HA, roles/RLS/TLS/authentication, migrations/backfills, monitoring/incidents, internals, distributed systems and staff architecture.

**Audit result:** every requested W3Schools curriculum item is represented, while authoritative semantics come from SQL:2023 and PostgreSQL 18 documentation.