---
id: 75-81-vacuum-storage-buffers
title: "75–81 — VACUUM, Autovacuum, HOT, Bloat, Storage, TOAST & Buffers"
---

# 75 — VACUUM

MVCC leaves obsolete tuple versions in heap pages after updates/deletes. `VACUUM` determines which versions are no longer needed, makes their space reusable, maintains visibility information, and participates in transaction-ID freezing.

```sql
VACUUM (ANALYZE) orders;
```

Normal vacuum does **not** rewrite the whole table or usually return free space to the OS; it makes space reusable inside relations.

`VACUUM FULL` rewrites a table into a new compact representation and takes an `ACCESS EXCLUSIVE` lock. Treat it as disruptive maintenance, not normal routine.

## Visibility map

Per-page visibility metadata tracks pages whose tuples are all visible and/or all frozen. This helps vacuum skip work and enables index-only scans to avoid heap visibility checks where safe.

## Freezing and wraparound

PostgreSQL transaction IDs are finite. Old tuple transaction metadata must eventually be frozen so age comparisons remain safe. Autovacuum performs anti-wraparound work even if normal performance tuning would prefer to delay maintenance.

```text
MVCC creates old tuple versions
        ↓
old snapshots eventually disappear
        ↓
VACUUM marks dead space reusable
        ↓
freeze old transaction identity where needed
```

---

# 76 — Autovacuum

Autovacuum automates vacuum/analyze based on table activity and age. A launcher starts workers; workers select relations needing maintenance.

Normal thresholds combine a fixed threshold and scale factor relative to table size. PostgreSQL also has insert-triggered vacuum behavior for insert-heavy tables, important for visibility/freeze maintenance even without many updates/deletes.

## Why defaults may fail large busy tables

On a table with hundreds of millions of rows, a percentage scale factor can mean tens of millions of changes before maintenance starts. Per-table settings can trigger earlier work:

```sql
ALTER TABLE hot_events SET (
  autovacuum_vacuum_scale_factor = 0.02,
  autovacuum_analyze_scale_factor = 0.01
);
```

These numbers are illustrative; tune from change rate, table size, dead tuples, vacuum duration, I/O capacity, and business load.

## Monitor

Use statistics/progress views, table age, dead-tuple estimates, last vacuum/analyze timestamps, log messages, and long transaction/snapshot data.

A long-running or idle-in-transaction session can hold back cleanup even while autovacuum appears active.

## Anti-wraparound

Do not casually cancel aggressive anti-wraparound vacuum. XID wraparound protection is a correctness requirement.

---

# 77 — HOT Updates

HOT = **Heap-Only Tuple** update. If an update does not modify index-referenced columns and the same heap page has room, PostgreSQL can create a new tuple version without adding new index entries for that row version.

```text
index entry
   ↓
heap tuple v1 → HOT chain → v2 → v3
```

Benefits: less index write amplification, smaller WAL/index churn, easier cleanup.

HOT eligibility is harmed by indexing every frequently updated column. `fillfactor` can leave page space for future updates:

```sql
ALTER TABLE accounts SET (fillfactor = 80);
```

Lower fillfactor costs table space and read density, so tune measured hot-update workloads rather than globally lowering it.

---

# 78 — Table and Index Bloat

Bloat is excess relation space compared with live useful data, often from update/delete churn, long snapshots, maintenance lag, page fragmentation, or index version churn.

Symptoms include growing disk use, more buffers/I/O per query, slower vacuum/index scans, and unexpectedly large indexes.

Tools/actions:

- healthy autovacuum prevents much avoidable bloat;
- `VACUUM` reuses internal space;
- `REINDEX` rebuilds an index (consider concurrent forms in production);
- `VACUUM FULL` rewrites/locks the table;
- external tools such as `pg_repack` can reorganize with different locking trade-offs but are not core PostgreSQL.

Do not estimate bloat from one simplistic formula and immediately rewrite production tables. Correlate relation size, live/dead tuples, workload, page inspection/extensions if approved, and maintenance history.

---

# 79 — Storage Internals

Conceptual hierarchy:

```text
database
  ↓
relation files (main + forks)
  ↓
fixed-size pages
  ↓
line pointers
  ↓
heap tuple versions
```

PostgreSQL relation data is stored in files beneath the data directory using internal mappings. Relations can have forks such as the main data fork, free-space map (`fsm`), visibility map (`vm`), and initialization fork for unlogged relations.

A normal heap page contains a page header, line-pointer array, tuple data growing from the other end, free space between them, and optional special space depending on page type. Heap tuple headers contain visibility and row-format metadata.

Exact fields/layout are PostgreSQL 18 implementation details; applications must not depend on physical tuple position or undocumented file layout.

---

# 80 — TOAST

TOAST (**The Oversized-Attribute Storage Technique**) lets PostgreSQL store large variable-width values by compression and/or out-of-line storage in an associated TOAST table.

```text
heap row
  ├─ small attributes inline
  └─ large value → compressed and/or external chunks
```

This supports large `text`, `bytea`, JSONB and other toastable values while keeping heap pages manageable.

Storage strategies control whether a column favors plain, external, extended, or main-style behavior. Change them only with a workload reason.

Large JSON documents can still be expensive even with TOAST: reading/updating one field may require fetching/decompressing/rebuilding substantial values; GIN indexes add write work. Split frequently accessed/updated stable fields into relational columns.

---

# 81 — Buffer Management

PostgreSQL uses **shared buffers** as its internal page cache, while the operating system also caches filesystem pages.

```text
executor asks for page
   ↓
shared_buffers hit? ─ yes → use buffer
   │ no
   ↓
OS/filesystem read (may itself hit OS cache)
   ↓
shared buffer
```

Modified pages become **dirty**. WAL for a change must be flushed according to durability rules before the corresponding dirty data page can safely reach persistent storage—write-ahead logging.

The background writer/checkpointer coordinate page writing; backends may also write buffers when necessary.

`EXPLAIN (ANALYZE, BUFFERS)` reports buffer hits/reads/dirties/writes for a query, helping distinguish CPU/row-processing problems from page access.

A cache-hit ratio is context, not a universal grade. Large sequential analytics may correctly read many pages; an OLTP hot set may expect mostly cached access.

**Exercise:** explain why adding an index can increase total write cost, reduce HOT updates, consume shared/OS cache, generate more WAL, and still improve one critical read. Database performance is a system trade-off.