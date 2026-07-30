---
id: version-baseline
title: Version Baseline
description: Audited SQL standard and PostgreSQL release baseline for this handbook.
sidebar_position: 2
---

# Version Baseline

**Date checked:** 30 July 2026

## Production baseline

| Item | Baseline |
| --- | --- |
| SQL standard | ISO/IEC 9075:2023 / SQL:2023 |
| Current PostgreSQL major | 18 |
| Current stable minor | **18.4** |
| PostgreSQL 18 initial release | 25 September 2025 |
| Supported majors | 18, 17, 16, 15, 14 |
| Development major | PostgreSQL 19 |
| Current development milestone | **19 Beta 2**, released 16 July 2026 |
| PostgreSQL 14 final planned update / EOL date | 12 November 2026 |

PostgreSQL 19 material is marked **🧪 DEVELOPMENT / BETA — NOT PRODUCTION-STABLE**. The normal handbook never depends on 19-only behavior.

## PostgreSQL versioning mental model

A PostgreSQL version such as `18.4` means:

```text
18   major release
.4   minor release within major 18
```

Major releases can change behavior, catalog structure, features, and on-disk compatibility. Minor releases are cumulative bug/security fixes for a major branch and do **not** require dump/restore or `pg_upgrade` merely because the minor number changes.

PostgreSQL normally publishes a major release roughly yearly and supports a major branch for five years. Supported branches receive periodic minor releases, including security fixes.

## SQL:2023 and implementation reality

`SQL:2023` is the language-standard baseline, not a promise that every SQL database behaves identically.

```text
SQL standard
    ↓
PostgreSQL implementation
    ↓
PostgreSQL extensions
```

The handbook therefore distinguishes portable SQL from PostgreSQL extensions such as `RETURNING`, `ON CONFLICT`, PostgreSQL arrays/range types, `JSONB`, `LATERAL` behavior details, GIN/GiST/BRIN indexes, row-level security policy mechanics, and PostgreSQL-specific administration.

## PostgreSQL 18 highlights used in this handbook

The PostgreSQL 18 release notes are the authority. Important changes include:

- asynchronous I/O infrastructure used by operations including sequential scans, bitmap heap scans, and vacuum;
- optimizer support for B-tree **skip scans**, expanding useful cases for multicolumn indexes;
- `uuidv7()` for timestamp-ordered UUID generation;
- virtual generated columns, now the default generated-column kind;
- OAuth authentication support;
- `OLD` and `NEW` values in `RETURNING` for `INSERT`, `UPDATE`, `DELETE`, and `MERGE`;
- `pg_upgrade` improvements including retention of optimizer statistics.

These are covered as PostgreSQL 18 features, not generic SQL features.

## Compatibility policy for examples

1. SQL examples prefer PostgreSQL 18 syntax.
2. Standard SQL features are marked when portability matters.
3. PostgreSQL extensions are explicitly named.
4. Internal implementation details are tied to PostgreSQL 18 and are not presented as eternal guarantees.
5. Third-party extensions such as PostGIS and pgvector are separated from PostgreSQL core.

## Authoritative sources

- PostgreSQL 18 documentation: `https://www.postgresql.org/docs/18/`
- PostgreSQL versioning policy: `https://www.postgresql.org/support/versioning/`
- PostgreSQL 18 release notes: `https://www.postgresql.org/docs/18/release-18.html`
- PostgreSQL 19 beta documentation: `https://www.postgresql.org/docs/19/`
- ISO SQL standard overview: ISO/IEC 9075:2023

This page is re-audited immediately before the final completion gate.