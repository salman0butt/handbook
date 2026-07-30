---
id: reference-official-docs-coverage
title: Official PostgreSQL 18 Documentation Coverage Audit
---

# Official PostgreSQL 18 Documentation Coverage Audit

The handbook uses the **current PostgreSQL 18 documentation as authority** and audits all major documentation parts. This page maps official subject areas to the handbook; it does not reproduce the manual.

| PostgreSQL 18 documentation area | Handbook coverage | Audit status |
| --- | --- | --- |
| **Part I — Tutorial**: getting started, SQL language, advanced SQL | 00 Start Here; 01–03 foundations; 19–38 SQL; 58 transactions; 37 windows | ✅ Deep developer path |
| Installation / creating/connecting to a database | 00, 06 | ✅ |
| Tables, rows, queries, joins, aggregates, updates/deletes | 08, 20–30 | ✅ |
| Views, foreign keys, transactions, windows, inheritance/partitioning | 39, 44, 58–67, 37, 08, 115 | ✅ |
| **Part II — SQL Language** | 02–49 plus 58–67, 98–103, 115–120 | ✅ Deep |
| SQL syntax / lexical structure / expressions | 03, 25 | ✅ |
| Data definition, tables, defaults, identity/generated, constraints | 08–18, 41–44 | ✅ |
| Privileges / schemas / inheritance / partitioning / FDW | 07, 92–96, 08, 115, 117 | ✅ |
| Data manipulation / queries / set ops / ordering / WITH | 20–38 | ✅ |
| Data types | 09–18 + data-type audit | ✅ |
| Functions/operators | 25, 28, 36–38, 98–103 + functions audit | ✅ |
| Type conversion | 09–18, 25, 98 | ✅ Core/Reference |
| Indexes | 50–57, 177 | ✅ Deep |
| Full-text search | 103, Project 9 | ✅ Deep |
| Concurrency control | 58–67 | ✅ Deep |
| Performance tips / planner basics | 68–74 | ✅ Deep |
| Parallel query | 118 | ✅ |
| **Part III — Server Administration** | 04–07, 75–97, 107–120, 129–169 | ✅ Production-depth |
| Server setup, configuration, connections | 04, 06, 91, 111–114 | ✅ |
| Authentication / client auth / TLS | 92–95 | ✅ Deep |
| Database roles and privileges | 92–93 | ✅ Deep |
| Locale/encoding/collation | 06, 11, 57 | ✅ |
| Routine maintenance / VACUUM / autovacuum | 75–78, 110, 114 | ✅ Deep |
| Backup/restore/PITR | 85–87, 129–138, Projects 12/Capstone | ✅ Deep |
| HA/load balancing/replication | 88–90, 137, 159, 189 | ✅ Deep |
| Monitoring statistics / disk / locks | 105–110, 133–138, 159–160 | ✅ Deep |
| WAL/checkpoints/recovery | 82–84, 113, 137, 178 | ✅ Deep |
| Logical replication | 89, 137, 169 | ✅ Deep |
| JIT | 119 | ✅ |
| **Part IV — Client Interfaces** | 00, 06, 91, 120–124 | ✅ Developer-focused |
| `psql` usage / connection concepts | 00, 06 | ✅ |
| libpq concepts / connection strings / environment | 06, 91, 121 | ✅ Conceptual |
| Driver/application access, parameters, prepared statements | 120–122 | ✅ Deep application path |
| Large-object/programming interface details | 18, 106 | ✅ Reference |
| **Part V — Server Programming** | 98–104, 117, 183–186 | ✅ Core + advanced mapping |
| SQL functions / PL/pgSQL / procedures | 98–100 | ✅ Deep |
| Triggers / event triggers | 101–102 | ✅ Deep/Advanced |
| Procedural languages / custom types/operators/access methods | 98–104, 177, reference command audit | ✅ Advanced awareness |
| Extensions | 104, 183–186 | ✅ Deep governance |
| FDW/server programming concepts | 117 | ✅ Core/Advanced |
| **Part VI — Reference** | SQL-command audit; 00/06 for clients; 82–90/111 for server apps | ✅ Complete mapping |
| SQL Commands reference | `reference/sql-command-coverage.md` | ✅ Command-by-command map |
| Client applications | 00, 06, 85, 132, 165 plus official links | ✅ Relevant developer/DBA tools |
| Server applications | 04, 82–90, 111–114, 169 | ✅ Operational concepts |
| **Part VII — Internals** | 62, 68–83, 170–179 | ✅ Deep but version-aware |
| Parser/rewrite/planner/executor | 68–74, 170, 179 | ✅ |
| Storage/page/tuple/FSM/VM/TOAST | 75–81, 174–177 | ✅ |
| WAL/LSN/recovery internals | 82–84, 178 | ✅ |
| Index internals | 50–57, 177 | ✅ |
| Transactions/XIDs/MultiXacts/MVCC | 58–67, 172–173 | ✅ |
| Background/server processes | 04, 76, 81–83, 171 | ✅ |
| **Part VIII — Appendices** | version baseline, 180, 169, reference audits | ✅ Relevant coverage |
| SQL conformance / standard compatibility | 180; SQL:2023 baseline | ✅ |
| Error codes / SQLSTATE | 154, 121–122, exercises | ✅ Practical |
| Date/time input, keywords, limits, catalogs | 13, 03, 106, production chapters | ✅ Core/Reference |
| Release notes/version policy | `version-baseline.md`, 167–169 | ✅ Current baseline |
| Security information/advisories policy | version baseline + production security guidance | ✅ Policy awareness; official advisories remain live authority |

## Client/server utility audit

The handbook focuses on utilities a developer/DBA must actively understand: `psql`, `pg_dump`, `pg_dumpall`, `pg_restore`, `pgbench`, base-backup/recovery concepts, `pg_upgrade`, configuration/server lifecycle, and COPY/client streaming. Less-common utility flags are intentionally referenced to official manuals rather than duplicated.

## Internals depth boundary

Internals are taught to explain production behavior—MVCC, visibility, vacuum, tuple/page storage, buffer/cache, WAL, indexes, optimizer/executor, XID/MultiXact—while exact struct fields/file offsets remain version-specific implementation details. PostgreSQL 18 documentation/source is authoritative for those details.

## Audit conclusion

No major PostgreSQL 18 documentation part is omitted. Tutorial/SQL language, server administration, server programming, command reference, internals, release/version policy, and practical client interface material are all represented at an appropriate depth for the handbook’s beginner → staff progression.