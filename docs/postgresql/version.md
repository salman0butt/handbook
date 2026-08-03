---
title: "PostgreSQL Version and Tooling Baseline"
description: "Current stable PostgreSQL, supported major versions, preview features, SQL baseline and production tooling assumptions."
---

# PostgreSQL Version and Tooling Baseline

**Research date:** August 3, 2026

**Primary production baseline:** **PostgreSQL 18.4**.

PostgreSQL 18 was released on September 25, 2025. The 18.4 minor release was published on May 14, 2026 and is the current stable maintenance release used by this handbook. PostgreSQL 19 is still a preview line; PostgreSQL 19 Beta 2 was published on July 23, 2026. Preview behavior is never presented as the production baseline.

```mermaid
flowchart LR
  A["PostgreSQL 18.4 stable"] --> B["Handbook SQL and operations"]
  C["PostgreSQL 19 beta"] --> D["Preview-only notes"]
  E["Extensions and providers"] --> F["Explicit compatibility checks"]
```

## Supported major versions

The PostgreSQL project supports a major version for five years. At the research date, supported majors are 18, 17, 16, 15 and 14. PostgreSQL 14 reaches end of life on November 12, 2026. Production teams should remain on a current minor release for their chosen supported major and rehearse major upgrades before support ends.

## PostgreSQL 18 capabilities used here

The handbook may use PostgreSQL 18 behavior such as asynchronous I/O improvements, B-tree skip scan planning, `uuidv7()`, virtual generated columns as the default generated-column form, richer `EXPLAIN` information, OAuth authentication support and other PostgreSQL 18 changes. Every feature that is not available on an older supported major is labelled.

MD5 password authentication is deprecated; new systems should use SCRAM authentication and a migration plan for legacy credentials.

## SQL and PostgreSQL scope

- **SQL baseline:** SQL:2023 concepts where PostgreSQL implements them.
- **PostgreSQL-specific:** MVCC details, `RETURNING`, `jsonb`, arrays, range types, operator classes, `LISTEN/NOTIFY`, `COPY`, catalog views and PostgreSQL administration.
- **Extensions:** PostGIS, `pg_stat_statements`, Citus and other extensions are labelled and require explicit installation/availability checks.
- **Managed providers:** RDS, Aurora PostgreSQL-Compatible, Cloud SQL, Azure, Supabase, Neon and other services can restrict superuser access, extensions, storage, networking, backup and failover controls.

## Tooling baseline

| Tool | Baseline and purpose |
| --- | --- |
| PostgreSQL server and `psql` | 18.4 for examples and local validation |
| Docker | `postgres:18.4` for disposable learning and integration tests |
| Node.js | Node.js 24 in repository CI |
| TypeScript | TypeScript examples use strict, modern ESM-compatible patterns |
| `pg` | Primary low-level Node.js driver examples |
| GUI clients | pgAdmin, DBeaver and TablePlus are optional clients, not server replacements |
| PostGIS | Extension-only geospatial examples |
| PgBouncer | External connection pooler; behavior depends on pooling mode |

## Safe local baseline

```bash
docker run --name pg-handbook \
  -e POSTGRES_PASSWORD=dev_only_password \
  -e POSTGRES_DB=handbook \
  -p 5432:5432 \
  -d postgres:18.4

psql "postgresql://postgres:dev_only_password@localhost:5432/handbook"
```

The password is intentionally fake and weak for a local disposable container. Do not reuse it.

## Version-aware writing rules

1. State when syntax or behavior arrived in a specific PostgreSQL major.
2. Mark PostgreSQL 19 material as preview until a stable release exists.
3. Separate core PostgreSQL from extensions.
4. Separate upstream PostgreSQL from provider-specific implementations.
5. Prefer current official documentation and release notes over undated tutorials.
6. Verify exact extension and provider support in the target environment.
7. Keep major upgrades, extension upgrades and application compatibility in the same release plan.

## Primary official sources

- PostgreSQL current documentation: `https://www.postgresql.org/docs/current/`
- PostgreSQL versioning policy: `https://www.postgresql.org/support/versioning/`
- PostgreSQL 18 release notes: `https://www.postgresql.org/docs/18/release-18.html`
- PostgreSQL 18.4 release announcement: `https://www.postgresql.org/about/news/postgresql-184-179-1613-1517-and-1422-released-3290/`
- PostgreSQL release archive: `https://www.postgresql.org/list/`
