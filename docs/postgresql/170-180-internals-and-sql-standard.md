---
id: 170-180-internals-and-sql-standard
title: 170–180 — PostgreSQL Internals & SQL Standard Compatibility
---

# 170 — Database Internals: Query Executor

The executor runs a tree of plan nodes. Conceptually, parent nodes request tuples from children, transform/combine them, and pass tuples upward.

```text
Limit
  ↓
Sort
  ↓
Hash Join
 ├─ Seq Scan orders
 └─ Hash
     ↓
   Seq Scan customers
```

Scan nodes produce rows, joins combine streams, sorts order, aggregates collapse/group, and Gather nodes coordinate parallel workers. `EXPLAIN ANALYZE` exposes actual row flow and loops; it is the practical bridge between SQL and executor behavior.

Executor details evolve. Rely on plan-node semantics documented for PostgreSQL 18 rather than undocumented implementation assumptions.

---

# 171 — Database Internals: System Processes

A PostgreSQL 18 server includes client backend processes plus auxiliary/background processes and workers.

Important roles:

- backend server processes execute client sessions;
- checkpointer coordinates checkpoints;
- background writer writes reusable dirty buffers progressively;
- WAL writer helps flush WAL buffers;
- autovacuum launcher/workers maintain tables/statistics;
- WAL sender/receiver processes support physical replication;
- logical replication launcher/workers handle subscriptions;
- additional workers support parallel queries and other facilities.

```text
postmaster/server parent
 ├─ backend A
 ├─ backend B
 ├─ checkpointer
 ├─ background writer
 ├─ WAL writer
 ├─ autovacuum launcher → workers
 └─ replication / parallel / logical workers
```

Process lists are diagnostic evidence but process names/counts vary with configuration/version/activity.

---

# 172 — Transaction IDs and Wraparound

PostgreSQL uses transaction IDs (XIDs) in MVCC visibility. XIDs are finite-width and comparisons use a moving horizon, so very old transaction references must be **frozen** before wraparound makes them appear incorrectly “in the future.”

```text
new XIDs advance → tuple ages increase → vacuum freezes old tuple identity
```

Monitor database/table age (`age(datfrozenxid)`, relation freeze age indicators) and autovacuum. PostgreSQL forces anti-wraparound vacuum based on age thresholds because ignoring wraparound threatens data visibility correctness.

Long-lived transactions/replication slots can hold horizons back, but freezing policy has specialized rules; diagnose actual age rather than assuming “dead tuples cause wraparound.”

---

# 173 — MultiXacts

A row can be locked by multiple transactions simultaneously in compatible lock modes (for example multiple key-share lockers). PostgreSQL represents groups of transaction/lock members using **MultiXact IDs**.

MultiXacts also have finite ID/member storage and require age management/vacuum. Foreign-key-heavy and shared row-lock workloads can generate substantial MultiXact activity.

Monitor MultiXact age alongside XID age in production; wraparound prevention applies to both mechanisms, though their counters and thresholds differ.

---

# 174 — Free Space Map

The Free Space Map (FSM) summarizes available free space in heap/index pages so inserts/updates can find pages with room without scanning the whole relation.

```text
VACUUM / page changes
       ↓
FSM summaries
       ↓
future insert/update searches for enough page space
```

The FSM is advisory/reconstructible metadata, not business data. Vacuum contributes to accurate reusable-space knowledge.

---

# 175 — Visibility Map

The Visibility Map tracks heap pages that are:

- **all-visible:** all tuples visible to all current/future transactions under required conditions;
- **all-frozen:** tuple transaction IDs on page need no future freezing work.

Benefits:

- vacuum can skip suitable pages;
- index-only scans can trust all-visible pages without per-tuple heap visibility checks.

Writes clear relevant bits; vacuum restores them after proving visibility/freeze state. This is why a covering index does not automatically produce a purely index-only workload after heavy writes.

---

# 176 — Page-Level Storage

PostgreSQL uses fixed-size pages (commonly 8 KiB in standard builds) as the basic storage/I/O unit.

Conceptual heap page:

```text
+---------------------+
| page header         |
| line pointer array  | ↓ grows
|                     |
| free space          |
|                     |
| tuple data          | ↑ grows
| special space       | (page-type dependent)
+---------------------+
```

Line pointers reference tuple locations inside a page and can remain useful as tuple state changes/HOT chains. Tuple headers contain MVCC/status/format metadata followed by attribute data/alignment.

Exact offsets, flags and structures are PostgreSQL 18 internals; use documented page-inspection facilities for learning/diagnosis, never direct file mutation.

---

# 177 — Index Internals

## B-tree

```text
root page
  ↓
internal pages
  ↓
leaf pages ordered by key
```

Inserts can split pages; concurrent algorithms preserve tree correctness. PostgreSQL B-tree supports deduplication for suitable duplicate keys, reducing leaf storage in relevant cases.

## GIN

Stores an inverted mapping from keys/elements/lexemes to posting data identifying rows, with structures for many matches and a pending-list optimization for updates.

## GiST

Framework where operator classes implement consistency/penalty/picksplit and related methods for generalized search domains.

## BRIN

Stores compact summaries per block range; revmap/summary structures let scans skip ranges that cannot satisfy a predicate.

Do not compare index methods using Big-O labels alone; page layout, operator classes, caching, correlation, maintenance and planner cost determine real behavior.

---

# 178 — WAL Internals

An LSN identifies a position in the WAL stream. WAL records describe changes/redo information; WAL segment files store the stream on disk.

After a checkpoint, the first modification of a data page may need a **full-page image** so recovery can repair a page potentially torn by a crash. This contributes to post-checkpoint WAL volume.

```text
page change
   ↓
WAL record at LSN X
   ↓
WAL flush guarantees ordering
   ↓
page can later be written
```

Crash recovery replays redo records from a recovery point. Standbys receive/replay the same physical stream. PITR archives segments and replays them onto a base backup.

WAL is sequential history for recovery, not a permanent business audit log.

---

# 179 — Query Optimizer Internals

The planner builds possible access/join **paths**, estimates their row counts/costs, and selects a plan.

For joins, exhaustive enumeration becomes expensive as relation count grows. PostgreSQL uses dynamic-programming-style join search for manageable join counts and GEQO (genetic query optimizer) beyond configurable complexity thresholds.

Cost estimation combines:

- statistics/selectivity;
- relation/index pages and tuples;
- CPU operator/tuple costs;
- sequential/random I/O cost assumptions;
- sort/hash/parallel costs;
- parameterization and required path ordering.

Planner GUCs (`random_page_cost`, `effective_cache_size`, join/scan enable switches, etc.) influence choices. Tune from hardware/workload evidence; setting `enable_seqscan=off` is a diagnostic nudge, not a normal “force index” solution.

Implementation details change; retain the durable model: enumerate viable paths → estimate rows/cost → choose cheapest semantics-preserving plan.

---

# 180 — SQL Standard vs PostgreSQL

PostgreSQL implements a large portion of SQL while adding extensions. Portability requires distinguishing the language standard from one implementation.

| Area | SQL standard | PostgreSQL implementation / extension notes |
| --- | --- | --- |
| identifiers | standard quoted/unquoted identifiers | unquoted names fold to lower case; quoted mixed-case names require quoting |
| NULL | three-valued logic | follows core semantics; adds `IS DISTINCT FROM`, configurable null uniqueness forms |
| identity | standard identity columns | supported; preferred over `serial` pseudo-types for modern design |
| generated columns | standard concept | PG18 supports stored and virtual, virtual default |
| joins | INNER/outer/cross etc. | supports standard families plus `LATERAL`; `NATURAL` available but risky |
| CTEs | `WITH`, recursive SQL | supports recursion, SEARCH/CYCLE, materialization controls |
| windows | SQL window model | rich support for ROWS/RANGE/GROUPS frames |
| MERGE | standard DML | PostgreSQL implementation; concurrency semantics differ from `ON CONFLICT` |
| JSON | SQL/JSON evolving standard | PostgreSQL also has native `jsonb` and operators/index classes |
| arrays | SQL array concepts | PostgreSQL has extensive native array operators/functions/indexing |
| transactions | standard transaction/isolation model | Read Uncommitted maps to Read Committed; Repeatable Read is snapshot isolation; Serializable uses SSI |
| functions/procedures | standard routine concepts | PostgreSQL adds languages, volatility, security modes, extensions |
| upsert | no single universal portable syntax | PostgreSQL `INSERT ... ON CONFLICT` extension |
| RETURNING | implementation extension historically | PostgreSQL-rich DML RETURNING, PG18 OLD/NEW enhancements |
| indexes | implementation-level physical design | B-tree, Hash, GIN, GiST, SP-GiST, BRIN are PostgreSQL mechanisms |

When writing portable SQL, consult the compatibility section of each PostgreSQL command. When engineering for PostgreSQL, use extensions intentionally rather than pretending portability is always a higher goal.